import React from 'react';
import { 
  Box, 
  Menu, 
  BookOpen, 
  Maximize, 
  Minimize, 
  ChevronRight,
  Code2
} from 'lucide-react';
import { DrawerModule } from '../drawers/types';

interface HeaderProps {
  gavetaAtiva: DrawerModule;
  onAbrirMenuMobile: () => void;
  onAbrirGuia: (aba?: 'didatico' | 'python' | 'adicionar') => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gavetaAtiva,
  onAbrirMenuMobile,
  onAbrirGuia,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header className="h-14 md:h-16 px-3 sm:px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-3 z-30 shrink-0">
      {/* Zona 1: Marca e Seletor Mobile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onAbrirMenuMobile}
          className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden transition-colors"
          aria-label="Abrir menu de gavetas"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight tracking-tight">
              Gaveta Matemática
            </h1>
            <p className="text-xs text-slate-600 hidden sm:block">
              Visualizações Didáticas para o Professor
            </p>
          </div>
        </div>
      </div>

      {/* Zona 2: Gaveta Ativa e Categoria (Desktop) */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-lg border border-slate-200/60 max-w-md truncate">
        {gavetaAtiva.questionNumber && (
          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-mono font-bold text-[10px] shrink-0">
            Q{gavetaAtiva.questionNumber}
          </span>
        )}
        <span className="text-xs font-medium text-slate-600 uppercase tracking-wider shrink-0">
          Questão Ativa:
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="text-xs font-semibold text-slate-800 truncate">
          {gavetaAtiva.title}
        </span>
      </div>

      {/* Zona 3: Ações do Professor */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Botão de Teste Python */}
        <button
          onClick={() => onAbrirGuia('python')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
          title="Ver funções e executar testes com Python"
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>API Python</span>
        </button>

        {/* Botão do Guia Didático */}
        <button
          onClick={() => onAbrirGuia('didatico')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
          title="Ver enunciado matemático, fórmulas e dicas de aula"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden xs:inline">Guia Didático</span>
          <span className="xs:hidden">Guia</span>
        </button>

        {/* Botão Tela Cheia (Projeção em sala de aula) */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title={isFullscreen ? 'Sair da tela cheia' : 'Modo Apresentação (Tela cheia)'}
          aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        >
          {isFullscreen ? (
            <Minimize className="w-4 h-4" />
          ) : (
            <Maximize className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
