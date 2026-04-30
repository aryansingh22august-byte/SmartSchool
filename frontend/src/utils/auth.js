export function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch (error) {
    return null;
  }
}

export function getTokenRole() {
  const token = localStorage.getItem('school_erp_token');
  const payload = parseJwt(token);
  return payload?.role || null;
}
