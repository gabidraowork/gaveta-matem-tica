import { describe, expect, it } from "vitest";

import { executarCalculo } from "@/lib/matematica";

// Valores conferidos com o script original docs/matematica.py
describe("cálculos matemáticos (porte do Python)", () => {
  it("ciclovia: 15 policiais protegem os 6.000 m inteiros", () => {
    const r = executarCalculo("cobertura_ciclovia", { num_policiais: 15 });
    const d = r.dados as { comprimento_total_ciclovia_m: number; esta_totalmente_protegida: boolean };
    expect(d.comprimento_total_ciclovia_m).toBe(6000);
    expect(d.esta_totalmente_protegida).toBe(true);
  });

  it("ciclovia: 14 policiais deixam lacunas", () => {
    const d = executarCalculo("cobertura_ciclovia", { num_policiais: 14 }).dados as {
      esta_totalmente_protegida: boolean;
    };
    expect(d.esta_totalmente_protegida).toBe(false);
  });

  it("diretoria de 10 casais e 3 cargos: 20 × 18 × 16 = 5760", () => {
    const d = executarCalculo("diretoria_casais", { num_casais: 10, num_cargos: 3 }).dados as {
      total_diretorias: number;
      formula_produto: string;
    };
    expect(d.total_diretorias).toBe(5760);
    expect(d.formula_produto).toBe("20 × 18 × 16");
  });

  it("combinações C(5, 2) = 10", () => {
    expect((executarCalculo("combinacoes", { n: 5, k: 2 }).dados as { total: number }).total).toBe(10);
  });

  it("cubo do ENEM termina em (3, 7, 3)", () => {
    const d = executarCalculo("resolver_cubo_enem", {}).dados as {
      posicao_final: { distancia_plano_yz: number; distancia_plano_xz: number; distancia_plano_xy: number };
    };
    expect(d.posicao_final).toMatchObject({ distancia_plano_yz: 3, distancia_plano_xz: 7, distancia_plano_xy: 3 });
  });

  it("função desconhecida devolve erro como o script original", () => {
    expect(executarCalculo("xyz", {})).toEqual({ ok: false, erro: "Função desconhecida: 'xyz'" });
  });
});
