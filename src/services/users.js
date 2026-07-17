// aggiornamento dell'unico account admin (username/email/password).
// Stesso pattern degli altri service: cookie httpOnly via
// `credentials: "include"`, API_URL dedotto dall'host corrente.
const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

async function parse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Errore di rete");
  return data;
}

export const updateUser = async (id, fields) => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(fields),
  });
  return parse(res);
};
