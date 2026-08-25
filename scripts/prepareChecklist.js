import fs from 'node:fs';

const componentPath = 'src/components/SensoryFoodSafety/SensoryFoodSafetyModule.tsx';
const contextPath = 'src/context/AppContext.tsx';

const patchFile = (path, replacements) => {
  let source = fs.readFileSync(path, 'utf8');
  for (const [from, to] of replacements) {
    if (!from || !source.includes(from)) {
      console.warn(`Checklist build patch source not found in ${path}; skipping optional patch.`);
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
  ]
]);

console.log('Checklist build patch applied successfully.');
