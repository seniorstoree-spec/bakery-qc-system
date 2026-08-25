import React from 'react';

interface SnapshotProps {
  snapshot: Record<string, unknown>;
}

type AnyRecord = Record<string, any>;

const asArray = (value: unknown): AnyRecord[] => Array.isArray(value) ? value.filter(v => v && typeof v === 'object') as AnyRecord[] : [];

const statusText = (value: unknown) => {
  const v = String(value ?? '');
  if (v === 'compliant' || v === 'passed' || v === 'مطابق') return 'مطابق ✓';
  if (v === 'non_compliant' || v === 'non-compliant' || v === 'noncompliant' || v === 'failed' || v === 'غير مطابق') return 'غير مطابق ×';
  if (v === 'not_operated' || v === 'لم يتم العمل عليها') return 'لم يتم العمل عليها —';
  return v || '—';
};

const shift = (value: AnyRecord | undefined, key: string) => value?.[key] ?? '';

export const ArchivedChecklistSections: React.FC<SnapshotProps> = ({ snapshot }) => {
  const sanitationParents = asArray(snapshot.sanitationLogs);
  const foodSafetyParents = asArray(snapshot.foodSafetyLogs);

  const sanitationRows = sanitationParents.flatMap(parent => asArray(parent.items).map(item => ({
    equipmentName: item.equipmentName ?? item.equipment_name ?? '—',
    equipmentCode: item.equipmentCode ?? item.equipment_code ?? '—',
    morningStart: shift(item.morningShift, 'startShift') || item.morning_start,
    morningEnd: shift(item.morningShift, 'endShift') || item.morning_end,
    morningNotes: shift(item.morningShift, 'notes') || item.morning_notes,
    eveningStart: shift(item.eveningShift, 'startShift') || item.evening_start,
    eveningEnd: shift(item.eveningShift, 'endShift') || item.evening_end,
    eveningNotes: shift(item.eveningShift, 'notes') || item.evening_notes,
  })));

  const foodSafetyRows = foodSafetyParents.flatMap(parent => asArray(parent.checks).map(item => ({
    category: item.category ?? '—',
    criterion: item.criterion ?? '—',
    morningStart: shift(item.morningShift, 'startShift') || item.morning_start,
    morningMid: shift(item.morningShift, 'midShift') || item.morning_mid,
    morningNotes: shift(item.morningShift, 'notes') || item.morning_notes,
    eveningStart: shift(item.eveningShift, 'startShift') || item.evening_start,
    eveningMid: shift(item.eveningShift, 'midShift') || item.evening_mid,
    eveningNotes: shift(item.eveningShift, 'notes') || item.evening_notes,
  })));

  const empty = (title: string) => <div className="py-8 text-center text-slate-400">لا توجد بيانات مسجلة في {title}.</div>;

  return (
    <div className="space-y-6" dir="rtl">
      <section className="border rounded-2xl overflow-hidden bg-white">
        <div className="px-5 py-4 bg-slate-50 border-b font-black text-lg">نموذج متابعة النظافة والتطهير بقسم المخبوزات (18 أداة ومعدة)</div>
        {sanitationRows.length === 0 ? empty('نموذج النظافة والتطهير') : (
          <div className="overflow-auto">
            <table className="w-full min-w-[1050px] text-sm border-collapse">
              <thead className="bg-white">
                <tr>
                  <th className="border px-3 py-3 text-right">م</th>
                  <th className="border px-3 py-3 text-right">الأداة والمعدة</th>
                  <th className="border px-3 py-3 text-right">الكود</th>
                  <th className="border px-3 py-3 text-center" colSpan={3}>وردية صباحية</th>
                  <th className="border px-3 py-3 text-center" colSpan={3}>وردية مسائية</th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="border px-3 py-2"></th>
                  <th className="border px-3 py-2"></th>
                  <th className="border px-3 py-2"></th>
                  <th className="border px-3 py-2">بداية التشغيل</th>
                  <th className="border px-3 py-2">نهاية التشغيل</th>
                  <th className="border px-3 py-2">ملاحظات</th>
                  <th className="border px-3 py-2">بداية التشغيل</th>
                  <th className="border px-3 py-2">نهاية التشغيل</th>
                  <th className="border px-3 py-2">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {sanitationRows.map((row, index) => (
                  <tr key={`${row.equipmentName}-${index}`} className={index % 2 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="border px-3 py-3 text-center">{index + 1}</td>
                    <td className="border px-3 py-3 font-semibold">{row.equipmentName}</td>
                    <td className="border px-3 py-3">{row.equipmentCode || '—'}</td>
                    <td className="border px-3 py-3 text-center">{statusText(row.morningStart)}</td>
                    <td className="border px-3 py-3 text-center">{statusText(row.morningEnd)}</td>
                    <td className="border px-3 py-3">{row.morningNotes || '—'}</td>
                    <td className="border px-3 py-3 text-center">{statusText(row.eveningStart)}</td>
                    <td className="border px-3 py-3 text-center">{statusText(row.eveningEnd)}</td>
                    <td className="border px-3 py-3">{row.eveningNotes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="border rounded-2xl overflow-hidden bg-white">
        <div className="px-5 py-4 bg-slate-50 border-b font-black text-lg">نموذج متابعة التحقق من اشتراطات سلامة الغذاء ومكافحة الآفات (GHP)</div>
        {foodSafetyRows.length === 0 ? empty('اشتراطات سلامة الغذاء (GHP)') : (
          <div className="overflow-auto">
            <table className="w-full min-w-[1100px] text-sm border-collapse">
              <thead>
                <tr className="bg-white">
                  <th className="border px-3 py-3 text-right">م</th>
                  <th className="border px-3 py-3 text-right">التصنيف</th>
                  <th className="border px-3 py-3 text-right">بند التحقق</th>
                  <th className="border px-3 py-3 text-center" colSpan={3}>وردية صباحية</th>
                  <th className="border px-3 py-3 text-center" colSpan={3}>وردية مسائية</th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="border px-3 py-2"></th>
                  <th className="border px-3 py-2"></th>
                  <th className="border px-3 py-2"></th>
                  <th className="border px-3 py-2">بداية</th>
                  <th className="border px-3 py-2">منتصف</th>
                  <th className="border px-3 py-2">ملاحظات</th>
                  <th className="border px-3 py-2">بداية</th>
                  <th className="border px-3 py-2">منتصف</th>
                  <th className="border px-3 py-2">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {foodSafetyRows.map((row, index) => (
                  <tr key={`${row.criterion}-${index}`} className={index % 2 ? 'bg-slate-50/40' : 'bg-white'}>
                    <td className="border px-3 py-3 text-center">{index + 1}</td>
                    <td className="border px-3 py-3">{row.category === 'Pest_Control' ? 'مكافحة الآفات' : row.category === 'Work_Environment' ? 'بيئة العمل' : row.category === 'Hall_Integrity' ? 'سلامة صالة الإنتاج' : 'GHP'}</td>
                    <td className="border px-3 py-3 font-semibold">{row.criterion}</td>
                    <td className="border px-3 py-3 text-center">{statusText(row.morningStart)}</td>
                    <td className="border px-3 py-3 text-center">{statusText(row.morningMid)}</td>
                    <td className="border px-3 py-3">{row.morningNotes || '—'}</td>
                    <td className="border px-3 py-3 text-center">{statusText(row.eveningStart)}</td>
                    <td className="border px-3 py-3 text-center">{statusText(row.eveningMid)}</td>
                    <td className="border px-3 py-3">{row.eveningNotes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
