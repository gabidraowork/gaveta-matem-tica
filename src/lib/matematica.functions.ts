import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { FUNCAO_IDS, FUNCOES_DISPONIVEIS, executarCalculo, type CalculoResposta } from "./matematica";

/** Substitui GET /api/py/funcoes do servidor Express original. */
export const listarFuncoesCalculo = createServerFn({ method: "GET" }).handler(async () => {
  return {
    ok: true as const,
    funcoes: FUNCOES_DISPONIVEIS.map((f) => ({ id: f.id, nome: f.nome, params: [...f.params] })),
  };
});

const entradaSchema = z.object({
  funcao: z.enum(FUNCAO_IDS as [string, ...string[]]),
  params: z.record(z.unknown()).optional(),
});

/** Substitui POST /api/py/calcular do servidor Express original. */
export const calcularNoServidor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => input)
  .handler(async ({ data }): Promise<{ ok: boolean; dados?: any; erro?: string }> => {
    const entrada = entradaSchema.safeParse(data);
    if (!entrada.success) return { ok: false, erro: "Dados de cálculo inválidos." };
    const resposta: CalculoResposta = executarCalculo(entrada.data.funcao, entrada.data.params ?? {});
    // Ida e volta em JSON garante um objeto simples, como a resposta do script original.
    return JSON.parse(JSON.stringify(resposta));
  });
