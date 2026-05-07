import { useEffect, useState } from 'react';
import api from '../../../app/api';

function LibraryPage() {
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [tab, setTab] = useState('catalog');
  const [search, setSearch] = useState('');
  const [showAddBook, setShowAddBook] = useState(false);
  const [showIssueBook, setShowIssueBook] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: '', total_copies: 1 });
  const [issueForm, setIssueForm] = useState({ book_id: '', borrower_id: '', borrower_type: 'student', borrower_name: '', due_date: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAll = async () => {
    const [booksRes, issuesRes] = await Promise.all([api.get('/library/books'), api.get('/library/issues')]);
    setBooks(booksRes.data.books || []);
    setIssues(issuesRes.data.issues || []);
  };

  useEffect(() => { fetchAll(); }, []);

  const addBook = async () => {
    if (!newBook.title || !newBook.author) { setMessage('Title and author required.'); return; }
    setSaving(true);
    try {
      await api.post('/library/books', { ...newBook, total_copies: parseInt(newBook.total_copies) });
      setNewBook({ title: '', author: '', isbn: '', category: '', total_copies: 1 });
      setShowAddBook(false);
      setMessage('Book added!');
      fetchAll();
    } catch { setMessage('Failed to add book.'); }
    finally { setSaving(false); }
  };

  const issueBook = async () => {
    if (!issueForm.book_id || !issueForm.borrower_name || !issueForm.due_date) {
      setMessage('Book, borrower name, and due date are required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/library/issues', { ...issueForm, borrower_id: issueForm.borrower_name.toLowerCase().replace(/ /g, '-') });
      setIssueForm({ book_id: '', borrower_id: '', borrower_type: 'student', borrower_name: '', due_date: '' });
      setShowIssueBook(false);
      setMessage('Book issued!');
      fetchAll();
    } catch (e) { setMessage(e.response?.data?.message || 'Failed to issue book.'); }
    finally { setSaving(false); }
  };

  const returnBook = async (issueId) => {
    await api.patch(`/library/issues/${issueId}/return`);
    setMessage('Book returned!');
    fetchAll();
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    (b.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const categoryColors = { Textbook: 'bg-blue-100 text-blue-700', Biography: 'bg-amber-100 text-amber-700', Fiction: 'bg-purple-100 text-purple-700', Science: 'bg-green-100 text-green-700' };

  return (
    <div className="space-y-6">
      <div className="bg-emerald-50 rounded-md p-6">
        <h2 className="text-2xl font-semibold text-emerald-900">Library</h2>
        <p className="mt-1 text-sm text-emerald-700">Manage book catalog, issue and return tracking.</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Books', value: books.length, bg: 'bg-emerald-50', text: 'text-emerald-800' },
          { label: 'Currently Issued', value: issues.filter(i => i.status === 'issued').length, bg: 'bg-amber-50', text: 'text-amber-800' },
          { label: 'Available Copies', value: books.reduce((s, b) => s + b.available_copies, 0), bg: 'bg-blue-50', text: 'text-blue-800' }
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-md p-4`}>
            <p className={`text-xs font-medium ${s.text} opacity-70`}>{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {['catalog', 'issues'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'catalog' ? 'Book Catalog' : 'Issues & Returns'}
          </button>
        ))}
      </div>

      {message && <p className="text-sm text-green-700 bg-green-50 rounded-md px-4 py-2">{message}</p>}

      {/* Catalog Tab */}
      {tab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input placeholder="Search by title, author, or category…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm" />
            <button onClick={() => setShowAddBook(!showAddBook)}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
              {showAddBook ? 'Cancel' : '+ Add Book'}
            </button>
            <button onClick={() => setShowIssueBook(!showIssueBook)}
              className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">
              Issue Book
            </button>
          </div>

          {showAddBook && (
            <div className="bg-emerald-50 rounded-md p-4 grid gap-3 sm:grid-cols-2">
              <input placeholder="Book Title *" value={newBook.title} onChange={e => setNewBook(p => ({ ...p, title: e.target.value }))}
                className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm" />
              <input placeholder="Author *" value={newBook.author} onChange={e => setNewBook(p => ({ ...p, author: e.target.value }))}
                className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm" />
              <input placeholder="ISBN" value={newBook.isbn} onChange={e => setNewBook(p => ({ ...p, isbn: e.target.value }))}
                className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm" />
              <input placeholder="Category (e.g. Textbook)" value={newBook.category} onChange={e => setNewBook(p => ({ ...p, category: e.target.value }))}
                className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm" />
              <input type="number" min="1" placeholder="Total Copies" value={newBook.total_copies}
                onChange={e => setNewBook(p => ({ ...p, total_copies: e.target.value }))}
                className="rounded-md border border-emerald-200 bg-white px-3 py-2 text-sm" />
              <button onClick={addBook} disabled={saving}
                className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {saving ? 'Adding…' : 'Add Book'}
              </button>
            </div>
          )}

          {showIssueBook && (
            <div className="bg-amber-50 rounded-md p-4 grid gap-3 sm:grid-cols-2">
              <select value={issueForm.book_id} onChange={e => setIssueForm(p => ({ ...p, book_id: e.target.value }))}
                className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm">
                <option value="">Select Book *</option>
                {books.filter(b => b.available_copies > 0).map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({b.available_copies} left)</option>
                ))}
              </select>
              <input placeholder="Borrower Name *" value={issueForm.borrower_name} onChange={e => setIssueForm(p => ({ ...p, borrower_name: e.target.value }))}
                className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm" />
              <select value={issueForm.borrower_type} onChange={e => setIssueForm(p => ({ ...p, borrower_type: e.target.value }))}
                className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm">
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
              <div>
                <label className="block text-xs text-amber-700 mb-1">Due Date *</label>
                <input type="date" value={issueForm.due_date} onChange={e => setIssueForm(p => ({ ...p, due_date: e.target.value }))}
                  className="w-full rounded-md border border-amber-200 bg-white px-3 py-2 text-sm" />
              </div>
              <button onClick={issueBook} disabled={saving}
                className="rounded-md bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-50 sm:col-span-2">
                {saving ? 'Issuing…' : 'Issue Book'}
              </button>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(book => (
              <div key={book.id} className="bg-white rounded-md p-4 border border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-slate-900 leading-snug">{book.title}</p>
                  {book.category && (
                    <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[book.category] || 'bg-slate-100 text-slate-600'}`}>
                      {book.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{book.author}</p>
                {book.isbn && <p className="text-xs text-slate-400 mt-0.5">ISBN: {book.isbn}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-xs font-semibold ${book.available_copies > 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {book.available_copies}/{book.total_copies} available
                  </span>
                  <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(book.available_copies / book.total_copies) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues Tab */}
      {tab === 'issues' && (
        <div className="bg-white rounded-md overflow-hidden">
          <div className="px-6 py-4 bg-slate-50">
            <h3 className="font-semibold text-slate-800">Active & Past Issues</h3>
          </div>
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Borrower</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Issued</th>
                <th className="px-4 py-3 text-left">Due</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {issues.map(issue => (
                <tr key={issue.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{issue.book_title}</td>
                  <td className="px-4 py-3 text-slate-700">{issue.borrower_name}</td>
                  <td className="px-4 py-3 capitalize text-slate-500">{issue.borrower_type}</td>
                  <td className="px-4 py-3 text-slate-500">{issue.issued_on}</td>
                  <td className="px-4 py-3 text-slate-500">{issue.due_date}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${issue.status === 'returned' ? 'bg-green-100 text-green-700' : issue.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {issue.status === 'issued' && (
                      <button onClick={() => returnBook(issue.id)} className="text-xs font-semibold text-emerald-600 hover:underline">
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LibraryPage;
