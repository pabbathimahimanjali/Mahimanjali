const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// Escape user input so it is safe inside a regular expression
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/contacts?q=text
router.get("/", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const filter = q
      ? {
          $or: ["name", "phone", "email"].map((f) => ({
            [f]: { $regex: escapeRegex(q), $options: "i" },
          })),
        }
      : {};
    const contacts = await Contact.find(filter).sort({ name: 1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/contacts
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;
    const contact = await Contact.create({ name, phone, email, notes });
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/contacts/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, notes },
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/contacts/:id
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
