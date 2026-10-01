export default function ContactList({ contacts, searching, onEdit, onDelete }) {
  if (contacts.length === 0) {
    return (
      <p className="muted empty">
        {searching
          ? "No contacts match your search."
          : "No contacts yet. Add your first one using the form."}
      </p>
    );
  }

  return (
    <ul className="list">
      {contacts.map((c) => (
        <li key={c._id} className="card">
          <div className="avatar" aria-hidden="true">
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div className="info">
            <strong>{c.name}</strong>
            <a href={`tel:${c.phone}`}>{c.phone}</a>
            {c.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
            {c.notes && <span className="muted">{c.notes}</span>}
          </div>
          <div className="row-actions">
            <button className="btn small" onClick={() => onEdit(c)}>Edit</button>
            <button className="btn small danger" onClick={() => onDelete(c._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
