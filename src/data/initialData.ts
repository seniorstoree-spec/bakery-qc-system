import { 
  UserProfile, 
  RawMaterialRecipe, 
  OperatingParametersLog, 
  DefectItemRow, 
  CoreTemperatureRecord, 
  MetalDetectorRecord, 
  ElectricSieveRecord, 
  AdditiveWeightRecord, 
  SensoryEvaluationRecord, 
  NonConformanceRecord, 
  DailySanitationLog, 
  DailyFoodSafetyLog, 
  FinishedProductReleaseForm,
  ProductWeightSpecRecord,
  BakerySectionDef,
  CriticalLimitsConfig
} from '../types';

export const INITIAL_SECTIONS: BakerySectionDef[] = [
  { id: 1, name: 'المعمل', subtitle: 'فحوصات وتحاليل الجودة وسلامة الغذاء', description: 'قسم المعمل' }
];

export const DEFAULT_CRITICAL_LIMITS: CriticalLimitsConfig = {
  coreTempMin: 90,
  metalDetector: {
    fe_mm: 2.5,
    nfe_mm: 3.0,
    ss_mm: 3.5
  },
  sieveMeshMicrons: 600,
  kneading: {
    minTemp: 15,
    maxTemp: 19,
    minDuration: 12,
    maxDuration: 20
  },
  baking: {
    b1_minTemp: 160,
    b1_maxTemp: 205,
    b1_minDuration: 6,
    b1_maxDuration: 40,
    b2_minTemp: 145,
    b2_maxTemp: 270,
    b2_minDuration: 5,
    b2_maxDuration: 28
  },
  sheeting: {
    b1_minThickness: 0.4,
    b1_maxThickness: 0.7,
    b2_minThickness: 0.4,
    b2_maxThickness: 1.5,
    croissantLaminationPct: 29,
    pateLaminationPct: 23
  },
  glazing: {
    honeySyrupMinPct: 73,
    honeySyrupMaxPct: 75,
    apricotJamMinPct: 60,
    apricotJamMaxPct: 65
  },
  frying: {
    tpmMaxPct: 24,
    oilAdditionMinPct: 0.5,
    oilAdditionMaxPct: 4.5
  },
  defectLimits: {
    sizeAndWeightMaxPct: 5,
    colorAndGlazeMaxPct: 5,
    textureAndFillingMaxPct: 3,
    criticalZeroDefectsAllowedPct: 0
  }
};

export const INITIAL_USERS: UserProfile[] = [
  { id: 'lab-user-engineer', name: 'مهندس المعمل', role: 'quality_engineer', department: 'المعمل', title: 'مهندس جودة المعمل', permissions: { canEnterData: true, canApproveRelease: false, canEditCriticalLimits: false, canManageUsers: false, canExportReports: true, canSignOff: true } },
  { id: 'lab-user-manager', name: 'رئيس المعمل', role: 'quality_manager', department: 'المعمل', title: 'رئيس المعمل', permissions: { canEnterData: true, canApproveRelease: true, canEditCriticalLimits: true, canManageUsers: true, canExportReports: true, canSignOff: true } },
  { id: 'lab-user-supervisor', name: 'مشرف المعمل', role: 'production_supervisor', department: 'المعمل', title: 'مشرف المعمل', permissions: { canEnterData: false, canApproveRelease: false, canEditCriticalLimits: false, canManageUsers: false, canExportReports: true, canSignOff: true } },
  { id: 'lab-user-admin', name: 'مدير النظام', role: 'developer', department: 'المعمل', title: 'مدير نظام المعمل', permissions: { canEnterData: true, canApproveRelease: true, canEditCriticalLimits: true, canManageUsers: true, canExportReports: true, canSignOff: true, isDeveloperSuperAdmin: true } }
];

export const BAKERY_1_RECIPES: RawMaterialRecipe[] = [];

export const BAKERY_2_RECIPES: RawMaterialRecipe[] = [];

export const INITIAL_OPERATING_PARAMETERS: OperatingParametersLog[] = [];

export const INITIAL_DEFECT_LOGS: DefectItemRow[] = [];

export const INITIAL_CORE_TEMPERATURES: CoreTemperatureRecord[] = [];

export const INITIAL_METAL_DETECTOR_RECORDS: MetalDetectorRecord[] = [];

export const INITIAL_ELECTRIC_SIEVE_RECORDS: ElectricSieveRecord[] = [];

export const INITIAL_ADDITIVE_RECORDS: AdditiveWeightRecord[] = [];

export const INITIAL_SENSORY_EVALUATIONS: SensoryEvaluationRecord[] = [];

export const INITIAL_NON_CONFORMANCE_RECORDS: NonConformanceRecord[] = [];

export const SANITATION_EQUIPMENT_NAMES_B1 = [
  { name: 'ميزان المعمل', code: 'LAB-01' },
  { name: 'ترمومتر المعمل', code: 'LAB-02' },
  { name: 'جهاز قياس الرطوبة', code: 'LAB-03' },
  { name: 'جهاز قياس الأس الهيدروجيني', code: 'LAB-04' },
  { name: 'أدوات أخذ العينات', code: 'LAB-05' },
  { name: 'ثلاجة حفظ العينات', code: 'LAB-06' },
  { name: 'أدوات التحليل', code: 'LAB-07' },
  { name: 'أسطح العمل', code: 'LAB-08' }
];

export const INITIAL_SANITATION_LOG_B1: DailySanitationLog = {
  id: 'lab-sanitation-template', date: '', day: '', bakerySection: 1, inspectorSignature: '',
  items: SANITATION_EQUIPMENT_NAMES_B1.map(eq => ({
    equipmentName: eq.name, equipmentCode: eq.code,
    morningShift: { startShift: 'not_operated', endShift: 'not_operated', notes: '' },
    eveningShift: { startShift: 'not_operated', endShift: 'not_operated', notes: '' }
  }))
};

export const FOOD_SAFETY_CHECK_CRITERIA = [
  { id: 'ghp-1', category: 'GHP' as const, criterion: 'نظافة الأظافر' },
  { id: 'ghp-2', category: 'GHP' as const, criterion: 'سلامة ونظافة الملابس' },
  { id: 'ghp-3', category: 'GHP' as const, criterion: 'إرتداء مهمات الوقاية (كمامات - قفازات - غطاء رأس)' },
  { id: 'ghp-4', category: 'GHP' as const, criterion: 'عدم إرتداء مخالفات (ساعات - مجوهرات - متعلقات شخصية)' },
  { id: 'ghp-5', category: 'GHP' as const, criterion: 'سلامة الأيدي وعدم وجود إصابات أو جروح' },
  { id: 'ghp-6', category: 'GHP' as const, criterion: 'التحقق من نظافة الأيدي والتطهير الدوري' },
  { id: 'pest-1', category: 'Pest_Control' as const, criterion: 'التحقق من عمل المصائد الضوئية ونظافتها' },
  { id: 'pest-2', category: 'Pest_Control' as const, criterion: 'التحقق من عمل الستائر الهوائية' },
  { id: 'pest-3', category: 'Pest_Control' as const, criterion: 'عدم وجود أي آفات أو حشرات بالصالة' },
  { id: 'env-1', category: 'Work_Environment' as const, criterion: 'التحقق من نظافة الحوائط والأرضيات' },
  { id: 'env-2', category: 'Work_Environment' as const, criterion: 'التحقق من نظافة بالوعات الصرف وأحواض الغسيل' },
  { id: 'env-3', category: 'Work_Environment' as const, criterion: 'عدم وجود مخلفات إنتاج في الممرات' },
  { id: 'env-4', category: 'Work_Environment' as const, criterion: 'التحقق من نظافة الأبواب والنوافذ والستائر' },
  { id: 'hall-1', category: 'Hall_Integrity' as const, criterion: 'سلامة الحوائط والأرضيات والأسقف وعدم وجود تكسيرات أو شروخ' },
];

export const INITIAL_FOOD_SAFETY_LOG: DailyFoodSafetyLog = {
  id: 'lab-food-safety-template', date: '', day: '', bakerySection: 1, inspectorSignature: '',
  checks: FOOD_SAFETY_CHECK_CRITERIA.map(crit => ({
    id: crit.id, category: crit.category, criterion: crit.criterion,
    morningShift: { startShift: 'not_operated', midShift: 'not_operated', notes: '' },
    eveningShift: { startShift: 'not_operated', midShift: 'not_operated', notes: '' }
  }))
};

export const INITIAL_RELEASE_FORM_B1: FinishedProductReleaseForm = {
  id: 'lab-release-1', date: '', day: '', bakerySection: 1, products: [],
  mandatoryConditions: { rawMaterialsCompliant: false, ccpOprpReportsCompliant: false, labAnalysisCompliant: false, labelAndPackagingCompliant: false, customerRequirementsCompliant: false },
  decision: 'pending', notes: '', qaReleaseOfficerName: '', qaReleaseOfficerSignature: '', qaReleaseOfficerTimestamp: '',
  storekeeperName: '', storekeeperSignature: '', storekeeperTimestamp: ''
};

export const INITIAL_RELEASE_FORM_B2: FinishedProductReleaseForm = {
  id: 'lab-release-2', date: '', day: '', bakerySection: 1, products: [],
  mandatoryConditions: { rawMaterialsCompliant: false, ccpOprpReportsCompliant: false, labAnalysisCompliant: false, labelAndPackagingCompliant: false, customerRequirementsCompliant: false },
  decision: 'pending', notes: '', qaReleaseOfficerName: '', qaReleaseOfficerSignature: '', qaReleaseOfficerTimestamp: '',
  storekeeperName: '', storekeeperSignature: '', storekeeperTimestamp: ''
};

export const INITIAL_PRODUCT_WEIGHT_SPECS: ProductWeightSpecRecord[] = [];
