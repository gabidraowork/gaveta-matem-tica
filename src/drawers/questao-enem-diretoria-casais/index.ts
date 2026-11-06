/**
 * GAVETA DIDÁTICA: Questão 10 - Diretoria dos 10 Casais (Grupo de Dança)
 * 
 * MODELO MATEMÁTICO:
 * - População total: 10 casais = 20 pessoas.
 * - Cargos distintos na diretoria: Presidente, Secretário, Tesoureiro (a ordem/atribuição importa).
 * - Restrição fundamental: "no máximo uma pessoa por casal poderá ocupar um cargo nessa diretoria".
 * 
 * PRINCÍPIO FUNDAMENTAL DA CONTAGEM:
 * 1. Escolha do Presidente: 20 pessoas possíveis (10 casais disponíveis).
 *    Ao eleger uma pessoa, seu cônjuge fica INABILITADO para os demais cargos.
 * 2. Escolha do Secretário: 18 pessoas possíveis (9 casais restantes).
 *    Ao eleger essa pessoa, seu cônjuge também fica inabilitado.
 * 3. Escolha do Tesoureiro: 16 pessoas possíveis (8 casais restantes).
 * 
 * Total de diretorias possíveis: 20 × 18 × 16 = 5.760
 * Resposta correta: Alternativa (B) 20×18×16
 */

import { DrawerInstance, DrawerModule, DrawerState } from '../types';

interface Pessoa {
  id: string;
  casalId: number;
  letra: 'A' | 'B';
  nome: string;
  genero: 'M' | 'F';
  corCasal: string;
}

const NOMES_CASAIS: Array<{ id: number; nomeA: string; nomeB: string; cor: string }> = [
  { id: 1, nomeA: 'Lucas', nomeB: 'Bia', cor: '#3b82f6' },      // Blue
  { id: 2, nomeA: 'Gabriel', nomeB: 'Sofia', cor: '#8b5cf6' },  // Violet
  { id: 3, nomeA: 'Mateus', nomeB: 'Clara', cor: '#ec4899' },   // Pink
  { id: 4, nomeA: 'Rodrigo', nomeB: 'Lara', cor: '#f97316' },   // Orange
  { id: 5, nomeA: 'Felipe', nomeB: 'Camila', cor: '#eab308' },  // Yellow
  { id: 6, nomeA: 'Thiago', nomeB: 'Mariana', cor: '#10b981' }, // Emerald
  { id: 7, nomeA: 'Rafael', nomeB: 'Júlia', cor: '#06b6d4' },   // Cyan
  { id: 8, nomeA: 'Bruno', nomeB: 'Helena', cor: '#6366f1' },   // Indigo
  { id: 9, nomeA: 'André', nomeB: 'Alice', cor: '#d946ef' },    // Fuchsia
  { id: 10, nomeA: 'Daniel', nomeB: 'Laura', cor: '#14b8a6' },  // Teal
];

const TODAS_AS_PESSOAS: Pessoa[] = [];
NOMES_CASAIS.forEach((c) => {
  TODAS_AS_PESSOAS.push({
    id: `C${c.id}A`,
    casalId: c.id,
    letra: 'A',
    nome: c.nomeA,
    genero: 'M',
    corCasal: c.cor,
  });
  TODAS_AS_PESSOAS.push({
    id: `C${c.id}B`,
    casalId: c.id,
    letra: 'B',
    nome: c.nomeB,
    genero: 'F',
    corCasal: c.cor,
  });
});

export const QuestaoEnemDiretoriaCasaisDrawer: DrawerModule = {
  id: 'enem-diretoria-10-casais',
  questionNumber: 10,
  title: 'Questão 10 · Diretoria dos 10 Casais',
  subtitle: 'Análise Combinatória · Princípio Fundamental da Contagem & Restrição',
  description: 'Simulação interativa da escolha de Presidente, Secretário e Tesoureiro entre 10 casais com bloqueio instantâneo do cônjuge e comparação com os distratores da prova.',
  category: 'combinatoria',
  badge: 'ENEM · Questão 10',
  iconName: 'Users',

  mathContext: {
    enunciado: 'Dez casais fundaram um grupo de dança e decidiram constituir uma diretoria com três cargos: presidente, secretário e tesoureiro. Para maior representatividade, decidiu-se que no máximo uma pessoa por casal poderá ocupar um cargo nessa diretoria.\nQuantas diretorias diferentes podem ser constituídas por esses 10 casais?\n(A) 10×9×8\n(B) 20×18×16\n(C) 20×19×18\n(D) 10×9×8×2\n(E) 20×18×16×2',
    formula: '20 × 18 × 16 = 5.760  ·  C(10, 3) × 2³ × 3! = 120 × 8 × 6 = 5.760',
    explicacao: '1. Total de membros: 10 casais × 2 pessoas = 20 pessoas.\n2. Escolha do Presidente: Qualquer uma das 20 pessoas pode ser eleita (20 opções). Escolhida a pessoa, seu casal já tem 1 representante; logo, o cônjuge fica impedido de assumir outro cargo.\n3. Escolha do Secretário: Restam 9 casais intocados, ou seja, 9 × 2 = 18 pessoas elegíveis (18 opções). Seu cônjuge também é bloqueado.\n4. Escolha do Tesoureiro: Restam 8 casais intocados, ou seja, 8 × 2 = 16 pessoas elegíveis (16 opções).\n5. Pelo Princípio Fundamental da Contagem: Total = 20 × 18 × 16 = 5.760 diretorias distintas.',
    dicaPedagogica: 'Peça aos alunos para clicarem em qualquer integrante e observarem o que acontece com o cônjuge do mesmo casal (bloqueado imediatamente com cadeado). Em seguida, compare com a Alternativa (C), que cometeria o erro de permitir casais juntos (6.840 possibilidades, gerando 1.080 diretorias ilegais).',
    codigoPython: 'calcular_diretoria_casais(num_casais=10, num_cargos=3)',
  },

  controls: [
    {
      id: 'modoVisao',
      label: 'Modo de Exploração',
      type: 'select',
      defaultValue: 'passo-a-passo',
      options: [
        { label: 'Passo a Passo Interativo (Clique nas pessoas)', value: 'passo-a-passo' },
        { label: 'Comparador de Alternativas (A, B, C, D, E)', value: 'comparador-distratores' },
        { label: 'Visão por Combinação C(10,3) × 2³ × 3!', value: 'visao-combinatoria' },
      ],
      description: 'Alterne entre a simulação prática e a análise das alternativas da prova.',
    },
    {
      id: 'destacarConjuges',
      label: 'Destacar Laço de Cada Casal',
      type: 'toggle',
      defaultValue: true,
      description: 'Exibe a conexão visual entre os cônjuges e o motivo de bloqueio.',
    },
    {
      id: 'mostrarFatoresProduto',
      label: 'Exibir Expressão 20 × 18 × 16',
      type: 'toggle',
      defaultValue: true,
      description: 'Mostra a árvore e o produto de possibilidades em tempo real.',
    },
  ],

  mount: (container: HTMLElement, initialState: DrawerState): DrawerInstance => {
    container.innerHTML = '';

    // Wrapper principal
    const root = document.createElement('div');
    root.className = 'w-full h-full overflow-y-auto overflow-x-hidden p-3 sm:p-5 flex flex-col items-center justify-start select-none font-sans text-slate-800';
    container.appendChild(root);

    // Estado local da diretoria: { presidenteId, secretarioId, tesoureiroId }
    let presidenteId: string | null = 'C1A'; // Início com exemplo claro (Lucas)
    let secretarioId: string | null = 'C3B'; // Clara
    let tesoureiroId: string | null = 'C7A'; // Rafael
    let tentativaInvalidaMsg: string | null = null;
    let timeoutInvalido: any = null;

    let modoVisao = initialState.params.modoVisao || 'passo-a-passo';
    let destacarConjuges = initialState.params.destacarConjuges !== false;
    let mostrarFatores = initialState.params.mostrarFatoresProduto !== false;

    // Helper para obter pessoa
    function getPessoa(id: string | null): Pessoa | null {
      if (!id) return null;
      return TODAS_AS_PESSOAS.find((p) => p.id === id) || null;
    }

    // Helper para obter cônjuge
    function getConjuge(pessoa: Pessoa): Pessoa {
      const letraOposta = pessoa.letra === 'A' ? 'B' : 'A';
      return TODAS_AS_PESSOAS.find((p) => p.casalId === pessoa.casalId && p.letra === letraOposta)!;
    }

    // Helper para saber o cargo de uma pessoa
    function getCargoPessoa(id: string): 'Presidente' | 'Secretário' | 'Tesoureiro' | null {
      if (id === presidenteId) return 'Presidente';
      if (id === secretarioId) return 'Secretário';
      if (id === tesoureiroId) return 'Tesoureiro';
      return null;
    }

    // Helper para saber se a pessoa está bloqueada por ser cônjuge de alguém eleito
    function getBloqueioInfo(pessoa: Pessoa): { bloqueado: boolean; motivo?: string } {
      if (getCargoPessoa(pessoa.id)) {
        return { bloqueado: false };
      }
      const conj = getConjuge(pessoa);
      const cargoConj = getCargoPessoa(conj.id);
      if (cargoConj) {
        return {
          bloqueado: true,
          motivo: `Cônjuge de ${conj.nome} (${cargoConj})`,
        };
      }
      return { bloqueado: false };
    }

    // Ação ao clicar em uma pessoa
    function handlePessoaClick(p: Pessoa) {
      tentativaInvalidaMsg = null;
      clearTimeout(timeoutInvalido);

      // Se já ocupa um cargo, remove dela
      if (p.id === presidenteId) {
        presidenteId = null;
        renderApp();
        return;
      }
      if (p.id === secretarioId) {
        secretarioId = null;
        renderApp();
        return;
      }
      if (p.id === tesoureiroId) {
        tesoureiroId = null;
        renderApp();
        return;
      }

      // Verifica se o cônjuge dela já ocupa um cargo
      const conj = getConjuge(p);
      const cargoConj = getCargoPessoa(conj.id);
      if (cargoConj) {
        tentativaInvalidaMsg = `⚠️ Violação da Regra: ${p.nome} e ${conj.nome} são do Casal ${p.casalId}. A regra exige no máximo 1 pessoa por casal na diretoria!`;
        timeoutInvalido = setTimeout(() => {
          tentativaInvalidaMsg = null;
          renderApp();
        }, 4500);
        renderApp();
        return;
      }

      // Atribui ao primeiro cargo vazio na ordem: Presidente -> Secretário -> Tesoureiro
      if (!presidenteId) {
        presidenteId = p.id;
      } else if (!secretarioId) {
        secretarioId = p.id;
      } else if (!tesoureiroId) {
        tesoureiroId = p.id;
      } else {
        // Todos preenchidos: substitui o tesoureiro por padrão
        tesoureiroId = p.id;
      }

      renderApp();
    }

    function sortearDiretoriaValida() {
      tentativaInvalidaMsg = null;
      // Sorteia 3 casais distintos de 1 a 10
      const casaisEmbaralhados = [...NOMES_CASAIS].sort(() => Math.random() - 0.5);
      const tresCasais = casaisEmbaralhados.slice(0, 3);

      // Para cada um dos 3 casais, sorteia A ou B
      const escolhidos: string[] = tresCasais.map((c) => {
        const letra = Math.random() < 0.5 ? 'A' : 'B';
        return `C${c.id}${letra}`;
      });

      presidenteId = escolhidos[0];
      secretarioId = escolhidos[1];
      tesoureiroId = escolhidos[2];
      renderApp();
    }

    function testarTentativaProibida() {
      // Tenta forçar marido e mulher juntos para mostrar didaticamente
      presidenteId = 'C2A'; // Gabriel
      secretarioId = 'C2B'; // Sofia (mesmo casal!)
      tesoureiroId = 'C5A';

      tentativaInvalidaMsg = '🚨 EXEMPLO DE DIRETORIA ILEGAL: Gabriel e Sofia pertencem ao Casal 2! A prova exclui esta hipótese. Se ignorássemos a regra, teríamos 20×19×18 = 6.840 (Alternativa C), gerando 1.080 diretorias ilegais!';
      renderApp();
    }

    function limparDiretoria() {
      presidenteId = null;
      secretarioId = null;
      tesoureiroId = null;
      tentativaInvalidaMsg = null;
      renderApp();
    }

    // Renderização do DOM reativo
    function renderApp() {
      root.innerHTML = '';

      const pres = getPessoa(presidenteId);
      const sec = getPessoa(secretarioId);
      const tes = getPessoa(tesoureiroId);

      const totalEleitos = (presidenteId ? 1 : 0) + (secretarioId ? 1 : 0) + (tesoureiroId ? 1 : 0);

      // Card de Alerta de Violação (se houver)
      if (tentativaInvalidaMsg) {
        const alertaEl = document.createElement('div');
        alertaEl.className = 'w-full max-w-4xl mb-4 p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-medium shadow-md animate-in fade-in duration-200';
        alertaEl.innerHTML = `
          <div class="flex items-center gap-2">
            <span>${tentativaInvalidaMsg}</span>
          </div>
          <button class="text-rose-500 hover:text-rose-700 font-bold px-2 py-1 cursor-pointer">×</button>
        `;
        alertaEl.querySelector('button')?.addEventListener('click', () => {
          tentativaInvalidaMsg = null;
          renderApp();
        });
        root.appendChild(alertaEl);
      }

      // 1. ZONA DA DIRETORIA (3 CARGOS / CADEIRAS)
      const mesaContainer = document.createElement('div');
      mesaContainer.className = 'w-full max-w-4xl bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs mb-4';
      
      mesaContainer.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold text-xs uppercase tracking-wider">
                Diretoria de 3 Cargos
              </span>
              <span class="text-xs text-slate-500 font-medium">
                ${totalEleitos} de 3 definidos
              </span>
            </div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900 mt-1">
              Composição Atual dos Cargos
            </h2>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button id="btn-sortear" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer">
              <span>🎲 Sortear Válida</span>
            </button>
            <button id="btn-proibida" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-semibold transition-all cursor-pointer">
              <span>⚠️ Testar Violação</span>
            </button>
            <button id="btn-limpar" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer">
              <span>Limpar</span>
            </button>
          </div>
        </div>

        <!-- 3 CADEIRAS DA DIRETORIA -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <!-- CADEIRA 1: PRESIDENTE -->
          <div class="p-3.5 rounded-xl border-2 transition-all ${
            pres ? 'bg-blue-50/70 border-blue-400 shadow-xs' : 'bg-slate-50/80 border-dashed border-slate-300'
          }">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <span>🥇 1º Cargo</span>
                <span class="text-slate-400">·</span>
                <span class="text-slate-900">Presidente</span>
              </span>
              <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-100 text-blue-800">
                20 opções
              </span>
            </div>
            <div class="mt-2.5 min-h-[50px] flex items-center justify-between">
              ${
                pres
                  ? `
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-xs text-sm" style="background-color: ${pres.corCasal}">
                    ${pres.letra}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 leading-tight">${pres.nome}</p>
                    <p class="text-xs text-slate-500">Casal ${pres.casalId} · Cônjuge: ${getConjuge(pres).nome}</p>
                  </div>
                </div>
                <button data-remover="pres" class="text-slate-400 hover:text-red-600 p-1 text-sm cursor-pointer" title="Remover">✕</button>
              `
                  : `
                <p class="text-xs text-slate-400 italic">Clique em qualquer pessoa abaixo para eleger</p>
              `
              }
            </div>
            <div class="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex justify-between">
              <span>Disponíveis: <strong>20 pessoas</strong></span>
              <span>10 casais livres</span>
            </div>
          </div>

          <!-- CADEIRA 2: SECRETÁRIO -->
          <div class="p-3.5 rounded-xl border-2 transition-all ${
            sec ? 'bg-emerald-50/70 border-emerald-400 shadow-xs' : 'bg-slate-50/80 border-dashed border-slate-300'
          }">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <span>🥈 2º Cargo</span>
                <span class="text-slate-400">·</span>
                <span class="text-slate-900">Secretário</span>
              </span>
              <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800">
                18 opções
              </span>
            </div>
            <div class="mt-2.5 min-h-[50px] flex items-center justify-between">
              ${
                sec
                  ? `
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-xs text-sm" style="background-color: ${sec.corCasal}">
                    ${sec.letra}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 leading-tight">${sec.nome}</p>
                    <p class="text-xs text-slate-500">Casal ${sec.casalId} · Cônjuge: ${getConjuge(sec).nome}</p>
                  </div>
                </div>
                <button data-remover="sec" class="text-slate-400 hover:text-red-600 p-1 text-sm cursor-pointer" title="Remover">✕</button>
              `
                  : `
                <p class="text-xs text-slate-400 italic">Clique em um integrante de outro casal</p>
              `
              }
            </div>
            <div class="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex justify-between">
              <span>Disponíveis: <strong>18 pessoas</strong></span>
              <span class="text-rose-600 font-medium">1 casal já bloqueado</span>
            </div>
          </div>

          <!-- CADEIRA 3: TESOUREIRO -->
          <div class="p-3.5 rounded-xl border-2 transition-all ${
            tes ? 'bg-amber-50/70 border-amber-400 shadow-xs' : 'bg-slate-50/80 border-dashed border-slate-300'
          }">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <span>🥉 3º Cargo</span>
                <span class="text-slate-400">·</span>
                <span class="text-slate-900">Tesoureiro</span>
              </span>
              <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-100 text-amber-800">
                16 opções
              </span>
            </div>
            <div class="mt-2.5 min-h-[50px] flex items-center justify-between">
              ${
                tes
                  ? `
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-xs text-sm" style="background-color: ${tes.corCasal}">
                    ${tes.letra}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 leading-tight">${tes.nome}</p>
                    <p class="text-xs text-slate-500">Casal ${tes.casalId} · Cônjuge: ${getConjuge(tes).nome}</p>
                  </div>
                </div>
                <button data-remover="tes" class="text-slate-400 hover:text-red-600 p-1 text-sm cursor-pointer" title="Remover">✕</button>
              `
                  : `
                <p class="text-xs text-slate-400 italic">Clique em um integrante dos casais restantes</p>
              `
              }
            </div>
            <div class="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex justify-between">
              <span>Disponíveis: <strong>16 pessoas</strong></span>
              <span class="text-rose-600 font-medium">2 casais bloqueados</span>
            </div>
          </div>
        </div>

        <!-- BARRA DA FÓRMULA EM TEMPO REAL -->
        ${
          mostrarFatores
            ? `
          <div class="mt-4 p-3 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-amber-400 font-bold">Princípio Multiplicativo:</span>
              <span class="font-mono text-sm tracking-wide bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                <span class="text-blue-300 font-bold">20</span> (Pres) × <span class="text-emerald-300 font-bold">18</span> (Sec) × <span class="text-amber-300 font-bold">16</span> (Tes)
              </span>
            </div>
            <div class="flex items-center gap-2 font-mono">
              <span class="text-slate-400">=</span>
              <span class="text-base font-bold text-emerald-400">5.760</span>
              <span class="text-[11px] text-slate-300 font-sans">diretorias possíveis</span>
              <span class="ml-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-sans font-bold border border-emerald-500/40">
                Gabarito (B)
              </span>
            </div>
          </div>
        `
            : ''
        }
      `;

      // Eventos dos botões da mesa
      mesaContainer.querySelector('#btn-sortear')?.addEventListener('click', sortearDiretoriaValida);
      mesaContainer.querySelector('#btn-proibida')?.addEventListener('click', testarTentativaProibida);
      mesaContainer.querySelector('#btn-limpar')?.addEventListener('click', limparDiretoria);
      
      mesaContainer.querySelector('[data-remover="pres"]')?.addEventListener('click', () => {
        presidenteId = null;
        renderApp();
      });
      mesaContainer.querySelector('[data-remover="sec"]')?.addEventListener('click', () => {
        secretarioId = null;
        renderApp();
      });
      mesaContainer.querySelector('[data-remover="tes"]')?.addEventListener('click', () => {
        tesoureiroId = null;
        renderApp();
      });

      root.appendChild(mesaContainer);

      // 2. SELETOR DE MODOS E COMPARADOR (SE ATIVADO)
      if (modoVisao === 'comparador-distratores') {
        const comparadorEl = document.createElement('div');
        comparadorEl.className = 'w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-4';
        comparadorEl.innerHTML = `
          <h3 class="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span>🎯 Análise Detalhada dos Distratores do ENEM</span>
          </h3>
          <p class="text-xs text-slate-600 mb-4">
            Entenda por que a banca colocou cada alternativa e onde os candidatos costumam tropeçar:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <!-- (A) 10x9x8 -->
            <div class="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-bold text-slate-800 font-mono">(A) 10 × 9 × 8</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-700 font-bold">720</span>
              </div>
              <p class="text-slate-600 leading-snug">
                <strong>Onde errou:</strong> Escolheu 1 casal para cada cargo, mas <em>esqueceu</em> de definir qual dos 2 membros do casal assume o posto! Faltou multiplicar por 2³ = 8.
              </p>
            </div>

            <!-- (B) 20x18x16 CORRETA -->
            <div class="p-3 rounded-xl border-2 border-emerald-400 bg-emerald-50/80 shadow-xs">
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-bold text-emerald-900 font-mono">(B) 20 × 18 × 16</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-emerald-200 text-emerald-900 font-bold">5.760 ✓</span>
              </div>
              <p class="text-emerald-800 leading-snug">
                <strong>Gabarito Oficial:</strong> 20 pessoas no 1º cargo. O cônjuge do eleito sai; restam 18 pessoas no 2º cargo. O segundo cônjuge sai; restam 16 pessoas no 3º cargo!
              </p>
            </div>

            <!-- (C) 20x19x18 -->
            <div class="p-3 rounded-xl border border-amber-300 bg-amber-50">
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-bold text-amber-900 font-mono">(C) 20 × 19 × 18</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-800 font-bold">6.840</span>
              </div>
              <p class="text-amber-800 leading-snug">
                <strong>O maior distrator:</strong> Ignorou por completo a restrição dos casais! Permitiria marido e mulher juntos na diretoria (1.080 diretorias ilegais).
              </p>
            </div>

            <!-- (D) 10x9x8x2 -->
            <div class="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-bold text-slate-800 font-mono">(D) 10 × 9 × 8 × 2</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-bold">1.440</span>
              </div>
              <p class="text-slate-600 leading-snug">
                <strong>Onde errou:</strong> Multiplicou por 2 apenas uma única vez, em vez de dobrar as escolhas para os três cargos (2 × 2 × 2 = 8).
              </p>
            </div>

            <!-- (E) 20x18x16x2 -->
            <div class="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div class="flex items-center justify-between mb-1.5">
                <span class="font-bold text-slate-800 font-mono">(E) 20 × 18 × 16 × 2</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 text-slate-700 font-bold">11.520</span>
              </div>
              <p class="text-slate-600 leading-snug">
                <strong>Onde errou:</strong> Pegou a resposta correta e dobrou desnecessariamente, confundindo a paridade de papéis.
              </p>
            </div>

            <!-- RESUMO DIDÁTICO -->
            <div class="p-3 rounded-xl border border-blue-200 bg-blue-50/70 flex flex-col justify-between">
              <div>
                <span class="font-bold text-blue-900 block mb-1">Diferença C - B:</span>
                <p class="text-blue-800 leading-snug">
                  6.840 - 5.760 = <strong>1.080 diretorias</strong> que violariam a representatividade do casal.
                </p>
              </div>
              <span class="text-[10px] text-blue-600 mt-2 font-mono">Dica: sempre deduza pelo Princípio Fundamental da Contagem.</span>
            </div>
          </div>
        `;
        root.appendChild(comparadorEl);
      } else if (modoVisao === 'visao-combinatoria') {
        const combEl = document.createElement('div');
        combEl.className = 'w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-4';
        combEl.innerHTML = `
          <h3 class="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span>📐 Método Alternativo: Teoria de Conjuntos e Permutação</span>
          </h3>
          <p class="text-xs text-slate-600 mb-3">
            Também é possível resolver dividindo o problema em três decisões independentes:
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="font-bold text-slate-900 block mb-1">1. Escolher 3 Casais:</span>
              <p class="text-slate-600">Dentre os 10 casais disponíveis, escolhemos quais 3 terão representação:</p>
              <p class="font-mono font-bold text-blue-600 mt-1.5 text-sm">C(10, 3) = 120</p>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="font-bold text-slate-900 block mb-1">2. Escolher o Membro:</span>
              <p class="text-slate-600">Para cada casal escolhido, decide-se qual dos 2 membros assume:</p>
              <p class="font-mono font-bold text-emerald-600 mt-1.5 text-sm">2 × 2 × 2 = 2³ = 8</p>
            </div>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span class="font-bold text-slate-900 block mb-1">3. Atribuir os 3 Cargos:</span>
              <p class="text-slate-600">Distribuir as 3 pessoas eleitas entre Presidente, Secretário e Tesoureiro:</p>
              <p class="font-mono font-bold text-amber-600 mt-1.5 text-sm">3! = 3 × 2 × 1 = 6</p>
            </div>
          </div>

          <div class="p-3 bg-slate-900 text-white rounded-xl font-mono text-xs flex flex-wrap items-center justify-between gap-2">
            <span>Total = C(10, 3) × 2³ × 3! = 120 × 8 × 6</span>
            <span class="text-emerald-400 font-bold text-sm">= 5.760 = 20 × 18 × 16</span>
          </div>
        `;
        root.appendChild(combEl);
      }

      // 3. GRADE DOS 10 CASAIS (20 PESSOAS CLICÁVEIS)
      const casaisContainer = document.createElement('div');
      casaisContainer.className = 'w-full max-w-4xl bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs';

      casaisContainer.innerHTML = `
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 class="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>👥 Os 10 Casais Fundadores (20 Integrantes)</span>
            </h3>
            <p class="text-xs text-slate-500 mt-0.5">
              Clique em qualquer pessoa para elegê-la para a diretoria. Observe o bloqueio automático do cônjuge:
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span class="inline-flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Livre
            </span>
            <span class="inline-flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span> Eleito
            </span>
            <span class="inline-flex items-center gap-1">
              <span class="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span> Bloqueado
            </span>
          </div>
        </div>

        <!-- GRID DOS 10 CASAIS: 2 COLUNAS NO MOBILE, 5 NO DESKTOP -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          ${NOMES_CASAIS.map((c) => {
            const pA = TODAS_AS_PESSOAS.find((p) => p.casalId === c.id && p.letra === 'A')!;
            const pB = TODAS_AS_PESSOAS.find((p) => p.casalId === c.id && p.letra === 'B')!;

            const cargoA = getCargoPessoa(pA.id);
            const cargoB = getCargoPessoa(pB.id);

            const bloqueioA = getBloqueioInfo(pA);
            const bloqueioB = getBloqueioInfo(pB);

            const casalTemRepresentante = Boolean(cargoA || cargoB);

            return `
              <div class="p-3 rounded-2xl border transition-all ${
                casalTemRepresentante
                  ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
              }">
                <!-- CABEÇALHO DO CASAL -->
                <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200/60">
                  <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full inline-block" style="background-color: ${c.cor}"></span>
                    Casal ${c.id}
                  </span>
                  ${
                    casalTemRepresentante
                      ? `<span class="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-full">Na Diretoria</span>`
                      : `<span class="text-[10px] text-slate-400">Disponível</span>`
                  }
                </div>

                <!-- OS 2 INTEGRANTES DO CASAL -->
                <div class="space-y-2">
                  <!-- INTEGRANTE A -->
                  <button 
                    data-pessoa-id="${pA.id}"
                    class="w-full text-left p-2 rounded-xl transition-all border flex items-center justify-between cursor-pointer active:scale-98 ${
                      cargoA
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300'
                        : bloqueioA.bloqueado
                        ? 'bg-slate-100/80 text-slate-400 border-slate-200 opacity-60'
                        : 'bg-white hover:bg-blue-50/50 text-slate-800 border-slate-200 hover:border-blue-300 shadow-2xs'
                    }"
                    title="${bloqueioA.bloqueado ? bloqueioA.motivo : 'Clique para eleger ou remover'}"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        cargoA ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                      }">
                        A
                      </div>
                      <span class="text-xs font-semibold truncate">${pA.nome}</span>
                    </div>

                    ${
                      cargoA
                        ? `<span class="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">${cargoA}</span>`
                        : bloqueioA.bloqueado
                        ? `<span class="text-[10px] text-slate-400 font-medium">🔒 Cônjuge</span>`
                        : `<span class="text-[11px] text-slate-400 hover:text-blue-600 font-bold">+</span>`
                    }
                  </button>

                  <!-- CONEXÃO DE CASAL (SE ATIVADO) -->
                  ${
                    destacarConjuges
                      ? `
                    <div class="flex items-center justify-center my-0.5">
                      <div class="h-1.5 w-0.5 bg-slate-300"></div>
                      <span class="text-[9px] text-slate-400 px-1 font-mono">casal</span>
                      <div class="h-1.5 w-0.5 bg-slate-300"></div>
                    </div>
                  `
                      : ''
                  }

                  <!-- INTEGRANTE B -->
                  <button 
                    data-pessoa-id="${pB.id}"
                    class="w-full text-left p-2 rounded-xl transition-all border flex items-center justify-between cursor-pointer active:scale-98 ${
                      cargoB
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300'
                        : bloqueioB.bloqueado
                        ? 'bg-slate-100/80 text-slate-400 border-slate-200 opacity-60'
                        : 'bg-white hover:bg-blue-50/50 text-slate-800 border-slate-200 hover:border-blue-300 shadow-2xs'
                    }"
                    title="${bloqueioB.bloqueado ? bloqueioB.motivo : 'Clique para eleger ou remover'}"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        cargoB ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
                      }">
                        B
                      </div>
                      <span class="text-xs font-semibold truncate">${pB.nome}</span>
                    </div>

                    ${
                      cargoB
                        ? `<span class="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">${cargoB}</span>`
                        : bloqueioB.bloqueado
                        ? `<span class="text-[10px] text-slate-400 font-medium">🔒 Cônjuge</span>`
                        : `<span class="text-[11px] text-slate-400 hover:text-blue-600 font-bold">+</span>`
                    }
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // Eventos de clique nas 20 pessoas
      casaisContainer.querySelectorAll('[data-pessoa-id]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = (e.currentTarget as HTMLElement).getAttribute('data-pessoa-id');
          if (id) {
            const p = TODAS_AS_PESSOAS.find((item) => item.id === id);
            if (p) handlePessoaClick(p);
          }
        });
      });

      root.appendChild(casaisContainer);
    }

    // Primeira renderização
    renderApp();

    return {
      update: (state: DrawerState) => {
        if (state.params.modoVisao !== undefined) {
          modoVisao = state.params.modoVisao;
        }
        if (state.params.destacarConjuges !== undefined) {
          destacarConjuges = Boolean(state.params.destacarConjuges);
        }
        if (state.params.mostrarFatoresProduto !== undefined) {
          mostrarFatores = Boolean(state.params.mostrarFatoresProduto);
        }
        renderApp();
      },
      play: () => {
        sortearDiretoriaValida();
      },
      step: (direction: 1 | -1) => {
        if (direction === 1) {
          sortearDiretoriaValida();
        } else {
          limparDiretoria();
        }
      },
      reset: () => {
        limparDiretoria();
      },
      destroy: () => {
        clearTimeout(timeoutInvalido);
        root.innerHTML = '';
      },
    };
  },
};
