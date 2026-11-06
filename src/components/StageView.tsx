import React, { useEffect, useRef, useState } from 'react';
import { 
  MousePointerClick, 
  Move3d, 
  Plus, 
  Minus, 
  Grid3X3,
  Shield,
  Info,
  RotateCcw,
  X,
  Users
} from 'lucide-react';
import { DrawerModule, DrawerInstance, DrawerState } from '../drawers/types';

interface StageViewProps {
  gaveta: DrawerModule;
  estado: DrawerState;
  onRegistrarInstancia: (instancia: DrawerInstance | null) => void;
  onChangeParam?: (paramId: string, value: any) => void;
}

export const StageView: React.FC<StageViewProps> = ({
  gaveta,
  estado,
  onRegistrarInstancia,
  onChangeParam,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const instanciaRef = useRef<DrawerInstance | null>(null);
  const [mostrarDicaGesto, setMostrarDicaGesto] = useState(true);
  
  // Estado da Pílula de Coordenadas no Topo (Mobile & Desktop)
  const [mostrarDetalhesCoord, setMostrarDetalhesCoord] = useState(false);

  // Montagem e recriação da gaveta ao trocar de módulo
  useEffect(() => {
    if (!mountRef.current) return;

    if (instanciaRef.current) {
      try {
        instanciaRef.current.destroy();
      } catch (err) {
        console.error('Erro ao destruir gaveta anterior:', err);
      }
      instanciaRef.current = null;
    }

    try {
      const instancia = gaveta.mount(mountRef.current, estado);
      instanciaRef.current = instancia;
      onRegistrarInstancia(instancia);
    } catch (err) {
      console.error('Erro ao montar gaveta:', err);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0 && instanciaRef.current?.resize) {
          instanciaRef.current.resize(width, height);
        }
      }
    });

    resizeObserver.observe(mountRef.current);

    return () => {
      resizeObserver.disconnect();
      if (instanciaRef.current) {
        try {
          instanciaRef.current.destroy();
        } catch (err) {
          console.error('Erro no desmonte da gaveta:', err);
        }
        instanciaRef.current = null;
        onRegistrarInstancia(null);
      }
    };
  }, [gaveta.id]);

  // Atualização de parâmetros e estado sem remontar a cena
  useEffect(() => {
    if (instanciaRef.current) {
      instanciaRef.current.update(estado);
    }
  }, [estado]);

  // 1. Identificação do módulo ativo
  const isCuboEnem = gaveta.id === 'enem-cubo-projecoes-3d';
  const isCicloviaEnem = gaveta.id === 'enem-ciclovia-lagoa-policiais';
  const isDiretoriaEnem = gaveta.id === 'enem-diretoria-10-casais';
  // A gaveta J24 desenha a própria fórmula, a barra de vistas e a dica de gestos no palco.
  const isCupulaEnem = gaveta.id === 'enem-cupula-giralongada-j24';
  // A gaveta da solução S1/S2 é um simulador HTML completo, com título e painel próprios.
  const isSolucaoEnem = gaveta.id === 'enem-solucao-s1-s2';

  // --- LÓGICA DO CUBO 3D (ENEM) ---
  const curX = Math.max(1, Math.min(8, Math.round(Number(estado.params.posX ?? 6))));
  const curY = Math.max(1, Math.min(8, Math.round(Number(estado.params.posY ?? 2))));
  const curZ = Math.max(1, Math.min(8, Math.round(Number(estado.params.posZ ?? 7))));

  const alterarEixo = (eixo: 'posX' | 'posY' | 'posZ', delta: number) => {
    if (!onChangeParam) return;
    const valAtual = Math.round(Number(estado.params[eixo] ?? (eixo === 'posX' ? 6 : eixo === 'posY' ? 2 : 7)));
    const novoVal = Math.max(1, Math.min(8, valAtual + delta));
    onChangeParam(eixo, novoVal);
  };

  const irParaInicial = () => {
    if (!onChangeParam) return;
    onChangeParam('posX', 6);
    onChangeParam('posY', 2);
    onChangeParam('posZ', 7);
  };

  const isPosicaoInicial = curX === 6 && curY === 2 && curZ === 7;

  // --- LÓGICA DA CICLOVIA (ENEM) ---
  const curPoliciais = Math.max(1, Math.min(30, Math.round(Number(estado.params.numPoliciais ?? 4))));
  const coberturaTotalM = Math.min(6000, curPoliciais * 400);
  const percentualCobertura = Math.min(100, Math.round((coberturaTotalM / 6000) * 100));
  const esta100Protegida = curPoliciais >= 15;

  const alterarPoliciais = (delta: number) => {
    if (!onChangeParam) return;
    const novo = Math.max(1, Math.min(30, curPoliciais + delta));
    onChangeParam('numPoliciais', novo);
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden math-grid-bg flex items-center justify-center">
      {/* Container onde o Three.js ou Canvas é inserido */}
      <div
        ref={mountRef}
        className="w-full h-full relative canvas-container"
      />

      {/* Dica de Interação Flutuante no Topo (Mouse & Toque) */}
      {gaveta.category === 'geometria-3d' && !isCupulaEnem && mostrarDicaGesto && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full shadow-xs text-[11px] sm:text-xs text-slate-600 animate-in fade-in duration-300">
          <MousePointerClick className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="hidden sm:inline">Arraste para girar · Pinça para zoom</span>
          <span className="sm:hidden">Gire e dê zoom com 2 dedos</span>
          <button
            onClick={() => setMostrarDicaGesto(false)}
            className="ml-1 text-slate-400 hover:text-slate-600 font-bold p-0.5 cursor-pointer"
            title="Fechar aviso"
          >
            ×
          </button>
        </div>
      )}

      {/* Dica para a Ciclovia: Ponto P arrastável */}
      {isCicloviaEnem && mostrarDicaGesto && (
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full shadow-xs text-[11px] sm:text-xs text-slate-600 animate-in fade-in duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-600 shrink-0 inline-block" />
          <span>Arraste o ponto <strong>P</strong> na ciclovia</span>
          <button
            onClick={() => setMostrarDicaGesto(false)}
            className="ml-1 text-slate-400 hover:text-slate-600 font-bold p-0.5 cursor-pointer"
            title="Fechar aviso"
          >
            ×
          </button>
        </div>
      )}

      {/* ZONA SUPERIOR: RÓTULO COMPACTO + PÍLULAS DE TELEMETRIA */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-col gap-2 max-w-[calc(100vw-24px)] sm:max-w-md pointer-events-auto">
        
        {/* Pílula Compacta para o Cubo 3D */}
        {isCuboEnem && (
          <div className="relative">
            <button
              onClick={() => setMostrarDetalhesCoord(!mostrarDetalhesCoord)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-md rounded-full shadow-md border border-slate-700/80 transition-all active:scale-98 cursor-pointer"
              title="Toque para ver ou ocultar detalhes das coordenadas e planos"
              aria-expanded={mostrarDetalhesCoord}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shrink-0" />
              
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-blue-300 font-sans font-bold text-[11px] bg-blue-500/30 px-1 py-0.5 rounded">Q3</span>
                <span className="font-bold text-red-400">X={curX}</span>
                <span className="text-slate-500">·</span>
                <span className="font-bold text-amber-400">Y={curY}</span>
                <span className="text-slate-500">·</span>
                <span className="font-bold text-purple-400">Z={curZ}</span>
              </div>

              <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider shrink-0 ${
                isPosicaoInicial 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {isPosicaoInicial ? 'Inicial' : 'Livre'}
              </span>

              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {mostrarDetalhesCoord && (
              <div className="absolute top-10 left-0 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-xl border border-slate-700/80 space-y-2 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200 z-30">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-sans font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Move3d className="w-3.5 h-3.5 text-blue-400" />
                    Projeções Ortogonais na Malha
                  </span>
                  <button
                    onClick={() => setMostrarDetalhesCoord(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                    title="Fechar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="bg-slate-800/80 px-2 py-2 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-sans">d(zy) = {curX}</span>
                    <span className="text-[9px] text-red-300 block font-sans">Frente</span>
                    <span className="font-bold text-red-400 text-xs tabular-nums">[{curX - 1}, {curX}]</span>
                  </div>
                  <div className="bg-slate-800/80 px-2 py-2 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-sans">d(xz) = {curY}</span>
                    <span className="text-[9px] text-amber-300 block font-sans">Esquerda</span>
                    <span className="font-bold text-amber-400 text-xs tabular-nums">[{curY - 1}, {curY}]</span>
                  </div>
                  <div className="bg-slate-800/80 px-2 py-2 rounded-xl border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block font-sans">d(xy) = {curZ}</span>
                    <span className="text-[9px] text-purple-300 block font-sans">Chão</span>
                    <span className="font-bold text-purple-400 text-xs tabular-nums">[{curZ - 1}, {curZ}]</span>
                  </div>
                </div>

                <p className="font-sans text-[11px] text-slate-300 leading-tight pt-1 border-t border-slate-800/80">
                  O cubo unitário ocupa exatamente a célula cúbica delimitada pelas retas da malha quadriculada.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pílula Compacta para a Ciclovia da Lagoa Circular */}
        {isCicloviaEnem && (
          <div className="relative">
            <button
              onClick={() => setMostrarDetalhesCoord(!mostrarDetalhesCoord)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-md rounded-full shadow-md border border-slate-700/80 transition-all active:scale-98 cursor-pointer"
              title="Toque para ver fórmulas e detalhes do perímetro"
              aria-expanded={mostrarDetalhesCoord}
            >
              <Shield className={`w-3.5 h-3.5 ${esta100Protegida ? 'text-emerald-400' : 'text-amber-400'}`} />
              
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-emerald-300 font-sans font-bold text-[11px] bg-emerald-500/30 px-1 py-0.5 rounded">Q5</span>
                <span className="font-bold text-white">6.000 m</span>
                <span className="text-slate-500">·</span>
                <span className="font-bold text-blue-400">{curPoliciais} Policiais</span>
              </div>

              <span className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider shrink-0 ${
                esta100Protegida
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {esta100Protegida ? '100% Protegida' : `${percentualCobertura}% Coberta`}
              </span>

              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {mostrarDetalhesCoord && (
              <div className="absolute top-10 left-0 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-xl border border-slate-700/80 space-y-2 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200 z-30">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-sans font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    Parâmetros da Ciclovia
                  </span>
                  <button
                    onClick={() => setMostrarDetalhesCoord(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                    title="Fechar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] font-sans">
                  <div className="flex justify-between bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400">Raio da Lagoa:</span>
                    <span className="font-mono font-bold text-slate-200">R = 1 km = 1.000 m</span>
                  </div>
                  <div className="flex justify-between bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400">Perímetro (π ≈ 3):</span>
                    <span className="font-mono font-bold text-blue-300">C = 2 · 3 · 1.000 = 6.000 m</span>
                  </div>
                  <div className="flex justify-between bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400">Arco por Policial:</span>
                    <span className="font-mono font-bold text-emerald-300">200 m + 200 m = 400 m</span>
                  </div>
                </div>

                <p className="font-sans text-[11px] text-slate-300 leading-tight pt-1 border-t border-slate-800/80">
                  Experimente ajustar a quantidade de policiais no controle deslizante até fechar todo o perímetro sem lacunas vermelhas.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pílula Compacta para a Diretoria dos 10 Casais */}
        {isDiretoriaEnem && (
          <div className="relative">
            <button
              onClick={() => setMostrarDetalhesCoord(!mostrarDetalhesCoord)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-md rounded-full shadow-md border border-slate-700/80 transition-all active:scale-98 cursor-pointer"
              title="Toque para ver ou ocultar detalhes do modelo combinatório"
              aria-expanded={mostrarDetalhesCoord}
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-amber-300 font-sans font-bold text-[11px] bg-amber-500/30 px-1 py-0.5 rounded">Q10</span>
                <span className="font-bold text-white">10 Casais</span>
                <span className="text-slate-500">·</span>
                <span className="font-bold text-emerald-400">20 × 18 × 16</span>
              </div>

              <span className="px-1.5 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                5.760 Diretorias
              </span>

              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {mostrarDetalhesCoord && (
              <div className="absolute top-10 left-0 w-72 sm:w-80 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-xl border border-slate-700/80 space-y-2 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200 z-30">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-sans font-bold text-slate-200 text-xs flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Regra da Diretoria (ENEM)
                  </span>
                  <button
                    onClick={() => setMostrarDetalhesCoord(false)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                    title="Fechar"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] font-sans">
                  <div className="flex justify-between bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400">1º Cargo (Presidente):</span>
                    <span className="font-mono font-bold text-blue-300">20 pessoas (10 casais)</span>
                  </div>
                  <div className="flex justify-between bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400">2º Cargo (Secretário):</span>
                    <span className="font-mono font-bold text-emerald-300">18 pessoas (9 casais)</span>
                  </div>
                  <div className="flex justify-between bg-slate-800/80 px-2 py-1.5 rounded-lg border border-slate-700/60">
                    <span className="text-slate-400">3º Cargo (Tesoureiro):</span>
                    <span className="font-mono font-bold text-amber-300">16 pessoas (8 casais)</span>
                  </div>
                </div>

                <p className="font-sans text-[11px] text-slate-300 leading-tight pt-1 border-t border-slate-800/80">
                  Total = 20 × 18 × 16 = 5.760. Se permitisse casais juntos, seriam 20 × 19 × 18 = 6.840 (Alternativa C, distrator).
                </p>
              </div>
            )}
          </div>
        )}

        {/* Módulos Padrão / Template */}
        {!isCuboEnem && !isCicloviaEnem && !isDiretoriaEnem && !isCupulaEnem && !isSolucaoEnem && (
          <div className="px-3 py-1.5 bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-xl shadow-xs">
            <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
              {gaveta.subtitle}
            </p>
            <p className="text-xs text-slate-700 line-clamp-1 font-medium">
              {gaveta.description}
            </p>
          </div>
        )}
      </div>

      {/* DESKTOP ONLY: PAINEL LATERAL FLUTUANTE PARA O CUBO (hidden md:block) */}
      {isCuboEnem && onChangeParam && (
        <div className="hidden md:flex absolute top-4 right-4 z-20 w-64 lg:w-72 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-lg flex-col gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <Grid3X3 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                Mover Cubo na Malha
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              [1 a 8]
            </span>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight">
            Clique nos botões para mover o cubo de quadrado em quadrado na malha:
          </p>

          {/* Controles por Eixo no Desktop */}
          <div className="space-y-1.5 text-xs">
            {/* Eixo X */}
            <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80">
              <span className="font-semibold text-red-600 font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                Eixo X (zy frente):
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alterarEixo('posX', -1)}
                  disabled={curX <= 1}
                  className="w-7 h-7 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 active:scale-95 transition-transform cursor-pointer"
                  title="Aproximar 1 quadrado do plano zy da frente"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-mono font-bold text-slate-900 tabular-nums">
                  {curX}
                </span>
                <button
                  onClick={() => alterarEixo('posX', 1)}
                  disabled={curX >= 8}
                  className="w-7 h-7 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 active:scale-95 transition-transform cursor-pointer"
                  title="Afastar 1 quadrado do plano zy da frente"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Eixo Y */}
            <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80">
              <span className="font-semibold text-amber-600 font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Eixo Y (xz esq):
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alterarEixo('posY', -1)}
                  disabled={curY <= 1}
                  className="w-7 h-7 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 active:scale-95 transition-transform cursor-pointer"
                  title="Aproximar 1 quadrado do plano xz da esquerda"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-mono font-bold text-slate-900 tabular-nums">
                  {curY}
                </span>
                <button
                  onClick={() => alterarEixo('posY', 1)}
                  disabled={curY >= 8}
                  className="w-7 h-7 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 active:scale-95 transition-transform cursor-pointer"
                  title="Afastar 1 quadrado do plano xz da esquerda"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Eixo Z */}
            <div className="flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200/80">
              <span className="font-semibold text-purple-600 font-mono text-[11px] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                Eixo Z (xy chão):
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alterarEixo('posZ', -1)}
                  disabled={curZ <= 1}
                  className="w-7 h-7 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 active:scale-95 transition-transform cursor-pointer"
                  title="Aproximar 1 quadrado do chão xy"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center font-mono font-bold text-slate-900 tabular-nums">
                  {curZ}
                </span>
                <button
                  onClick={() => alterarEixo('posZ', 1)}
                  disabled={curZ >= 8}
                  className="w-7 h-7 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 active:scale-95 transition-transform cursor-pointer"
                  title="Elevar 1 quadrado do chão xy"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Atalho para reiniciar na posição inicial do exercício */}
            <div className="pt-1.5 text-[11px]">
              <button
                onClick={irParaInicial}
                className={`w-full py-2 rounded-xl font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                  isPosicaoInicial
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                }`}
                title="Voltar à coordenada inicial do exercício (6, 2, 7)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Voltar à Posição Inicial (6, 2, 7)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLES SEMPRE VISÍVEIS NO CELULAR PARA O CUBO (SEM GAVETA / SEM TAMPAR A TELA) */}
      {isCuboEnem && onChangeParam && (
        <div className="md:hidden fixed bottom-2 left-2 right-2 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-lg p-2 flex flex-col gap-1.5 animate-in fade-in duration-200">
          
          {/* Linha 1: Os Três Eixos Lado a Lado (X, Y, Z) com botões táteis imediatos */}
          <div className="grid grid-cols-3 gap-1.5">
            {/* Eixo X */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-1.5 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 font-mono leading-none mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>X (zy)</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => alterarEixo('posX', -1)}
                  disabled={curX <= 1}
                  className="w-8 h-8 bg-white hover:bg-slate-100 active:scale-90 disabled:opacity-30 border border-slate-300 rounded-lg flex items-center justify-center text-slate-800 shadow-xs transition-transform cursor-pointer"
                  aria-label="Diminuir X"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                  {curX}
                </span>
                <button
                  onClick={() => alterarEixo('posX', 1)}
                  disabled={curX >= 8}
                  className="w-8 h-8 bg-white hover:bg-slate-100 active:scale-90 disabled:opacity-30 border border-slate-300 rounded-lg flex items-center justify-center text-slate-800 shadow-xs transition-transform cursor-pointer"
                  aria-label="Aumentar X"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Eixo Y */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-1.5 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 font-mono leading-none mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Y (xz)</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => alterarEixo('posY', -1)}
                  disabled={curY <= 1}
                  className="w-8 h-8 bg-white hover:bg-slate-100 active:scale-90 disabled:opacity-30 border border-slate-300 rounded-lg flex items-center justify-center text-slate-800 shadow-xs transition-transform cursor-pointer"
                  aria-label="Diminuir Y"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                  {curY}
                </span>
                <button
                  onClick={() => alterarEixo('posY', 1)}
                  disabled={curY >= 8}
                  className="w-8 h-8 bg-white hover:bg-slate-100 active:scale-90 disabled:opacity-30 border border-slate-300 rounded-lg flex items-center justify-center text-slate-800 shadow-xs transition-transform cursor-pointer"
                  aria-label="Aumentar Y"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Eixo Z */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-1.5 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] font-bold text-purple-600 font-mono leading-none mb-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Z (xy)</span>
              </div>
              <div className="flex items-center justify-between w-full">
                <button
                  onClick={() => alterarEixo('posZ', -1)}
                  disabled={curZ <= 1}
                  className="w-8 h-8 bg-white hover:bg-slate-100 active:scale-90 disabled:opacity-30 border border-slate-300 rounded-lg flex items-center justify-center text-slate-800 shadow-xs transition-transform cursor-pointer"
                  aria-label="Diminuir Z"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                  {curZ}
                </span>
                <button
                  onClick={() => alterarEixo('posZ', 1)}
                  disabled={curZ >= 8}
                  className="w-8 h-8 bg-white hover:bg-slate-100 active:scale-90 disabled:opacity-30 border border-slate-300 rounded-lg flex items-center justify-center text-slate-800 shadow-xs transition-transform cursor-pointer"
                  aria-label="Aumentar Z"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Linha 2: Atalho para reiniciar na posição inicial */}
          <div>
            <button
              onClick={irParaInicial}
              className={`w-full py-1.5 px-2 rounded-xl font-bold text-[11px] border flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                isPosicaoInicial
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
              }`}
              title="Voltar à posição inicial do exercício (6, 2, 7)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Voltar à Posição Inicial (6, 2, 7)</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTROLES SEMPRE VISÍVEIS NO CELULAR PARA A CICLOVIA (SEM GAVETA / SEM TAMPAR A TELA) */}
      {isCicloviaEnem && onChangeParam && (
        <div className="md:hidden fixed bottom-2 left-2 right-2 z-30 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-lg p-2.5 flex flex-col gap-1.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Quantidade de Policiais:
              </span>
              <span className="text-[10px] text-slate-500 font-sans">
                Alcance de 400 m por policial
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alterarPoliciais(-1)}
                disabled={curPoliciais <= 1}
                className="w-9 h-9 bg-white hover:bg-slate-100 active:scale-90 disabled:opacity-30 border border-slate-300 rounded-xl flex items-center justify-center text-slate-800 shadow-xs transition-transform cursor-pointer"
                aria-label="Diminuir policiais"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-mono font-bold text-base text-slate-900 tabular-nums">
                {curPoliciais}
              </span>
              <button
                onClick={() => alterarPoliciais(1)}
                disabled={curPoliciais >= 30}
                className="w-9 h-9 bg-white hover:bg-slate-100 active:scale-90 disabled:opacity-30 border border-slate-300 rounded-xl flex items-center justify-center text-slate-800 shadow-xs transition-transform cursor-pointer"
                aria-label="Aumentar policiais"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slider contínuo de 1 a 30 */}
          <div className="flex items-center gap-2 px-1 pt-0.5">
            <span className="text-[10px] font-mono text-slate-400">1</span>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={curPoliciais}
              onChange={(e) => onChangeParam('numPoliciais', Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-slate-400">30</span>
          </div>
        </div>
      )}
    </div>
  );
};
