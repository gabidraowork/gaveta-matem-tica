import React, { useState } from 'react';
import { 
  Search, 
  X, 
  Box, 
  FileCode2, 
  Layers, 
  PieChart, 
  GitBranch, 
  PlusCircle, 
  ChevronRight,
  Sparkles,
  Shield,
  Users
} from 'lucide-react';
import { DrawerModule, DrawerCategory } from '../drawers/types';
import { todasAsGavetas, categoriasInfo } from '../drawers';

interface DrawerSidebarProps {
  gavetaAtivaId: string;
  onSelecionarGaveta: (gaveta: DrawerModule) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onAbrirComoAdicionar: () => void;
}

// Mapeamento dinâmico de ícones
const iconMap: Record<string, React.ElementType> = {
  Box,
  FileCode2,
  Layers,
  PieChart,
  GitBranch,
  Shield,
  Users,
};

export const DrawerSidebar: React.FC<DrawerSidebarProps> = ({
  gavetaAtivaId,
  onSelecionarGaveta,
  isOpenMobile,
  onCloseMobile,
  onAbrirComoAdicionar,
}) => {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');

  const gavetasFiltradas = todasAsGavetas.filter((gaveta) => {
    const matchBusca = 
      gaveta.title.toLowerCase().includes(busca.toLowerCase()) ||
      gaveta.description.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoriaFiltro === 'todas' || gaveta.category === categoriaFiltro;
    return matchBusca && matchCategoria;
  });

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Topo da Gaveta: Título e Busca */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              Índice de Gavetas
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-mono text-slate-600">
              {todasAsGavetas.length}
            </span>
          </div>
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 lg:hidden"
              aria-label="Fechar índice"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar questão ou tema..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Filtros por Categoria */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setCategoriaFiltro('todas')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              categoriaFiltro === 'todas'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setCategoriaFiltro('geometria-3d')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              categoriaFiltro === 'geometria-3d'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            3D
          </button>
          <button
            onClick={() => setCategoriaFiltro('template')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              categoriaFiltro === 'template'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Modelos
          </button>
        </div>
      </div>

      {/* Lista Rolável de Gavetas */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {gavetasFiltradas.length === 0 ? (
          <div className="text-center py-10 px-4 text-slate-400 text-xs">
            Nenhuma gaveta encontrada com "{busca}".
          </div>
        ) : (
          gavetasFiltradas.map((gaveta) => {
            const IconComponent = iconMap[gaveta.iconName] || Box;
            const isAtiva = gaveta.id === gavetaAtivaId;
            const catInfo = categoriasInfo[gaveta.category as DrawerCategory];

            return (
              <button
                key={gaveta.id}
                onClick={() => {
                  onSelecionarGaveta(gaveta);
                  if (isOpenMobile) onCloseMobile();
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1.5 relative ${
                  isAtiva
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isAtiva
                          ? 'bg-blue-600 text-white shadow-xs'
                          : gaveta.questionNumber
                          ? 'bg-blue-100 text-blue-800 font-mono font-bold text-xs'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {gaveta.questionNumber ? (
                        <span className="font-mono font-bold text-xs">
                          {gaveta.questionNumber}
                        </span>
                      ) : (
                        <IconComponent className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      {gaveta.questionNumber && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
                          Q{gaveta.questionNumber}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-900 leading-snug truncate">
                        {gaveta.title}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isAtiva ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'
                    }`}
                  />
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 pl-9">
                  {gaveta.description}
                </p>

                <div className="flex items-center gap-1.5 pl-9 pt-1 text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded font-medium border ${catInfo?.cor || 'bg-slate-100 text-slate-600'}`}>
                    {catInfo?.label || gaveta.category}
                  </span>
                  {gaveta.badge && (
                    <span className="text-slate-400">· {gaveta.badge}</span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Rodapé: Botão de Adicionar Nova Questão */}
      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <button
          onClick={() => {
            onAbrirComoAdicionar();
            if (isOpenMobile) onCloseMobile();
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Como Adicionar Nova Questão</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Versão Desktop: Barra Lateral Fixa */}
      <aside className="hidden lg:block w-80 border-r border-slate-200 h-[calc(100vh-4rem)] shrink-0">
        {sidebarContent}
      </aside>

      {/* Versão Mobile: Drawer Deslizante */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Fundo escurecido clicável */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Painel lateral móvel */}
          <div className="relative w-full max-w-xs h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
