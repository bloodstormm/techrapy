import PatientCard from "@/components/patientCard";
import { PatientData } from "@/types/patientData";
import { supabase } from "@/lib/supabaseClient";

const AllUsers = async () => {

  const { data, error } = await supabase
    .from('patients')
    .select('*');

  if (error) {
    console.error('Error fetching patients:', error);
    return <div>Error fetching patients</div>;
  }

  // Tipagem da resposta
  const patients: PatientData[] = data;

  console.log(patients)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 mt-16 gap-4 container mx-auto">
      {patients.map(patient => (
        <PatientCard key={patient.patient_id} patientData={patient} lastSession={patient.last_session} />
      ))}
    </div>
  );
};

export default AllUsers;