// Role-Based Access Control (RBAC) Types
export type UserRole = 'quality_engineer' | 'quality_manager' | 'production_supervisor' | 'system_admin' | 'developer';

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
    isDeveloperSuperAdmin?: boolean;
  };
}

// Section Definition for Dynamic Section Management
export interface BakerySectionDef {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  iconName?: string;
}

// Global Configurable Critical Limits & Standard Parameters
export interface CriticalLimitsConfig {
  coreTempMin: number; // default 90 °C
  metalDetector: {
    fe_mm: number; // default 2.5
    nfe_mm: number; // default 3.0
    ss_mm: number; // default 3.5
  };
  sieveMeshMicrons: number; // default 600
  kneading: {
    minTemp: number; // 15
    maxTemp: number; // 19
    minDuration: number; // 12
    maxDuration: number; // 20
  };
  baking: {
    b1_minTemp: number; // 160
    b1_maxTemp: number; // 205
    b1_minDuration: number; // 6
    b1_maxDuration: number; // 40
    b2_minTemp: number; // 145
    b2_maxTemp: number; // 270
    b2_minDuration: number; // 5
    b2_maxDuration: number; // 28
  };
  sheeting: {
    b1_minThickness: number; // 0.4
    b1_maxThickness: number; // 0.7
    b2_minThickness: number; // 0.4
    b2_maxThickness: number; // 1.5
    croissantLaminationPct: number; // 29%
    pateLaminationPct: number; // 23%
  };
  glazing: {
    honeySyrupMinPct: number; // 73%
    honeySyrupMaxPct: number; // 75%
    apricotJamMinPct: number; // 60%
    apricotJamMaxPct: number; // 65%
  };
  frying: {
    tpmMaxPct: number; // 24%
    oilAdditionMinPct: number; // 0.5%
    oilAdditionMaxPct: number; // 4.5%
  };
  defectLimits: {
    sizeAndWeightMaxPct: number; // 5%
    colorAndGlazeMaxPct: number; // 5%
    textureAndFillingMaxPct: number; // 3%
    criticalZeroDefectsAllowedPct: number; // 0%
  };
}

// In-Process Control (IPC) Types
export interface RawMaterialRecipe {
  id?: string;
  sectionId: number; // 1, 2, or custom section id
  productName: string;
  flour_kg?: number;
  butter_kg?: number;
  pasteurized_eggs_kg?: number;
  powdered_milk_kg?: number;
  sugar_kg?: number;
  salt_gm?: number;
  yeast_gm?: number;
  improver_gm?: number;
  softener_gm?: number;
  gluten_kg?: number;
  oil_L?: number;
  water_ice_L?: number;
  debris_kg?: number;
  polish_kg?: number;
  broken_ghorayeba_kg?: number;
  notes?: string;
  customFields?: { [key: string]: string | number };
}

export interface OperatingParametersLog {
  id: string;
  time: string;
  stage: 'kneading' | 'sheeting' | 'flattening' | 'baking' | 'glazing' | 'packaging' | 'quick_freezing' | 'frying';
  bakerySection: number;
  productName: string;
  temperature?: number;
  duration_min?: number;
  doughProductionDate?: string;
  debrisProductionDate?: string;
  sheetingThickness_cm?: number;
  glazingConcentration_pct?: number;
  packagingQuality?: 'مطابق' | 'غير مطابق';
  packagingExpiryDate?: string;
  packagingProductionDate?: string;
  packagingValidity?: string;
  oilAddedPct?: number;
  tpmPct?: number;
  fryerCode?: string;
  isCompliant: boolean;
  notes?: string;
}

// Defect Logging Types
export type ProductionStage = 'start' | 'mid' | 'end' | 'unplanned';

export interface DefectItemRow {
  id: string;
  productName: string;
  bakerySection: number;
  stage: ProductionStage;
  time: string;
  requiredProductionQty: number;
  sampleSize: number;
  
  // حجم القطع (Limit: 5%)
  oversize: number;
  undersize: number;
  
  // الأوزان (Limit: 5%)
  overweight: number;
  underweight: number;
  
  // التسوية (Limit: 5% for color, 0% for burnt)
  darkColor: number;
  lightColor: number;
  burntParts: number; // 0%
  
  // النسيج الداخلي (Limit: 3%, 0% for non-laminated)
  deflatedProduct: number;
  gapsInPieces: number;
  dryProduct: number;
  doughyProduct: number;
  nonLaminated: number; // 0%
  
  // الحشو (Limit: 3% for qty, 0% for taste/empty)
  bitterTaste: number; // 0%
  rancidTaste: number; // 0%
  fillingLeakage: number;
  excessFilling: number;
  insufficientFilling: number;
  noFilling: number; // 0%
  
  // التلميع (Limit: 3% for texture, 5% for glaze)
  heavyTexture: number;
  lightTexture: number;
  excessGlaze: number;
  insufficientGlaze: number;
  
  // المظهر الخارجي (Limit: 3%, 0% for foreign matters)
  surfaceSpots: number;
  surfacePeeling: number;
  surfaceCracks: number;
  foreignMatters: number; // 0%
  
  // التغليف (Limit: 0% expiry, 3% seal/print)
  expiryDateDefect: number; // 0%
  sealingDefect: number;
  printingDefect: number;
  
  // الرائحة (Limit: 0%)
  undesiredSmell: number; // 0%
  
  status: 'compliant' | 'warning' | 'non_compliant';
  criticalDeviation: boolean;
  notes?: string;
}

// Core Product Temperature Monitoring
export interface CoreTemperatureRecord {
  id: string;
  sn: number;
  productName: string;
  time: string;
  machineCode: string;
  coreTemperature: number;
  isCompliant: boolean;
  responsiblePerson: string;
  correctiveAction?: string;
  verifiedBy?: string;
  date: string;
  bakerySection: number;
}

// Metal Detector CCP Monitoring
export interface MetalDetectorRecord {
  id: string;
  sn: number;
  time: string;
  machineCode: string;
  feStatus: 'pass' | 'fail';
  nfeStatus: 'pass' | 'fail';
  ssStatus: 'pass' | 'fail';
  isCompliant: boolean;
  responsiblePerson: string;
  correctiveAction?: string;
  verifiedBy?: string;
  date: string;
}

// Electric Sieve OPRP Monitoring
export interface ElectricSieveRecord {
  id: string;
  sn: number;
  productName: string;
  time: string;
  isCompliant: boolean;
  responsiblePerson: string;
  correctiveAction?: string;
  sieveIntegrityCheck: 'سليم وكفء' | 'غير مطابق';
  notes?: string;
  date: string;
}

// Food Additives Weights Monitoring
export interface AdditiveWeightRecord {
  id: string;
  sn: number;
  productName: string;
  additiveName: string;
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

// Sensory Evaluation
export interface SensoryEvaluationRecord {
  id: string;
  sn: number;
  productName: string;
  sampleType: 'daily_product' | 'new_sample';
  isVegan: boolean;
  time: string;
  sampleNumber: string;
  colorScore: number;
  tasteScore: number;
  aromaScore: number;
  textureScore: number;
  overallImpressionScore: number;
  overallRating: 'مرفوض' | 'مقبول' | 'جيد' | 'جيد جداً' | 'ممتاز';
  inspectorName: string;
  headOfSensoryName: string;
  notes?: string;
  date: string;
}

// Non-Conformance Report (NCR)
export interface NonConformanceRecord {
  id: string;
  sn: number;
  productName: string;
  productionQty: number;
  detectedDefects: string;
  defectiveQty: number;
  defectPercentage: number;
  rootCause: string;
  correctiveAction: string;
  signee: string;
  date: string;
  status: 'open' | 'resolved' | 'under_review';
}

// Sanitation & Hygiene Checklist
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
  bakerySection: number;
  items: SanitationEquipmentCheck[];
  inspectorSignature: string;
}

// Food Safety & GHP Checklist
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
  bakerySection: number;
  checks: FoodSafetyItemCheck[];
  inspectorSignature: string;
}

// Finished Product Release Approval
export interface ReleaseProductItem {
  id: string;
  productName: string;
  unit: string;
  quantity: number;
}

export interface FinishedProductReleaseForm {
  id: string;
  date: string;
  day: string;
  bakerySection: number;
  products: ReleaseProductItem[];
  mandatoryConditions: {
    rawMaterialsCompliant: boolean;
    ccpOprpReportsCompliant: boolean;
    labAnalysisCompliant: boolean;
    labelAndPackagingCompliant: boolean;
    customerRequirementsCompliant: boolean;
  };
  decision: 'approved' | 'pending' | 'rejected';
  notes?: string;
  qaReleaseOfficerName: string;
  qaReleaseOfficerSignature?: string;
  qaReleaseOfficerTimestamp?: string;
  storekeeperName: string;
  storekeeperSignature?: string;
  storekeeperTimestamp?: string;
}

// Product Weights Specification Record
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
