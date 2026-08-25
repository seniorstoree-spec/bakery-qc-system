import fs from 'node:fs';

const componentPath = 'src/components/SensoryFoodSafety/SensoryFoodSafetyModule.tsx';
const contextPath = 'src/context/AppContext.tsx';

const patchFile = (path, replacements) => {
  let source = fs.readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    if (from && !source.includes(from)) {
      console.warn(`Checklist build patch source not found in ${path}; skipping optional patch: ${from.slice(0, 120)}`);
      continue;
    }
    source = source.replace(from, to);
  }
  fs.writeFileSync(path, source, 'utf8');
};

patchFile(contextPath, [
  [
    "const updateSanitationLogB1=async(log:DailySanitationLog)=>{try{const saved=log.id&&log.id.length>20?await qualityFormPersistence.updateSanitation(log):await qualityFormPersistence.saveSanitation(log);setSanitationLogB1(saved as DailySanitationLog)}catch(e){console.warn(e)}};",
    "const updateSanitationLogB1=async(log:DailySanitationLog)=>{setSanitationLogB1(log);try{const saved=log.id&&log.id.length>20?await qualityFormPersistence.updateSanitation(log):await qualityFormPersistence.saveSanitation(log);setSanitationLogB1(saved as DailySanitationLog)}catch(e){console.warn('Sanitation checklist save failed; keeping local state visible',e)}};"
  ],
  [
    "const updateFoodSafetyLog=async(log:DailyFoodSafetyLog)=>{try{const saved=log.id&&log.id.length>20?await qualityFormPersistence.updateFoodSafety(log):await qualityFormPersistence.saveFoodSafety(log);setFoodSafetyLog(saved as DailyFoodSafetyLog)}catch(e){console.warn(e)}};",
    "const updateFoodSafetyLog=async(log:DailyFoodSafetyLog)=>{setFoodSafetyLog(log);try{const saved=log.id&&log.id.length>20?await qualityFormPersistence.updateFoodSafety(log):await qualityFormPersistence.saveFoodSafety(log);setFoodSafetyLog(saved as DailyFoodSafetyLog)}catch(e){console.warn('GHP checklist save failed; keeping local state visible',e)}};"
  ]
]);

patchFile(componentPath, [
  [
    "updated.items[index][shift][timing] = nextVal;\n    updateSanitationLogB1(updated);",
    "const updatedItems = updated.items.map((item, itemIndex) => itemIndex === index ? { ...item, [shift]: { ...item[shift], [timing]: nextVal } } : item);\n    updateSanitationLogB1({ ...updated, items: updatedItems });"
  ],
  [
    "updated.checks[index][shift][timing] = nextVal;\n    updateFoodSafetyLog(updated);",
    "const updatedChecks = updated.checks.map((item, itemIndex) => itemIndex === index ? { ...item, [shift]: { ...item[shift], [timing]: nextVal } } : item);\n    updateFoodSafetyLog({ ...updated, checks: updatedChecks });"
  ],
  [
    "  };\n\n  const regularSensory = sensoryEvaluations.filter(s => !s.isVegan);",
    "  };\n\n  const updateSanitationNote = (index: number, shift: 'morningShift' | 'eveningShift', note: string) => {\n    const updatedItems = sanitationLogB1.items.map((item, itemIndex) => itemIndex === index ? { ...item, [shift]: { ...item[shift], notes: note } } : item);\n    updateSanitationLogB1({ ...sanitationLogB1, items: updatedItems });\n  };\n\n  const updateGhpNote = (index: number, shift: 'morningShift' | 'eveningShift', note: string) => {\n    const updatedChecks = foodSafetyLog.checks.map((item, itemIndex) => itemIndex === index ? { ...item, [shift]: { ...item[shift], notes: note } } : item);\n    updateFoodSafetyLog({ ...foodSafetyLog, checks: updatedChecks });\n  };\n\n  const regularSensory = sensoryEvaluations.filter(s => !s.isVegan);"
  ],
  [
    "<td className=\"p-2 text-[11px] text-slate-400 border-l max-w-[120px] truncate\">{item.morningShift.notes || '-'}</td>",
    "<td className=\"p-2 border-l w-48\"><textarea value={item.morningShift.notes || ''} onChange={(e) => updateSanitationNote(idx, 'morningShift', e.target.value)} placeholder=\"ملاحظات...\" className=\"w-full min-h-10 resize-y rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200\" /></td>"
  ],
  [
    "<td className=\"p-2 text-[11px] text-slate-400 max-w-[120px] truncate\">{item.eveningShift.notes || '-'}</td>",
    "<td className=\"p-2 w-48\"><textarea value={item.eveningShift.notes || ''} onChange={(e) => updateSanitationNote(idx, 'eveningShift', e.target.value)} placeholder=\"ملاحظات...\" className=\"w-full min-h-10 resize-y rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200\" /></td>"
  ],
  [
    "<td className=\"p-2 text-[11px] text-slate-400 border-l max-w-[100px] truncate\">{chk.morningShift.notes || '-'}</td>",
    "<td className=\"p-2 border-l w-48\"><textarea value={chk.morningShift.notes || ''} onChange={(e) => updateGhpNote(idx, 'morningShift', e.target.value)} placeholder=\"ملاحظات...\" className=\"w-full min-h-10 resize-y rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200\" /></td>"
  ],
  [
    "<td className=\"p-2 text-[11px] text-slate-400 max-w-[100px] truncate\">{chk.eveningShift.notes || '-'}</td>",
    "<td className=\"p-2 w-48\"><textarea value={chk.eveningShift.notes || ''} onChange={(e) => updateGhpNote(idx, 'eveningShift', e.target.value)} placeholder=\"ملاحظات...\" className=\"w-full min-h-10 resize-y rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-700 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200\" /></td>"
  ]
]);

console.log('Checklist build patch applied successfully.');
