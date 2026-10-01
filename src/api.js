const BASE = "/api/contacts";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

export const getContacts = (q = "") =>
  request(`${BASE}?q=${encodeURIComponent(q)}`);
export const createContact = (body) =>
  request(BASE, { method: "POST", body: JSON.stringify(body) });
export const updateContact = (id, body) =>
  request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteContact = (id) =>
  request(`${BASE}/${id}`, { method: "DELETE" });
