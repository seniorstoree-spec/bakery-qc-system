const storageKey = (table: string) => `bakery_qc_repo_${table}`;

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

export const dataRepository = {
  async insert(table: string, payload: unknown) {
    const row = { ...(payload as Record<string, unknown>), id: String((payload as Record<string, unknown>)?.id ?? `${table}-${Date.now()}`) };
    writeTable(table, [row, ...readTable(table)]);
    return row;
  },

  async getAll(table: string) {
    return readTable(table);
  },

  async select(table: string) {
    return readTable(table);
  },

  async update(table: string, id: string, payload: unknown) {
    const rows = readTable(table);
    const index = rows.findIndex((row) => String(row.id) === id);
    if (index < 0) return null;
    rows[index] = { ...rows[index], ...(payload as Record<string, unknown>), id };
    writeTable(table, rows);
    return rows[index];
  },

  async remove(table: string, id: string) {
    writeTable(table, readTable(table).filter((row) => String(row.id) !== id));
    return true;
  },
};
