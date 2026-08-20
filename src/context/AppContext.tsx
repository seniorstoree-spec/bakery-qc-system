import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
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
import {
  INITIAL_USERS,
  INITIAL_OPERATING_PARAMETERS,
  INITIAL_DEFECT_LOGS,
  INITIAL_CORE_TEMPERATURES,
  INITIAL_METAL_DETECTOR_RECORDS,
  INITIAL_ELECTRIC_SIEVE_RECORDS,
  INITIAL_ADDITIVE_RECORDS,
  INITIAL_SENSORY_EVALUATIONS,
  INITIAL_NON_CONFORMANCE_RECORDS,
  INITIAL_SANITATION_LOG_B1,
  INITIAL_FOOD_SAFETY_LOG,
  INITIAL_RELEASE_FORM_B1,
  INITIAL_RELEASE_FORM_B2,
  INITIAL_PRODUCT_WEIGHT_SPECS
} from '../data/initialData';

interface KPISummary {
  totalSamplesInspected: number;
  compliantCount: number;
  nonCompliantCount: number;
  warningCount: number;
  compliancePercentage: number;
  criticalDeviationsCount: number;
  releaseStatusB1: 'approved' | 'pending' | 'rejected';
  releaseStatusB2: 'approved' | 'pending' | 'rejected';
  avgSensoryScore: number;
  avgCoreTemp: number;
  ccpFailureCount: number;
}

interface AppContextType {
  // App state
  activeSection: 1 | 2;
  setActiveSection: (sec: 1 | 2) => void;
  currentUser: UserProfile;
  setCurrentUserRole: (role: UserRole) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  activeDate: string;
  setActiveDate: (date: string) => void;
  
  // Data records
  operatingParams: OperatingParametersLog[];
  addOperatingParam: (param: Omit<OperatingParametersLog, 'id'>) => void;
  deleteOperatingParam: (id: string) => void;
  
  defectLogs: DefectItemRow[];
  addDefectLog: (log: Omit<DefectItemRow, 'id'>) => void;
  updateDefectLog: (id: string, log: Partial<DefectItemRow>) => void;
  deleteDefectLog: (id: string) => void;
  
  coreTemperatures: CoreTemperatureRecord[];
  addCoreTemperature: (rec: Omit<CoreTemperatureRecord, 'id'>) => void;
  deleteCoreTemperature: (id: string) => void;
  
  metalDetectorLogs: MetalDetectorRecord[];
  addMetalDetectorRecord: (rec: Omit<MetalDetectorRecord, 'id'>) => void;
  updateMetalDetectorRecord: (id: string, rec: Partial<MetalDetectorRecord>) => void;
  deleteMetalDetectorRecord: (id: string) => void;
  
  electricSieveLogs: ElectricSieveRecord[];
  addElectricSieveRecord: (rec: Omit<ElectricSieveRecord, 'id'>) => void;
  deleteElectricSieveRecord: (id: string) => void;
  
  additiveWeights: AdditiveWeightRecord[];
  addAdditiveWeightRecord: (rec: Omit<AdditiveWeightRecord, 'id'>) => void;
  deleteAdditiveWeightRecord: (id: string) => void;
  
  sensoryEvaluations: SensoryEvaluationRecord[];
  addSensoryEvaluation: (rec: Omit<SensoryEvaluationRecord, 'id'>) => void;
  deleteSensoryEvaluation: (id: string) => void;
  
  nonConformanceLogs: NonConformanceRecord[];
  addNonConformanceRecord: (rec: Omit<NonConformanceRecord, 'id'>) => void;
  updateNonConformanceRecord: (id: string, rec: Partial<NonConformanceRecord>) => void;
  deleteNonConformanceRecord: (id: string) => void;
  
  sanitationLogB1: DailySanitationLog;
  updateSanitationLogB1: (log: DailySanitationLog) => void;
  
  foodSafetyLog: DailyFoodSafetyLog;
  updateFoodSafetyLog: (log: DailyFoodSafetyLog) => void;
  
  releaseFormB1: FinishedProductReleaseForm;
  updateReleaseFormB1: (form: Partial<FinishedProductReleaseForm>) => void;
  
  releaseFormB2: FinishedProductReleaseForm;
  updateReleaseFormB2: (form: Partial<FinishedProductReleaseForm>) => void;
  
  productWeightSpecs: ProductWeightSpecRecord[];
  addProductWeightSpec: (rec: Omit<ProductWeightSpecRecord, 'id'>) => void;
  deleteProductWeightSpec: (id: string) => void;
  
  // Analytics & Utilities
  kpi: KPISummary;
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
  triggerMockUpdate: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bakery_qc_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState<1 | 2>(1);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('bakery_theme') === 'dark';
  });
  const [activeDate, setActiveDate] = useState<string>('2026-08-20');

  // Load from local storage or use initials
  const [operatingParams, setOperatingParams] = useState<OperatingParametersLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_op_params`);
    return saved ? JSON.parse(saved) : INITIAL_OPERATING_PARAMETERS;
  });

  const [defectLogs, setDefectLogs] = useState<DefectItemRow[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_defect_logs`);
    return saved ? JSON.parse(saved) : INITIAL_DEFECT_LOGS;
  });

  const [coreTemperatures, setCoreTemperatures] = useState<CoreTemperatureRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_core_temp`);
    return saved ? JSON.parse(saved) : INITIAL_CORE_TEMPERATURES;
  });

  const [metalDetectorLogs, setMetalDetectorLogs] = useState<MetalDetectorRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_metal_det`);
    return saved ? JSON.parse(saved) : INITIAL_METAL_DETECTOR_RECORDS;
  });

  const [electricSieveLogs, setElectricSieveLogs] = useState<ElectricSieveRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_electric_sieve`);
    return saved ? JSON.parse(saved) : INITIAL_ELECTRIC_SIEVE_RECORDS;
  });

  const [additiveWeights, setAdditiveWeights] = useState<AdditiveWeightRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_additives`);
    return saved ? JSON.parse(saved) : INITIAL_ADDITIVE_RECORDS;
  });

  const [sensoryEvaluations, setSensoryEvaluations] = useState<SensoryEvaluationRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_sensory`);
    return saved ? JSON.parse(saved) : INITIAL_SENSORY_EVALUATIONS;
  });

  const [nonConformanceLogs, setNonConformanceLogs] = useState<NonConformanceRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_ncr`);
    return saved ? JSON.parse(saved) : INITIAL_NON_CONFORMANCE_RECORDS;
  });

  const [sanitationLogB1, setSanitationLogB1] = useState<DailySanitationLog>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_san_b1`);
    return saved ? JSON.parse(saved) : INITIAL_SANITATION_LOG_B1;
  });

  const [foodSafetyLog, setFoodSafetyLog] = useState<DailyFoodSafetyLog>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_food_safety`);
    return saved ? JSON.parse(saved) : INITIAL_FOOD_SAFETY_LOG;
  });

  const [releaseFormB1, setReleaseFormB1] = useState<FinishedProductReleaseForm>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_rel_b1`);
    return saved ? JSON.parse(saved) : INITIAL_RELEASE_FORM_B1;
  });

  const [releaseFormB2, setReleaseFormB2] = useState<FinishedProductReleaseForm>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_rel_b2`);
    return saved ? JSON.parse(saved) : INITIAL_RELEASE_FORM_B2;
  });

  const [productWeightSpecs, setProductWeightSpecs] = useState<ProductWeightSpecRecord[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_weight_specs`);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCT_WEIGHT_SPECS;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_op_params`, JSON.stringify(operatingParams));
  }, [operatingParams]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_defect_logs`, JSON.stringify(defectLogs));
  }, [defectLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_core_temp`, JSON.stringify(coreTemperatures));
  }, [coreTemperatures]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_metal_det`, JSON.stringify(metalDetectorLogs));
  }, [metalDetectorLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_electric_sieve`, JSON.stringify(electricSieveLogs));
  }, [electricSieveLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_additives`, JSON.stringify(additiveWeights));
  }, [additiveWeights]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_sensory`, JSON.stringify(sensoryEvaluations));
  }, [sensoryEvaluations]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_ncr`, JSON.stringify(nonConformanceLogs));
  }, [nonConformanceLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_san_b1`, JSON.stringify(sanitationLogB1));
  }, [sanitationLogB1]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_food_safety`, JSON.stringify(foodSafetyLog));
  }, [foodSafetyLog]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_rel_b1`, JSON.stringify(releaseFormB1));
  }, [releaseFormB1]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_rel_b2`, JSON.stringify(releaseFormB2));
  }, [releaseFormB2]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_weight_specs`, JSON.stringify(productWeightSpecs));
  }, [productWeightSpecs]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bakery_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bakery_theme', 'light');
    }
  }, [isDarkMode]);

  const setCurrentUserRole = (role: UserRole) => {
    const user = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(user);
  };

  // Add / Delete functions
  const addOperatingParam = (param: Omit<OperatingParametersLog, 'id'>) => {
    const newParam: OperatingParametersLog = {
      ...param,
      id: `op-${Date.now()}`
    };
    setOperatingParams(prev => [newParam, ...prev]);
  };

  const deleteOperatingParam = (id: string) => {
    setOperatingParams(prev => prev.filter(p => p.id !== id));
  };

  const addDefectLog = (log: Omit<DefectItemRow, 'id'>) => {
    const newLog: DefectItemRow = {
      ...log,
      id: `def-${Date.now()}`
    };
    setDefectLogs(prev => [newLog, ...prev]);
  };

  const updateDefectLog = (id: string, updated: Partial<DefectItemRow>) => {
    setDefectLogs(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteDefectLog = (id: string) => {
    setDefectLogs(prev => prev.filter(item => item.id !== id));
  };

  const addCoreTemperature = (rec: Omit<CoreTemperatureRecord, 'id'>) => {
    const newRec: CoreTemperatureRecord = {
      ...rec,
      id: `ct-${Date.now()}`
    };
    setCoreTemperatures(prev => [newRec, ...prev]);
  };

  const deleteCoreTemperature = (id: string) => {
    setCoreTemperatures(prev => prev.filter(item => item.id !== id));
  };

  const addMetalDetectorRecord = (rec: Omit<MetalDetectorRecord, 'id'>) => {
    const newRec: MetalDetectorRecord = {
      ...rec,
      id: `md-${Date.now()}`
    };
    setMetalDetectorLogs(prev => [newRec, ...prev]);
  };

  const updateMetalDetectorRecord = (id: string, updated: Partial<MetalDetectorRecord>) => {
    setMetalDetectorLogs(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteMetalDetectorRecord = (id: string) => {
    setMetalDetectorLogs(prev => prev.filter(item => item.id !== id));
  };

  const addElectricSieveRecord = (rec: Omit<ElectricSieveRecord, 'id'>) => {
    const newRec: ElectricSieveRecord = {
      ...rec,
      id: `es-${Date.now()}`
    };
    setElectricSieveLogs(prev => [newRec, ...prev]);
  };

  const deleteElectricSieveRecord = (id: string) => {
    setElectricSieveLogs(prev => prev.filter(item => item.id !== id));
  };

  const addAdditiveWeightRecord = (rec: Omit<AdditiveWeightRecord, 'id'>) => {
    const newRec: AdditiveWeightRecord = {
      ...rec,
      id: `ad-${Date.now()}`
    };
    setAdditiveWeights(prev => [newRec, ...prev]);
  };

  const deleteAdditiveWeightRecord = (id: string) => {
    setAdditiveWeights(prev => prev.filter(item => item.id !== id));
  };

  const addSensoryEvaluation = (rec: Omit<SensoryEvaluationRecord, 'id'>) => {
    const newRec: SensoryEvaluationRecord = {
      ...rec,
      id: `se-${Date.now()}`
    };
    setSensoryEvaluations(prev => [newRec, ...prev]);
  };

  const deleteSensoryEvaluation = (id: string) => {
    setSensoryEvaluations(prev => prev.filter(item => item.id !== id));
  };

  const addNonConformanceRecord = (rec: Omit<NonConformanceRecord, 'id'>) => {
    const newRec: NonConformanceRecord = {
      ...rec,
      id: `ncr-${Date.now()}`
    };
    setNonConformanceLogs(prev => [newRec, ...prev]);
  };

  const updateNonConformanceRecord = (id: string, updated: Partial<NonConformanceRecord>) => {
    setNonConformanceLogs(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const deleteNonConformanceRecord = (id: string) => {
    setNonConformanceLogs(prev => prev.filter(item => item.id !== id));
  };

  const updateSanitationLogB1 = (log: DailySanitationLog) => {
    setSanitationLogB1(log);
  };

  const updateFoodSafetyLog = (log: DailyFoodSafetyLog) => {
    setFoodSafetyLog(log);
  };

  const updateReleaseFormB1 = (form: Partial<FinishedProductReleaseForm>) => {
    setReleaseFormB1(prev => ({ ...prev, ...form }));
  };

  const updateReleaseFormB2 = (form: Partial<FinishedProductReleaseForm>) => {
    setReleaseFormB2(prev => ({ ...prev, ...form }));
  };

  const addProductWeightSpec = (rec: Omit<ProductWeightSpecRecord, 'id'>) => {
    const newRec: ProductWeightSpecRecord = {
      ...rec,
      id: `pw-${Date.now()}`
    };
    setProductWeightSpecs(prev => [newRec, ...prev]);
  };

  const deleteProductWeightSpec = (id: string) => {
    setProductWeightSpecs(prev => prev.filter(item => item.id !== id));
  };

  // Reset Data
  const resetAllData = () => {
    setOperatingParams(INITIAL_OPERATING_PARAMETERS);
    setDefectLogs(INITIAL_DEFECT_LOGS);
    setCoreTemperatures(INITIAL_CORE_TEMPERATURES);
    setMetalDetectorLogs(INITIAL_METAL_DETECTOR_RECORDS);
    setElectricSieveLogs(INITIAL_ELECTRIC_SIEVE_RECORDS);
    setAdditiveWeights(INITIAL_ADDITIVE_RECORDS);
    setSensoryEvaluations(INITIAL_SENSORY_EVALUATIONS);
    setNonConformanceLogs(INITIAL_NON_CONFORMANCE_RECORDS);
    setSanitationLogB1(INITIAL_SANITATION_LOG_B1);
    setFoodSafetyLog(INITIAL_FOOD_SAFETY_LOG);
    setReleaseFormB1(INITIAL_RELEASE_FORM_B1);
    setReleaseFormB2(INITIAL_RELEASE_FORM_B2);
    setProductWeightSpecs(INITIAL_PRODUCT_WEIGHT_SPECS);
  };

  // Export JSON
  const exportDataJSON = (): string => {
    const payload = {
      operatingParams,
      defectLogs,
      coreTemperatures,
      metalDetectorLogs,
      electricSieveLogs,
      additiveWeights,
      sensoryEvaluations,
      nonConformanceLogs,
      sanitationLogB1,
      foodSafetyLog,
      releaseFormB1,
      releaseFormB2,
      productWeightSpecs,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(payload, null, 2);
  };

  // Import JSON
  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.defectLogs) setDefectLogs(parsed.defectLogs);
      if (parsed.operatingParams) setOperatingParams(parsed.operatingParams);
      if (parsed.coreTemperatures) setCoreTemperatures(parsed.coreTemperatures);
      if (parsed.metalDetectorLogs) setMetalDetectorLogs(parsed.metalDetectorLogs);
      if (parsed.electricSieveLogs) setElectricSieveLogs(parsed.electricSieveLogs);
      if (parsed.additiveWeights) setAdditiveWeights(parsed.additiveWeights);
      if (parsed.sensoryEvaluations) setSensoryEvaluations(parsed.sensoryEvaluations);
      if (parsed.nonConformanceLogs) setNonConformanceLogs(parsed.nonConformanceLogs);
      if (parsed.sanitationLogB1) setSanitationLogB1(parsed.sanitationLogB1);
      if (parsed.foodSafetyLog) setFoodSafetyLog(parsed.foodSafetyLog);
      if (parsed.releaseFormB1) setReleaseFormB1(parsed.releaseFormB1);
      if (parsed.releaseFormB2) setReleaseFormB2(parsed.releaseFormB2);
      if (parsed.productWeightSpecs) setProductWeightSpecs(parsed.productWeightSpecs);
      return true;
    } catch {
      return false;
    }
  };

  const triggerMockUpdate = () => {
    // Add random new sample reading
    const sampleTemps = [91.5, 93.0, 94.2, 95.5, 92.8, 96.0];
    const randTemp = sampleTemps[Math.floor(Math.random() * sampleTemps.length)];
    addCoreTemperature({
      sn: coreTemperatures.length + 1,
      productName: 'كرواسون ساده ميجا',
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      machineCode: 'OVEN-01',
      coreTemperature: randTemp,
      isCompliant: randTemp >= 90,
      responsiblePerson: currentUser.name,
      verifiedBy: 'م. محمد سيف الإسلام',
      date: activeDate,
      bakerySection: activeSection
    });
  };

  // KPI Calculations
  const totalSamplesInspected = defectLogs.reduce((acc, curr) => acc + curr.sampleSize, 0) + 
    coreTemperatures.length * 5 + 
    metalDetectorLogs.length * 3 + 
    sensoryEvaluations.length * 2;

  const nonCompliantDefects = defectLogs.filter(d => d.status === 'non_compliant').length;
  const warningDefects = defectLogs.filter(d => d.status === 'warning').length;
  const compliantDefects = defectLogs.filter(d => d.status === 'compliant').length;

  const tempFails = coreTemperatures.filter(t => !t.isCompliant).length;
  const ccpFails = metalDetectorLogs.filter(m => !m.isCompliant).length + electricSieveLogs.filter(s => !s.isCompliant).length;
  
  const totalChecks = (defectLogs.length || 1) + (coreTemperatures.length || 1) + (metalDetectorLogs.length || 1);
  const totalFails = nonCompliantDefects + tempFails + ccpFails;
  const compliancePercentage = Math.max(0, Math.min(100, Math.round(((totalChecks - totalFails) / totalChecks) * 100)));

  const criticalDeviationsCount = nonConformanceLogs.length + ccpFails + tempFails;

  const avgSensoryScore = sensoryEvaluations.length > 0 
    ? Number((sensoryEvaluations.reduce((acc, curr) => acc + curr.overallImpressionScore, 0) / sensoryEvaluations.length).toFixed(1))
    : 9.0;

  const avgCoreTemp = coreTemperatures.length > 0
    ? Number((coreTemperatures.reduce((acc, curr) => acc + curr.coreTemperature, 0) / coreTemperatures.length).toFixed(1))
    : 93.5;

  const kpi: KPISummary = {
    totalSamplesInspected,
    compliantCount: compliantDefects,
    nonCompliantCount: nonCompliantDefects,
    warningCount: warningDefects,
    compliancePercentage,
    criticalDeviationsCount,
    releaseStatusB1: releaseFormB1.decision,
    releaseStatusB2: releaseFormB2.decision,
    avgSensoryScore,
    avgCoreTemp,
    ccpFailureCount: ccpFails
  };

  return (
    <AppContext.Provider value={{
      activeSection,
      setActiveSection,
      currentUser,
      setCurrentUserRole,
      isDarkMode,
      setIsDarkMode,
      activeDate,
      setActiveDate,
      operatingParams,
      addOperatingParam,
      deleteOperatingParam,
      defectLogs,
      addDefectLog,
      updateDefectLog,
      deleteDefectLog,
      coreTemperatures,
      addCoreTemperature,
      deleteCoreTemperature,
      metalDetectorLogs,
      addMetalDetectorRecord,
      updateMetalDetectorRecord,
      deleteMetalDetectorRecord,
      electricSieveLogs,
      addElectricSieveRecord,
      deleteElectricSieveRecord,
      additiveWeights,
      addAdditiveWeightRecord,
      deleteAdditiveWeightRecord,
      sensoryEvaluations,
      addSensoryEvaluation,
      deleteSensoryEvaluation,
      nonConformanceLogs,
      addNonConformanceRecord,
      updateNonConformanceRecord,
      deleteNonConformanceRecord,
      sanitationLogB1,
      updateSanitationLogB1,
      foodSafetyLog,
      updateFoodSafetyLog,
      releaseFormB1,
      updateReleaseFormB1,
      releaseFormB2,
      updateReleaseFormB2,
      productWeightSpecs,
      addProductWeightSpec,
      deleteProductWeightSpec,
      kpi,
      resetAllData,
      exportDataJSON,
      importDataJSON,
      triggerMockUpdate
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
