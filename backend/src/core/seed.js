import bcrypt from 'bcryptjs';

export async function seedData(query) {
  const adminPassword = bcrypt.hashSync('admin', 10);
  const teacherPassword = bcrypt.hashSync('teacher', 10);

  await query(
    `INSERT INTO schools (id, name, domain) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    ['school-1', 'Smart School Demo', 'smartschool.local']
  );

  await query(
    `INSERT INTO roles (id, name, description, permissions) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
    ['super-admin', 'Super Admin', 'Full system access across all schools.', JSON.stringify(['manage_all', 'manage_users', 'manage_schools', 'view_reports'])]
  );
  await query(
    `INSERT INTO roles (id, name, description, permissions) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
    ['admin', 'School Admin', 'Manage school operations, admissions, fees, staff, and students.', JSON.stringify(['view_reports', 'manage_admissions', 'manage_fees', 'manage_staff', 'manage_students', 'manage_timetable', 'manage_attendance'])]
  );
  await query(
    `INSERT INTO roles (id, name, description, permissions) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
    ['teacher', 'Teacher', 'View student data, attendance, timetable and exam schedules.', JSON.stringify(['view_students', 'manage_attendance', 'view_timetable', 'view_exams', 'send_messages'])]
  );
  await query(
    `INSERT INTO roles (id, name, description, permissions) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
    ['student', 'Student', 'View personal profile, timetable, and exam results.', JSON.stringify(['view_own_profile', 'view_timetable', 'view_exams'])]
  );
  await query(
    `INSERT INTO roles (id, name, description, permissions) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
    ['parent', 'Parent', 'View linked student progress and attendance.', JSON.stringify(['view_child_profile', 'view_child_attendance', 'view_child_exams'])]
  );

  await query(
    `INSERT INTO users (id, school_id, username, password_hash, role, name, email) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
    ['admin-1', 'school-1', 'admin', adminPassword, 'super-admin', 'System Administrator', 'admin@smartschool.local']
  );

  await query(
    `INSERT INTO users (id, school_id, username, password_hash, role, name, email) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
    ['teacher-1', 'school-1', 'teacher', teacherPassword, 'teacher', 'Math Teacher', 'teacher@smartschool.local']
  );

  await query(
    `INSERT INTO students (id, school_id, name, grade, section, status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    ['student-1', 'school-1', 'Riya Sharma', '7', 'A', 'Active']
  );

  await query(
    `INSERT INTO staff (id, school_id, name, role, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
    ['staff-1', 'school-1', 'Mr. R. Verma', 'Math Teacher', 'Active']
  );

  await query(
    `INSERT INTO admissions (id, school_id, student_name, grade, status, admission_date) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    ['A001', 'school-1', 'Nikhil Patel', '8', 'Pending', '2026-02-20']
  );

  await query(
    `INSERT INTO fees (id, school_id, student_name, amount, paid, due_date) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    ['F001', 'school-1', 'Riya Sharma', 1200, 1200, '2026-04-15']
  );

  await query(
    `INSERT INTO timetable (id, school_id, day, subject, teacher_name, time) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    ['T001', 'school-1', 'Monday', 'Math', 'Mr. R. Verma', '09:00 - 10:00']
  );

  await query(
    `INSERT INTO exams (id, school_id, name, grade, date, status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    ['E001', 'school-1', 'Mid-Term Exam', '7', '2026-05-21', 'Scheduled']
  );

  await query(
    `INSERT INTO attendance (id, school_id, date, present, absent, percentage) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    ['AT001', 'school-1', '2026-04-30', 286, 26, '91.7%']
  );

  await query(
    `INSERT INTO messages (id, school_id, sender, subject, body, date, status) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
    ['M001', 'school-1', 'Principal', 'Holiday Notice', 'School will be closed on June 1st for a staff training day.', '2026-04-28', 'Sent']
  );

  await query(
    `INSERT INTO leaves (id, school_id, type, name, duration, status) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    ['L001', 'school-1', 'Student', 'Riya Sharma', '3 days', 'Approved']
  );

  await query(
    `INSERT INTO transfer_certificates (id, school_id, student_name, grade, status, issued_date) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
    ['TC001', 'school-1', 'Nikhil Patel', '8', 'Generated', '2026-03-30']
  );

  await query(
    `INSERT INTO subscriptions (id, school_id, plan, monthly_price, seats, start_date, renewal_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`,
    ['SUB001', 'school-1', 'Pro', 149.99, 250, '2026-01-01', '2026-07-01', 'Active']
  );

  console.log('Seed data ensured.');
}
