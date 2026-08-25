import fs from 'node:fs';

const componentPath = 'src/components/SensoryFoodSafety/SensoryFoodSafetyModule.tsx';
const contextPath = 'src/context/AppContext.tsx';
const persistencePath = 'src/services/qualityPersistenceService.ts';

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
    "const [sanitationLogB1,setSanitationLogB1]=useState<DailySanitationLog>({id:'',date:activeDate,day:activeDate,bakerySection:1,items:[],inspectorSignature:''}); const [foodSafetyLog,setFoodSafetyLog]=useState<DailyFoodSafetyLog>({id:'',date:activeDate,day:activeDate,bakerySection:1,checks:[],inspectorSignature:''});",
    "const [sanitationLogB1,setSanitationLogB1]=useState<DailySanitationLog>({id:'',date:activeDate,day:activeDate,bakerySection:1,items:[],inspectorSignature:''}); const [sanitationLogB2,setSanitationLogB2]=useState<DailySanitationLog>({id:'',date:activeDate,day:activeDate,bakerySection:2,items:[],inspectorSignature:''}); const [foodSafetyLog,setFoodSafetyLog]=useState<DailyFoodSafetyLog>({id:'',date:activeDate,day:activeDate,bakerySection:1,checks:[],inspectorSignature:''}); const [foodSafetyLogB2,setFoodSafetyLogB2]=useState<DailyFoodSafetyLog>({id:'',date:activeDate,day:activeDate,bakerySection:2,checks:[],inspectorSignature:''});"
  ],
  [
    "const san=(data.sanitationLogs as DailySanitationLog[]).find(x=>x.bakerySection===1); const food=(data.foodSafetyLogs as DailyFoodSafetyLog[]).find(x=>x.bakerySection===1); const releases=data.releaseForms as FinishedProductReleaseForm[]; setSanitationLogB1(san ?? {id:'',date:activeDate,day:activeDate,bakerySection:1,items:[],inspectorSignature:''}); setFoodSafetyLog(food ?? {id:'',date:activeDate,day:activeDate,bakerySection:1,checks:[],inspectorSignature:''});",
    "const sanitationRows=data.sanitationLogs as DailySanitationLog[]; const foodRows=data.foodSafetyLogs as DailyFoodSafetyLog[]; const san=sanitationRows.find(x=>x.bakerySection===1); const san2=sanitationRows.find(x=>x.bakerySection===2); const food=foodRows.find(x=>x.bakerySection===1); const food2=foodRows.find(x=>x.bakerySection===2); const releases=data.releaseForms as FinishedProductReleaseForm[]; setSanitationLogB1(san ?? {id:'',date:activeDate,day:activeDate,bakerySection:1,items:[],inspectorSignature:''}); setSanitationLogB2(san2 ?? {id:'',date:activeDate,day:activeDate,bakerySection:2,items:[],inspectorSignature:''}); setFoodSafetyLog(food ?? {id:'',date:activeDate,day:activeDate,bakerySection:1,checks:[],inspectorSignature:''}); setFoodSafetyLogB2(food2 ?? {id:'',date:activeDate,day:activeDate,bakerySection:2,checks:[],inspectorSignature:''});"
  ],
  [
    "const updateSanitationLogB1=async(log:DailySanitationLog)=>{try{const saved=log.id&&log.id.length>20?await qualityFormPersistence.updateSanitation(log):await qualityFormPersistence.saveSanitation(log);setSanitationLogB1(saved as DailySanitationLog)}catch(e){console.warn(e)}}; const updateFoodSafetyLog=async(log:DailyFoodSafetyLog)=>{try{const saved=log.id&&log.id.length>20?await qualityFormPersistence.updateFoodSafety(log):await qualityFormPersistence.saveFoodSafety(log);setFoodSafetyLog(saved as DailyFoodSafetyLog)}catch(e){console.warn(e)}};",
    "const updateSanitationLogB1=async(log:DailySanitationLog)=>{const target=log.bakerySection===2?2:activeSection; const normalized={...log,bakerySection:target,date:log.date||activeDate,day:log.day||activeDate}; if(target===1)setSanitationLogB1(normalized); else setSanitationLogB2(normalized); try{const saved=normalized.id&&normalized.id.length>20?await qualityFormPersistence.updateSanitation(normalized):await qualityFormPersistence.saveSanitation(normalized); if(target===1)setSanitationLogB1(saved as DailySanitationLog); else setSanitationLogB2(saved as DailySanitationLog); return saved as DailySanitationLog}catch(e){console.error('Sanitation persistence failed',e);throw e}}; const updateFoodSafetyLog=async(log:DailyFoodSafetyLog)=>{const target=log.bakerySection===2?2:activeSection; const normalized={...log,bakerySection:target,date:log.date||activeDate,day:log.day||activeDate}; if(target===1)setFoodSafetyLog(normalized); else setFoodSafetyLogB2(normalized); try{const saved=normalized.id&&normalized.id.length>20?await qualityFormPersistence.updateFoodSafety(normalized):await qualityFormPersistence.saveFoodSafety(normalized); if(target===1)setFoodSafetyLog(saved as DailyFoodSafetyLog); else setFoodSafetyLogB2(saved as DailyFoodSafetyLog); return saved as DailyFoodSafetyLog}catch(e){console.error('GHP persistence failed',e);throw e}};"
  ],
  [
    "const resetAllData=()=>{setOperatingParams([]);setDefectLogs([]);setCoreTemperatures([]);setMetalDetectorLogs([]);setElectricSieveLogs([]);setAdditiveWeights([]);setSensoryEvaluations([]);setNonConformanceLogs([]);setSanitationLogB1({id:'',date:activeDate,day:activeDate,bakerySection:1,items:[],inspectorSignature:''});setFoodSafetyLog({id:'',date:activeDate,day:activeDate,bakerySection:1,checks:[],inspectorSignature:''});",
    "const resetAllData=()=>{setOperatingParams([]);setDefectLogs([]);setCoreTemperatures([]);setMetalDetectorLogs([]);setElectricSieveLogs([]);setAdditiveWeights([]);setSensoryEvaluations([]);setNonConformanceLogs([]);setSanitationLogB1({id:'',date:activeDate,day:activeDate,bakerySection:1,items:[],inspectorSignature:''});setSanitationLogB2({id:'',date:activeDate,day:activeDate,bakerySection:2,items:[],inspectorSignature:''});setFoodSafetyLog({id:'',date:activeDate,day:activeDate,bakerySection:1,checks:[],inspectorSignature:''});setFoodSafetyLogB2({id:'',date:activeDate,day:activeDate,bakerySection:2,checks:[],inspectorSignature:''});"
  ],
  [
    "const triggerMockUpdate=()=>{};\n const totalSamplesInspected=",
    "const triggerMockUpdate=()=>{};\n const activeSanitationLog=activeSection===1?sanitationLogB1:sanitationLogB2; const activeFoodSafetyLog=activeSection===1?foodSafetyLog:foodSafetyLogB2;\n const totalSamplesInspected="
  ],
  [
    "sanitationLogB1,updateSanitationLogB1,foodSafetyLog,updateFoodSafetyLog,",
    "sanitationLogB1:activeSanitationLog,updateSanitationLogB1,foodSafetyLog:activeFoodSafetyLog,updateFoodSafetyLog,"
  ]
]);

patchFile(componentPath, [
  [
    "const updated = { ...sanitationLogB1 };\n    const currentVal = updated.items[index][shift][timing];\n    const nextVal: 'compliant' | 'non_compliant' | 'not_operated' = currentVal === 'compliant' ? 'non_compliant' : currentVal === 'non_compliant' ? 'not_operated' : 'compliant';\n    updated.items[index][shift][timing] = nextVal;\n    updateSanitationLogB1(updated);",
    "const updated = { ...sanitationLogB1 };\n    const currentVal = updated.items[index][shift][timing];\n    const nextVal: 'compliant' | 'non_compliant' | 'not_operated' = currentVal === 'compliant' ? 'non_compliant' : currentVal === 'non_compliant' ? 'not_operated' : 'compliant';\n    const updatedItems = updated.items.map((item, itemIndex) => itemIndex === index ? { ...item, [shift]: { ...item[shift], [timing]: nextVal } } : item);\n    void updateSanitationLogB1({ ...updated, items: updatedItems, bakerySection: activeSection });"
  ],
  [
    "const updated = { ...foodSafetyLog };\n    const currentVal = updated.checks[index][shift][timing];\n    const nextVal: 'compliant' | 'non_compliant' | 'not_operated' = currentVal === 'compliant' ? 'non_compliant' : currentVal === 'non_compliant' ? 'not_operated' : 'compliant';\n    updated.checks[index][shift][timing] = nextVal;\n    updateFoodSafetyLog(updated);",
    "const updated = { ...foodSafetyLog };\n    const currentVal = updated.checks[index][shift][timing];\n    const nextVal: 'compliant' | 'non_compliant' | 'not_operated' = currentVal === 'compliant' ? 'non_compliant' : currentVal === 'non_compliant' ? 'not_operated' : 'compliant';\n    const updatedChecks = updated.checks.map((item, itemIndex) => itemIndex === index ? { ...item, [shift]: { ...item[shift], [timing]: nextVal } } : item);\n    void updateFoodSafetyLog({ ...updated, checks: updatedChecks, bakerySection: activeSection });"
  ]
]);

let persistence = fs.readFileSync(persistencePath, 'utf8');

const replaceFunction = (source, name, replacement) => {
  const marker = `async function ${name}`;
  const start = source.indexOf(marker);
  if (start < 0) return source;
  const next = source.indexOf('\nasync function ', start + marker.length);
  const end = next >= 0 ? next : source.indexOf('\nexport async function ', start + marker.length);
  if (end < 0) return source;
  return source.slice(0, start) + replacement + source.slice(end);
};

persistence = replaceFunction(
  persistence,
  'saveSanitation(log:DailySanitationLog)',
  `async function saveSanitation(log:DailySanitationLog){
  const payload={...log,items:log.items.length?log.items:DEFAULT_SANITATION_ITEMS.map(item=>({...item,morningShift:{...item.morningShift},eveningShift:{...item.eveningShift}}))};
  const section=payload.bakerySection===2?2:1;
  let existingId=isUuid(payload.id)?payload.id:'';
  if(!existingId){
    const {data,error}=await supabase.from(QUALITY_TABLES.sanitation).select('id').eq('date',payload.date).eq('bakery_section',section).order('created_at',{ascending:false}).limit(1).maybeSingle();
    if(error)throw error;
    existingId=data?.id??'';
  }
  const normalized={...payload,bakerySection:section};
  const parent=existingId?await updateQualityRow<DailySanitationLog>('sanitation',existingId,normalized):await createQualityRow<DailySanitationLog>('sanitation',normalized);
  await replaceSanitationItems(parent.id,payload.items);
  return {...parent,items:payload.items};
}`
);

persistence = replaceFunction(
  persistence,
  'saveFoodSafety(log:DailyFoodSafetyLog)',
  `async function saveFoodSafety(log:DailyFoodSafetyLog){
  const payload={...log,checks:log.checks.length?log.checks:DEFAULT_FOOD_SAFETY_CHECKS.map(item=>({...item,morningShift:{...item.morningShift},eveningShift:{...item.eveningShift}}))};
  const section=payload.bakerySection===2?2:1;
  let existingId=isUuid(payload.id)?payload.id:'';
  if(!existingId){
    const {data,error}=await supabase.from(QUALITY_TABLES.foodSafety).select('id').eq('date',payload.date).eq('bakery_section',section).order('created_at',{ascending:false}).limit(1).maybeSingle();
    if(error)throw error;
    existingId=data?.id??'';
  }
  const normalized={...payload,bakerySection:section};
  const parent=existingId?await updateQualityRow<DailyFoodSafetyLog>('foodSafety',existingId,normalized):await createQualityRow<DailyFoodSafetyLog>('foodSafety',normalized);
  await replaceFoodSafetyItems(parent.id,payload.checks);
  return {...parent,checks:payload.checks};
}`
);

fs.writeFileSync(persistencePath, persistence, 'utf8');
console.log('Checklist persistence patch applied successfully.');
