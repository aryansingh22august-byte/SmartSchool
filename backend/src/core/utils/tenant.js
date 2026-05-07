export function tenantQuery(user, sql, params = []) {
  if (!user || user.role === 'super-admin' || !user.school_id) return { sql, params };
  const separator = sql.toLowerCase().includes('where') ? ' AND ' : ' WHERE ';
  return { sql: `${sql}${separator}school_id = $${params.length + 1}`, params: [...params, user.school_id] };
}

export function tenantInsert(user, baseParams = []) {
  if (!user || user.role === 'super-admin' || !user.school_id) return baseParams;
  return [...baseParams, user.school_id];
}
