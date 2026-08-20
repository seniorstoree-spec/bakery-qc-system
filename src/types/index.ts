// Role-Based Access Control (RBAC) Types
export type UserRole = 'quality_engineer' | 'quality_manager' | 'production_supervisor' | 'system_admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  title: string;
  avatar?: string;
  permissions: {
    canEnterData: boolean;
    canApproveRelease: boolean;
    canEditCriticalLimits: boolean;
    canManageUsers: boolean;
    canExportReports: boolean;
    canSignOff: boolean;
  };
}

// In-Process Control (IPC) Types
export interface RawMaterialRecipe {
  productName: string;
  flour_kg?: number; // دقيق (كجم)
  butter_kg?: number; // زبدة (كجم)
  pasteurized_eggs_kg?: number; // بيض مبستر (كجم)
  powdered_milk_kg?: number; // لبن بودرة (كجم)
  sugar_kg?: number; // سكر (كجم)
  salt_gm?: number; // ملح (جم)
  yeast_gm?: number; // خميرة (جم)
  improver_gm?: number; // محسن (جم)
  softener_gm?: number; // مطري (جم)
  gluten_kg?: number; // جلوتين (كجم)
  oil_L?: number; // زيت (لتر)
  water_ice_L?: number; // ماء + ثلج (لتر)
  debris_kg?: number; // دبري (كجم)
  polish_kg?: number; // بوليش (كجم)
  broken_ghorayeba_kg?: number; // كسر غريبة (كجم)
  notes?: string;
  // Specific recipe additions
  customFields?: { [key: string]: string | number };
}

export interface OperatingParametersLog {
  id: string;
  time: string; // 06:00 AM, 07:00 AM, ...
  stage: 'kneading' | 'sheeting' | 'flattening' | 'baking' | 'glazing' | 'packaging' | 'quick_freezing' | 'frying';
  bakerySection: 1 | 2;
  productName: string;
  temperature?: number;
  duration_min?: number;
  doughProductionDate?: string;
  debrisProductionDate?: string;
  sheetingThickness_cm?: number; // e.g. 0.4:0.7 cm or 0.4:1.5 cm
  glazingConcentration_pct?: number; // e.g. 73-75% for honey syrup, 60-65% for apricot jam
  packagingQuality?: 'مطابق' | 'غير مطابق';
  packagingExpiryDate?: string;
  packagingProductionDate?: string;
  packagingValidity?: string;
  oilAddedPct?: number; // 0.5 - 4.5%
  tpmPct?: number; // < 24
  fryerCode?: string;
  isCompliant: boolean;
  notes?: string;
}

// Defect Logging Types (Daily Quality Defect Log - Pages 2-5, 20-22)
export type ProductionStage = 'start' | 'mid' | 'end' | 'unplanned';

export interface DefectItemRow {
  id: string;
  productName: string;
  bakerySection: 1 | 2;
  stage: ProductionStage;
  time: string;
  requiredProductionQty: number; // كمية الإنتاج المطلوبة
  sampleSize: number; // كمية العينة
  
  // Defect metrics (Count of defective pieces or % calculated)
  // حجم القطع (Limit: 5%)
  oversize: number; // حجم زائد
  undersize: number; // حجم أقل
  
  // الأوزان (Limit: 5%)
  overweight: number; // وزن زيادة
  underweight: number; // وزن أقل
  
  // التسوية (Limit: 5% for color, 0% for burnt)
  darkColor: number; // لون داكن (<=5%)
  lightColor: number; // لون فاتح (<=5%)
  burntParts: number; // أجزاء محروقة (0%)
  
  // النسيج الداخلي (Limit: 3%, 0% for non-laminated)
  deflatedProduct: number; // منتج هابط (<=3%)
  gapsInPieces: number; // فراغات بالقطع (<=3%)
  dryProduct: number; // منتج ناشف (<=3%)
  doughyProduct: number; // منتج معجن (<=3%)
  nonLaminated: number; // منتج غير مورق (0%)
  
  // الحشو (Limit: 3% for qty, 0% for taste/empty)
  bitterTaste: number; // طعم مر (0%)
  rancidTaste: number; // طعم متزنخ (0%)
  fillingLeakage: number; // خروج حشو (<=3%)
  excessFilling: number; // حشو زائد (<=3%)
  insufficientFilling: number; // حشو أقل (<=3%)
  noFilling: number; // بدون حشو (0%)
  
  // التلميع (Limit: 3% for texture, 5% for glaze)
  heavyTexture: number; // قوام ثقيل (<=3%)
  lightTexture: number; // قوام خفيف (<=3%)
  excessGlaze: number; // تلميع زائد (<=5%)
  insufficientGlaze: number; // تلميع أقل (<=5%)
  
  // المظهر الخارجي (Limit: 3%, 0% for foreign matters)
  surfaceSpots: number; // بقع على السطح (<=3%)
  surfacePeeling: number; // تقشير بالسطح (<=3%)
  surfaceCracks: number; // تشقق السطح (<=3%)
  foreignMatters: number; // الشوائب والمواد الغريبة أو الضارة (0%)
  
  // التغليف (Limit: 0% expiry, 3% seal/print)
  expiryDateDefect: number; // تاريخ الصلاحية (0%)
  sealingDefect: number; // اللحام (<=3%)
  printingDefect: number; // الطباعة (<=3%)
  
  // الرائحة (Limit: 0%)
  undesiredSmell: number; // رائحة غير مرغوبة (0%)
  
  // Overall status
  status: 'compliant' | 'warning' | 'non_compliant';
  criticalDeviation: boolean;
  notes?: string;
}

// Core Product Temperature Monitoring (Pages 10 & 27)
export interface CoreTemperatureRecord {
  id: string;
  sn: number;
  productName: string;
  time: string;
  machineCode: string;
  coreTemperature: number; // Critical limit >= 90°C
  isCompliant: boolean;
  responsiblePerson: string;
  correctiveAction?: string;
  verifiedBy?: string;
  date: string;
  bakerySection: 1 | 2;
}

// Metal Detector CCP Monitoring (Page 11)
export interface MetalDetectorRecord {
  id: string;
  sn: number;
  time: string; // 08:00 AM, 09:00 AM ... 24h
  machineCode: string;
  feStatus: 'pass' | 'fail'; // Fe: 2.5 mm
  nfeStatus: 'pass' | 'fail'; // NFe: 3.0 mm
  ssStatus: 'pass' | 'fail'; // S.S: 3.5 mm
  isCompliant: boolean;
  responsiblePerson: string;
  correctiveAction?: string;
  verifiedBy?: string;
  date: string;
}

// Electric Sieve OPRP Monitoring (Pages 12 & 28)
export interface ElectricSieveRecord {
  id: string;
  sn: number;
  productName: string;
  time: string;
  isCompliant: boolean; // Criteria: free from any foreign bodies/impurities
  responsiblePerson: string;
  correctiveAction?: string;
  sieveIntegrityCheck: 'سليم وكفء' | 'غير مطابق';
  notes?: string;
  date: string;
}

// Food Additives Weights Monitoring (Page 26)
export interface AdditiveWeightRecord {
  id: string;
  sn: number;
  productName: string;
  additiveName: string; // e.g. E330 ملح ليمون (0.67 جم/كجم), Cotton Candy 120 (2 جم/كجم), E133 (3.3 جم/كجم), E122 (1.5 جم/كجم)
  batchNumber: string;
  time: string;
  actualWeight_gm: number;
  standardLimit_gm: number;
  isCompliant: boolean;
  responsiblePerson: string;
  correctiveAction?: string;
  verifiedBy?: string;
  date: string;
}

// Sensory Evaluation (Pages 13, 14, 29)
export interface SensoryEvaluationRecord {
  id: string;
  sn: number;
  productName: string;
  sampleType: 'daily_product' | 'new_sample'; // منتج يومي / عينة جديدة
  isVegan: boolean; // صيامي (Page 14)
  time: string;
  sampleNumber: string;
  colorScore: number; // 0-10
  tasteScore: number; // 0-10
  aromaScore: number; // 0-10
  textureScore: number; // 0-10
  overallImpressionScore: number; // 0-10
  overallRating: 'مرفوض' | 'مقبول' | 'جيد' | 'جيد جداً' | 'ممتاز'; // Matrix 0-4, 5-6, 7-8, 9, 10
  inspectorName: string;
  headOfSensoryName: string;
  notes?: string;
  date: string;
}

// Non-Conformance Report (NCR) (Page 15)
export interface NonConformanceRecord {
  id: string;
  sn: number;
  productName: string;
  productionQty: number;
  detectedDefects: string;
  defectiveQty: number;
  defectPercentage: number;
  rootCause: string; // السبب الجذري
  correctiveAction: string; // التصحيح
  signee: string;
  date: string;
  status: 'open' | 'resolved' | 'under_review';
}

// Sanitation & Hygiene Checklist (Pages 16 & 30)
export interface SanitationEquipmentCheck {
  equipmentName: string;
  equipmentCode: string;
  morningShift: {
    startShift: 'compliant' | 'non_compliant' | 'not_operated';
    endShift: 'compliant' | 'non_compliant' | 'not_operated';
    notes?: string;
  };
  eveningShift: {
    startShift: 'compliant' | 'non_compliant' | 'not_operated';
    endShift: 'compliant' | 'non_compliant' | 'not_operated';
    notes?: string;
  };
}

export interface DailySanitationLog {
  id: string;
  date: string;
  day: string;
  bakerySection: 1 | 2;
  items: SanitationEquipmentCheck[];
  inspectorSignature: string;
}

// Food Safety & GHP & Pest Control Checklist (Pages 17 & 31)
export interface FoodSafetyItemCheck {
  id: string;
  category: 'GHP' | 'Pest_Control' | 'Work_Environment' | 'Hall_Integrity';
  criterion: string;
  morningShift: {
    startShift: 'compliant' | 'non_compliant' | 'not_operated';
    midShift: 'compliant' | 'non_compliant' | 'not_operated';
    notes?: string;
  };
  eveningShift: {
    startShift: 'compliant' | 'non_compliant' | 'not_operated';
    midShift: 'compliant' | 'non_compliant' | 'not_operated';
    notes?: string;
  };
}

export interface DailyFoodSafetyLog {
  id: string;
  date: string;
  day: string;
  bakerySection: 1 | 2;
  checks: FoodSafetyItemCheck[];
  inspectorSignature: string;
}

// Finished Product Release Approval (Pages 18 & 32)
export interface ReleaseProductItem {
  id: string;
  productName: string;
  unit: string; // قطعة
  quantity: number;
}

export interface FinishedProductReleaseForm {
  id: string;
  date: string;
  day: string;
  bakerySection: 1 | 2;
  products: ReleaseProductItem[];
  mandatoryConditions: {
    rawMaterialsCompliant: boolean; // جميع الخامات المستخدمة مطابقة
    ccpOprpReportsCompliant: boolean; // جميع تقارير و نتائج متابعة CCP و OPRP مطابقة
    labAnalysisCompliant: boolean; // نتائج تحاليل المعمل
    labelAndPackagingCompliant: boolean; // مراجعة محتويات بطاقة البيانات و الصلاحية و حالة العبوة الظاهرية
    customerRequirementsCompliant: boolean; // المنتج مطابق لشروط العميل
  };
  decision: 'approved' | 'pending' | 'rejected'; // يتم الإفراج عن المنتج ويسمح له بالخروج للعميل أو التداول أو التخزين
  notes?: string;
  qaReleaseOfficerName: string;
  qaReleaseOfficerSignature?: string;
  qaReleaseOfficerTimestamp?: string;
  storekeeperName: string;
  storekeeperSignature?: string;
  storekeeperTimestamp?: string;
}

// Bakery 2 Finished Product Weights (Pages 23-25)
export interface ProductWeightSpecRecord {
  id: string;
  productName: string;
  time: string;
  doughWeight: number;
  doughWeightMin: number;
  doughWeightMax: number;
  bakedWeight: number;
  bakedWeightMin: number;
  bakedWeightMax: number;
  finishedWeight: number;
  finishedWeightMin: number;
  finishedWeightMax: number;
  isCompliant: boolean;
  date: string;
}
