
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RespondentSectionProps {
  respondentData: {
    hasProjectExperience: boolean | null;
    isPharmaceutical: boolean | null;
    pharmaceuticalType: string;
    companySize: string;
    state: string;
  };
  updateRespondentData: (field: string, value: any) => void;
}

const pharmaceuticalTypes = [
  "Medicamento Biológico Não Novo",
  "Medicamento Específico",
  "Medicamento Genérico",
  "Medicamentos Liberados ou Isentos de Prescrição Médica (MIP)",
  "Medicamento Fitoterápico",
  "Medicamento Novo",
  "Medicamento Similar",
  "Produtos de Terapia Avançada",
  "Radiofármacos",
  "Outros Medicamentos"
];

const companySizes = [
  { value: "Pequena", description: "Até 99 funcionários" },
  { value: "Média", description: "De 100 a 499 funcionários" },
  { value: "Grande", description: "500 ou mais funcionários" }
];

const brazilianStates = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" }
];

const RespondentSection: React.FC<RespondentSectionProps> = ({ respondentData, updateRespondentData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Classificação do respondente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-medium">
            A- Nos últimos 12 meses, participou de projetos na instituição que trabalha e tem conhecimento das práticas realizadas no planejamento, desenvolvimento e encerramento do projeto?
          </h3>
          <RadioGroup 
            value={respondentData.hasProjectExperience === null 
              ? undefined 
              : respondentData.hasProjectExperience ? "yes" : "no"} 
            onValueChange={(value) => updateRespondentData('hasProjectExperience', value === "yes")}
            className="flex space-x-4"
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="experience-yes" />
              <Label htmlFor="experience-yes">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="experience-no" />
              <Label htmlFor="experience-no">Não</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium">
            B- A instituição onde trabalha é uma indústria farmacêutica?
          </h3>
          <RadioGroup 
            value={respondentData.isPharmaceutical === null 
              ? undefined 
              : respondentData.isPharmaceutical ? "yes" : "no"}
            onValueChange={(value) => updateRespondentData('isPharmaceutical', value === "yes")}
            className="flex space-x-4"
            required
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="pharma-yes" />
              <Label htmlFor="pharma-yes">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="pharma-no" />
              <Label htmlFor="pharma-no">Não</Label>
            </div>
          </RadioGroup>

          {respondentData.isPharmaceutical && (
            <div className="mt-4 pl-4 border-l-2 border-blue-200">
              <h4 className="text-sm font-medium mb-2">
                Qual vertente de produtos se classifica a indústria farmacêutica?
              </h4>
              <Select 
                value={respondentData.pharmaceuticalType || ""} 
                onValueChange={(value) => updateRespondentData('pharmaceuticalType', value)}
                required={respondentData.isPharmaceutical}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o tipo de indústria" />
                </SelectTrigger>
                <SelectContent>
                  {pharmaceuticalTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium">
            C- Qual o porte da indústria que trabalha?
          </h3>
          <Select 
            value={respondentData.companySize || ""} 
            onValueChange={(value) => updateRespondentData('companySize', value)}
            required
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Selecione o porte da empresa" />
            </SelectTrigger>
            <SelectContent>
              {companySizes.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.value} ({size.description})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-medium">
            D- Em qual estado está localizada a indústria?
          </h3>
          <Select 
            value={respondentData.state || ""} 
            onValueChange={(value) => updateRespondentData('state', value)}
            required
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {brazilianStates.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label} ({state.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default RespondentSection;
