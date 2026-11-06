# Guia do Professor: Como Adicionar Novas Questões ("Gavetas")

Bem-vindo à base da sua **Gaveta de Visualizações Matemáticas**! 

A arquitetura do projeto foi desenvolvida para ser **modular, enxuta e desacoplada**: cada questão vive em sua própria gaveta e pode ser adicionada sem risco de quebrar o restante da aplicação.

---

## 📁 Estrutura de Pastas do Projeto

```text
├── docs/
│   ├── COMO_ADICIONAR_GAVETA.md # Este guia prático
│   └── matematica.py            # Script Python original (referência, não é executado)
├── src/
│   ├── routes/index.tsx         # Página inicial (abre a Gaveta)
│   ├── styles.css               # Estilos globais e papel milimetrado
│   ├── lib/
│   │   ├── matematica.ts        # Cálculos matemáticos (porte fiel do matematica.py)
│   │   └── matematica.functions.ts # Funções do servidor que executam os cálculos
│   ├── components/              # Componentes de interface reutilizáveis
│   │   ├── GavetaApp.tsx        # Estrutura principal da interface
│   │   ├── Header.tsx           # Barra superior com ações e tela cheia
│   │   ├── DrawerSidebar.tsx    # Índice lateral e lista de gavetas
│   │   ├── StageView.tsx        # Palco central de renderização
│   │   ├── ControlDock.tsx      # Doca inferior de reprodução e sliders
│   │   └── ProfessorGuideModal.tsx # Apoio pedagógico e testes de cálculo
│   ├── utils/
│   │   └── pythonApi.ts         # Cliente para chamar os cálculos do navegador
│   └── drawers/                 # ONDE FICAM AS SUAS QUESTÕES ("GAVETAS")
│       ├── types.ts             # Contrato TypeScript de cada gaveta
│       ├── index.ts             # Registro central de todas as gavetas
│       ├── exemplo-3d/          # Gaveta: Cubo 3D interativo com Three.js
│       └── template-novo/       # Gaveta: Modelo em branco para copiar
```

---

## 🚀 Passo a Passo: Adicionando uma Nova Questão em 3 Minutos

### Passo 1: Duplique a pasta template
Copie a pasta `src/drawers/template-novo/` para uma nova pasta correspondente ao seu tema.  
*Exemplo:* `src/drawers/permutacao-anagramas/`

### Passo 2: Configure os dados e a visualização em `index.ts`
Abra o arquivo `src/drawers/permutacao-anagramas/index.ts` e preencha:

1. **Identificação e Textos Didáticos:**
```typescript
export const MinhaNovaQuestaoDrawer: DrawerModule = {
  id: 'combinatoria-anagramas',
  title: 'Anagramas & Permutação Simples',
  subtitle: 'Análise Combinatória · Princípio Multiplicativo',
  description: 'Visualização da formação de palavras e permutações de letras passo a passo.',
  category: 'combinatoria', // 'geometria-3d' | 'combinatoria' | 'probabilidade' | 'algebra'
  iconName: 'GitBranch',

  mathContext: {
    enunciado: 'Quantas palavras distintas podem ser formadas permutando as letras de ROMA?',
    formula: 'P_n = n! -> P_4 = 4! = 24',
    explicacao: 'Cada ramo representa uma escolha da próxima letra disponível.',
    dicaPedagogica: 'Peça aos alunos para fixarem a primeira letra antes de contar as demais.',
  },
  
  // 2. Controles que aparecerão na barra inferior:
  controls: [
    {
      id: 'numLetras',
      label: 'Número de Letras (n)',
      type: 'range',
      min: 2,
      max: 6,
      defaultValue: 4,
    },
  ],

  // 3. Onde você desenha (Three.js, Canvas 2D ou SVG):
  mount: (container: HTMLElement, initialState: DrawerState): DrawerInstance => {
    // Insira seu código de desenho no container HTML
    return {
      update: (state) => { /* atualiza quando o slider mudar */ },
      play: () => { /* inicia animação */ },
      pause: () => { /* pausa animação */ },
      reset: () => { /* volta ao início */ },
      destroy: () => { /* limpa a tela e memória ao sair */ },
    };
  }
};
```

### Passo 3: Registre a nova gaveta no índice central
Abra `src/drawers/index.ts`, importe sua nova gaveta e adicione-a no array `todasAsGavetas`:

```typescript
import { MinhaNovaQuestaoDrawer } from './permutacao-anagramas';

export const todasAsGavetas: DrawerModule[] = [
  Exemplo3DDrawer,
  TemplateNovoDrawer,
  MinhaNovaQuestaoDrawer, // <- Sua nova gaveta aqui!
];
```

Pronto! A nova questão aparecerá no índice lateral, terá busca instantânea e controles funcionando automaticamente.

---

## 🐍 Como Conectar Cálculos no Servidor

O servidor da aplicação não executa Python. As funções do `docs/matematica.py` original foram portadas
para TypeScript em `src/lib/matematica.ts`, com os mesmos nomes de parâmetros e o mesmo formato de resposta.

Se a sua questão precisar de um cálculo matemático pesado (como combinações, arranjos, permutações ou matrizes):

1. Abra `src/lib/matematica.ts` e adicione sua função:
```typescript
export function calcularAnagramas(palavra: string) {
  const perms = new Set([...permutacoesEmOrdem(Array.from(palavra))].map((p) => p.join('')));
  return { total: perms.size, amostra: [...perms].slice(0, 20) };
}
```

2. Registre o nome em `FUNCOES_DISPONIVEIS` e no `despachar()` do mesmo arquivo:
```typescript
case "anagramas":
  return calcularAnagramas(String(get(params, "palavra", "ROMA")));
```

3. Na sua gaveta em JavaScript/TypeScript, chame o cálculo facilmente:
```typescript
import { calcularEmPython } from '../../utils/pythonApi';

const resposta = await calcularEmPython('anagramas', { palavra: 'ROMA' });
console.log(resposta.dados.total); // 24
```

---

## 🎨 Tipos de Renderizadores Suportados
- **Three.js (3D):** Ideal para sólidos geométricos, poliedros, malhas espaciais e cubos com rotação livre por toque e mouse.
- **Canvas 2D / SVG:** Ideal para árvores de probabilidade, grafos combinatórios, diagramas de Venn e balanças proporcionais.
- **HTML/CSS puro:** Ideal para matrizes dinâmicas, tabelas do Triângulo de Pascal e cartões de permutações.
