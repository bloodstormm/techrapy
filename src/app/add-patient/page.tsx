import { FormSteps } from "@/components/add-user";

export default function AddPatient() {
  return (
    <div className="flex flex-col px-6 sm:px-0 items-center justify-center py-16 mb-32">
      <h1 className="text-4xl text-orange-900 dark:text-primary font-cabinetGrotesk mb-1">Adicionar Paciente</h1>
      <p className="text-lg text-center mb-8">Escolha o tipo de paciente que deseja adicionar</p>

      <FormSteps patientType="adult" />
    </div>
  )
}