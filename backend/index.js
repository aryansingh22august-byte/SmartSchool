import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth.js';
import dashboardRouter from './src/routes/dashboard.js';
import admissionsRouter from './src/routes/admissions.js';
import feesRouter from './src/routes/fees.js';
import timetableRouter from './src/routes/timetable.js';
import examsRouter from './src/routes/exams.js';
import attendanceRouter from './src/routes/attendance.js';
import messagesRouter from './src/routes/messages.js';
import staffRouter from './src/routes/staff.js';
import studentsRouter from './src/routes/students.js';
import leavesRouter from './src/routes/leaves.js';
import tcRouter from './src/routes/tc.js';
import profileRouter from './src/routes/profile.js';
import rolesRouter from './src/routes/roles.js';
import usersRouter from './src/routes/users.js';
import contactRouter from './src/routes/contact.js';
import schoolsRouter from './src/routes/schools.js';
import { initDb } from './src/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const frontendDist = path.resolve(process.cwd(), '../frontend/dist');
if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(frontendDist));
}

async function start() {
  await initDb();

  app.use('/api/auth', authRouter);
  app.use('/api/dashboard', dashboardRouter);
  app.use('/api/admissions', admissionsRouter);
  app.use('/api/fees', feesRouter);
  app.use('/api/timetable', timetableRouter);
  app.use('/api/exams', examsRouter);
  app.use('/api/attendance', attendanceRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/staff', staffRouter);
  app.use('/api/students', studentsRouter);
  app.use('/api/leaves', leavesRouter);
  app.use('/api/tc', tcRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/roles', rolesRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/schools', schoolsRouter);

  app.get('/', (req, res) => {
    res.send({ status: 'Smart School ERP backend is running' });
  });

  app.get('*', (req, res) => {
    if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
      return res.sendFile(path.join(frontendDist, 'index.html'));
    }
    res.status(404).json({ message: 'Route not found' });
  });

  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
