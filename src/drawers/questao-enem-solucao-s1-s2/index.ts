/**
 * GAVETA DIDÁTICA: Questão ENEM - Solução de S1 e S2 (retirada de S1)
 *
 * O simulador completo vive em um único arquivo HTML independente
 * (`public/simuladores/solucao-s1-s2.html`), que também pode ser usado fora do app.
 * Esta gaveta apenas o exibe dentro do palco.
 *
 * PRINCÍPIO PEDAGÓGICO:
 * Não mostra fórmula, cálculo nem a alternativa correta. O aluno retira S1 com a
 * seringa, observa a porcentagem e registra tentativas; o retorno diz apenas se a
 * porcentagem ficou acima, abaixo ou igual a 99,90%.
 */

import { DrawerInstance, DrawerModule } from '../types';

export const SIMULADOR_SOLUCAO_URL = '/simuladores/solucao-s1-s2.html';

export const QuestaoEnemSolucaoS1S2Drawer: DrawerModule = {
  id: 'enem-solucao-s1-s2',
  title: 'Solução S1 + S2 · Retirada de S1',
  subtitle: 'Porcentagem · Misturas e Soluções',
  description:
    'Béquer com 10 L de solução (99,95% de S1) e seringa para retirar S1, com porcentagem atualizada em tempo real e registro de tentativas.',
  category: 'algebra',
  badge: 'ENEM · Soluções',
  iconName: 'PieChart',

  mathContext: {
    enunciado:
      'Em um laboratório, um recipiente contém 10 litros de uma solução composta apenas pelas substâncias S1 e S2. Dessa solução, 99,95% é de S1. Uma quantidade de S1 será retirada dessa solução, mantendo a quantidade inicial de S2 de modo que 99,90% da nova solução seja de S1. Qual é a quantidade de S1, em litros, que será retirada?\nA) 0,0050   B) 0,0100   C) 0,5000   D) 4,9775   E) 5,0000',
    explicacao:
      'O simulador deixa o aluno experimentar: ao puxar o êmbolo da seringa, só S1 sai do béquer, enquanto S2 permanece igual (veja a lupa). A porcentagem de S1 é recalculada a cada movimento. Ao registrar uma tentativa, o aluno recebe apenas a indicação "acima", "abaixo" ou "igual" à meta de 99,90%. A explicação teórica fica para o professor, depois da exploração.',
    dicaPedagogica:
      'Peça aos alunos que testem primeiro volumes pequenos e observem quanto a porcentagem muda. Depois, pergunte: o que acontece com a quantidade de S2 durante a retirada? E com a parte que ela representa no total?',
  },

  controls: [],

  mount: (container: HTMLElement): DrawerInstance => {
    container.innerHTML = '';

    // O simulador HTML roda isolado em um iframe que ocupa todo o palco
    const iframe = document.createElement('iframe');
    iframe.src = SIMULADOR_SOLUCAO_URL;
    iframe.title = 'Simulador: solução de S1 e S2';
    iframe.className = 'w-full h-full block border-0 bg-transparent';
    container.appendChild(iframe);

    return {
      update: () => {},
      reset: () => {
        iframe.src = SIMULADOR_SOLUCAO_URL;
      },
      destroy: () => {
        container.innerHTML = '';
      },
    };
  },
};
