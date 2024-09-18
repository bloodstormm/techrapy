import { PatientTypeCard, FormSteps } from "@/components/add-user";
import { Adult, Child, Teens, Couple } from "../../../public/images";

export default function AddUser() {
  return (
    <div className="flex flex-col items-center justify-center py-16 mb-32">
      <h1 className="text-4xl font-cabinetGrotesk mb-1">Adicionar Paciente</h1>
      <p className="text-lightText text-2xl font-light mb-8">Escolha o tipo de paciente que deseja adicionar</p>

      {/* <div className="grid sm:grid-cols-2 gap-4 items-center rounded-xl p-6 mx-auto max-w-2xl">
        <PatientTypeCard src={Child} alt="Criança" type="child" />
        <PatientTypeCard src={Adult} alt="Adulto" type="adult" />
        <PatientTypeCard src={Teens} alt="Adolescente" type="teen" />
        <PatientTypeCard src={Couple} alt="Casal" type="couple" />
      </div> */}

      <FormSteps patientType="adult" />
    </div>
  )
}