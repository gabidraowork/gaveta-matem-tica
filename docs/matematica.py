#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
MÓDULO DE CÁLCULOS MATEMÁTICOS E COMBINATÓRIA (PYTHON)
=============================================================================
Este arquivo contém as funções em Python que realizam cálculos exatos para as
visualizações da gaveta. O professor pode adicionar novas funções aqui de forma
simples e direta.

COMO TESTAR MANUALMENTE NO TERMINAL:
  python3 scripts/matematica.py '{"funcao": "combinacoes", "n": 5, "k": 2}'
=============================================================================
"""

import sys
import json
import math
import itertools


def fatorial(n: int) -> int:
    """Calcula o fatorial n!"""
    return math.factorial(max(0, int(n)))


def permutacoes_simples(elementos: list) -> dict:
    """
    Gera todas as permutações de uma lista de elementos e a contagem total (P_n = n!).
    """
    perms = list(itertools.permutations(elementos))
    return {
        "formula": "P_n = n!",
        "total": len(perms),
        "elementos": elementos,
        "amostra": [list(p) for p in perms[:120]],  # Limite para exibição fluida
    }


def combinacoes_simples(n: int, k: int) -> dict:
    """
    Calcula a combinação simples C(n, k) = n! / (k! * (n - k)!)
    """
    n, k = int(n), int(k)
    if k > n or k < 0:
        return {"total": 0, "formula": "C(n, k) = n! / (k! * (n - k)!)", "n": n, "k": k}
    
    total = math.comb(n, k)
    return {
        "formula": "C(n, k) = n! / (k! * (n - k)!)",
        "n": n,
        "k": k,
        "total": total,
        "detalhes": f"C({n}, {k}) = {total}",
    }


def arranjos_simples(n: int, k: int) -> dict:
    """
    Calcula o arranjo simples A(n, k) = n! / (n - k)!
    """
    n, k = int(n), int(k)
    if k > n or k < 0:
        return {"total": 0, "formula": "A(n, k) = n! / (n - k)!", "n": n, "k": k}
    
    total = math.perm(n, k)
    return {
        "formula": "A(n, k) = n! / (n - k)!",
        "n": n,
        "k": k,
        "total": total,
        "detalhes": f"A({n}, {k}) = {total}",
    }


def geometria_cubo_malha(arestas: int = 3, espacamento: float = 1.0) -> dict:
    """
    Gera coordenadas espaciais (x, y, z) para um arranjo cúbico de pontos didáticos.
    Muito útil para visualizações 3D em Three.js.
    """
    arestas = max(1, min(10, int(arestas)))
    pontos = []
    offset = (arestas - 1) * espacamento / 2.0
    
    for x in range(arestas):
        for y in range(arestas):
            for z in range(arestas):
                pontos.append({
                    "x": round(x * espacamento - offset, 3),
                    "y": round(y * espacamento - offset, 3),
                    "z": round(z * espacamento - offset, 3),
                    "indices": [x, y, z],
                })
                
    return {
        "total_vertices": len(pontos),
        "arestas_por_eixo": arestas,
        "formula_volume": f"{arestas}^3 = {len(pontos)} cubos unitários",
        "pontos": pontos,
    }


def resolver_cubo_projecoes_enem(
    x_inicial: float = 6.0,
    y_inicial: float = 2.0,
    z_inicial: float = 7.0,
    delta_yz: float = -3.0,  # aproximou 3 unidades do plano yz (x diminui de 6 para 3)
    delta_xz: float = 5.0,   # afastou 5 unidades do plano xz (y aumenta de 2 para 7)
    delta_xy: float = -4.0,  # aproximou 4 unidades do plano xy (z diminui de 7 para 3)
) -> dict:
    """
    Resolve o deslocamento espacial do cubo em relação aos três planos coordenados:
    - Plano yz (x = 0): distância = |x|
    - Plano xz (y = 0): distância = |y|
    - Plano xy (z = 0): distância = |z|
    """
    x_final = x_inicial + delta_yz
    y_final = y_inicial + delta_xz
    z_final = z_inicial + delta_xy

    return {
        "posicao_inicial": {
            "x": [x_inicial, x_inicial + 1.0],
            "y": [y_inicial, y_inicial + 1.0],
            "z": [z_inicial, z_inicial + 1.0],
            "distancia_plano_yz": x_inicial,
            "distancia_plano_xz": y_inicial,
            "distancia_plano_xy": z_inicial,
        },
        "deslocamentos": {
            "plano_yz": {"descricao": "Aproximou-se 3 unidades de yz", "delta_x": delta_yz},
            "plano_xz": {"descricao": "Afastou-se 5 unidades de xz", "delta_y": delta_xz},
            "plano_xy": {"descricao": "Aproximou-se 4 unidades de xy", "delta_z": delta_xy},
        },
        "posicao_final": {
            "x": [x_final, x_final + 1.0],
            "y": [y_final, y_final + 1.0],
            "z": [z_final, z_final + 1.0],
            "distancia_plano_yz": x_final,
            "distancia_plano_xz": y_final,
            "distancia_plano_xy": z_final,
        },
        "projecoes_ortogonais": {
            "plano_xy": {"x": [x_final, x_final + 1.0], "y": [y_final, y_final + 1.0], "z": 0},
            "plano_xz": {"x": [x_final, x_final + 1.0], "y": 0, "z": [z_final, z_final + 1.0]},
            "plano_yz": {"x": 0, "y": [y_final, y_final + 1.0], "z": [z_final, z_final + 1.0]},
        },
    }


def calcular_cobertura_ciclovia(
    raio_km: float = 1.0,
    pi_aprox: float = 3.0,
    alcance_m: float = 200.0,
    num_policiais: int = 15,
    posicao_p_m: float = 0.0,
) -> dict:
    """
    Calcula a cobertura da ciclovia circular ao redor da lagoa (ENEM):
    - Raio R em metros: raio_km * 1000
    - Comprimento da ciclovia C = 2 * pi * R
    - Cada policial cobre alcance_m para cada lado -> arco total = 2 * alcance_m
    - Determina a cobertura percentual, lacunas desprotegidas e se o ponto P está protegido.
    """
    raio_m = float(raio_km) * 1000.0
    comprimento_total_m = 2.0 * float(pi_aprox) * raio_m
    arco_por_policial = 2.0 * float(alcance_m)
    num_p = max(1, int(num_policiais))
    
    # Se distribuídos uniformemente ao longo dos 6.000m:
    distancia_entre_policiais = comprimento_total_m / num_p
    
    # Cobertura máxima sem sobreposição
    cobertura_linear = min(comprimento_total_m, num_p * arco_por_policial)
    percentual_coberto = round((cobertura_linear / comprimento_total_m) * 100.0, 1)
    
    # A ciclovia está 100% protegida se a distância entre policiais for <= 400m
    esta_totalmente_protegida = distancia_entre_policiais <= arco_por_policial
    
    # Lacuna desprotegida por intervalo (se houver)
    lacuna_por_intervalo = max(0.0, distancia_entre_policiais - arco_por_policial)
    lacunas_totais_m = round(lacuna_por_intervalo * num_p, 1)

    # Verificação do ponto P fornecido (em metros ao longo do perímetro de 0 a C)
    pos_p = float(posicao_p_m) % comprimento_total_m
    # Distância mínima do ponto P até o policial mais próximo (supondo policiais em k * dist)
    dist_min = comprimento_total_m
    for k in range(num_p):
        pos_policial = k * distancia_entre_policiais
        diff = abs(pos_p - pos_policial)
        # Distância circular
        dist_circular = min(diff, comprimento_total_m - diff)
        if dist_circular < dist_min:
            dist_min = dist_circular
            
    ponto_p_protegido = dist_min <= alcance_m

    return {
        "raio_km": raio_km,
        "pi_aprox": pi_aprox,
        "alcance_por_lado_m": alcance_m,
        "arco_por_policial_m": arco_por_policial,
        "comprimento_total_ciclovia_m": comprimento_total_m,
        "num_policiais": num_p,
        "distancia_entre_policiais_m": round(distancia_entre_policiais, 1),
        "cobertura_metros": round(cobertura_linear, 1),
        "percentual_coberto": percentual_coberto,
        "lacunas_desprotegidas_total_m": lacunas_totais_m,
        "esta_totalmente_protegida": esta_totalmente_protegida,
        "ponto_p": {
            "posicao_m": round(pos_p, 1),
            "distancia_policial_mais_proximo_m": round(dist_min, 1),
            "protegido": ponto_p_protegido,
        },
    }


def calcular_diretoria_casais(num_casais: int = 10, num_cargos: int = 3) -> dict:
    """
    Calcula a quantidade de diretorias com cargos distintos formadas por casais,
    com a restrição de no máximo 1 integrante por casal (Questão 10).
    """
    num_casais = max(1, int(num_casais))
    num_cargos = max(1, min(num_casais, int(num_cargos)))
    total_pessoas = num_casais * 2

    # 1. Princípio Multiplicativo (escolha cargo a cargo):
    # Cargo 1: 2 * num_casais opções
    # Cargo 2: 2 * (num_casais - 1) opções
    # Cargo 3: 2 * (num_casais - 2) opções
    fatores_passos = [(num_casais - i) * 2 for i in range(num_cargos)]
    total_diretorias = math.prod(fatores_passos)
    formula_produto_str = " × ".join(str(f) for f in fatores_passos)

    # 2. Visão alternativa: Combinação de casais * escolha de membro * permutações de cargos
    comb_casais = math.comb(num_casais, num_cargos)
    escolhas_membros = 2 ** num_cargos
    perm_cargos = math.factorial(num_cargos)
    total_comb = comb_casais * escolhas_membros * perm_cargos

    # 3. Análise dos Distratores (para n=10 e k=3):
    sem_restricao = math.prod([total_pessoas - i for i in range(num_cargos)])  # 20 * 19 * 18 = 6840
    apenas_casais = math.prod([num_casais - i for i in range(num_cargos)])     # 10 * 9 * 8 = 720
    distrator_d = apenas_casais * 2                                             # 10 * 9 * 8 * 2 = 1440
    distrator_e = total_diretorias * 2                                          # 20 * 18 * 16 * 2 = 11520

    diretorias_ilegais_evitadas = sem_restricao - total_diretorias

    passos_didaticos = [
        {
            "cargo": "Presidente",
            "opcoes": fatores_passos[0] if len(fatores_passos) > 0 else 0,
            "descricao": f"Qualquer uma das {total_pessoas} pessoas dos {num_casais} casais.",
            "casais_restantes": num_casais - 1,
            "pessoas_restantes": (num_casais - 1) * 2,
        },
        {
            "cargo": "Secretário",
            "opcoes": fatores_passos[1] if len(fatores_passos) > 1 else 0,
            "descricao": f"O cônjuge do presidente fica bloqueado. Restam {num_casais - 1} casais ({fatores_passos[1]} pessoas).",
            "casais_restantes": num_casais - 2,
            "pessoas_restantes": (num_casais - 2) * 2,
        },
        {
            "cargo": "Tesoureiro",
            "opcoes": fatores_passos[2] if len(fatores_passos) > 2 else 0,
            "descricao": f"Os 2 cônjuges anteriores ficam bloqueados. Restam {num_casais - 2} casais ({fatores_passos[2]} pessoas).",
            "casais_restantes": num_casais - 3,
            "pessoas_restantes": (num_casais - 3) * 2,
        },
    ]

    return {
        "num_casais": num_casais,
        "num_cargos": num_cargos,
        "total_pessoas": total_pessoas,
        "total_diretorias": total_diretorias,
        "formula_produto": formula_produto_str,
        "fatores": fatores_passos,
        "passos_didaticos": passos_didaticos,
        "visao_combinatoria": {
            "comb_casais": comb_casais,
            "escolhas_membros": escolhas_membros,
            "perm_cargos": perm_cargos,
            "formula": f"C({num_casais}, {num_cargos}) × 2^{num_cargos} × {num_cargos}! = {comb_casais} × {escolhas_membros} × {perm_cargos} = {total_comb}",
        },
        "distratores": {
            "correta_b": {"rotulo": "(B) 20×18×16", "valor": total_diretorias, "correta": True},
            "sem_restricao_c": {"rotulo": "(C) 20×19×18", "valor": sem_restricao, "erro": "Ignora a regra (permite casais juntos)"},
            "apenas_casais_a": {"rotulo": "(A) 10×9×8", "valor": apenas_casais, "erro": "Esquece de escolher qual dos 2 membros assume"},
            "distrator_d": {"rotulo": "(D) 10×9×8×2", "valor": distrator_d, "erro": "Multiplicou por 2 apenas uma vez em vez de 2³"},
            "distrator_e": {"rotulo": "(E) 20×18×16×2", "valor": distrator_e, "erro": "Multiplicou por 2 além do necessário"},
        },
        "diretorias_ilegais_evitadas": diretorias_ilegais_evitadas,
    }


def despachar(requisicao: dict) -> dict:
    """
    Roteador que chama a função Python solicitada pelo front-end.
    """
    funcao = requisicao.get("funcao", "")
    params = requisicao.get("params", {})
    
    if funcao == "fatorial":
        n = params.get("n", 0)
        return {"resultado": fatorial(n)}
    
    elif funcao == "permutacoes":
        elementos = params.get("elementos", ["A", "B", "C"])
        return permutacoes_simples(elementos)
    
    elif funcao == "combinacoes":
        n = params.get("n", 5)
        k = params.get("k", 2)
        return combinacoes_simples(n, k)
        
    elif funcao == "arranjos":
        n = params.get("n", 5)
        k = params.get("k", 2)
        return arranjos_simples(n, k)
        
    elif funcao == "geometria_cubo":
        arestas = params.get("arestas", 3)
        espacamento = params.get("espacamento", 1.0)
        return geometria_cubo_malha(arestas, espacamento)

    elif funcao == "resolver_cubo_enem":
        return resolver_cubo_projecoes_enem(
            x_inicial=float(params.get("x_inicial", 6.0)),
            y_inicial=float(params.get("y_inicial", 2.0)),
            z_inicial=float(params.get("z_inicial", 7.0)),
            delta_yz=float(params.get("delta_yz", -3.0)),
            delta_xz=float(params.get("delta_xz", 5.0)),
            delta_xy=float(params.get("delta_xy", -4.0)),
        )

    elif funcao == "cobertura_ciclovia":
        return calcular_cobertura_ciclovia(
            raio_km=float(params.get("raio_km", 1.0)),
            pi_aprox=float(params.get("pi_aprox", 3.0)),
            alcance_m=float(params.get("alcance_m", 200.0)),
            num_policiais=int(params.get("num_policiais", 15)),
            posicao_p_m=float(params.get("posicao_p_m", 0.0)),
        )

    elif funcao == "diretoria_casais":
        return calcular_diretoria_casais(
            num_casais=int(params.get("num_casais", 10)),
            num_cargos=int(params.get("num_cargos", 3)),
        )
        
    else:
        raise ValueError(f"Função desconhecida: '{funcao}'")


def main():
    """Entrada CLI para comunicação com o servidor Express"""
    try:
        entrada_raw = sys.argv[1] if len(sys.argv) > 1 else sys.stdin.read()
        if not entrada_raw.strip():
            print(json.dumps({"ok": False, "erro": "Nenhum dado JSON fornecido"}))
            return
            
        dados = json.loads(entrada_raw)
        resultado = despachar(dados)
        print(json.dumps({"ok": True, "dados": resultado}))
    except Exception as e:
        print(json.dumps({"ok": False, "erro": str(e)}))


if __name__ == "__main__":
    main()
