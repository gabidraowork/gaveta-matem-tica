# Plano de Implementação: Ciclovia da Lagoa Circular (ENEM)

## 1. Visão Geral e Princípio Pedagógico

O usuário solicitou a implementação da questão do ENEM sobre a **ciclovia em torno da lagoa circular** (raio $1\text{ km}$, $\pi \approx 3$, proteção até $200\text{ m}$ por policial).

**Requisito central:** Não entregar a resposta de bandeja (*"tente não dar resposta"*). O aluno deve experimentar, mover o ponto $P$, variar o número de policiais no controle deslizante livre e constatar visual e matematicamente em qual quantidade a ciclovia fica 100% protegida.

---

## 2. Modelagem Matemática do Problema

- **Raio da lagoa:** $R = 1\text{ km} = 1.000\text{ m}$
- **Comprimento total da ciclovia:**
  $$C = 2 \cdot \pi \cdot R \approx 2 \cdot 3 \cdot 1.000 = 6.000\text{ m}$$
- **Zona de cobertura de cada policial:**
  - O enunciado estabelece que um ponto $P$ está protegido se houver um policial a, no máximo, $200\text{ m}$ dele sobre a ciclovia.
  - Logo, um policial posicionado na ciclovia protege até $200\text{ m}$ no sentido horário e até $200\text{ m}$ no sentido anti-horário.
  - **Arco total protegido por cada policial:** $200\text{ m} + 200\text{ m} = 400\text{ m}$.
- **Condição de proteção total:**
  - Para cobrir todos os $6.000\text{ m}$ sem lacunas:
  $$N \ge \frac{6.000\text{ m}}{400\text{ m}} = 15\text{ policiais}$$
- **Descoberta do aluno:**
  - Com $N < 15$ (ex: $N=4$ ou $N=8$), surgem arcos vermelhos desprotegidos. Se o ponto $P$ for colocado numa dessas brechas, o status acusa "Desprotegido".
  - Com $N = 15$, os arcos se tocam perfeitamente nos extremos.
  - Com $N > 15$, há sobreposição de proteção.

---

## 3. Arquitetura da Gaveta Interativa

### A. Novo Módulo de Gaveta
- Caminho: `src/drawers/questao-enem-ciclovia-policiais/index.ts`
- Categoria: `geometria-2d` / `modelagem-matematica`
- Badge: `ENEM · Geometria Plana & Otimização`

### B. Elementos Visuais da Cena
1. **Lagoa Circular:**
   - Círculo de água azul central com visual limpo e didático fiel à imagem da prova (`enem2025-q139-figura.png`).
   - Indicação de raio $R = 1\text{ km} = 1.000\text{ m}$.
2. **Ciclovia Perimétrica:**
   - Pista circular com perímetro de $6.000\text{ m}$ no entorno da lagoa.
3. **Policiais e Arcos de Proteção:**
   - Cada policial é indicado por um ícone de distintivo/policial distribuído na pista.
   - De cada policial estende-se uma zona em cinza escuro (fiel à figura da questão) medindo $200\text{ m}$ para a esquerda e $200\text{ m}$ para a direita ($400\text{ m}$ de cobertura total).
   - Trechos desprotegidos ficam evidenciados em vermelho/alerta com o comprimento da brecha.
4. **Ponto $P$ Interativo e Arrastável:**
   - Marcador circular amarelo com a letra **$P$** (exatamente como na ilustração do ENEM).
   - O estudante pode arrastar o ponto $P$ livremente ao longo de qualquer trecho da ciclovia com o mouse ou toque no celular.
   - Mostra em tempo real:
     - Distância até o policial mais próximo em metros.
     - Status: `Ponto P Protegido (distância ≤ 200m)` ou `Ponto P Desprotegido (distância > 200m)`.

---

## 4. Controles e Ergonomia (Mobile e Desktop)

- **Controle Deslizante Numérico Livre:**
  - Slider de 1 a 30 policiais (padrão inicial em 4 ou 8 para incentivar a exploração sem entregar a resposta).
  - Indicador numérico claro com botões de ajuste fino `+` e `-`.
- **Barra de Telemetria Neutra (Sem Spoilers):**
  - Mostra:
    - Comprimento da Ciclovia: $6.000\text{ m}$ ($2 \cdot 3 \cdot 1.000\text{ m}$).
    - Cobertura Total Atual: $X\text{ m} / 6.000\text{ m}$ ($Y\%$).
    - Lacunas desprotegidas: $Z\text{ metros}$ restantes.
- **Alternar Visualização das Regiões de 200m:**
  - Toggle para destacar as réguas de $200\text{ m}$ dos policiais e as cotas angulares.

---

## 5. Integração com Python e Sistema Modular

1. **Adicionar função em `scripts/matematica.py`**:
   - `calcular_cobertura_ciclovia(raio_km=1.0, pi_aprox=3.0, alcance_m=200, num_policiais=...)`
   - Retorna dados precisos de perímetro, arcos e verificação de pontos.
2. **Registrar a Gaveta no Sistema**:
   - Inserir no array `todasAsGavetas` em `src/drawers/index.ts`.
   - Adicionar guia didático com o enunciado completo e as opções de múltipla escolha A, B, C, D, E na aba pedagógica.
3. **Verificação de Compilação e Linting**:
   - Executar `compile_applet` e `lint_applet` para garantir zero erros.
