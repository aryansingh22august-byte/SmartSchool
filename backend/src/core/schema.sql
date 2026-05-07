CREATE TABLE IF NOT EXISTS schools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id) ON DELETE SET NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  plan TEXT NOT NULL,
  monthly_price NUMERIC NOT NULL,
  seats INTEGER NOT NULL,
  start_date DATE NOT NULL,
  renewal_date DATE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  section TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admissions (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  student_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  status TEXT NOT NULL,
  admission_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fees (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  student_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  paid NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timetable (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  day TEXT NOT NULL,
  subject TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  date DATE NOT NULL,
  present INTEGER NOT NULL,
  absent INTEGER NOT NULL,
  percentage TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  sender TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  date DATE NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaves (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transfer_certificates (
  id TEXT PRIMARY KEY,
  school_id TEXT REFERENCES schools(id),
  student_name TEXT NOT NULL,
  grade TEXT NOT NULL,
  status TEXT NOT NULL,
  issued_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  school_name TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
