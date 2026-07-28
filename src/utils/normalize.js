// normalizza per la ricerca: minuscolo e senza accenti ("Cà"→"ca")
export const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
