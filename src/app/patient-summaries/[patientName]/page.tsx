"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ArrowTopLeftIcon, SizeIcon } from "@radix-ui/react-icons";
import { CheckIcon, XIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Notes_Example, Notes_Example2 } from "../../../../public/images"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useEffect, useState } from "react";


const patientSummaries = ({ params }: { params: { patientName: string } }) => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true); // Defina o valor inicial baseado no defaultOpen
  }, []);
  return (

    <div className="container mx-auto flex gap-10 mt-10 mb-32">
      {/* Lado esquerdo */}
      <div className="flex relative flex-col h-fit bg-white p-8 space-y-4 rounded-3xl shadow-lg overflow-hidden w-96">
        <Link href="/all-users" className="flex items-center gap-1 hover:gap-3 transition-all">
          <ArrowTopLeftIcon className="w-4 h-4" />
          Voltar
        </Link>
        <div>
          <h2 className="text-2xl font-bold capitalize">{params.patientName}</h2>
          <p className="text-sm text-gray-500">Tipo de paciente: Adulto</p>
        </div>

        <div className="flex flex-col">
          <span className=" text-orange-400">Histórico de doenças</span>
          <div className="flex gap-2 gap-y-3 mt-2 flex-wrap">
            <p className="text-sm px-3 py-1 rounded-full bg-orange-50 border border-orange-300 text-orange-300">Depressão</p>
            <p className="text-sm px-3 py-1 rounded-full bg-orange-50 border border-orange-300 text-orange-300">Ansiedade</p>
            <p className="text-sm px-3 py-1 rounded-full bg-orange-50 border border-orange-300 text-orange-300">TOC</p>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-orange-400">Dia da consulta</span>
          <p className="text-sm text-gray-500">Segundas-feiras</p>
        </div>
        <div className="flex flex-col">
          <span className="text-orange-400">Idade</span>
          <p className="text-sm text-gray-500">30 anos</p>
        </div>
        <div className="flex flex-col">
          <span className="text-orange-400">Telefone</span>
          <p className="text-sm text-gray-500">(12) 99999-9999</p>
        </div>
        <div className="flex flex-col">
          <span className="text-orange-400">Estado civil</span>
          <p className="text-sm text-gray-500">Solteiro</p>
        </div>
        <div className="flex flex-col">
          <span className="text-orange-400">Tipo de pagamento</span>
          <p className="text-sm text-gray-500">Sulamerica</p>
        </div>
        <Separator className="bg-orange-200" />
        <div className="flex flex-col">
          <span className="text-orange-400">Presença nas ultimas 3 consultas</span>
          <div className="flex gap-2 items-center">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-500">Presente - 20/05/2024</p>
          </div>
          <div className="flex gap-2 items-center ">
            <CheckIcon className="w-4 h-4 text-green-500" />
            <p className="text-sm text-gray-500">Presente - 13/05/2024</p>
          </div>
          <div className="flex gap-2 items-center">
            <XIcon className="w-4 h-4 text-red-500" />
            <p className="text-sm text-gray-500">Não atendido - 06/05/2024</p>
          </div>
        </div>
      </div>
      {/* Lado direito */}
      <div className="flex flex-col gap-8 w-full overflow-y-auto hide-scrollbar">
        <Tabs defaultValue="notes" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="notes">Notas da Sessão</TabsTrigger>
              <TabsTrigger value="notes_summary">Resumo de notas (IA)</TabsTrigger>
            </TabsList>
            <Link href={`/add-note/${params.patientName}`}>
              <Button variant="outline" className="bg-transparent flex items-center justify-center hover:bg-orange-400/20">
                <PlusIcon className="w-4 h-4 text-orange-400 gap-2" />
                <p className="text-orange-400 font-medium">Adicionar uma nova nota</p>
              </Button>
            </Link>
          </div>
          <TabsContent value="notes" className="w-full flex flex-col mx-auto items-center space-y-8">
            <div className="flex flex-col bg-[#FCF6F7] border border-[#E6E6E6] p-8 px-12 rounded-3xl w-full">
              <div className="flex justify-between border-b border-orange-200 pb-4">
                <h1 className="text-orange-900 text-xl font-medium">Resumo de sessão</h1>
                <div className="flex items-center gap-2 text-orange-400">
                  <CalendarIcon className="w-4 h-4 " />
                  <p>29 de Junho, 2024</p>
                </div>
              </div>
              <Collapsible defaultOpen={true} className="pt-4">
                <CollapsibleTrigger onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-orange-400">
                {isOpen ? (<><SizeIcon className="w-4 h-4"/> <p>Fechar</p></>) : (<><PlusIcon className="w-4 h-4"/> <p>Abrir</p></>)}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="mt-6">Durante a sessão de hoje, o paciente relatou uma melhora significativa em seu estado emocional geral, embora ainda enfrente desafios consideráveis no ambiente de trabalho. Ele mencionou que, apesar de se sentir mais confiante e menos ansioso em situações sociais, o estresse relacionado às demandas profissionais tem sido uma fonte constante de preocupação. O paciente expressou dúvidas sobre sua capacidade de lidar com a carga de <b>trabalho atual e está considerando a possibilidade de buscar novas oportunidades</b> que ofereçam um melhor equilíbrio entre vida pessoal e profissional. Discutimos estratégias para gerenciar o estresse, incluindo técnicas de mindfulness e a importância de estabelecer limites claros no trabalho. O paciente também compartilhou que tem encontrado apoio em amigos e familiares, o que tem sido um fator positivo em sua jornada de recuperação. Continuaremos a monitorar seu progresso e a explorar opções que possam contribuir para um ambiente de trabalho mais saudável e satisfatório. Além disso, o paciente mencionou que tem se dedicado a atividades físicas regulares, o que tem ajudado a aliviar parte do estresse.</p>

                  <p>Na sessão de hoje, também discutimos a importância de manter uma alimentação equilibrada e como isso pode impactar positivamente o bem-estar geral do paciente. Ele relatou que tem feito esforços para incluir mais alimentos saudáveis em sua dieta, mas ainda enfrenta dificuldades em manter a consistência devido à sua rotina agitada. Sugerimos algumas estratégias para facilitar a preparação de refeições nutritivas, como planejamento de refeições semanais e a preparação de alimentos em maior quantidade para economizar tempo durante a semana. Além disso, o paciente mencionou que tem interesse em explorar técnicas de meditação para ajudar a reduzir o estresse e melhorar a concentração. Planejamos introduzir algumas práticas de meditação simples nas próximas sessões para avaliar sua eficácia. O paciente também expressou interesse em participar de um grupo de apoio para compartilhar experiências e obter suporte de outras pessoas que enfrentam desafios semelhantes. Vamos explorar opções de grupos de apoio disponíveis na comunidade e discutir a possibilidade de participação na próxima sessão. Continuaremos a monitorar o progresso do paciente e ajustar as estratégias conforme necessário para garantir que ele continue a avançar em sua jornada de recuperação.</p>

                  <Image src={Notes_Example} alt="session" width={1000} height={1000} className="mt-8 border border-stroke rounded-xl" />
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="flex flex-col bg-[#FCF6F7] border pb-8 border-[#E6E6E6] p-8 px-12 space-y-4 rounded-3xl w-full">
              <div className="flex justify-between border-b border-orange-200 pb-4">
                <h1 className="text-orange-900 text-xl font-medium">Resumo de sessão</h1>
                <div className="flex items-center gap-2 text-orange-400">
                  <CalendarIcon className="w-4 h-4 " />
                  <p>15 de Julho, 2024</p>
                </div>
              </div>
              <p>Na sessão de hoje, o paciente relatou que tem se sentido mais equilibrado emocionalmente, mas ainda enfrenta dificuldades em manter a motivação no trabalho. Ele mencionou que, apesar de estar mais organizado e produtivo, a pressão constante para atingir metas tem sido desgastante. O paciente está considerando a possibilidade de buscar um novo emprego que ofereça um ambiente menos estressante. Discutimos a importância de estabelecer prioridades e delegar tarefas quando possível. O paciente também compartilhou que tem encontrado conforto em atividades de lazer, como leitura e caminhadas ao ar livre, o que tem ajudado a aliviar o estresse. Continuaremos a monitorar seu progresso e a explorar opções que possam contribuir para um ambiente de trabalho mais saudável e satisfatório. Além disso, o paciente mencionou que tem se dedicado a práticas de yoga, o que tem ajudado a melhorar sua flexibilidade e reduzir a tensão muscular.</p>

              <p>Durante a sessão, também discutimos a importância de manter uma rotina de sono saudável e como isso pode impactar positivamente o bem-estar geral do paciente. Ele relatou que tem feito esforços para dormir mais cedo, mas ainda enfrenta dificuldades em manter a consistência devido ao trabalho noturno. Sugerimos algumas estratégias para melhorar a qualidade do sono, como evitar o uso de dispositivos eletrônicos antes de dormir e criar um ambiente propício para o descanso. Além disso, o paciente mencionou que tem interesse em explorar técnicas de respiração para ajudar a reduzir a ansiedade e melhorar a concentração. Planejamos introduzir algumas práticas de respiração nas próximas sessões para avaliar sua eficácia. O paciente também expressou interesse em participar de um workshop sobre gestão de tempo para melhorar sua produtividade e reduzir o estresse. Vamos explorar opções de workshops disponíveis na comunidade e discutir a possibilidade de participação na próxima sessão. Continuaremos a monitorar o progresso do paciente e ajustar as estratégias conforme necessário para garantir que ele continue a avançar em sua jornada de recuperação.</p>

              <Image src={Notes_Example2} alt="session" width={1000} height={1000} className="mt-8 border border-stroke rounded-xl" />
            </div>
          </TabsContent>
          <TabsContent value="notes_summary"><p className="font-medium text-center text-xl">Resumos de IA ficarão por aqui. (Parte 2 do projeto)</p></TabsContent>
        </Tabs>
      </div>
    </div>

  );
};


export default patientSummaries;
