import { Router } from 'express';
import { query, isMock } from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  const { fullName, email, schoolName, role, message } = req.body;
  if (!fullName || !email || !schoolName || !role) {
    return res.status(400).json({ message: 'fullName, email, schoolName, and role are required.' });
  }

  if (isMock()) {
    return res.status(201).json({ message: 'Contact request submitted successfully.' });
  }

  const id = `contact-${Date.now()}`;
  await query(
    'INSERT INTO contact_requests (id, full_name, email, school_name, role, message) VALUES ($1, $2, $3, $4, $5, $6)',
    [id, fullName, email, schoolName, role, message || '']
  );

  res.status(201).json({ message: 'Contact request submitted successfully.' });
});

export default router;
