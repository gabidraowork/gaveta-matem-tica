/**
 * MÓDULO DE CÁLCULOS MATEMÁTICOS E COMBINATÓRIA
 *
 * Porte 1:1 em TypeScript de `docs/matematica.py` (o script Python original do
 * projeto). O servidor da aplicação não executa Python, então as mesmas funções
 * vivem aqui com os mesmos nomes de parâmetros, valores padrão e formato de
 * resposta. Para adicionar uma função nova:
 *   1. escreva a função abaixo;
 *   2. registre o nome em `FUNCOES_DISPONIVEIS` e no `despachar()`.
 *
 * Inteiros grandes: o Python devolve inteiros exatos de qualquer tamanho. Aqui
 * os cálculos usam BigInt e o resultado é devolvido como número quando cabe com
 * exatidão em um número JavaScript, ou como texto com todos os dígitos.
 */

export const FUNCOES_DISPONIVEIS = [
  { id: "fatorial", nome: "Fatorial (n!)", params: ["n"] },
  { id: "permutacoes", nome: "Permutações Simples (P_n)", params: ["elementos"] },
  { id: "combinacoes", nome: "Combinações Simples C(n, k)", params: ["n", "k"] },
  { id: "arranjos", nome: "Arranjos Simples A(n, k)", params: ["n", "k"] },
  {
    id: "geometria_cubo",
    nome: "Malha de Pontos 3D (x, y, z)",
    params: ["arestas", "espacamento"],
  },
  {
    id: "resolver_cubo_enem",
    nome: "Projeções do Cubo (ENEM)",
    params: ["x_inicial", "y_inicial", "z_inicial", "delta_yz", "delta_xz", "delta_xy"],
  },
  {
    id: "cobertura_ciclovia",
    nome: "Cobertura da Ciclovia",
    params: ["raio_km", "pi_aprox", "alcance_m", "num_policiais", "posicao_p_m"],
  },
  {
    id: "diretoria_casais",
    nome: "Diretoria de Casais (20 × 18 × 16)",
    params: ["num_casais", "num_cargos"],
  },
] as const;

export type FuncaoId = (typeof FUNCOES_DISPONIVEIS)[number]["id"];

export const FUNCAO_IDS: readonly FuncaoId[] = FUNCOES_DISPONIVEIS.map((f) => f.id);

export type Inteiro = number | string;

/** Converte BigInt para número quando exato; caso contrário devolve o texto com todos os dígitos. */
function exato(valor: bigint): Inteiro {
  const limite = BigInt(Number.MAX_SAFE_INTEGER);
  return valor <= limite && valor >= -limite ? Number(valor) : valor.toString();
}

/** Equivalente ao int() do Python para números e textos numéricos. */
function int(valor: unknown): number {
  const n = Number(valor);
  if (!Number.isFinite(n)) throw new Error(`invalid literal for int(): '${String(valor)}'`);
  return Math.trunc(n);
}

function float(valor: unknown): number {
  const n = Number(valor);
  if (Number.isNaN(n)) throw new Error(`could not convert string to float: '${String(valor)}'`);
  return n;
}

function round(valor: number, casas = 0): number {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

function fatorialBig(n: number): bigint {
  let resultado = 1n;
  for (let i = 2n; i <= BigInt(n); i++) resultado *= i;
  return resultado;
}

function produtoBig(fatores: number[]): bigint {
  return fatores.reduce((acc, f) => acc * BigInt(f), 1n);
}

function combBig(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  let resultado = 1n;
  for (let i = 1; i <= k; i++) resultado = (resultado * BigInt(n - k + i)) / BigInt(i);
  return resultado;
}

function permBig(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  let resultado = 1n;
  for (let i = 0; i < k; i++) resultado *= BigInt(n - i);
  return resultado;
}

export function fatorial(n: unknown): Inteiro {
  return exato(fatorialBig(Math.max(0, int(n))));
}

/** Mesma ordem de itertools.permutations (lexicográfica pelos índices). */
function* permutacoesEmOrdem<T>(itens: T[]): Generator<T[]> {
  if (itens.length <= 1) {
    yield [...itens];
    return;
  }
  for (let i = 0; i < itens.length; i++) {
    const resto = [...itens.slice(0, i), ...itens.slice(i + 1)];
    for (const p of permutacoesEmOrdem(resto)) yield [itens[i] as T, ...p];
  }
}

export function permutacoesSimples(elementos: unknown[]) {
  const amostra: unknown[][] = [];
  for (const p of permutacoesEmOrdem(elementos)) {
    if (amostra.length >= 120) break; // Limite para exibição fluida
    amostra.push(p);
  }
  return {
    formula: "P_n = n!",
    total: exato(fatorialBig(elementos.length)),
    elementos,
    amostra,
  };
}

export function combinacoesSimples(nIn: unknown, kIn: unknown) {
  const n = int(nIn);
  const k = int(kIn);
  if (k > n || k < 0) return { total: 0, formula: "C(n, k) = n! / (k! * (n - k)!)", n, k };
  const total = exato(combBig(n, k));
  return {
    formula: "C(n, k) = n! / (k! * (n - k)!)",
    n,
    k,
    total,
    detalhes: `C(${n}, ${k}) = ${total}`,
  };
}

export function arranjosSimples(nIn: unknown, kIn: unknown) {
  const n = int(nIn);
  const k = int(kIn);
  if (k > n || k < 0) return { total: 0, formula: "A(n, k) = n! / (n - k)!", n, k };
  const total = exato(permBig(n, k));
  return {
    formula: "A(n, k) = n! / (n - k)!",
    n,
    k,
    total,
    detalhes: `A(${n}, ${k}) = ${total}`,
  };
}

export function geometriaCuboMalha(arestasIn: unknown = 3, espacamentoIn: unknown = 1.0) {
  const arestas = Math.max(1, Math.min(10, int(arestasIn)));
  const espacamento = float(espacamentoIn);
  const pontos: Array<{ x: number; y: number; z: number; indices: number[] }> = [];
  const offset = ((arestas - 1) * espacamento) / 2.0;
  for (let x = 0; x < arestas; x++) {
    for (let y = 0; y < arestas; y++) {
      for (let z = 0; z < arestas; z++) {
        pontos.push({
          x: round(x * espacamento - offset, 3),
          y: round(y * espacamento - offset, 3),
          z: round(z * espacamento - offset, 3),
          indices: [x, y, z],
        });
      }
    }
  }
  return {
    total_vertices: pontos.length,
    arestas_por_eixo: arestas,
    formula_volume: `${arestas}^3 = ${pontos.length} cubos unitários`,
    pontos,
  };
}

export function resolverCuboProjecoesEnem(
  x_inicial = 6.0,
  y_inicial = 2.0,
  z_inicial = 7.0,
  delta_yz = -3.0, // aproximou 3 unidades do plano yz (x diminui de 6 para 3)
  delta_xz = 5.0, // afastou 5 unidades do plano xz (y aumenta de 2 para 7)
  delta_xy = -4.0, // aproximou 4 unidades do plano xy (z diminui de 7 para 3)
) {
  const x_final = x_inicial + delta_yz;
  const y_final = y_inicial + delta_xz;
  const z_final = z_inicial + delta_xy;
  return {
    posicao_inicial: {
      x: [x_inicial, x_inicial + 1.0],
      y: [y_inicial, y_inicial + 1.0],
      z: [z_inicial, z_inicial + 1.0],
      distancia_plano_yz: x_inicial,
      distancia_plano_xz: y_inicial,
      distancia_plano_xy: z_inicial,
    },
    deslocamentos: {
      plano_yz: { descricao: "Aproximou-se 3 unidades de yz", delta_x: delta_yz },
      plano_xz: { descricao: "Afastou-se 5 unidades de xz", delta_y: delta_xz },
      plano_xy: { descricao: "Aproximou-se 4 unidades de xy", delta_z: delta_xy },
    },
    posicao_final: {
      x: [x_final, x_final + 1.0],
      y: [y_final, y_final + 1.0],
      z: [z_final, z_final + 1.0],
      distancia_plano_yz: x_final,
      distancia_plano_xz: y_final,
      distancia_plano_xy: z_final,
    },
    projecoes_ortogonais: {
      plano_xy: { x: [x_final, x_final + 1.0], y: [y_final, y_final + 1.0], z: 0 },
      plano_xz: { x: [x_final, x_final + 1.0], y: 0, z: [z_final, z_final + 1.0] },
      plano_yz: { x: 0, y: [y_final, y_final + 1.0], z: [z_final, z_final + 1.0] },
    },
  };
}

export function calcularCoberturaCiclovia(
  raio_km = 1.0,
  pi_aprox = 3.0,
  alcance_m = 200.0,
  num_policiais = 15,
  posicao_p_m = 0.0,
) {
  const raio_m = raio_km * 1000.0;
  const comprimento_total_m = 2.0 * pi_aprox * raio_m;
  const arco_por_policial = 2.0 * alcance_m;
  const num_p = Math.max(1, Math.trunc(num_policiais));

  const distancia_entre_policiais = comprimento_total_m / num_p;
  const cobertura_linear = Math.min(comprimento_total_m, num_p * arco_por_policial);
  const percentual_coberto = round((cobertura_linear / comprimento_total_m) * 100.0, 1);
  const esta_totalmente_protegida = distancia_entre_policiais <= arco_por_policial;
  const lacuna_por_intervalo = Math.max(0.0, distancia_entre_policiais - arco_por_policial);
  const lacunas_totais_m = round(lacuna_por_intervalo * num_p, 1);

  // Módulo com o mesmo sinal do Python (sempre positivo para divisor positivo)
  const pos_p = ((posicao_p_m % comprimento_total_m) + comprimento_total_m) % comprimento_total_m;
  let dist_min = comprimento_total_m;
  for (let k = 0; k < num_p; k++) {
    const pos_policial = k * distancia_entre_policiais;
    const diff = Math.abs(pos_p - pos_policial);
    const dist_circular = Math.min(diff, comprimento_total_m - diff);
    if (dist_circular < dist_min) dist_min = dist_circular;
  }
  const ponto_p_protegido = dist_min <= alcance_m;

  return {
    raio_km,
    pi_aprox,
    alcance_por_lado_m: alcance_m,
    arco_por_policial_m: arco_por_policial,
    comprimento_total_ciclovia_m: comprimento_total_m,
    num_policiais: num_p,
    distancia_entre_policiais_m: round(distancia_entre_policiais, 1),
    cobertura_metros: round(cobertura_linear, 1),
    percentual_coberto,
    lacunas_desprotegidas_total_m: lacunas_totais_m,
    esta_totalmente_protegida,
    ponto_p: {
      posicao_m: round(pos_p, 1),
      distancia_policial_mais_proximo_m: round(dist_min, 1),
      protegido: ponto_p_protegido,
    },
  };
}

/**
 * Diretorias com cargos distintos formadas por casais, com no máximo
 * 1 integrante por casal (Questão 10).
 */
export function calcularDiretoriaCasais(numCasaisIn = 10, numCargosIn = 3) {
  const num_casais = Math.max(1, Math.trunc(numCasaisIn));
  const num_cargos = Math.max(1, Math.min(num_casais, Math.trunc(numCargosIn)));
  const total_pessoas = num_casais * 2;

  const fatores_passos = Array.from({ length: num_cargos }, (_, i) => (num_casais - i) * 2);
  const total_diretorias = produtoBig(fatores_passos);
  const formula_produto_str = fatores_passos.join(" × ");

  const comb_casais = combBig(num_casais, num_cargos);
  const escolhas_membros = 2n ** BigInt(num_cargos);
  const perm_cargos = fatorialBig(num_cargos);
  const total_comb = comb_casais * escolhas_membros * perm_cargos;

  const sem_restricao = produtoBig(Array.from({ length: num_cargos }, (_, i) => total_pessoas - i));
  const apenas_casais = produtoBig(Array.from({ length: num_cargos }, (_, i) => num_casais - i));
  const distrator_d = apenas_casais * 2n;
  const distrator_e = total_diretorias * 2n;
  const diretorias_ilegais_evitadas = sem_restricao - total_diretorias;

  // O script original lê fatores_passos[1] e [2] nas descrições; com menos de 3 cargos
  // o Python interrompe com IndexError. Mantemos o mesmo comportamento.
  if (fatores_passos.length < 3) throw new Error("list index out of range");
  const [f0, f1, f2] = fatores_passos as [number, number, number];

  const passos_didaticos = [
    {
      cargo: "Presidente",
      opcoes: f0,
      descricao: `Qualquer uma das ${total_pessoas} pessoas dos ${num_casais} casais.`,
      casais_restantes: num_casais - 1,
      pessoas_restantes: (num_casais - 1) * 2,
    },
    {
      cargo: "Secretário",
      opcoes: f1,
      descricao: `O cônjuge do presidente fica bloqueado. Restam ${num_casais - 1} casais (${f1} pessoas).`,
      casais_restantes: num_casais - 2,
      pessoas_restantes: (num_casais - 2) * 2,
    },
    {
      cargo: "Tesoureiro",
      opcoes: f2,
      descricao: `Os 2 cônjuges anteriores ficam bloqueados. Restam ${num_casais - 2} casais (${f2} pessoas).`,
      casais_restantes: num_casais - 3,
      pessoas_restantes: (num_casais - 3) * 2,
    },
  ];

  return {
    num_casais,
    num_cargos,
    total_pessoas,
    total_diretorias: exato(total_diretorias),
    formula_produto: formula_produto_str,
    fatores: fatores_passos,
    passos_didaticos,
    visao_combinatoria: {
      comb_casais: exato(comb_casais),
      escolhas_membros: exato(escolhas_membros),
      perm_cargos: exato(perm_cargos),
      formula: `C(${num_casais}, ${num_cargos}) × 2^${num_cargos} × ${num_cargos}! = ${comb_casais} × ${escolhas_membros} × ${perm_cargos} = ${total_comb}`,
    },
    distratores: {
      correta_b: { rotulo: "(B) 20×18×16", valor: exato(total_diretorias), correta: true },
      sem_restricao_c: {
        rotulo: "(C) 20×19×18",
        valor: exato(sem_restricao),
        erro: "Ignora a regra (permite casais juntos)",
      },
      apenas_casais_a: {
        rotulo: "(A) 10×9×8",
        valor: exato(apenas_casais),
        erro: "Esquece de escolher qual dos 2 membros assume",
      },
      distrator_d: {
        rotulo: "(D) 10×9×8×2",
        valor: exato(distrator_d),
        erro: "Multiplicou por 2 apenas uma vez em vez de 2³",
      },
      distrator_e: {
        rotulo: "(E) 20×18×16×2",
        valor: exato(distrator_e),
        erro: "Multiplicou por 2 além do necessário",
      },
    },
    diretorias_ilegais_evitadas: exato(diretorias_ilegais_evitadas),
  };
}

type Params = Record<string, unknown>;

function get(params: Params, chave: string, padrao: unknown): unknown {
  return chave in params && params[chave] !== undefined ? params[chave] : padrao;
}

/** Roteador que chama a função solicitada pelo front-end (igual ao despachar() do Python). */
export function despachar(funcao: string, params: Params = {}): unknown {
  switch (funcao) {
    case "fatorial":
      return { resultado: fatorial(get(params, "n", 0)) };
    case "permutacoes": {
      const elementos = get(params, "elementos", ["A", "B", "C"]);
      return permutacoesSimples(Array.isArray(elementos) ? elementos : Array.from(String(elementos)));
    }
    case "combinacoes":
      return combinacoesSimples(get(params, "n", 5), get(params, "k", 2));
    case "arranjos":
      return arranjosSimples(get(params, "n", 5), get(params, "k", 2));
    case "geometria_cubo":
      return geometriaCuboMalha(get(params, "arestas", 3), get(params, "espacamento", 1.0));
    case "resolver_cubo_enem":
      return resolverCuboProjecoesEnem(
        float(get(params, "x_inicial", 6.0)),
        float(get(params, "y_inicial", 2.0)),
        float(get(params, "z_inicial", 7.0)),
        float(get(params, "delta_yz", -3.0)),
        float(get(params, "delta_xz", 5.0)),
        float(get(params, "delta_xy", -4.0)),
      );
    case "cobertura_ciclovia":
      return calcularCoberturaCiclovia(
        float(get(params, "raio_km", 1.0)),
        float(get(params, "pi_aprox", 3.0)),
        float(get(params, "alcance_m", 200.0)),
        int(get(params, "num_policiais", 15)),
        float(get(params, "posicao_p_m", 0.0)),
      );
    case "diretoria_casais":
      return calcularDiretoriaCasais(
        int(get(params, "num_casais", 10)),
        int(get(params, "num_cargos", 3)),
      );
    default:
      throw new Error(`Função desconhecida: '${funcao}'`);
  }
}

export interface CalculoResposta {
  ok: boolean;
  dados?: unknown;
  erro?: string;
}

/** Executa um cálculo e devolve { ok, dados } ou { ok: false, erro }, como o script original. */
export function executarCalculo(funcao: string, params: Params = {}): CalculoResposta {
  try {
    return { ok: true, dados: despachar(funcao, params) };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : String(e) };
  }
}
