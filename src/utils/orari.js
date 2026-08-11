// Stato "aperto ora / chiuso" calcolato dagli orari in data.js (SHOP_INFO.orari).
//
// L'ora è SEMPRE quella del negozio (Europe/Rome), non quella del telefono:
// un cliente che guarda il sito in vacanza all'estero deve vedere se il
// negozio è aperto adesso a Lodi, non dov'è lui.

const GIORNI = [
  "domenica",
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
];

// "09:00" -> 540. Restituisce null su un valore non valido, così una fascia
// scritta male fa sparire il pallino invece di dare un orario inventato.
const minuti = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hhmm).trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
};

// "09:00" -> "9:00": nel testo parlato ("apre alle 9:00") lo zero iniziale
// suona da tabella. Nella tabella degli orari resta com'è scritto in data.js.
const oraParlata = (hhmm) => String(hhmm).replace(/^0/, "");

// L'orologio del negozio: prendo i pezzi della data già convertiti in fuso
// di Roma e li rimonto come se fossero UTC. Così getUTCDay()/le ore leggono
// il calendario di Lodi qualunque sia il fuso del dispositivo.
const oraDiRoma = (now) => {
  const parti = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const p = Object.fromEntries(parti.map((x) => [x.type, x.value]));
  // hourCycle h23 può restituire "24" a mezzanotte in certi runtime
  const ore = Number(p.hour) % 24;
  const d = new Date(
    Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), ore, Number(p.minute))
  );
  return { giorno: d.getUTCDay(), minuti: ore * 60 + Number(p.minute) };
};

// tutte le fasce valide di un giorno della settimana, in ordine
const fasceDelGiorno = (orari, dow) => {
  const riga = orari.find((o) => Array.isArray(o.dow) && o.dow.includes(dow));
  if (!riga || !Array.isArray(riga.fasce)) return [];
  return riga.fasce
    .map(([da, a]) => ({ da: minuti(da), a: minuti(a), daTesto: da }))
    .filter((f) => f.da !== null && f.a !== null && f.a > f.da)
    .sort((x, y) => x.da - y.da);
};

/**
 * @returns {{aperto: boolean, testo: string} | null}
 *   null = gli orari non sono in forma calcolabile (manca dow/fasce): chi
 *   chiama deve semplicemente non mostrare il pallino.
 */
export function statoApertura(orari, now = new Date()) {
  if (!Array.isArray(orari) || !orari.some((o) => Array.isArray(o.dow))) return null;

  const { giorno, minuti: adesso } = oraDiRoma(now);
  const oggi = fasceDelGiorno(orari, giorno);

  const inCorso = oggi.find((f) => adesso >= f.da && adesso < f.a);
  if (inCorso) {
    const chiusura = `${Math.floor(inCorso.a / 60)}:${String(inCorso.a % 60).padStart(2, "0")}`;
    return { aperto: true, testo: `Aperto ora · chiude alle ${chiusura}` };
  }

  // riapre più tardi oggi?
  const dopo = oggi.find((f) => f.da > adesso);
  if (dopo) return { aperto: false, testo: `Chiuso · apre alle ${oraParlata(dopo.daTesto)}` };

  // altrimenti il primo giorno utile nei prossimi sette
  for (let i = 1; i <= 7; i++) {
    const dow = (giorno + i) % 7;
    const [prima] = fasceDelGiorno(orari, dow);
    if (!prima) continue;
    const quando = i === 1 ? "domani" : GIORNI[dow];
    return { aperto: false, testo: `Chiuso · apre ${quando} alle ${oraParlata(prima.daTesto)}` };
  }

  // nessuna fascia in tutta la settimana: non c'è niente di sensato da dire
  return null;
}

// indice del giorno di Roma, per evidenziare la riga di oggi nella tabella
export const giornoDiRoma = (now = new Date()) => oraDiRoma(now).giorno;
