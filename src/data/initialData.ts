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
  {
    id: 1,
    name: 'مخبوزات 1',
    subtitle: 'كرواسون، باتيه، دانش، ميلفيه، بغاشة',
    description: 'قسم تصنيع وإنتاج المخبوزات المورقة والمعجنات الفرنسية'
  },
  {
    id: 2,
    name: 'مخبوزات 2',
    subtitle: 'دونتس، سينامون، ساندويتشات',
    description: 'قسم إنتاج الدونتس المقلي ولفائف السينامون والساندويتشات'
  }
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
  {
    id: 'usr-1',
    name: 'م. أحمد الشناوي',
    role: 'quality_engineer',
    department: 'إدارة الجودة - قسم المخبوزات',
    title: 'مهندس جودة ومراقبة عمليات',
    permissions: {
      canEnterData: true,
      canApproveRelease: false,
      canEditCriticalLimits: false,
      canManageUsers: false,
      canExportReports: true,
      canSignOff: true,
    }
  },
  {
    id: 'usr-2',
    name: 'م. محمد سيف الإسلام',
    role: 'quality_manager',
    department: 'إدارة تأكيد الجودة والتشريعات',
    title: 'رئيس قسم مراقبة وتأكيد الجودة',
    permissions: {
      canEnterData: true,
      canApproveRelease: true,
      canEditCriticalLimits: true,
      canManageUsers: true,
      canExportReports: true,
      canSignOff: true,
    }
  },
  {
    id: 'usr-3',
    name: 'أ. محمود عبد الرحمن',
    role: 'production_supervisor',
    department: 'قسم الإنتاج والمستودعات',
    title: 'مشرف إنتاج / أمين مخزن التام',
    permissions: {
      canEnterData: false,
      canApproveRelease: false,
      canEditCriticalLimits: false,
      canManageUsers: false,
      canExportReports: true,
      canSignOff: true,
    }
  },
  {
    id: 'usr-4',
    name: 'م. إبراهيم خليل (مطور النظام)',
    role: 'developer',
    department: 'التطوير الهندسي والتحكم الفائق',
    title: 'المطور الرئيسي للبرمجيات',
    permissions: {
      canEnterData: true,
      canApproveRelease: true,
      canEditCriticalLimits: true,
      canManageUsers: true,
      canExportReports: true,
      canSignOff: true,
      isDeveloperSuperAdmin: true
    }
  }
];

export const BAKERY_1_RECIPES: RawMaterialRecipe[] = [
  {
    id: 'rec-1',
    sectionId: 1,
    productName: 'كرواسون',
    flour_kg: 100,
    butter_kg: 2,
    pasteurized_eggs_kg: 16.5,
    powdered_milk_kg: 4,
    sugar_kg: 8.5,
    salt_gm: 1460,
    yeast_gm: 960,
    improver_gm: 530,
    softener_gm: 530,
    gluten_kg: 2.08,
    water_ice_L: 48,
    debris_kg: 6,
    polish_kg: 0,
    broken_ghorayeba_kg: 0,
    notes: 'معايير التشغيل القياسية لقسم المخبوزات 1'
  },
  {
    id: 'rec-2',
    sectionId: 1,
    productName: 'باتيه',
    flour_kg: 100,
    pasteurized_eggs_kg: 16.5,
    powdered_milk_kg: 4,
    sugar_kg: 8.5,
    salt_gm: 1460,
    yeast_gm: 960,
    improver_gm: 530,
    gluten_kg: 2.08,
    water_ice_L: 43,
    debris_kg: 12,
    polish_kg: 20,
    broken_ghorayeba_kg: 32,
  },
  {
    id: 'rec-3',
    sectionId: 1,
    productName: 'دانش',
    flour_kg: 100,
    pasteurized_eggs_kg: 16.5,
    powdered_milk_kg: 4,
    sugar_kg: 8.5,
    salt_gm: 1460,
    yeast_gm: 960,
    improver_gm: 530,
    gluten_kg: 2.08,
    water_ice_L: 40,
    debris_kg: 12,
    polish_kg: 20,
    broken_ghorayeba_kg: 32,
  },
  {
    id: 'rec-4',
    sectionId: 1,
    productName: 'عجين أبيض - بغاشة',
    flour_kg: 50,
    salt_gm: 700,
    water_ice_L: 32,
    broken_ghorayeba_kg: 16,
  },
  {
    id: 'rec-5',
    sectionId: 1,
    productName: 'عجين أبيض - ميلفيه',
    flour_kg: 50,
    salt_gm: 250,
    improver_gm: 150,
    oil_L: 1.250,
    water_ice_L: 24,
    broken_ghorayeba_kg: 16,
  },
  {
    id: 'rec-6',
    sectionId: 1,
    productName: 'عجين زبده',
    flour_kg: 62.5,
    butter_kg: 112.5,
    notes: 'خلط الزبدة مع الدقيق'
  },
  {
    id: 'rec-7',
    sectionId: 1,
    productName: 'منقوش',
    flour_kg: 25,
    powdered_milk_kg: 1.0,
    sugar_kg: 2.5,
    salt_gm: 75.0,
    yeast_gm: 75.0,
    softener_gm: 125.0,
    oil_L: 2.5,
    water_ice_L: 12.0,
  },
  {
    id: 'rec-8',
    sectionId: 1,
    productName: 'باتون ساليه',
    flour_kg: 48,
    butter_kg: 24,
    pasteurized_eggs_kg: 12,
    salt_gm: 1200,
    yeast_gm: 800,
    water_ice_L: 6,
  },
  {
    id: 'rec-9',
    sectionId: 1,
    productName: 'عجين صيامي',
    flour_kg: 10,
    sugar_kg: 1,
    salt_gm: 150,
    yeast_gm: 100,
    improver_gm: 50,
    gluten_kg: 0.200,
    oil_L: 0.500,
    water_ice_L: 6,
    debris_kg: 3.5,
    polish_kg: 2.5,
  },
  {
    id: 'rec-10',
    sectionId: 1,
    productName: 'بيتزا ايطالي',
    flour_kg: 50,
    pasteurized_eggs_kg: 2.8,
    powdered_milk_kg: 2.5,
    sugar_kg: 4,
    salt_gm: 250,
    yeast_gm: 150,
    oil_L: 5,
    water_ice_L: 20,
  },
  {
    id: 'rec-11',
    sectionId: 1,
    productName: 'كريمه بستري (دانش)',
    customFields: {
      'بودر كريمة': '1 kg',
      'مياه + ثلج': '2 L',
    }
  },
  {
    id: 'rec-12',
    sectionId: 1,
    productName: 'خليط صلصة البيتزا',
    customFields: {
      'صلصة': '30 kg',
      'زيت': '7.5 L',
      'ملح': '250 gm',
      'بصل بودر': '7.5 gm',
      'بهارات': '140 gm',
      'كمون': '140 gm',
      'فلفل اسود': '160 gm',
    }
  }
];

export const BAKERY_2_RECIPES: RawMaterialRecipe[] = [
  {
    id: 'rec-b2-1',
    sectionId: 2,
    productName: 'دونتس ميجا مفتوح',
    flour_kg: 50,
    butter_kg: 5,
    pasteurized_eggs_kg: 12.5,
    powdered_milk_kg: 1.5,
    sugar_kg: 6,
    salt_gm: 500,
    yeast_gm: 500,
    improver_gm: 250,
    water_ice_L: 15,
    debris_kg: 20,
  },
  {
    id: 'rec-b2-2',
    sectionId: 2,
    productName: 'دونتس ميجا فيلد',
    flour_kg: 50,
    butter_kg: 5,
    pasteurized_eggs_kg: 13,
    sugar_kg: 2.5,
    salt_gm: 500,
    yeast_gm: 500,
    gluten_kg: 0.500,
    water_ice_L: 23,
    debris_kg: 20,
  },
  {
    id: 'rec-b2-3',
    sectionId: 2,
    productName: 'دونتس مفتوح',
    flour_kg: 60,
    butter_kg: 9,
    pasteurized_eggs_kg: 15,
    powdered_milk_kg: 1.8,
    sugar_kg: 7.2,
    salt_gm: 600,
    yeast_gm: 600,
    improver_gm: 300,
    water_ice_L: 18,
    debris_kg: 23,
  },
  {
    id: 'rec-b2-4',
    sectionId: 2,
    productName: 'دونتس فيلد',
    flour_kg: 60,
    butter_kg: 9,
    pasteurized_eggs_kg: 15,
    sugar_kg: 3,
    salt_gm: 600,
    yeast_gm: 600,
    improver_gm: 300,
    gluten_kg: 0.600,
    water_ice_L: 27.5,
    debris_kg: 23,
  },
  {
    id: 'rec-b2-5',
    sectionId: 2,
    productName: 'دونتس صيامي',
    flour_kg: 10,
    sugar_kg: 1.2,
    salt_gm: 100,
    yeast_gm: 100,
    improver_gm: 60,
    oil_L: 0.9,
    water_ice_L: 5.5,
    debris_kg: 1.5,
  },
  {
    id: 'rec-b2-6',
    sectionId: 2,
    productName: 'ساندويتش',
    flour_kg: 30,
    powdered_milk_kg: 1.2,
    sugar_kg: 3,
    salt_gm: 300,
    yeast_gm: 450,
    improver_gm: 75,
    gluten_kg: 0.075,
    oil_L: 4.5,
    water_ice_L: 8.5,
    debris_kg: 8,
  },
  {
    id: 'rec-b2-7',
    sectionId: 2,
    productName: 'ميني ساندويتش',
    flour_kg: 48,
    pasteurized_eggs_kg: 3,
    powdered_milk_kg: 1.5,
    sugar_kg: 4.8,
    salt_gm: 480,
    yeast_gm: 720,
    improver_gm: 240,
    softener_gm: 240,
    oil_L: 6,
    water_ice_L: 14,
    debris_kg: 15,
  },
  {
    id: 'rec-b2-8',
    sectionId: 2,
    productName: 'سينامون',
    flour_kg: 50,
    butter_kg: 7.2,
    pasteurized_eggs_kg: 5,
    powdered_milk_kg: 2.4,
    sugar_kg: 5,
    salt_gm: 700,
    yeast_gm: 500,
    improver_gm: 250,
    softener_gm: 250,
    water_ice_L: 15,
    debris_kg: 10,
  },
  {
    id: 'rec-b2-9',
    sectionId: 2,
    productName: 'كريمة السينامون',
    customFields: {
      'سكر مطحون': '2 kg',
      'زبدة': '750 gm',
      'جبنة كريمي': '750 gm',
      'فانيليا': '3 gm',
      'ليمون فريش': '2 gm'
    }
  },
  {
    id: 'rec-b2-10',
    sectionId: 2,
    productName: 'خليط التيرميسيو',
    customFields: {
      'نسكافيه': '50 gm',
      'سكر مطحون': '500 gm',
      'لبن': '1 kg'
    }
  },
  {
    id: 'rec-b2-11',
    sectionId: 2,
    productName: 'كريمة حشو الريد فلفت',
    customFields: {
      'زبدة': '1.5 kg',
      'سكر مطحون': '1.5 kg',
      'جبنة كريمي': '3 kg'
    }
  }
];

export const INITIAL_OPERATING_PARAMETERS: OperatingParametersLog[] = [
  {
    id: 'op-1',
    time: '08:00 AM',
    stage: 'kneading',
    bakerySection: 1,
    productName: 'كرواسون ساده ميجا',
    temperature: 17,
    duration_min: 16,
    isCompliant: true,
    notes: 'ضمن الحدود القياسية للعجن (الوقت 12:20 دقيقة، الحرارة 15:19°C)'
  },
  {
    id: 'op-2',
    time: '09:00 AM',
    stage: 'sheeting',
    bakerySection: 1,
    productName: 'كرواسون ساده ميجا',
    sheetingThickness_cm: 0.5,
    isCompliant: true,
    notes: 'السمك مطابق (0.4 : 0.7 cm)'
  },
  {
    id: 'op-3',
    time: '10:00 AM',
    stage: 'baking',
    bakerySection: 1,
    productName: 'كرواسون ساده ميجا',
    temperature: 185,
    duration_min: 22,
    isCompliant: true,
    notes: 'حرارة الفرن 185°C (المواصفة: 160 : 205°C)'
  },
  {
    id: 'op-4',
    time: '11:00 AM',
    stage: 'glazing',
    bakerySection: 1,
    productName: 'دانش فواكه ميجا',
    glazingConcentration_pct: 63,
    isCompliant: true,
    notes: 'تركيز مربى المشمش 63% (المواصفة 60-65%)'
  },
  {
    id: 'op-5',
    time: '08:30 AM',
    stage: 'kneading',
    bakerySection: 2,
    productName: 'دونتس ميجا مفتوح',
    temperature: 18,
    duration_min: 18,
    isCompliant: true,
    notes: 'عجن الدونتس مطابق'
  },
  {
    id: 'op-6',
    time: '09:30 AM',
    stage: 'frying',
    bakerySection: 2,
    productName: 'دونتس ميجا مفتوح',
    temperature: 175,
    fryerCode: 'FRY-02',
    tpmPct: 14.5,
    oilAddedPct: 2.1,
    isCompliant: true,
    notes: 'نسبة TPM أقل من 24% ونسبة الزيت المضاف 2.1% (المسموح 0.5 - 4.5%)'
  }
];

export const INITIAL_DEFECT_LOGS: DefectItemRow[] = [
  {
    id: 'def-1',
    productName: 'كرواسون ساده ميجا',
    bakerySection: 1,
    stage: 'start',
    time: '08:30 AM',
    requiredProductionQty: 5000,
    sampleSize: 100,
    oversize: 2,
    undersize: 1,
    overweight: 2,
    underweight: 1,
    darkColor: 1,
    lightColor: 2,
    burntParts: 0,
    deflatedProduct: 1,
    gapsInPieces: 1,
    dryProduct: 0,
    doughyProduct: 0,
    nonLaminated: 0,
    bitterTaste: 0,
    rancidTaste: 0,
    fillingLeakage: 0,
    excessFilling: 0,
    insufficientFilling: 0,
    noFilling: 0,
    heavyTexture: 1,
    lightTexture: 0,
    excessGlaze: 2,
    insufficientGlaze: 1,
    surfaceSpots: 1,
    surfacePeeling: 0,
    surfaceCracks: 1,
    foreignMatters: 0,
    expiryDateDefect: 0,
    sealingDefect: 1,
    printingDefect: 1,
    undesiredSmell: 0,
    status: 'compliant',
    criticalDeviation: false,
    notes: 'جميع النسب ضمن الحدود المسموحة (≤3% و ≤5%)'
  },
  {
    id: 'def-2',
    productName: 'كرواسون شيكولاتة ميجا',
    bakerySection: 1,
    stage: 'mid',
    time: '12:00 PM',
    requiredProductionQty: 4200,
    sampleSize: 100,
    oversize: 1,
    undersize: 2,
    overweight: 1,
    underweight: 2,
    darkColor: 2,
    lightColor: 1,
    burntParts: 0,
    deflatedProduct: 1,
    gapsInPieces: 1,
    dryProduct: 1,
    doughyProduct: 0,
    nonLaminated: 0,
    bitterTaste: 0,
    rancidTaste: 0,
    fillingLeakage: 2,
    excessFilling: 1,
    insufficientFilling: 1,
    noFilling: 0,
    heavyTexture: 1,
    lightTexture: 1,
    excessGlaze: 1,
    insufficientGlaze: 2,
    surfaceSpots: 1,
    surfacePeeling: 1,
    surfaceCracks: 1,
    foreignMatters: 0,
    expiryDateDefect: 0,
    sealingDefect: 2,
    printingDefect: 1,
    undesiredSmell: 0,
    status: 'compliant',
    criticalDeviation: false,
    notes: 'مطابق للمواصفات'
  },
  {
    id: 'def-3',
    productName: 'دونتس فيلد ميجا شيكولاتة',
    bakerySection: 2,
    stage: 'start',
    time: '09:00 AM',
    requiredProductionQty: 3000,
    sampleSize: 100,
    oversize: 3,
    undersize: 2,
    overweight: 2,
    underweight: 3,
    darkColor: 3,
    lightColor: 2,
    burntParts: 0,
    deflatedProduct: 2,
    gapsInPieces: 1,
    dryProduct: 1,
    doughyProduct: 1,
    nonLaminated: 0,
    bitterTaste: 0,
    rancidTaste: 0,
    fillingLeakage: 2,
    excessFilling: 2,
    insufficientFilling: 1,
    noFilling: 0,
    heavyTexture: 1,
    lightTexture: 1,
    excessGlaze: 2,
    insufficientGlaze: 1,
    surfaceSpots: 1,
    surfacePeeling: 1,
    surfaceCracks: 2,
    foreignMatters: 0,
    expiryDateDefect: 0,
    sealingDefect: 1,
    printingDefect: 1,
    undesiredSmell: 0,
    status: 'compliant',
    criticalDeviation: false,
    notes: 'فحص بداية التشغيل ممتاز'
  }
];

export const INITIAL_CORE_TEMPERATURES: CoreTemperatureRecord[] = [
  { id: 'ct-1', sn: 1, productName: 'كرواسون ساده', time: '08:15 AM', machineCode: 'OVEN-01', coreTemperature: 94.5, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 1 },
  { id: 'ct-2', sn: 2, productName: 'كرواسون جبنه شيدر', time: '09:00 AM', machineCode: 'OVEN-01', coreTemperature: 93.0, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 1 },
  { id: 'ct-3', sn: 3, productName: 'باتيه جبن رومي', time: '09:45 AM', machineCode: 'OVEN-02', coreTemperature: 92.5, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 1 },
  { id: 'ct-4', sn: 4, productName: 'بيتزا إيطالي', time: '10:30 AM', machineCode: 'OVEN-03', coreTemperature: 95.0, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 1 },
  { id: 'ct-5', sn: 5, productName: 'بغاشة', time: '11:15 AM', machineCode: 'OVEN-02', coreTemperature: 91.0, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 1 },
  { id: 'ct-6', sn: 6, productName: 'دانش كريمة', time: '12:00 PM', machineCode: 'OVEN-01', coreTemperature: 92.0, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 1 },
  { id: 'ct-7', sn: 7, productName: 'دونتس مفتوح', time: '08:45 AM', machineCode: 'FRY-01', coreTemperature: 94.0, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 2 },
  { id: 'ct-8', sn: 8, productName: 'دونتس فيلد', time: '09:30 AM', machineCode: 'FRY-02', coreTemperature: 93.5, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 2 },
  { id: 'ct-9', sn: 9, productName: 'سينامون', time: '10:15 AM', machineCode: 'OVEN-04', coreTemperature: 96.0, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 2 },
  { id: 'ct-10', sn: 10, productName: 'ساندويتش مقفول', time: '11:00 AM', machineCode: 'OVEN-04', coreTemperature: 91.5, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20', bakerySection: 2 },
];

export const INITIAL_METAL_DETECTOR_RECORDS: MetalDetectorRecord[] = [
  { id: 'md-1', sn: 1, time: '08:00 AM', machineCode: 'MD-LINE-01', feStatus: 'pass', nfeStatus: 'pass', ssStatus: 'pass', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'md-2', sn: 2, time: '09:00 AM', machineCode: 'MD-LINE-01', feStatus: 'pass', nfeStatus: 'pass', ssStatus: 'pass', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'md-3', sn: 3, time: '10:00 AM', machineCode: 'MD-LINE-01', feStatus: 'pass', nfeStatus: 'pass', ssStatus: 'pass', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'md-4', sn: 4, time: '11:00 AM', machineCode: 'MD-LINE-01', feStatus: 'pass', nfeStatus: 'pass', ssStatus: 'pass', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'md-5', sn: 5, time: '12:00 PM', machineCode: 'MD-LINE-01', feStatus: 'pass', nfeStatus: 'pass', ssStatus: 'pass', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'md-6', sn: 6, time: '01:00 PM', machineCode: 'MD-LINE-01', feStatus: 'pass', nfeStatus: 'pass', ssStatus: 'pass', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'md-7', sn: 7, time: '02:00 PM', machineCode: 'MD-LINE-01', feStatus: 'pass', nfeStatus: 'pass', ssStatus: 'pass', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'md-8', sn: 8, time: '03:00 PM', machineCode: 'MD-LINE-01', feStatus: 'pass', nfeStatus: 'pass', ssStatus: 'pass', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
];

export const INITIAL_ELECTRIC_SIEVE_RECORDS: ElectricSieveRecord[] = [
  { id: 'es-1', sn: 1, productName: 'دقيق فاخر 72% - خط الكرواسون', time: '07:30 AM', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', sieveIntegrityCheck: 'سليم وكفء', notes: 'المنخل 600 ميكرون خالي من أي شوائب أو تمزقات', date: '2026-08-20' },
  { id: 'es-2', sn: 2, productName: 'سكر مطحون - خط الدونتس والسينامون', time: '08:00 AM', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', sieveIntegrityCheck: 'سليم وكفء', notes: 'تم النخل والتأكد من نقاء المسحوق', date: '2026-08-20' },
  { id: 'es-3', sn: 3, productName: 'لبن بودرة - خط الباتيه', time: '09:15 AM', isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', sieveIntegrityCheck: 'سليم وكفء', notes: 'خالي من أي تكتلات أو أجسام غريبة', date: '2026-08-20' },
];

export const INITIAL_ADDITIVE_RECORDS: AdditiveWeightRecord[] = [
  { id: 'ad-1', sn: 1, productName: 'بغاشة', additiveName: 'ملح ليمون E330 (0.67 جم / كجم)', batchNumber: 'LOT-20260820-01', time: '08:30 AM', actualWeight_gm: 0.67, standardLimit_gm: 0.67, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'ad-2', sn: 2, productName: 'دونتس كوتن كاندي', additiveName: 'اسانس Cotton Candy 120 (2 جم / كجم)', batchNumber: 'LOT-20260820-02', time: '09:00 AM', actualWeight_gm: 2.0, standardLimit_gm: 2.0, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'ad-3', sn: 3, productName: 'دونتس كوتن كاندي', additiveName: 'لون أزرق E133 FD&C Blue 1 lake (3.3 جم / كجم)', batchNumber: 'LOT-20260820-03', time: '09:15 AM', actualWeight_gm: 3.25, standardLimit_gm: 3.3, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
  { id: 'ad-4', sn: 4, productName: 'دونتس بينك', additiveName: 'أحمر كارموازين 610 - E122 (1.5 جم / كجم)', batchNumber: 'LOT-20260820-04', time: '10:00 AM', actualWeight_gm: 1.48, standardLimit_gm: 1.5, isCompliant: true, responsiblePerson: 'م. أحمد الشناوي', verifiedBy: 'م. محمد سيف الإسلام', date: '2026-08-20' },
];

export const INITIAL_SENSORY_EVALUATIONS: SensoryEvaluationRecord[] = [
  { id: 'se-1', sn: 1, productName: 'دانش كريمه', sampleType: 'daily_product', isVegan: false, time: '09:00 AM', sampleNumber: 'SAMP-001', colorScore: 9, tasteScore: 9, aromaScore: 9, textureScore: 8, overallImpressionScore: 9, overallRating: 'جيد جداً', inspectorName: 'م. أحمد الشناوي', headOfSensoryName: 'م. محمد سيف الإسلام', notes: 'منتج ممتاز متوازن في الطعم والقوام', date: '2026-08-20' },
  { id: 'se-2', sn: 2, productName: 'كرواسون ساده', sampleType: 'daily_product', isVegan: false, time: '09:30 AM', sampleNumber: 'SAMP-002', colorScore: 10, tasteScore: 10, aromaScore: 10, textureScore: 9, overallImpressionScore: 10, overallRating: 'ممتاز', inspectorName: 'م. أحمد الشناوي', headOfSensoryName: 'م. محمد سيف الإسلام', notes: 'توريق ممتاز ونكهة زبدة واضحة ومثالية', date: '2026-08-20' },
  { id: 'se-3', sn: 3, productName: 'بيتزا إيطالي', sampleType: 'daily_product', isVegan: false, time: '10:00 AM', sampleNumber: 'SAMP-003', colorScore: 8, tasteScore: 8, aromaScore: 8, textureScore: 8, overallImpressionScore: 8, overallRating: 'جيد', inspectorName: 'م. أحمد الشناوي', headOfSensoryName: 'م. محمد سيف الإسلام', notes: 'صلصة متوازنة وتسوية ممتازة', date: '2026-08-20' },
  { id: 'se-4', sn: 4, productName: 'باتيه صيامي ساده', sampleType: 'daily_product', isVegan: true, time: '10:30 AM', sampleNumber: 'VEG-001', colorScore: 9, tasteScore: 8, aromaScore: 8, textureScore: 8, overallImpressionScore: 8, overallRating: 'جيد', inspectorName: 'م. أحمد الشناوي', headOfSensoryName: 'م. محمد سيف الإسلام', notes: 'عجين صيامي خفيف وقوام مورق', date: '2026-08-20' },
  { id: 'se-5', sn: 5, productName: 'دونتس شيكولاتة صيامي', sampleType: 'daily_product', isVegan: true, time: '11:00 AM', sampleNumber: 'VEG-002', colorScore: 9, tasteScore: 9, aromaScore: 9, textureScore: 9, overallImpressionScore: 9, overallRating: 'جيد جداً', inspectorName: 'م. أحمد الشناوي', headOfSensoryName: 'م. محمد سيف الإسلام', notes: 'تغطية شيكولاتة متجانسة وخالي من الدهون المتبقية', date: '2026-08-20' },
];

export const INITIAL_NON_CONFORMANCE_RECORDS: NonConformanceRecord[] = [
  {
    id: 'ncr-1',
    sn: 1,
    productName: 'كرواسون شوكولاتة ميجا',
    productionQty: 4000,
    detectedDefects: 'خروج حشو جزئي وتسييل شوكولاتة أثناء التخمير',
    defectiveQty: 25,
    defectPercentage: 0.625,
    rootCause: 'زيادة بسيطة في زمن التخمير النهائي بنسبة 4 دقائق',
    correctiveAction: 'ضبط توقيت المخمر الآلي وإعادة معايرة الحساس وتدريب العمال',
    signee: 'م. أحمد الشناوي',
    date: '2026-08-20',
    status: 'resolved'
  }
];

export const SANITATION_EQUIPMENT_NAMES_B1 = [
  { name: 'خط التبنيط', code: 'EQ-01' },
  { name: 'خط التشكيل (روندو)', code: 'EQ-02' },
  { name: 'العجانات', code: 'EQ-03' },
  { name: 'الفرادات', code: 'EQ-04' },
  { name: 'ماكينة تقطيع الفلفل', code: 'EQ-05' },
  { name: 'ماكينة تقطيع الخوخ', code: 'EQ-06' },
  { name: 'ماكينة تقطيع الجبنة', code: 'EQ-07' },
  { name: 'ماكينات الحقن', code: 'EQ-08' },
  { name: 'المنخل الكهربي', code: 'EQ-09' },
  { name: 'مكبس العجين', code: 'EQ-10' },
  { name: 'السخانات', code: 'EQ-11' },
  { name: 'الإستاندات', code: 'EQ-12' },
  { name: 'أدوات المناولة', code: 'EQ-13' },
  { name: 'الترابيزات', code: 'EQ-14' },
  { name: 'المخمرات', code: 'EQ-15' },
  { name: 'الأفران', code: 'EQ-16' },
];

export const INITIAL_SANITATION_LOG_B1: DailySanitationLog = {
  id: 'san-b1-1',
  date: '2026-08-20',
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
  id: 'fs-1',
  date: '2026-08-20',
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
  date: '2026-08-20',
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
  date: '2026-08-20',
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

export const INITIAL_PRODUCT_WEIGHT_SPECS: ProductWeightSpecRecord[] = [
  { id: 'pw-1', productName: 'دونتس مفتوح ميجا (شيكولاتة)', time: '08:30 AM', doughWeight: 80, doughWeightMin: 75, doughWeightMax: 85, bakedWeight: 90, bakedWeightMin: 85, bakedWeightMax: 95, finishedWeight: 112, finishedWeightMin: 105, finishedWeightMax: 120, isCompliant: true, date: '2026-08-20' },
  { id: 'pw-2', productName: 'دونتس فيلد ميجا (شيكولاتة)', time: '09:00 AM', doughWeight: 68, doughWeightMin: 65, doughWeightMax: 70, bakedWeight: 73, bakedWeightMin: 70, bakedWeightMax: 75, finishedWeight: 106, finishedWeightMin: 100, finishedWeightMax: 110, isCompliant: true, date: '2026-08-20' },
  { id: 'pw-3', productName: 'سينامون كلاسيك', time: '09:30 AM', doughWeight: 170, doughWeightMin: 165, doughWeightMax: 175, bakedWeight: 155, bakedWeightMin: 150, bakedWeightMax: 160, finishedWeight: 210, finishedWeightMin: 200, finishedWeightMax: 220, isCompliant: true, date: '2026-08-20' },
  { id: 'pw-4', productName: 'ساندويتش فاهيتا فراخ', time: '10:00 AM', doughWeight: 102, doughWeightMin: 100, doughWeightMax: 105, bakedWeight: 93, bakedWeightMin: 90, bakedWeightMax: 95, finishedWeight: 155, finishedWeightMin: 150, finishedWeightMax: 160, isCompliant: true, date: '2026-08-20' },
];
