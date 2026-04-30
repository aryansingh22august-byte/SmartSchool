import { useEffect, useState } from 'react';
import api from '../api';

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/profile').then((res) => setProfile(res.data.profile));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">My Profile</h2>
        <p className="mt-2 text-sm text-slate-500">View your user details and access level.</p>
      </div>

      {profile ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">Name</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{profile.name}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">Role</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{profile.role}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">Email</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{profile.email}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white p-6 shadow-sm">Loading profile...</div>
      )}
    </div>
  );
}

export default ProfilePage;
