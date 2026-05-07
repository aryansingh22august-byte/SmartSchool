import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Core
import { initDb } from './src/core/db.js';

// Modules
import authRouter from './src/modules/auth/auth.routes.js';
import dashboardRouter from './src/modules/dashboard/dashboard.routes.js';
import admissionsRouter from './src/modules/administration/admissions.routes.js';
import feesRouter from './src/modules/administration/fees.routes.js';
import staffRouter from './src/modules/administration/staff.routes.js';
import studentsRouter from './src/modules/administration/students.routes.js';
import leavesRouter from './src/modules/administration/leaves.routes.js';
import tcRouter from './src/modules/administration/tc.routes.js';
import profileRouter from './src/modules/administration/profile.routes.js';
import usersRouter from './src/modules/administration/users.routes.js';
import rolesRouter from './src/modules/administration/roles.routes.js';
import timetableRouter from './src/modules/academics/timetable.routes.js';
import examsRouter from './src/modules/academics/exams.routes.js';
import attendanceRouter from './src/modules/academics/attendance.routes.js';
import messagesRouter from './src/modules/communication/messages.routes.js';
import contactRouter from './src/modules/communication/contact.routes.js';
import schoolsRouter from './src/modules/schools/schools.routes.js';
import classesRouter from './src/modules/academics/classes.routes.js';
import studentAttendanceRouter from './src/modules/academics/student-attendance.routes.js';
import marksRouter from './src/modules/academics/marks.routes.js';
import feeServicesRouter from './src/modules/administration/fee-services.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const frontendDist = process.env.NODE_ENV === 'production'
  ? path.join(process.cwd(), '../frontend/dist')
  : path.resolve(process.cwd(), '../frontend/dist');

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
  app.use('/api/classes', classesRouter);
  app.use('/api/student-attendance', studentAttendanceRouter);
  app.use('/api/marks', marksRouter);
  app.use('/api/fee-services', feeServicesRouter);

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
