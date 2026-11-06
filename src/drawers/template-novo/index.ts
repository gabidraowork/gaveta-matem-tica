/**
 * ============================================================================
 * TEMPLATE DIDÁTICO PARA UMA NOVA GAVETA MATEMÁTICA
 * ============================================================================
 * Olá, professor! Este arquivo é o modelo oficial para criar qualquer nova
 * questão ou visualização interativa.
 * 
 * PASSOS SIMPLES PARA ADICIONAR UMA NOVA GAVETA:
 * 1. Copie esta pasta (`src/drawers/template-novo/`) para uma nova pasta,
 *    por exemplo: `src/drawers/permutacao-letras/`.
 * 2. Renomeie o objeto abaixo (ex: `PermutacaoLetrasDrawer`) e preencha:
 *    - `id`: identificador único (ex: 'combinatoria-permutacao')
 *    - `title`: Título didático da questão
 *    - `mathContext`: Enunciado, fórmulas e dicas para seus alunos
 *    - `controls`: Sliders, botões ou seletores que você quer na doca
 * 3. Escreva a sua lógica de visualização dentro de `mount`:
 *    Você pode usar Canvas 2D (como neste exemplo leve), Three.js para 3D,
 *    ou elementos HTML/SVG interativos!
 * 4. Adicione o seu novo módulo no arquivo `src/drawers/index.ts`.
 * Pronto! A nova gaveta aparecerá automaticamente no menu.
 * ============================================================================
 */

import { DrawerInstance, DrawerModule, DrawerState } from '../types';

export const TemplateNovoDrawer: DrawerModule = {
  // 1. IDENTIFICAÇÃO DA GAVETA
  id: 'template-em-branco',
  title: 'Template Didático (Modelo para Nova Questão)',
  subtitle: 'Estrutura Base para Criação de Novas Visualizações',
  description: 'Módulo modelo em branco com instruções completas para que você adicione suas próprias questões de geometria, combinatória ou probabilidade.',
  category: 'template',
  badge: 'Modelo Base',
  iconName: 'FileCode2',

  // 2. CONTEXTO DIDÁTICO E ENUNCIADO
  mathContext: {
    enunciado: 'Este é o espaço onde você escreverá o enunciado da sua questão de matemática para os alunos.',
    formula: 'f(x) = ... ou C(n, k) = n! / (k!(n-k)!)',
    explicacao: 'Explique aqui aos alunos a intuição geométrica ou o raciocínio por trás do problema apresentado.',
    dicaPedagogica: 'Dica didática para conduzir a aula: incentive os alunos a manipularem os parâmetros antes de apresentar a solução formal.',
    codigoPython: 'calcular_sua_funcao(parametro_1, parametro_2)',
  },

  // 3. CONTROLES PERSONALIZADOS NA DOCA INFERIOR
  controls: [
    {
      id: 'quantidadeElementos',
      label: 'Quantidade de Elementos (n)',
      type: 'range',
      min: 1,
      max: 10,
      step: 1,
      defaultValue: 5,
      description: 'Exemplo de controle deslizante numérico.',
    },
    {
      id: 'corDestaque',
      label: 'Cor dos Elementos',
      type: 'select',
      defaultValue: 'azul',
      options: [
        { label: 'Azul Acadêmico', value: 'azul' },
        { label: 'Verde Esmeralda', value: 'verde' },
        { label: 'Laranja Coral', value: 'laranja' },
      ],
      description: 'Exemplo de seletor de opções.',
    },
    {
      id: 'mostrarLinhas',
      label: 'Exibir Malha de Apoio',
      type: 'toggle',
      defaultValue: true,
      description: 'Exemplo de alternador de ativação.',
    },
  ],

  // 4. CICLO DE VIDA DA VISUALIZAÇÃO
  mount: (container: HTMLElement, initialState: DrawerState): DrawerInstance => {
    // Criação de um elemento Canvas 2D leve e responsivo
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.innerHTML = '';
    container.appendChild(canvas);

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 500;
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    ctx?.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    // Estado interno do módulo
    let currentState = { ...initialState };
    let animationPhase = 0;
    let animationId: number;

    const cores = {
      azul: '#2563eb',
      verde: '#059669',
      laranja: '#ea580c',
    };

    // Função de desenho no Canvas
    function desenhar() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Fundo e grade opcional
      if (currentState.params.mostrarLinhas !== false) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        const step = 30;
        for (let x = 0; x < width; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Desenho demonstrativo dos elementos
      const n = Number(currentState.params.quantidadeElementos || 5);
      const corSelecionada = cores[currentState.params.corDestaque as keyof typeof cores] || cores.azul;
      const raio = Math.min(width, height) * 0.28;
      const centroX = width / 2;
      const centroY = height / 2;

      // Desenha círculo delimitador com pontos matemáticos
      ctx.strokeStyle = '#cbd5e1';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(centroX, centroY, raio, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Desenha os n pontos distribuídos angularmente
      const pontos: { x: number; y: number }[] = [];
      for (let i = 0; i < n; i++) {
        const angulo = (i / n) * Math.PI * 2 + animationPhase;
        const px = centroX + Math.cos(angulo) * raio;
        const py = centroY + Math.sin(angulo) * raio;
        pontos.push({ x: px, y: py });
      }

      // Conexões didáticas entre os nós (grafo combinatório)
      ctx.strokeStyle = `${corSelecionada}33`; // 20% opacidade
      ctx.lineWidth = 1.5;
      for (let i = 0; i < pontos.length; i++) {
        for (let j = i + 1; j < pontos.length; j++) {
          ctx.beginPath();
          ctx.moveTo(pontos[i].x, pontos[i].y);
          ctx.lineTo(pontos[j].x, pontos[j].y);
          ctx.stroke();
        }
      }

      // Desenha os nós e rótulos
      pontos.forEach((p, idx) => {
        // Círculo externo
        ctx.fillStyle = corSelecionada;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
        ctx.fill();

        // Rótulo numérico
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(idx + 1), p.x, p.y);
      });

      // Texto explicativo no centro
      ctx.fillStyle = '#334155';
      ctx.font = '600 15px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Grafo Completo: n = ${n}`, centroX, centroY - 12);

      const arestas = (n * (n - 1)) / 2;
      ctx.fillStyle = '#64748b';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText(`Conexões C(${n}, 2) = ${arestas}`, centroX, centroY + 12);
    }

    // Loop de animação quando em modo Play
    function loop() {
      if (currentState.isPlaying) {
        animationPhase += 0.01 * currentState.speed;
        desenhar();
      }
      animationId = requestAnimationFrame(loop);
    }

    desenhar();
    loop();

    // Retorna a API de controle do módulo
    return {
      update: (newState: DrawerState) => {
        currentState = { ...newState };
        desenhar();
      },

      step: (direction: 1 | -1) => {
        animationPhase += direction * (Math.PI / 8);
        desenhar();
      },

      play: () => {
        currentState.isPlaying = true;
      },

      pause: () => {
        currentState.isPlaying = false;
      },

      reset: () => {
        animationPhase = 0;
        desenhar();
      },

      resize: (newW: number, newH: number) => {
        width = newW;
        height = newH;
        canvas.width = width * (window.devicePixelRatio || 1);
        canvas.height = height * (window.devicePixelRatio || 1);
        ctx?.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        desenhar();
      },

      destroy: () => {
        cancelAnimationFrame(animationId);
        container.innerHTML = '';
      },
    };
  },
};
