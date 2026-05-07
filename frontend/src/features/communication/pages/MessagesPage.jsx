import { useEffect, useState } from 'react';
import api from '../../../app/api';

function MessagesPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get('/messages').then((res) => setMessages(res.data.messages));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Messages</h2>
        <p className="mt-2 text-sm text-slate-500">Send announcements and communicate with staff, students, and parents.</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <ul className="space-y-4">
          {messages.map((item) => (
            <li key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">{item.subject}</p>
              <p className="mt-1 text-sm text-slate-600">From: {item.sender}</p>
              <p className="mt-1 text-sm text-slate-500">{item.date} · {item.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MessagesPage;
