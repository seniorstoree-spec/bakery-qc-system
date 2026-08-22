const storageKey = (table: string) => `bakery_qc_sync_${table}`;

function readTable(table: string): Array<Record<string, unknown>> {
  try {
    const raw = localStorage.getItem(storageKey(table));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTable(table: string, rows: Array<Record<string, unknown>>) {
  localStorage.setItem(storageKey(table), JSON.stringify(rows));
}

export async function saveRecord(table: string, data: Record<string, unknown>) {
  const record = { ...data, id: String(data.id ?? `${table}-${Date.now()}`) };
  writeTable(table, [record, ...readTable(table)]);
  return record;
}

export async function deleteRecord(table: string, id: string) {
  writeTable(table, readTable(table).filter((row) => String(row.id) !== id));
  return true;
}

export async function updateRecord(table: string, id: string, data: Record<string, unknown>) {
  const rows = readTable(table);
  const index = rows.findIndex((row) => String(row.id) === id);
  if (index < 0) return null;
  rows[index] = { ...rows[index], ...data, id };
  writeTable(table, rows);
  return rows[index];
}
