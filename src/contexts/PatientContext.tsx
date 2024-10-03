import React, { createContext, useState, useContext, useCallback } from 'react';
import { PatientData } from '@/types/patientData';
import { fetchPatients } from '@/services/patientService';

interface PatientContextType {
  patients: PatientData[];
  refreshPatients: () => Promise<void>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PatientData[]>([]);

  const refreshPatients = useCallback(async () => {
    const updatedPatients = await fetchPatients();
    setPatients(updatedPatients);
  }, []);

  return (
    <PatientContext.Provider value={{ patients, refreshPatients }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};
