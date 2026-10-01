import { useState } from "react";

const empty = { name: "", phone: "", email: "", notes: "" };

export default function ContactForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ? { ...empty, ...initial } : empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        name: form.name,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
      });
      if (!initial) setForm(empty);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <label>
        Name
        <input name="name" value={form.name} onChange={change} autoComplete="off" />
      </label>
      <label>
        Phone
        <input name="phone" value={form.phone} onChange={change} inputMode="tel" />
      </label>
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={change} />
      </label>
      <label>
        Notes
        <textarea name="notes" rows="3" value={form.notes} onChange={change} />
      </label>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="actions">
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? "Saving…" : initial ? "Save changes" : "Add contact"}
        </button>
        {initial && (
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
