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

export interface OperatingParametersLog { id: string; time: string; stage: 'kneading'|'sheeting'|'flattening'|'baking'|'glazing'|'packaging'|'quick_freezing'|'frying'; bakerySection: 1|2; productName: string; temperature?: number; duration_min?: number; doughProductionDate?: string; debrisProductionDate?: string; sheetingThickness_cm?: number; glazingConcentration_pct?: number; packagingQuality?: 'مطابق'|'غير مطابق'; packagingExpiryDate?: string; packagingProductionDate?: string; packagingValidity?: string; oilAddedPct?: number; tpmPct?: number; fryerCode?: string; isCompliant: boolean; notes?: string; }
export type ProductionStage = 'start'|'mid'|'end'|'unplanned';
export interface DefectItemRow { id:string; date?:string; productName:string; bakerySection:1|2; stage:ProductionStage; time:string; requiredProductionQty:number; sampleSize:number; oversize:number; undersize:number; overweight:number; underweight:number; darkColor:number; lightColor:number; burntParts:number; deflatedProduct:number; gapsInPieces:number; dryProduct:number; doughyProduct:number; nonLaminated:number; bitterTaste:number; rancidTaste:number; fillingLeakage:number; excessFilling:number; insufficientFilling:number; noFilling:number; heavyTexture:number; lightTexture:number; excessGlaze:number; insufficientGlaze:number; surfaceSpots:number; surfacePeeling:number; surfaceCracks:number; foreignMatters:number; expiryDateDefect:number; sealingDefect:number; printingDefect:number; undesiredSmell:number; status:'compliant'|'warning'|'non_compliant'; criticalDeviation:boolean; notes?:string; }
export interface CoreTemperatureRecord { id:string; sn:number; productName:string; time:string; machineCode:string; coreTemperature:number; isCompliant:boolean; responsiblePerson:string; correctiveAction?:string; verifiedBy?:string; date:string; bakerySection:1|2; }
export interface MetalDetectorRecord { id:string; sn:number; time:string; machineCode:string; feStatus:'pass'|'fail'; nfeStatus:'pass'|'fail'; ssStatus:'pass'|'fail'; isCompliant:boolean; responsiblePerson:string; correctiveAction?:string; verifiedBy?:string; date:string; }
export interface ElectricSieveRecord { id:string; sn:number; productName:string; time:string; isCompliant:boolean; responsiblePerson:string; correctiveAction?:string; sieveIntegrityCheck:'سليم وكفء'|'غير مطابق'; notes?:string; date:string; }
export interface AdditiveWeightRecord { id:string; sn:number; productName:string; additiveName:string; batchNumber:string; time:string; actualWeight_gm:number; standardLimit_gm:number; isCompliant:boolean; responsiblePerson:string; correctiveAction?:string; verifiedBy?:string; date:string; }
export interface SensoryEvaluationRecord { id:string; sn:number; productName:string; sampleType:'daily_product'|'new_sample'; isVegan:boolean; time:string; sampleNumber:string; colorScore:number; tasteScore:number; aromaScore:number; textureScore:number; overallImpressionScore:number; overallRating:'مرفوض'|'مقبول'|'جيد'|'جيد جداً'|'ممتاز'; inspectorName:string; headOfSensoryName:string; notes?:string; date:string; }
export interface NonConformanceRecord { id:string; sn:number; productName:string; productionQty:number; detectedDefects:string; defectiveQty:number; defectPercentage:number; rootCause:string; correctiveAction:string; signee:string; date:string; status:'open'|'resolved'|'under_review'; }
export interface SanitationEquipmentCheck { equipmentName:string; equipmentCode:string; morningShift:{startShift:'compliant'|'non_compliant'|'not_operated'; endShift:'compliant'|'non_compliant'|'not_operated'; notes?:string}; eveningShift:{startShift:'compliant'|'non_compliant'|'not_operated'; endShift:'compliant'|'non_compliant'|'not_operated'; notes?:string}; }
export interface DailySanitationLog { id:string; date:string; day:string; bakerySection:1|2; items:SanitationEquipmentCheck[]; inspectorSignature:string; }
export interface FoodSafetyItemCheck { id:string; category:'GHP'|'Pest_Control'|'Work_Environment'|'Hall_Integrity'; criterion:string; morningShift:{startShift:'compliant'|'non_compliant'|'not_operated'; midShift:'compliant'|'non_compliant'|'not_operated'; notes?:string}; eveningShift:{startShift:'compliant'|'non_compliant'|'not_operated'; midShift:'compliant'|'non_compliant'|'not_operated'; notes?:string}; }
export interface DailyFoodSafetyLog { id:string; date:string; day:string; bakerySection:1|2; checks:FoodSafetyItemCheck[]; inspectorSignature:string; }

// Finished Product Release Approval
export interface ReleaseProductItem { id:string; productName:string; unit:string; quantity:number; }
export interface FinishedProductReleaseForm {
  id:string;
  date:string;
  day:string;
  bakerySection:1|2;
  products:ReleaseProductItem[];
  mandatoryConditions:{ rawMaterialsCompliant:boolean; ccpOprpReportsCompliant:boolean; labAnalysisCompliant:boolean; labelAndPackagingCompliant:boolean; customerRequirementsCompliant:boolean; };
  decision:'approved'|'pending'|'rejected';
  notes?:string;
  qaReleaseOfficerName:string;
  qaReleaseOfficerSignature?:string;
  qaReleaseOfficerTimestamp?:string;
  storekeeperName:string;
  storekeeperSignature?:string;
  storekeeperTimestamp?:string;
  dailyReportId?:string;
}
export interface ProductWeightSpecRecord { id:string; productName:string; time:string; doughWeight:number; doughWeightMin:number; doughWeightMax:number; bakedWeight:number; bakedWeightMin:number; bakedWeightMax:number; finishedWeight:number; finishedWeightMin:number; finishedWeightMax:number; isCompliant:boolean; date:string; }