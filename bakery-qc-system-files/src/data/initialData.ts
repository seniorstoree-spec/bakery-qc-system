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
  ProductWeightSpecRecord
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  { id: 'lab-user-engineer', name: 'مهندس المعمل', role: 'quality_engineer', department: 'المعمل', title: 'مهندس جودة المعمل', permissions: { canEnterData: true, canApproveRelease: false, canEditCriticalLimits: false, canManageUsers: false, canExportReports: true, canSignOff: true } },
  { id: 'lab-user-manager', name: 'رئيس المعمل', role: 'quality_manager', department: 'المعمل', title: 'رئيس المعمل', permissions: { canEnterData: true, canApproveRelease: true, canEditCriticalLimits: true, canManageUsers: true, canExportReports: true, canSignOff: true } },
  { id: 'lab-user-supervisor', name: 'مشرف المعمل', role: 'production_supervisor', department: 'المعمل', title: 'مشرف المعمل', permissions: { canEnterData: false, canApproveRelease: false, canEditCriticalLimits: false, canManageUsers: false, canExportReports: true, canSignOff: true } },
  { id: 'lab-user-admin', name: 'مدير النظام', role: 'system_admin', department: 'المعمل', title: 'مدير نظام المعمل', permissions: { canEnterData: true, canApproveRelease: true, canEditCriticalLimits: true, canManageUsers: true, canExportReports: true, canSignOff: true, isDeveloperSuperAdmin: true } }
]

export const BAKERY_1_RECIPES: RawMaterialRecipe[] = []

export const BAKERY_2_RECIPES: RawMaterialRecipe[] = []

export const INITIAL_OPERATING_PARAMETERS: OperatingParametersLog[] = []

export const INITIAL_DEFECT_LOGS: DefectItemRow[] = []

export const INITIAL_CORE_TEMPERATURES: CoreTemperatureRecord[] = []

export const INITIAL_METAL_DETECTOR_RECORDS: MetalDetectorRecord[] = []

export const INITIAL_ELECTRIC_SIEVE_RECORDS: ElectricSieveRecord[] = []

export const INITIAL_ADDITIVE_RECORDS: AdditiveWeightRecord[] = []

export const INITIAL_SENSORY_EVALUATIONS: SensoryEvaluationRecord[] = []

export const INITIAL_NON_CONFORMANCE_RECORDS: NonConformanceRecord[] = []

export const SANITATION_EQUIPMENT_NAMES_B1 = [
  { name: 'ميزان المعمل', code: 'LAB-01' },
  { name: 'ترمومتر المعمل', code: 'LAB-02' },
  { name: 'جهاز قياس الرطوبة', code: 'LAB-03' },
  { name: 'جهاز قياس الأس الهيدروجيني', code: 'LAB-04' },
  { name: 'أدوات أخذ العينات', code: 'LAB-05' },
  { name: 'ثلاجة حفظ العينات', code: 'LAB-06' },
  { name: 'أدوات التحليل', code: 'LAB-07' },
  { name: 'أسطح العمل', code: 'LAB-08' }
]

export const SANITATION_EQUIPMENT_NAMES_B2 = [
  { name: 'العجانات', code: 'EQ2-01' },
  { name: 'الفرادات', code: 'EQ2-02' },
  { name: 'ماكينات التكوير', code: 'EQ2-03' },
  { name: 'ماكينات التقطيع', code: 'EQ2-04' },
  { name: 'ماكينات الحقن', code: 'EQ2-05' },
  { name: 'المضارب', code: 'EQ2-06' },
  { name: 'القلايات', code: 'EQ2-07' },
  { name: 'السخانات', code: 'EQ2-08' },
  { name: 'الإستاندات', code: 'EQ2-09' },
  { name: 'أدوات المناولة', code: 'EQ2-10' },
  { name: 'الترابيزات', code: 'EQ2-11' },
  { name: 'المخمرات', code: 'EQ2-12' },
  { name: 'الأفران', code: 'EQ2-13' },
  { name: 'الآيس ميكر', code: 'EQ2-14' },
];

export const INITIAL_SANITATION_LOG_B1: DailySanitationLog = {
  id: 'lab-sanitation-template',
  date: '',
  day: 'الخميس',
  bakerySection: 1,
  inspectorSignature: 'م. أحمد الشناوي',
  items: SANITATION_EQUIPMENT_NAMES_B1.map(eq => ({
    equipmentName: eq.name,
    equipmentCode: eq.code,
    morningShift: {
      startShift: 'compliant',
      endShift: 'compliant',
      notes: 'تم التحقق والتطهير بمحلول معتمد'
    },
    eveningShift: {
      startShift: 'compliant',
      endShift: 'compliant',
      notes: 'نظافة تامة'
    }
  }))
};

export const FOOD_SAFETY_CHECK_CRITERIA = [
  // GHP
  { id: 'ghp-1', category: 'GHP' as const, criterion: 'نظافة الأظافر' },
  { id: 'ghp-2', category: 'GHP' as const, criterion: 'سلامة ونظافة الملابس' },
  { id: 'ghp-3', category: 'GHP' as const, criterion: 'إرتداء مهمات الوقاية (كمامات - قفازات - غطاء رأس)' },
  { id: 'ghp-4', category: 'GHP' as const, criterion: 'عدم إرتداء مخالفات (ساعات - مجوهرات - متعلقات شخصية)' },
  { id: 'ghp-5', category: 'GHP' as const, criterion: 'سلامة الأيدي وعدم وجود إصابات أو جروح' },
  { id: 'ghp-6', category: 'GHP' as const, criterion: 'التحقق من نظافة الأيدي والتطهير الدوري' },
  
  // Pest Control
  { id: 'pest-1', category: 'Pest_Control' as const, criterion: 'التحقق من عمل المصائد الضوئية ونظافتها' },
  { id: 'pest-2', category: 'Pest_Control' as const, criterion: 'التحقق من عمل الستائر الهوائية' },
  { id: 'pest-3', category: 'Pest_Control' as const, criterion: 'عدم وجود أي آفات أو حشرات بالصالة' },
  
  // Work Environment
  { id: 'env-1', category: 'Work_Environment' as const, criterion: 'التحقق من نظافة الحوائط والأرضيات' },
  { id: 'env-2', category: 'Work_Environment' as const, criterion: 'التحقق من نظافة بالوعات الصرف وأحواض الغسيل' },
  { id: 'env-3', category: 'Work_Environment' as const, criterion: 'عدم وجود مخلفات إنتاج في الممرات' },
  { id: 'env-4', category: 'Work_Environment' as const, criterion: 'التحقق من نظافة الأبواب والنوافذ والستائر' },
  
  // Hall Integrity
  { id: 'hall-1', category: 'Hall_Integrity' as const, criterion: 'سلامة الحوائط والأرضيات والأسقف وعدم وجود تكسيرات أو شروخ' },
];

export const INITIAL_FOOD_SAFETY_LOG: DailyFoodSafetyLog = {
  id: 'fs-1',
  date: '',
  day: 'الخميس',
  bakerySection: 1,
  inspectorSignature: 'م. أحمد الشناوي',
  checks: FOOD_SAFETY_CHECK_CRITERIA.map(crit => ({
    id: crit.id,
    category: crit.category,
    criterion: crit.criterion,
    morningShift: {
      startShift: 'compliant',
      midShift: 'compliant',
      notes: 'مطابق للشروط والمعايير'
    },
    eveningShift: {
      startShift: 'compliant',
      midShift: 'compliant',
      notes: 'مطابق'
    }
  }))
};

export const INITIAL_RELEASE_FORM_B1: FinishedProductReleaseForm = {
  id: 'rel-b1-20260820',
  date: '',
  day: 'الخميس',
  bakerySection: 1,
  products: [
    { id: 'rp-1', productName: 'كرواسون سادة ميجا', unit: 'قطعة', quantity: 4950 },
    { id: 'rp-2', productName: 'كرواسون جبنة بيضة ميجا', unit: 'قطعة', quantity: 3800 },
    { id: 'rp-3', productName: 'كرواسون شوكولاته ميجا', unit: 'قطعة', quantity: 4150 },
    { id: 'rp-4', productName: 'باتيه هالوبينو', unit: 'قطعة', quantity: 2200 },
    { id: 'rp-5', productName: 'باتيه جبنة بيضة ميجا', unit: 'قطعة', quantity: 3500 },
    { id: 'rp-6', productName: 'باتيه جبنة رومي ميجا', unit: 'قطعة', quantity: 3100 },
    { id: 'rp-7', productName: 'بيتزا ايطالى ميجا', unit: 'قطعة', quantity: 2800 },
    { id: 'rp-8', productName: 'دانيش فواكه ميجا', unit: 'قطعة', quantity: 2400 },
    { id: 'rp-9', productName: 'دانيش كريمة ميجا', unit: 'قطعة', quantity: 2600 },
    { id: 'rp-10', productName: 'دانش سكر ميجا', unit: 'قطعة', quantity: 1900 },
    { id: 'rp-11', productName: 'بغاشة ميجا', unit: 'قطعة', quantity: 1800 },
  ],
  mandatoryConditions: {
    rawMaterialsCompliant: true,
    ccpOprpReportsCompliant: true,
    labAnalysisCompliant: true,
    labelAndPackagingCompliant: true,
    customerRequirementsCompliant: true,
  },
  decision: 'approved',
  notes: 'تم استيفاء كافة اشتراطات الجودة وسلامة الغذاء والإفراج عن كامل الكميات للتخزين والتوزيع',
  qaReleaseOfficerName: 'م. محمد سيف الإسلام',
  qaReleaseOfficerSignature: 'م. محمد سيف الإسلام',
  qaReleaseOfficerTimestamp: '2026-08-20 14:30',
  storekeeperName: 'أ. محمود عبد الرحمن',
  storekeeperSignature: 'أ. محمود عبد الرحمن',
  storekeeperTimestamp: '2026-08-20 14:45'
};

export const INITIAL_RELEASE_FORM_B2: FinishedProductReleaseForm = {
  id: 'rel-b2-20260820',
  date: '',
  day: 'الخميس',
  bakerySection: 2,
  products: [
    { id: 'rp2-1', productName: 'سندوتش فاهيتا فراخ ميجا', unit: 'قطعة', quantity: 2100 },
    { id: 'rp2-2', productName: 'ساندوتش فاهيتا لحمة ميجا', unit: 'قطعة', quantity: 1850 },
    { id: 'rp2-3', productName: 'سندوتش تونة ميجا', unit: 'قطعة', quantity: 1900 },
    { id: 'rp2-4', productName: 'ساندوتش سوسيس ميجا', unit: 'قطعة', quantity: 2000 },
    { id: 'rp2-5', productName: 'سينامون رول ساده', unit: 'قطعة', quantity: 1500 },
    { id: 'rp2-6', productName: 'سينامون رول شوكولاته', unit: 'قطعة', quantity: 1600 },
    { id: 'rp2-7', productName: 'دونتس شوكولاته ميجا', unit: 'قطعة', quantity: 2800 },
    { id: 'rp2-8', productName: 'دونتس أبيض بالسبرينكلز ميجا', unit: 'قطعة', quantity: 2500 },
    { id: 'rp2-9', productName: 'دونتس فيلد شوكولاته ميجا', unit: 'قطعة', quantity: 2900 },
  ],
  mandatoryConditions: {
    rawMaterialsCompliant: true,
    ccpOprpReportsCompliant: true,
    labAnalysisCompliant: true,
    labelAndPackagingCompliant: true,
    customerRequirementsCompliant: true,
  },
  decision: 'approved',
  notes: 'تمت الموافقة والإفراج',
  qaReleaseOfficerName: 'م. محمد سيف الإسلام',
  qaReleaseOfficerSignature: 'م. محمد سيف الإسلام',
  qaReleaseOfficerTimestamp: '2026-08-20 15:00',
  storekeeperName: 'أ. محمود عبد الرحمن',
  storekeeperSignature: 'أ. محمود عبد الرحمن',
  storekeeperTimestamp: '2026-08-20 15:15'
};

export const INITIAL_PRODUCT_WEIGHT_SPECS: ProductWeightSpecRecord[] = []
