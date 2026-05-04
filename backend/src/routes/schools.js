import { Router } from 'express';
import authenticate from '../middleware/auth.js';
import { authorizeRole } from '../middleware/authorize.js';
import { query, isMock } from '../db.js';

const router = Router();
router.use(authenticate);

router.get('/', authorizeRole('super-admin'), async (req, res) => {
  if (isMock()) {
    const schools = [
      {
        id: 'school-1',
        name: 'St. John\'s Academy',
        domain: 'stjohns.edu',
        created_at: new Date().toISOString()
      }
    ];
    return res.json({ schools });
  }

  try {
    const result = await query(
      'SELECT id, name, domain, created_at FROM schools ORDER BY created_at DESC',
      []
    );
    res.json({ schools: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch schools.' });
  }
});

router.post('/', authorizeRole('super-admin'), async (req, res) => {
  const { name, domain } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'School name is required.' });
  }

  if (isMock()) {
    const school = {
      id: `school-${Date.now()}`,
      name,
      domain,
      created_at: new Date().toISOString()
    };
    return res.status(201).json({ school });
  }

  try {
    const id = `school-${Date.now()}`;
    const result = await query(
      'INSERT INTO schools (id, name, domain) VALUES ($1, $2, $3) RETURNING id, name, domain, created_at',
      [id, name, domain || null]
    );
    res.status(201).json({ school: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create school.' });
  }
});

router.get('/:id', authorizeRole('super-admin'), async (req, res) => {
  const { id } = req.params;

  if (isMock()) {
    return res.json({
      school: {
        id,
        name: 'St. John\'s Academy',
        domain: 'stjohns.edu',
        created_at: new Date().toISOString()
      }
    });
  }

  try {
    const result = await query(
      'SELECT id, name, domain, created_at FROM schools WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'School not found.' });
    }
    res.json({ school: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch school.' });
  }
});

export default router;
