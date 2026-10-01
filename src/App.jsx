import { useEffect, useState } from "react";
import * as api from "./api";
import ContactForm from "./components/ContactForm.jsx";
import ContactList from "./components/ContactList.jsx";
import SearchBar from "./components/SearchBar.jsx";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Reload the list whenever the search text changes (small delay while typing)
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setContacts(await api.getContacts(query));
        setError("");
      } catch (e) {
        setError(`Could not load contacts. Is the server running? (${e.message})`);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  const handleSave = async (data) => {
    if (editing) {
      const updated = await api.updateContact(editing._id, data);
      setContacts((list) => list.map((c) => (c._id === updated._id ? updated : c)));
      setEditing(null);
    } else {
      const created = await api.createContact(data);
      setContacts((list) =>
        [...list, created].sort((a, b) => a.name.localeCompare(b.name))
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await api.deleteContact(id);
      setContacts((list) => list.filter((c) => c._id !== id));
      if (editing?._id === id) setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="app">
      <header className="masthead">
        <h1>Contact Book</h1>
        <p>{contacts.length} {contacts.length === 1 ? "person" : "people"} saved</p>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>{editing ? `Edit ${editing.name}` : "New contact"}</h2>
          <ContactForm
            key={editing?._id || "new"}
            initial={editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        </section>

        <section className="panel">
          <SearchBar value={query} onChange={setQuery} />
          {error && <p className="error" role="alert">{error}</p>}
          {loading ? (
            <p className="muted">Loading…</p>
          ) : (
            <ContactList
              contacts={contacts}
              searching={!!query}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}
