import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './Header';
import { DrawerSidebar } from './DrawerSidebar';
import { StageView } from './StageView';
import { ControlDock } from './ControlDock';
import { ProfessorGuideModal } from './ProfessorGuideModal';
import { gavetaPadrao, todasAsGavetas } from '../drawers';
import { DrawerModule, DrawerInstance, DrawerState } from '../drawers/types';

export default function App() {
  const [gavetaAtiva, setGavetaAtiva] = useState<DrawerModule>(gavetaPadrao);
  const [instancia, setInstancia] = useState<DrawerInstance | null>(null);

  // Inicializa os parâmetros com os valores padrão dos controles da gaveta
  const extrairParamsPadrao = (gaveta: DrawerModule) => {
    const params: Record<string, any> = {};
    gaveta.controls.forEach((ctrl) => {
      params[ctrl.id] = ctrl.defaultValue;
    });
    return params;
  };

  const [estado, setEstado] = useState<DrawerState>(() => ({
    isPlaying: false,
    step: 0,
    speed: 1,
    params: extrairParamsPadrao(gavetaPadrao),
  }));

  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isGuiaOpen, setIsGuiaOpen] = useState(false);
  const [abaGuia, setAbaGuia] = useState<'didatico' | 'python' | 'adicionar'>('didatico');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Troca de gaveta ativa
  const handleSelecionarGaveta = useCallback((novaGaveta: DrawerModule) => {
    setGavetaAtiva(novaGaveta);
    setEstado({
      isPlaying: false,
      step: 0,
      speed: 1,
      params: extrairParamsPadrao(novaGaveta),
    });
  }, []);

  // Controles de Reprodução
  const handleTogglePlay = useCallback(() => {
    setEstado((prev) => {
      const proximoPlay = !prev.isPlaying;
      if (instancia) {
        if (proximoPlay && instancia.play) instancia.play();
        if (!proximoPlay && instancia.pause) instancia.pause();
      }
      return { ...prev, isPlaying: proximoPlay };
    });
  }, [instancia]);

  const handleStep = useCallback((direcao: 1 | -1) => {
    if (instancia?.step) {
      instancia.step(direcao);
    }
    setEstado((prev) => {
      const novosParams = { ...prev.params };
      if ('faseMovimento' in novosParams) {
        const atual = Number(novosParams.faseMovimento ?? 0);
        novosParams.faseMovimento = Math.max(0, Math.min(3, Math.round(atual) + direcao));
      }
      return {
        ...prev,
        step: prev.step + direcao,
        params: novosParams,
      };
    });
  }, [instancia]);

  const handleReset = useCallback(() => {
    if (instancia?.reset) {
      instancia.reset();
    }
    setEstado({
      isPlaying: false,
      step: 0,
      speed: 1,
      params: extrairParamsPadrao(gavetaAtiva),
    });
  }, [instancia, gavetaAtiva]);

  const handleChangeSpeed = useCallback((speed: number) => {
    setEstado((prev) => ({ ...prev, speed }));
  }, []);

  const handleChangeParam = useCallback((paramId: string, value: any) => {
    setEstado((prev) => ({
      ...prev,
      params: {
        ...prev.params,
        [paramId]: value,
      },
    }));
  }, []);

  // Alternar tela cheia para apresentações em projetor / sala de aula
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleAbrirGuia = (aba: 'didatico' | 'python' | 'adicionar' = 'didatico') => {
    setAbaGuia(aba);
    setIsGuiaOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden text-slate-800">
      {/* 1. Barra Superior Principal */}
      <Header
        gavetaAtiva={gavetaAtiva}
        onAbrirMenuMobile={() => setIsOpenMobile(true)}
        onAbrirGuia={handleAbrirGuia}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* 2. Área Central de Trabalho: Índice Lateral + Palco */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Menu Lateral de Gavetas */}
        <DrawerSidebar
          gavetaAtivaId={gavetaAtiva.id}
          onSelecionarGaveta={handleSelecionarGaveta}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          onAbrirComoAdicionar={() => handleAbrirGuia('adicionar')}
        />

        {/* Palco Reutilizável de Renderização */}
        <main className="flex-1 flex flex-col relative overflow-hidden">
          <StageView
            gaveta={gavetaAtiva}
            estado={estado}
            onRegistrarInstancia={setInstancia}
            onChangeParam={handleChangeParam}
          />

          {/* Doca Inferior com Controles de Reprodução e Sliders */}
          <ControlDock
            gaveta={gavetaAtiva}
            estado={estado}
            onTogglePlay={handleTogglePlay}
            onStep={handleStep}
            onReset={handleReset}
            onChangeSpeed={handleChangeSpeed}
            onChangeParam={handleChangeParam}
          />
        </main>
      </div>

      {/* 3. Modal Didática de Apoio ao Professor */}
      <ProfessorGuideModal
        gaveta={gavetaAtiva}
        isOpen={isGuiaOpen}
        onClose={() => setIsGuiaOpen(false)}
        abaInicial={abaGuia}
      />
    </div>
  );
}
