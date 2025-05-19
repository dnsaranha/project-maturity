
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthFormWrapper from '@/components/Auth/AuthForm';
import { useAuth } from '@/context/AuthProvider';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">
          Autoavaliação de Maturidade em Gerenciamento de Projetos (MMGP)
        </h1>
        <p className="text-gray-600 mb-8">
          Este questionário avalia o nível de maturidade em gerenciamento de projetos da sua organização com base no modelo Prado-MMGP.
          Sua participação é muito importante para nossa pesquisa.
        </p>
      </div>
      
      <Button 
        onClick={() => navigate('/assessment')}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
      >
        Iniciar Avaliação
      </Button>
      
      {!user && (
        <div className="w-full max-w-md mt-10">
          <p className="text-center mb-6">
            Você também pode fazer login para acessar recursos adicionais.
          </p>
          <AuthFormWrapper />
        </div>
      )}
    </div>
  );
};

export default Index;
