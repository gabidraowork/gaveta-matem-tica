import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Gauge
} from 'lucide-react';
import { DrawerModule, DrawerState, DrawerControlConfig } from '../drawers/types';

interface ControlDockProps {
  gaveta: DrawerModule;
  estado: DrawerState;
  onTogglePlay: () => void;
  onStep: (direcao: 1 | -1) => void;
  onReset: () => void;
  onChangeSpeed: (speed: number) => void;
  onChangeParam: (paramId: string, value: any) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  gaveta,
  estado,
  onTogglePlay,
  onStep,
  onReset,
  onChangeSpeed,
  onChangeParam,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const isEnemDrawer = gaveta.id.startsWith('enem-');

  // A gaveta da solução S1/S2 traz os próprios controles dentro do simulador HTML.
  if (gaveta.id === 'enem-solucao-s1-s2') return null;

  return (
    <div className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-20 w-[95vw] max-w-4xl transition-all duration-300 ${
      isEnemDrawer ? 'hidden md:block' : ''
    }`}>
      {/* Botão de Recolher / Expandir a Doca */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-4 py-1 bg-white border border-slate-200 border-b-0 rounded-t-xl text-xs font-semibold text-slate-600 hover:text-slate-900 shadow-xs transition-colors"
          title={isExpanded ? 'Ocultar controles para visão limpa' : 'Exibir controles'}
        >
          {isExpanded ? (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Ocultar Controles</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-600">Mostrar Controles</span>
            </>
          )}
        </button>
      </div>

      {/* Painel Principal da Doca */}
      {isExpanded && (
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-3 sm:p-4 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            
            {/* Bloco 1: Controles Principais de Reprodução */}
            <div className="flex items-center justify-between sm:justify-start gap-2 pb-3 lg:pb-0 lg:pr-4 lg:border-r border-slate-200 shrink-0">
              {/* Reiniciar */}
              <button
                onClick={onReset}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Reiniciar visualização para o estado original"
                aria-label="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Passo Anterior */}
              <button
                onClick={() => onStep(-1)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Passo anterior (-45° ou recuar)"
                aria-label="Passo anterior"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause Principal */}
              <button
                onClick={onTogglePlay}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow-xs ${
                  estado.isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title={estado.isPlaying ? 'Pausar animação' : 'Iniciar rotação/animação'}
              >
                {estado.isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Animar</span>
                  </>
                )}
              </button>

              {/* Próximo Passo */}
              <button
                onClick={() => onStep(1)}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Próximo passo (+45° ou avançar)"
                aria-label="Próximo passo"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Seletor de Velocidade */}
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5 ml-1">
                {[0.5, 1, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => onChangeSpeed(spd)}
                    className={`px-2 py-1 text-[11px] font-mono rounded-md transition-colors ${
                      estado.speed === spd
                        ? 'bg-white text-blue-700 font-bold shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {spd}×
                  </button>
                ))}
              </div>
            </div>

            {/* Bloco 2: Controles Específicos da Questão Selecionada */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 overflow-x-auto">
              {gaveta.controls.map((ctrl: DrawerControlConfig) => {
                const valorAtual = estado.params[ctrl.id] ?? ctrl.defaultValue;

                if (ctrl.type === 'range') {
                  return (
                    <div key={ctrl.id} className="flex flex-col gap-1 min-w-[130px]">
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span className="font-medium truncate" title={ctrl.description}>
                          {ctrl.label}
                        </span>
                        <span className="font-mono font-bold text-blue-700 tabular-nums">
                          {valorAtual}{ctrl.unit || ''}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={ctrl.min ?? 0}
                        max={ctrl.max ?? 100}
                        step={ctrl.step ?? 1}
                        value={valorAtual}
                        onChange={(e) => onChangeParam(ctrl.id, Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      />
                    </div>
                  );
                }

                if (ctrl.type === 'select') {
                  return (
                    <div key={ctrl.id} className="flex flex-col gap-1 min-w-[130px]">
                      <span className="text-[11px] font-medium text-slate-600 truncate" title={ctrl.description}>
                        {ctrl.label}
                      </span>
                      <select
                        value={valorAtual}
                        onChange={(e) => onChangeParam(ctrl.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        {ctrl.options?.map((opt) => (
                          <option key={String(opt.value)} value={String(opt.value)}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (ctrl.type === 'toggle') {
                  return (
                    <div key={ctrl.id} className="flex items-center justify-between gap-2 min-w-[130px] py-1">
                      <span className="text-[11px] font-medium text-slate-600 leading-tight" title={ctrl.description}>
                        {ctrl.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => onChangeParam(ctrl.id, !valorAtual)}
                        className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ${
                          valorAtual ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                        aria-pressed={Boolean(valorAtual)}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                            valorAtual ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                }

                return null;
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
