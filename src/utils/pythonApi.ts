/**
 * Cliente de Integração com a API de Cálculos
 *
 * Permite que qualquer gaveta execute funções matemáticas avançadas
 * implementadas em `src/lib/matematica.ts` (porte do script original
 * `docs/matematica.py`), executadas no servidor da aplicação.
 */
import { calcularNoServidor } from '@/lib/matematica.functions';
import type { FuncaoId } from '@/lib/matematica';

export interface PythonResposta<T = any> {
  ok: boolean;
  dados?: T;
  erro?: string;
}

/**
 * Executa uma função cadastrada em src/lib/matematica.ts
 *
 * @param funcao Nome da função (ex: 'combinacoes', 'permutacoes', 'geometria_cubo')
 * @param params Parâmetros para a função
 */
export async function calcularEmPython<T = any>(
  funcao: FuncaoId,
  params: Record<string, unknown> = {}
): Promise<PythonResposta<T>> {
  try {
    const resposta = await calcularNoServidor({ data: { funcao, params } });
    return resposta as PythonResposta<T>;
  } catch (err: any) {
    // Fallback didático no navegador para o caso de ambiente desconectado
    console.warn(`[PythonApi] Chamada ao servidor falhou, usando cálculo local de fallback:`, err?.message);
    return fallbackLocal(funcao, params);
  }
}

/**
 * Fallback em JavaScript para funções comuns caso o servidor esteja indisponível
 */
function fallbackLocal(funcao: string, params: Record<string, unknown>): PythonResposta {
  if (funcao === 'combinacoes') {
    const n = Number(params['n']) || 5;
    const k = Number(params['k']) || 2;
    let comb = 1;
    for (let i = 1; i <= k; i++) {
      comb = (comb * (n - i + 1)) / i;
    }
    return {
      ok: true,
      dados: {
        formula: 'C(n, k) = n! / (k! * (n - k)!)',
        n,
        k,
        total: Math.round(comb),
        detalhes: `C(${n}, ${k}) = ${Math.round(comb)} (cálculo de contingência)`,
      },
    };
  }

  if (funcao === 'fatorial') {
    const n = Number(params['n']) || 0;
    let fat = 1;
    for (let i = 2; i <= n; i++) fat *= i;
    return { ok: true, dados: { resultado: fat } };
  }

  return {
    ok: false,
    erro: `Função ${funcao} não disponível localmente e servidor inacessível.`,
  };
}
