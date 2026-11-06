/**
 * GAVETA DIDÁTICA: Questão ENEM - Ciclovia da Lagoa Circular & Alocação de Policiais
 * 
 * MODELO MATEMÁTICO:
 * - Raio da lagoa: R = 1 km = 1.000 m
 * - Aproximação de pi: pi = 3
 * - Comprimento total da ciclovia: C = 2 * pi * R = 2 * 3 * 1.000 = 6.000 m
 * - Cobertura por policial: até 200 m para a esquerda e 200 m para a direita -> Arco de 400 m
 * - Quantidade mínima para cobertura total: 6.000 / 400 = 15 policiais
 * 
 * PRINCÍPIO PEDAGÓGICO:
 * O aplicativo NÃO entrega a resposta pronta. Ele inicia com valor neutro (ex: 4 policiais)
 * exibindo as frestas desprotegidas em vermelho. O estudante desliza o controle ou arrasta
 * o ponto P na ciclovia para constatar experimentalmente e deduzir a quantidade necessária.
 */

import { DrawerInstance, DrawerModule, DrawerState } from '../types';

export const QuestaoEnemCicloviaDrawer: DrawerModule = {
  id: 'enem-ciclovia-lagoa-policiais',
  questionNumber: 5,
  title: 'Questão 5 · Ciclovia da Lagoa Circular',
  subtitle: 'Geometria Plana · Perímetro do Círculo & Cobertura de Policiais',
  description: 'Simulação interativa da lagoa de raio 1 km com arcos de proteção de 200 m por policial e ponto P arrastável ao longo da ciclovia de 6.000 m.',
  category: 'diagramas',
  badge: 'ENEM · Questão 5',
  iconName: 'Shield',

  mathContext: {
    enunciado: 'No entorno de uma lagoa circular, cujo raio mede 1 km, há uma ciclovia. Devido aos frequentes roubos de bicicleta, a prefeitura planeja alocar policiais em posições estratégicas para patrulhar essa ciclovia, de forma a torná-la totalmente protegida. Um ponto da ciclovia é considerado protegido se houver pelo menos um policial a, no máximo, 200 m de distância daquele ponto, posicionado sobre a ciclovia. A figura ilustra um ponto P sobre a ciclovia, que estará protegido se houver pelo menos um policial posicionado sobre a região de cor cinza escuro. Desconsidere a largura da pista da ciclovia e utilize 3 como aproximação para π. Nessas condições, a quantidade mínima necessária de policiais a serem alocados ao longo dessa ciclovia para torná-la protegida é:\nA) 4   B) 8   C) 15   D) 30   E) 60',
    formula: 'C = 2 · π · R = 2 · 3 · 1.000 = 6.000 m  ·  Arco por Policial = 200 + 200 = 400 m',
    explicacao: '1. Comprimento da ciclovia: C = 2 · π · R. Com R = 1.000 m e π ≈ 3, temos C = 6.000 m.\n2. Alcance de 1 policial: protege qualquer ponto a até 200 m dele. Logo, protege 200 m para frente e 200 m para trás, totalizando um arco contínuo de 400 m.\n3. Quantidade mínima: Para cobrir todos os 6.000 m sem deixar nenhum ponto desprotegido, dividimos o perímetro total pelo arco de cobertura: N = 6.000 / 400 = 15 policiais.',
    dicaPedagogica: 'Peça aos alunos para arrastarem o ponto P para uma zona vermelha desprotegida e observarem a distância até o policial mais próximo. Em seguida, aumentem a quantidade de policiais até que o anel se feche completamente sem brechas.',
    codigoPython: 'calcular_cobertura_ciclovia(raio_km=1.0, pi_aprox=3.0, alcance_m=200, num_policiais=15)',
  },

  controls: [
    {
      id: 'numPoliciais',
      label: 'Quantidade de Policiais',
      type: 'range',
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 4, // Valor neutro para descoberta
      unit: ' policiais',
      description: 'Quantidade de policiais alocados na ciclovia de 6.000 metros.',
    },
    {
      id: 'posicaoP',
      label: 'Posição do Ponto P',
      type: 'range',
      min: 0,
      max: 6000,
      step: 50,
      defaultValue: 1000,
      unit: ' m',
      description: 'Posição do ponto P ao longo da ciclovia (arraste também na tela).',
    },
    {
      id: 'mostrarCotas200m',
      label: 'Destacar Arcos e Cotas de 200m',
      type: 'toggle',
      defaultValue: true,
      description: 'Exibe as marcações de 200m para cada lado e as lacunas desprotegidas.',
    },
  ],

  mount: (container: HTMLElement, initialState: DrawerState): DrawerInstance => {
    container.innerHTML = '';

    const canvas = document.createElement('canvas');
    canvas.className = 'w-full h-full block cursor-grab active:cursor-grabbing select-none';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;

    // Estado local da simulação
    let numPoliciais = Math.max(1, Math.min(30, Math.round(Number(initialState.params.numPoliciais ?? 4))));
    let posicaoP = Number(initialState.params.posicaoP ?? 1000); // 0 a 6000 m
    let mostrarCotas = initialState.params.mostrarCotas200m !== false;
    let isPlaying = Boolean(initialState.isPlaying);
    let speed = initialState.speed || 1;

    const COMPRIMENTO_TOTAL = 6000; // 2 * 3 * 1000 m
    const ALCANCE_POLICIAL = 200; // 200 m para cada lado
    const ARCO_POR_POLICIAL = 400; // 400 m no total

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 600;

    let isDraggingP = false;
    let animFrameId = 0;

    function resizeCanvas(w: number, h: number) {
      width = w;
      height = h;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }

    resizeCanvas(width, height);

    // Converte metros ao longo da ciclovia (0 a 6000) em ângulo em radianos (-PI a PI)
    // No desenho da questão do ENEM, o ponto P está no quadrante superior-direito (-PI/4)
    function metrosParaAngulo(m: number): number {
      const fracao = (m % COMPRIMENTO_TOTAL) / COMPRIMENTO_TOTAL;
      // 0m começa no topo (-PI / 2) e gira no sentido horário
      return -Math.PI / 2 + fracao * (2 * Math.PI);
    }

    // Converte ângulo em radianos para metros ao longo da ciclovia
    function anguloParaMetros(rad: number): number {
      let offset = rad - (-Math.PI / 2);
      while (offset < 0) offset += 2 * Math.PI;
      offset = offset % (2 * Math.PI);
      return (offset / (2 * Math.PI)) * COMPRIMENTO_TOTAL;
    }

    // Calcula a distância circular até o policial mais próximo
    function calcularDistanciaMaisProxima(mP: number, nPol: number) {
      const distEntre = COMPRIMENTO_TOTAL / nPol;
      let menorDist = COMPRIMENTO_TOTAL;
      let policialMaisProximoIdx = 0;

      for (let i = 0; i < nPol; i++) {
        const posPol = i * distEntre;
        const diff = Math.abs(mP - posPol);
        const distCirc = Math.min(diff, COMPRIMENTO_TOTAL - diff);
        if (distCirc < menorDist) {
          menorDist = distCirc;
          policialMaisProximoIdx = i;
        }
      }

      return {
        distancia: menorDist,
        policialIdx: policialMaisProximoIdx,
        protegido: menorDist <= ALCANCE_POLICIAL,
      };
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      // Leve deslocamento vertical no mobile para dar respiro aos controles inferiores
      const isMobile = width < 768;
      const cy = isMobile ? height * 0.44 : height * 0.48;

      // Raio visual da lagoa e ciclovia ajustado para a tela
      const tamanhoMin = Math.min(width, height);
      const raioLagoa = Math.max(80, Math.min(240, tamanhoMin * (isMobile ? 0.32 : 0.36)));
      const larguraCiclovia = Math.max(22, Math.min(38, raioLagoa * 0.18));
      const raioCicloviaMeio = raioLagoa + larguraCiclovia / 2;
      const raioCicloviaExterno = raioLagoa + larguraCiclovia;

      // 1. FUNDO SUAVE DO QUADRÍCULO DIDÁTICO
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      const gridGap = 32;
      for (let x = 0; x < width; x += gridGap) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridGap) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. CICLOVIA (PISTA EXTERNA BRANCA COM BORDAS DEFINIDAS)
      ctx.beginPath();
      ctx.arc(cx, cy, raioCicloviaExterno, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 3. LAGOA CIRCULAR AZUL CENTRAL (FIEL À IMAGEM DO ENEM)
      const gradienteAgua = ctx.createRadialGradient(cx - raioLagoa * 0.3, cy - raioLagoa * 0.3, 10, cx, cy, raioLagoa);
      gradienteAgua.addColorStop(0, '#38bdf8'); // Azul piscina claro
      gradienteAgua.addColorStop(0.7, '#0ea5e9');
      gradienteAgua.addColorStop(1, '#0284c7'); // Azul mais profundo na margem

      ctx.beginPath();
      ctx.arc(cx, cy, raioLagoa, 0, 2 * Math.PI);
      ctx.fillStyle = gradienteAgua;
      ctx.fill();
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rótulo da Lagoa no Centro
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(12, Math.round(raioLagoa * 0.12))}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Lagoa Circular', cx, cy - 10);
      
      ctx.font = `500 ${Math.max(10, Math.round(raioLagoa * 0.09))}px "JetBrains Mono", monospace`;
      ctx.fillStyle = '#e0f2fe';
      ctx.fillText('Raio R = 1 km = 1.000 m', cx, cy + 12);

      // Linha tracejada do Raio
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + raioLagoa * Math.cos(Math.PI / 6), cy + raioLagoa * Math.sin(Math.PI / 6));
      ctx.stroke();
      ctx.restore();

      // 4. ARCOS DE PROTEÇÃO DOS POLICIAIS (200m PARA CADA LADO)
      // Em radianos, 200m equivalem a: (200 / 6000) * 2 * PI = (1 / 30) * 2 * PI = 2*PI / 30 rad
      const anguloAlcanceRad = (ALCANCE_POLICIAL / COMPRIMENTO_TOTAL) * 2 * Math.PI;
      const distEntrePoliciaisM = COMPRIMENTO_TOTAL / numPoliciais;
      const anguloEntrePoliciaisRad = (distEntrePoliciaisM / COMPRIMENTO_TOTAL) * 2 * Math.PI;

      // Desenhar zonas de proteção em cinza escuro (como na prova do ENEM!)
      for (let i = 0; i < numPoliciais; i++) {
        const anguloPolicial = metrosParaAngulo(i * distEntrePoliciaisM);
        const anguloInicio = anguloPolicial - anguloAlcanceRad;
        const anguloFim = anguloPolicial + anguloAlcanceRad;

        // Setor anular cinza escuro
        ctx.beginPath();
        ctx.arc(cx, cy, raioCicloviaExterno, anguloInicio, anguloFim, false);
        ctx.arc(cx, cy, raioLagoa, anguloFim, anguloInicio, true);
        ctx.closePath();
        
        ctx.fillStyle = '#475569'; // Cinza escuro fidedigno à prova
        ctx.fill();
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 5. MARCAÇÃO DE BRECHAS DESPROTEGIDAS (QUANDO N < 15)
      const temLacuna = distEntrePoliciaisM > ARCO_POR_POLICIAL;
      if (temLacuna && mostrarCotas) {
        const larguraLacunaM = distEntrePoliciaisM - ARCO_POR_POLICIAL;
        const anguloLacunaRad =
          (larguraLacunaM / COMPRIMENTO_TOTAL) * 2 * Math.PI;

        for (let i = 0; i < numPoliciais; i++) {
          const anguloInicioLacuna = metrosParaAngulo(
            i * distEntrePoliciaisM + ALCANCE_POLICIAL,
          );
          const anguloFimLacuna = anguloInicioLacuna + anguloLacunaRad;

          ctx.beginPath();
          ctx.arc(
            cx,
            cy,
            raioCicloviaExterno,
            anguloInicioLacuna,
            anguloFimLacuna,
            false,
          );
          ctx.arc(
            cx,
            cy,
            raioLagoa,
            anguloFimLacuna,
            anguloInicioLacuna,
            true,
          );
          ctx.closePath();

          ctx.fillStyle = 'rgba(239, 68, 68, 0.25)'; // Vermelho alerta translúcido
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      // 6. DESENHO DOS POLICIAIS NA PISTA
      for (let i = 0; i < numPoliciais; i++) {
        const anguloPolicial = metrosParaAngulo(i * distEntrePoliciaisM);
        const px = cx + raioCicloviaMeio * Math.cos(anguloPolicial);
        const py = cy + raioCicloviaMeio * Math.sin(anguloPolicial);

        // Ícone / Ponto do Policial
        ctx.beginPath();
        ctx.arc(px, py, 6.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#1e293b'; // Escudo escuro
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ponto de luz interno azul
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
      }

      // 7. COTAS DE 200m COM SETAS (FIEL AO DIAGRAMA DO ENEM)
      if (mostrarCotas) {
        // Exibir cota de 200m e 200m no primeiro policial (topo/direita)
        const angPol0 = metrosParaAngulo(0);
        const angInicio0 = angPol0 - anguloAlcanceRad;
        const angFim0 = angPol0 + anguloAlcanceRad;

        const raioCota = raioCicloviaExterno + 14;

        // Arco de cota para trás (-200m)
        ctx.beginPath();
        ctx.arc(cx, cy, raioCota, angInicio0, angPol0);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Arco de cota para frente (+200m)
        ctx.beginPath();
        ctx.arc(cx, cy, raioCota, angPol0, angFim0);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Rótulo "200 m"
        const angMeio1 = (angInicio0 + angPol0) / 2;
        const rtx1 = cx + (raioCota + 14) * Math.cos(angMeio1);
        const rty1 = cy + (raioCota + 14) * Math.sin(angMeio1);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('200 m', rtx1, rty1);

        const angMeio2 = (angPol0 + angFim0) / 2;
        const rtx2 = cx + (raioCota + 14) * Math.cos(angMeio2);
        const rty2 = cy + (raioCota + 14) * Math.sin(angMeio2);
        ctx.fillText('200 m', rtx2, rty2);
      }

      // 8. O PONTO P ARRASTÁVEL INTERATIVO (AMARELO COM LETRA 'P' FIEL AO ENEM)
      const anguloP = metrosParaAngulo(posicaoP);
      const pxP = cx + raioCicloviaMeio * Math.cos(anguloP);
      const pyP = cy + raioCicloviaMeio * Math.sin(anguloP);

      const statusP = calcularDistanciaMaisProxima(posicaoP, numPoliciais);

      // Círculo de pulso em torno do Ponto P se estiver selecionado/arrastando
      ctx.beginPath();
      ctx.arc(pxP, pyP, 14, 0, 2 * Math.PI);
      ctx.fillStyle = statusP.protegido ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';
      ctx.fill();

      // Círculo amarelo do ponto P
      ctx.beginPath();
      ctx.arc(pxP, pyP, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#eab308'; // Amarelo do ENEM
      ctx.fill();
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Letra 'P' estilizada
      const anguloTextoP = anguloP - 0.12;
      const txP = cx + (raioLagoa - 16) * Math.cos(anguloTextoP);
      const tyP = cy + (raioLagoa - 16) * Math.sin(anguloTextoP);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P', txP, tyP);

      // 9. LINHA GUIA DE DISTÂNCIA DO PONTO P AO POLICIAL MAIS PRÓXIMO
      const anguloPolMaisProximo = metrosParaAngulo(statusP.policialIdx * distEntrePoliciaisM);
      const pxPol = cx + raioCicloviaMeio * Math.cos(anguloPolMaisProximo);
      const pyPol = cy + raioCicloviaMeio * Math.sin(anguloPolMaisProximo);

      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pxP, pyP);
      ctx.lineTo(pxPol, pyPol);
      ctx.strokeStyle = statusP.protegido ? '#16a34a' : '#dc2626';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // 10. PLACA DIDÁTICA DO PONTO P (STATUS DINÂMICO)
      const textoStatus = statusP.protegido 
        ? `✓ Ponto P Protegido (${Math.round(statusP.distancia)} m ≤ 200 m)`
        : `✕ Ponto P Desprotegido (${Math.round(statusP.distancia)} m > 200 m)`;

      const tagLargura = 230;
      const tagAltura = 34;
      const tagX = Math.max(10, Math.min(width - tagLargura - 10, pxP - tagLargura / 2));
      const tagY = pyP > cy ? pyP + 18 : pyP - tagAltura - 18;

      ctx.beginPath();
      ctx.roundRect(tagX, tagY, tagLargura, tagAltura, 10);
      ctx.fillStyle = statusP.protegido ? 'rgba(22, 101, 52, 0.95)' : 'rgba(153, 27, 27, 0.95)';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(textoStatus, tagX + tagLargura / 2, tagY + tagAltura / 2);
    }

    // Interação tátil e de mouse: arrastar o ponto P ao longo da ciclovia
    function calcularMetrosDoPonteiro(clientX: number, clientY: number): number {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const cx = width / 2;
      const isMobile = width < 768;
      const cy = isMobile ? height * 0.44 : height * 0.48;

      const ang = Math.atan2(y - cy, x - cx);
      return Math.round(anguloParaMetros(ang));
    }

    function onPointerDown(e: PointerEvent) {
      isDraggingP = true;
      posicaoP = calcularMetrosDoPonteiro(e.clientX, e.clientY);
      render();
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDraggingP) return;
      posicaoP = calcularMetrosDoPonteiro(e.clientX, e.clientY);
      render();
    }

    function onPointerUp() {
      isDraggingP = false;
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Loop de animação se o play estiver ativo (patrulha girando suavemente)
    function animLoop() {
      if (isPlaying) {
        posicaoP = (posicaoP + 8 * speed) % COMPRIMENTO_TOTAL;
        render();
      }
      animFrameId = requestAnimationFrame(animLoop);
    }

    animLoop();
    render();

    return {
      update: (newState: DrawerState) => {
        if (newState.params.numPoliciais !== undefined) {
          numPoliciais = Math.max(1, Math.min(30, Math.round(Number(newState.params.numPoliciais))));
        }
        if (newState.params.posicaoP !== undefined && !isDraggingP) {
          posicaoP = Number(newState.params.posicaoP);
        }
        if (newState.params.mostrarCotas200m !== undefined) {
          mostrarCotas = Boolean(newState.params.mostrarCotas200m);
        }
        isPlaying = Boolean(newState.isPlaying);
        speed = newState.speed || 1;
        render();
      },

      step: (direction: 1 | -1) => {
        posicaoP = (posicaoP + direction * 200 + COMPRIMENTO_TOTAL) % COMPRIMENTO_TOTAL;
        render();
      },

      play: () => {
        isPlaying = true;
      },

      pause: () => {
        isPlaying = false;
      },

      reset: () => {
        posicaoP = 1000;
        numPoliciais = 4; // Reseta para valor neutro de exploração
        render();
      },

      resize: (w: number, h: number) => {
        resizeCanvas(w, h);
        render();
      },

      destroy: () => {
        cancelAnimationFrame(animFrameId);
        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      },
    };
  },
};
