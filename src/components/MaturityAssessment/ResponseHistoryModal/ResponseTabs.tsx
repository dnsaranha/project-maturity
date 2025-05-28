
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResponseItem from './ResponseItem';
import { ResponseData } from './types';

interface ResponseTabsProps {
  responses: ResponseData[];
}

const ResponseTabs: React.FC<ResponseTabsProps> = ({ responses }) => {
  const filterResponsesByType = (type: string) => {
    return responses.filter((r) => r.details?.response_type === type);
  };

  const filterResponsesByLevel = (level: number) => {
    return responses.filter((r) => r.level_number === level);
  };

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">Todas</TabsTrigger>
        <TabsTrigger value="respondent">Classificação</TabsTrigger>
        <TabsTrigger value="level2">Nível 2</TabsTrigger>
        <TabsTrigger value="level3">Nível 3</TabsTrigger>
        <TabsTrigger value="level4">Nível 4</TabsTrigger>
        <TabsTrigger value="level5">Nível 5</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="space-y-4">
        {responses.map((response) => (
          <ResponseItem key={response.id} response={response} />
        ))}
      </TabsContent>
      
      <TabsContent value="respondent" className="space-y-4">
        {filterResponsesByType('respondent').map((response) => (
          <ResponseItem key={response.id} response={response} />
        ))}
      </TabsContent>
      
      <TabsContent value="level2" className="space-y-4">
        {filterResponsesByLevel(2).map((response) => (
          <ResponseItem key={response.id} response={response} />
        ))}
      </TabsContent>
      
      <TabsContent value="level3" className="space-y-4">
        {filterResponsesByLevel(3).map((response) => (
          <ResponseItem key={response.id} response={response} />
        ))}
      </TabsContent>
      
      <TabsContent value="level4" className="space-y-4">
        {filterResponsesByLevel(4).map((response) => (
          <ResponseItem key={response.id} response={response} />
        ))}
      </TabsContent>
      
      <TabsContent value="level5" className="space-y-4">
        {filterResponsesByLevel(5).map((response) => (
          <ResponseItem key={response.id} response={response} />
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default ResponseTabs;
