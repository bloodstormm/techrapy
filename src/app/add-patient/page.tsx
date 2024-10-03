import { PatientTypeCard, FormSteps } from "@/components/add-user";
import { Adult, Child, Teens, Couple } from "../../../public/images";

export default function AddPatient() {
  return (
    <div className="flex flex-col items-center justify-center py-16 mb-32">
      <h1 className="text-4xl font-cabinetGrotesk mb-1">Adicionar Paciente</h1>
      <p className="text-lightText text-2xl font-light mb-8">Escolha o tipo de paciente que deseja adicionar</p>

      <FormSteps patientType="adult" />
    </div>
  )
}