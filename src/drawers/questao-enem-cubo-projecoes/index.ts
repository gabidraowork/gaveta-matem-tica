/**
 * GAVETA DIDÁTICA: Questão ENEM - Deslocamento 3D & Projeções Ortogonais
 * 
 * Configuração dos Eixos alinhada 100% com a figura da prova do ENEM:
 * - Eixo Z: vertical para CIMA (com seta e rótulo "z")
 * - Eixo X: para FRENTE-ESQUERDA (com seta e rótulo "x")
 * - Eixo Y: para FRENTE-DIREITA (com seta e rótulo "y")
 * - Origem (0, 0, 0): no vértice posterior do triedro
 * - Plano XZ: parede à ESQUERDA
 * - Plano ZY (YZ): parede à FRENTE/DIREITA
 * - Plano XY: chão EM BAIXO
 * 
 * ALINHAMENTO NA MALHA (GRID):
 * O cubo unitário (1×1×1) e suas projeções encaixam PERFEITAMENTE dentro dos
 * quadrados da malha, delimitados pelas linhas tracejadas:
 * Para coordenada inteira (x, y, z):
 * - O cubo ocupa o intervalo [x - 1, x] × [y - 1, y] × [z - 1, z]
 * - Posição inicial: x = 6, y = 2, z = 7 -> [5, 6] × [1, 2] × [6, 7]
 * - Movimento:
 *   1. Aproximou 3 unid. de zy -> x = 6 - 3 = 3 (ocupa [2, 3])
 *   2. Afastou 5 unid. de xz   -> y = 2 + 5 = 7 (ocupa [6, 7])
 *   3. Aproximou 4 unid. de xy -> z = 7 - 4 = 3 (ocupa [2, 3])
 * - Posição final: (x = 3, y = 7, z = 3) -> [2, 3] × [6, 7] × [2, 3]
 */

import * as THREE from 'three';
import { DrawerInstance, DrawerModule, DrawerState } from '../types';

export const QuestaoEnemCuboDrawer: DrawerModule = {
  id: 'enem-cubo-projecoes-3d',
  questionNumber: 3,
  title: 'Questão 3 · Cubo 3D & Projeções Ortogonais',
  subtitle: 'Geometria Espacial · Cubo Encaixado na Malha Quadriculada',
  description: 'Visualização tridimensional fiel com o cubo encaixado exatamente nos quadrados da malha e controles livres nos eixos X, Y e Z.',
  category: 'geometria-3d',
  badge: 'ENEM · Questão 3',
  iconName: 'Box',

  mathContext: {
    enunciado: 'Em um jogo de computador, um cubo se encontra inicialmente posicionado na coordenada (6, 2, 7), ocupando o quadrado da malha [5, 6] × [1, 2] × [6, 7]. Cada deslocamento efetuado por esse cubo se dá sempre em uma das direções definidas pelos três eixos coordenados. Ao se movimentar a partir da posição inicial, esse cubo se aproximou 3 unidades do plano yz, se afastou 5 unidades do plano xz e se aproximou 4 unidades do plano xy. Identifique as projeções ortogonais resultantes sobre os três planos coordenados.',
    formula: 'd(P, plano yz) = x · d(P, plano xz) = y · d(P, plano xy) = z',
    explicacao: '1. Posição inicial: x = 6 (célula [5, 6]), y = 2 (célula [1, 2]), z = 7 (célula [6, 7]).\n2. Aproximou 3 unidades de zy: x diminui em 3 -> x = 6 - 3 = 3 (célula [2, 3]).\n3. Afastou 5 unidades de xz: y aumenta em 5 -> y = 2 + 5 = 7 (célula [6, 7]).\n4. Aproximou 4 unidades de xy: z diminui em 4 -> z = 7 - 4 = 3 (célula [2, 3]).\nResultado final: O cubo fica perfeitamente encaixado no quadrado da malha (3, 7, 3), projetando sua sombra ortogonal exatamente em:\n- Plano xy (em baixo): célula [2, 3] × [6, 7]\n- Plano xz (à esquerda): célula [2, 3] × [2, 3]\n- Plano zy (à frente/direita): célula [6, 7] × [2, 3]',
    dicaPedagogica: 'Note que cada cubo unitário e sua respectiva sombra estão delimitados perfeitamente pelas linhas tracejadas da malha, sem cruzar o meio dos quadrados!',
    codigoPython: 'resolver_cubo_enem(x_inicial=6, y_inicial=2, z_inicial=7)',
  },

  controls: [
    {
      id: 'posX',
      label: 'Eixo X (Distância a zy)',
      type: 'range',
      min: 1,
      max: 8,
      step: 1,
      defaultValue: 6,
      unit: '',
      description: 'Posição inteira na malha do eixo X (aproxima ou afasta do plano zy da frente).',
    },
    {
      id: 'posY',
      label: 'Eixo Y (Distância a xz)',
      type: 'range',
      min: 1,
      max: 8,
      step: 1,
      defaultValue: 2,
      unit: '',
      description: 'Posição inteira na malha do eixo Y (afasta ou aproxima do plano xz da esquerda).',
    },
    {
      id: 'posZ',
      label: 'Eixo Z (Distância a xy)',
      type: 'range',
      min: 1,
      max: 8,
      step: 1,
      defaultValue: 7,
      unit: '',
      description: 'Posição inteira na malha do eixo Z (aproxima ou afasta do chão xy).',
    },
    {
      id: 'anguloCamera',
      label: 'Perspectiva da Câmera',
      type: 'select',
      defaultValue: 'enem',
      options: [
        { label: 'Perspectiva Original ENEM', value: 'enem' },
        { label: 'Visão 3D Livre (Orbital)', value: 'livre' },
        { label: 'Vista Superior (Plano xy)', value: 'superior' },
        { label: 'Vista Frontal (Plano xz)', value: 'frontal' },
        { label: 'Vista Lateral (Plano zy)', value: 'lateral' },
      ],
      description: 'Altera o ponto de vista da câmera.',
    },
    {
      id: 'mostrarLinhasProjecao',
      label: 'Linhas Pontilhadas de Projeção',
      type: 'toggle',
      defaultValue: true,
      description: 'Exibe as retas pontilhadas ligando o cubo às projeções.',
    },
    {
      id: 'mostrarFantasmaInicial',
      label: 'Cubo Fantasma Inicial (6, 2, 7)',
      type: 'toggle',
      defaultValue: true,
      description: 'Mostra o cubo na posição de partida (6, 2, 7) para comparação.',
    },
    {
      id: 'mostrarRotulosPlanos',
      label: 'Rótulos dos Planos em 3D',
      type: 'toggle',
      defaultValue: true,
      description: 'Exibe os nomes "Plano xz", "Plano zy", "Plano xy" na cena.',
    },
  ],

  mount: (container: HTMLElement, initialState: DrawerState): DrawerInstance => {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Fundo papel didático

    // Renderizador WebGL
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const canvas = renderer.domElement;
    canvas.className = 'w-full h-full block cursor-grab active:cursor-grabbing';
    container.innerHTML = '';
    container.appendChild(canvas);

    // Câmera Perspectiva
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

    // Iluminação balanceada
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.95);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.25);
    dirLight.position.set(12, 22, 18);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.45);
    fillLight.position.set(-14, 8, -10);
    scene.add(fillLight);

    const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

    // GRUPO PRINCIPAL DO SISTEMA DE COORDENADAS
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, -2.2, 0);
    scene.add(rootGroup);

    /**
     * MATEMÁTICA DOS EIXOS:
     * - Eixo Z (vertical para cima): Vector3(0, 1, 0)
     * - Eixo X (para frente e esquerda): Vector3(-cos(45°), 0, sin(45°)) = (-√2/2, 0, √2/2)
     * - Eixo Y (para frente e direita):  Vector3( cos(45°), 0, sin(45°)) = ( √2/2, 0, √2/2)
     */
    const SQRT2_INV = Math.SQRT1_2; // ≈ 0.7071

    const dirX = new THREE.Vector3(-SQRT2_INV, 0, SQRT2_INV);
    const dirY = new THREE.Vector3(SQRT2_INV, 0, SQRT2_INV);
    const dirZ = new THREE.Vector3(0, 1, 0);

    /** Converte coordenada matemática (x, y, z) em posição Three.js */
    function mathToThree(x: number, y: number, z: number): THREE.Vector3 {
      return new THREE.Vector3(
        (y - x) * SQRT2_INV,
        z,
        (x + y) * SQRT2_INV
      );
    }

    /**
     * Função auxiliar para criar sprites de texto nítidos em 3D
     */
    function criarSpriteTexto(
      texto: string,
      opcoes?: {
        corFundo?: string;
        corTexto?: string;
        fontSize?: number;
        padding?: number;
        scale?: number;
        italic?: boolean;
      }
    ) {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d')!;
      const fontSize = opcoes?.fontSize || 40;
      const padding = opcoes?.padding || 12;
      const fontStyle = opcoes?.italic ? 'italic bold' : 'bold';
      ctx.font = `${fontStyle} ${fontSize}px "Plus Jakarta Sans", sans-serif`;

      const textWidth = ctx.measureText(texto).width;
      const w = textWidth + padding * 2;
      const h = fontSize + padding * 2;

      c.width = w * 2;
      c.height = h * 2;
      ctx.scale(2, 2);

      if (opcoes?.corFundo) {
        ctx.fillStyle = opcoes.corFundo;
        ctx.beginPath();
        ctx.roundRect(0, 0, w, h, 8);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.fillStyle = opcoes?.corTexto || '#0f172a';
      ctx.font = `${fontStyle} ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(texto, w / 2, h / 2);

      const texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      disposables.push(texture);

      const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
      disposables.push(spriteMat);

      const sprite = new THREE.Sprite(spriteMat);
      const s = opcoes?.scale || 1.0;
      sprite.scale.set((w / 70) * s, (h / 70) * s, 1);
      return sprite;
    }

    // 1. CONSTRUÇÃO DOS TRÊS PLANOS COM MALHAS TRACEJADAS
    const gridSize = 8;

    function criarGradePlano(eixo1: THREE.Vector3, eixo2: THREE.Vector3) {
      const linePositions: number[] = [];

      for (let i = 0; i <= gridSize; i++) {
        // Linhas paralelas a eixo2
        const pInicio1 = eixo1.clone().multiplyScalar(i);
        const pFim1 = pInicio1.clone().add(eixo2.clone().multiplyScalar(gridSize));
        linePositions.push(pInicio1.x, pInicio1.y, pInicio1.z, pFim1.x, pFim1.y, pFim1.z);

        // Linhas paralelas a eixo1
        const pInicio2 = eixo2.clone().multiplyScalar(i);
        const pFim2 = pInicio2.clone().add(eixo1.clone().multiplyScalar(gridSize));
        linePositions.push(pInicio2.x, pInicio2.y, pInicio2.z, pFim2.x, pFim2.y, pFim2.z);
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      disposables.push(geom);

      const mat = new THREE.LineDashedMaterial({
        color: 0x94a3b8,
        dashSize: 0.18,
        gapSize: 0.12,
        linewidth: 1,
      });
      disposables.push(mat);

      const line = new THREE.LineSegments(geom, mat);
      line.computeLineDistances();
      return line;
    }

    // Plano XY: EM BAIXO (chão, entre eixos X e Y)
    const gradeXY = criarGradePlano(dirX, dirY);
    rootGroup.add(gradeXY);

    // Plano XZ: À ESQUERDA (entre eixos X e Z)
    const gradeXZ = criarGradePlano(dirX, dirZ);
    rootGroup.add(gradeXZ);

    // Plano ZY (YZ): À FRENTE / DIREITA (entre eixos Y e Z)
    const gradeZY = criarGradePlano(dirY, dirZ);
    rootGroup.add(gradeZY);

    // Rótulos 3D flutuantes nos planos
    const rotulosPlanosGroup = new THREE.Group();

    const rotuloXZ = criarSpriteTexto('Plano xz (esquerda)', {
      corFundo: 'rgba(255, 255, 255, 0.9)',
      corTexto: '#1e40af',
      fontSize: 26,
      scale: 0.85,
    });
    rotuloXZ.position.copy(mathToThree(4.5, 0, 4.5)).add(new THREE.Vector3(-0.2, 0, -0.2));

    const rotuloZY = criarSpriteTexto('Plano zy (frente/direita)', {
      corFundo: 'rgba(255, 255, 255, 0.9)',
      corTexto: '#047857',
      fontSize: 26,
      scale: 0.85,
    });
    rotuloZY.position.copy(mathToThree(0, 4.5, 4.5)).add(new THREE.Vector3(0.2, 0, -0.2));

    const rotuloXY = criarSpriteTexto('Plano xy (em baixo)', {
      corFundo: 'rgba(255, 255, 255, 0.9)',
      corTexto: '#b45309',
      fontSize: 26,
      scale: 0.85,
    });
    rotuloXY.position.copy(mathToThree(4.5, 4.5, 0)).add(new THREE.Vector3(0, 0.3, 0));

    rotulosPlanosGroup.add(rotuloXZ, rotuloZY, rotuloXY);
    rootGroup.add(rotulosPlanosGroup);

    // 2. EIXOS COORDENADOS COM SETAS E LETRAS X, Y, Z
    const eixoGrossura = 0.055;
    const eixoComprimento = 9.4;

    function criarEixo(direcao: THREE.Vector3, letra: string) {
      const g = new THREE.Group();

      const geomCilindro = new THREE.CylinderGeometry(eixoGrossura, eixoGrossura, eixoComprimento, 16);
      const matEixo = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
      disposables.push(geomCilindro, matEixo);

      const cilindro = new THREE.Mesh(geomCilindro, matEixo);
      cilindro.position.copy(direcao.clone().multiplyScalar(eixoComprimento / 2));
      cilindro.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direcao);
      g.add(cilindro);

      const geomCone = new THREE.ConeGeometry(0.22, 0.55, 16);
      disposables.push(geomCone);
      const cone = new THREE.Mesh(geomCone, matEixo);
      cone.position.copy(direcao.clone().multiplyScalar(eixoComprimento));
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direcao);
      g.add(cone);

      const spriteLetra = criarSpriteTexto(letra, {
        corFundo: '#0f172a',
        corTexto: '#ffffff',
        fontSize: 34,
        scale: 0.75,
        italic: true,
      });
      spriteLetra.position.copy(direcao.clone().multiplyScalar(eixoComprimento + 0.65));
      g.add(spriteLetra);

      return g;
    }

    const eixoZ = criarEixo(dirZ, 'z');
    const eixoX = criarEixo(dirX, 'x');
    const eixoY = criarEixo(dirY, 'y');

    const rotuloOrigem = criarSpriteTexto('(0,0,0)', {
      corFundo: 'rgba(255, 255, 255, 0.85)',
      corTexto: '#475569',
      fontSize: 22,
      scale: 0.6,
    });
    rotuloOrigem.position.set(0, -0.3, 0);

    rootGroup.add(eixoZ, eixoX, eixoY, rotuloOrigem);

    // 3. O CUBO PRINCIPAL (1×1×1 UNITÁRIO ENCAIXADO NA MALHA)
    const cubeGeom = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Azul clássico do ENEM
      roughness: 0.25,
      metalness: 0.1,
    });
    disposables.push(cubeGeom, cubeMat);

    const mainCube = new THREE.Mesh(cubeGeom, cubeMat);
    mainCube.rotation.y = Math.PI / 4;

    const edgeGeom = new THREE.EdgesGeometry(cubeGeom);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 2 });
    disposables.push(edgeGeom, edgeMat);
    mainCube.add(new THREE.LineSegments(edgeGeom, edgeMat));

    rootGroup.add(mainCube);

    // CUBO FANTASMA ENCAIXADO NA MALHA NA POSIÇÃO INICIAL (6, 2, 7) -> [5, 6] × [1, 2] × [6, 7]
    const ghostMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.35,
      roughness: 0.5,
    });
    disposables.push(ghostMat);
    const ghostCube = new THREE.Mesh(cubeGeom, ghostMat);
    ghostCube.rotation.y = Math.PI / 4;

    const ghostEdgeMat = new THREE.LineDashedMaterial({ color: 0x3b82f6, dashSize: 0.15, gapSize: 0.1 });
    disposables.push(ghostEdgeMat);
    const ghostEdges = new THREE.LineSegments(edgeGeom, ghostEdgeMat);
    ghostEdges.computeLineDistances();
    ghostCube.add(ghostEdges);

    // Centro do quadrado da malha [5, 6] × [1, 2] × [6, 7] = (5.5, 1.5, 6.5)
    ghostCube.position.copy(mathToThree(5.5, 1.5, 6.5));
    rootGroup.add(ghostCube);

    // 4. QUADRADOS DE PROJEÇÃO ORTOGONAL ENCAIXADOS NA MALHA
    const projGeom = new THREE.PlaneGeometry(1.0, 1.0);
    const projMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.3,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    disposables.push(projGeom, projMat);

    // Projeção no plano XY (chão)
    const projXY = new THREE.Mesh(projGeom, projMat);
    projXY.rotation.x = -Math.PI / 2;
    projXY.rotation.z = Math.PI / 4;
    rootGroup.add(projXY);

    // Projeção no plano XZ (parede da esquerda)
    const projXZ = new THREE.Mesh(projGeom, projMat);
    projXZ.rotation.y = Math.PI / 4;
    rootGroup.add(projXZ);

    // Projeção no plano ZY (parede da direita/frente)
    const projZY = new THREE.Mesh(projGeom, projMat);
    projZY.rotation.y = -Math.PI / 4;
    rootGroup.add(projZY);

    // 5. LINHAS PONTILHADAS DE PROJEÇÃO LIGANDO O CUBO AOS VÉRTICES DA MALHA
    const dottedMat = new THREE.LineDashedMaterial({
      color: 0x1e293b,
      dashSize: 0.18,
      gapSize: 0.12,
      linewidth: 1.5,
    });
    disposables.push(dottedMat);

    const dottedLinesGroup = new THREE.Group();
    rootGroup.add(dottedLinesGroup);

    /**
     * Posiciona o cubo encaixado exatamente no quadrado da malha:
     * Para índice inteiro (x, y, z):
     * O cubo ocupa de x-1 até x, de y-1 até y, de z-1 até z.
     * O centro fica em (x - 0.5, y - 0.5, z - 0.5).
     */
    function posicionarCuboNaMalha(x: number, y: number, z: number) {
      // Centro do cubo no grid
      const cx = x - 0.5;
      const cy = y - 0.5;
      const cz = z - 0.5;

      const pos3D = mathToThree(cx, cy, cz);
      mainCube.position.copy(pos3D);

      // Projeção no plano XY (chão: z = 0)
      const posProjXY = mathToThree(cx, cy, 0.01);
      projXY.position.copy(posProjXY);

      // Projeção no plano XZ (parede esquerda: y = 0)
      const posProjXZ = mathToThree(cx, 0.01, cz);
      projXZ.position.copy(posProjXZ);

      // Projeção no plano ZY (parede direita: x = 0)
      const posProjZY = mathToThree(0.01, cy, cz);
      projZY.position.copy(posProjZY);

      // Limpar linhas pontilhadas anteriores
      while (dottedLinesGroup.children.length > 0) {
        dottedLinesGroup.remove(dottedLinesGroup.children[0]);
      }

      // Os 4 cantos do quadrado no grid: de (x-1) a x, e de (y-1) a y
      const x0 = x - 1;
      const x1 = x;
      const y0 = y - 1;
      const y1 = y;
      const z0 = z - 1;
      const z1 = z;

      const cantosXY = [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ];

      const ptsLinhas: number[] = [];

      cantosXY.forEach(([px, py]) => {
        // Linhas verticais para o plano XY (chão)
        const vCuboXY = mathToThree(px, py, z0);
        const vChaoXY = mathToThree(px, py, 0);
        ptsLinhas.push(vCuboXY.x, vCuboXY.y, vCuboXY.z, vChaoXY.x, vChaoXY.y, vChaoXY.z);

        // Linhas para o plano XZ (parede esquerda: y vai a 0)
        const vCuboXZ = mathToThree(px, y0, z1);
        const vParedeXZ = mathToThree(px, 0, z1);
        ptsLinhas.push(vCuboXZ.x, vCuboXZ.y, vCuboXZ.z, vParedeXZ.x, vParedeXZ.y, vParedeXZ.z);

        // Linhas para o plano ZY (parede direita: x vai a 0)
        const vCuboZY = mathToThree(x0, py, z1);
        const vParedeZY = mathToThree(0, py, z1);
        ptsLinhas.push(vCuboZY.x, vCuboZY.y, vCuboZY.z, vParedeZY.x, vParedeZY.y, vParedeZY.z);
      });

      const geomDotted = new THREE.BufferGeometry();
      geomDotted.setAttribute('position', new THREE.Float32BufferAttribute(ptsLinhas, 3));
      disposables.push(geomDotted);

      const l = new THREE.LineSegments(geomDotted, dottedMat);
      l.computeLineDistances();
      dottedLinesGroup.add(l);
    }

    function atualizarPorEstado(params: Record<string, any>) {
      const x = Math.max(1, Math.min(8, Math.round(Number(params.posX ?? 6))));
      const y = Math.max(1, Math.min(8, Math.round(Number(params.posY ?? 2))));
      const z = Math.max(1, Math.min(8, Math.round(Number(params.posZ ?? 7))));
      posicionarCuboNaMalha(x, y, z);
    }

    // 6. CÂMERA & CONTROLE ORBITAL (VISÃO ENQUADRADA FIEL AO ENEM)
    let isDragging = false;
    let prevPointer = { x: 0, y: 0 };
    let pinchDist = 0;

    let cameraAngles = {
      radius: 24,
      theta: 0,
      phi: 1.15,
    };

    // Em telas estreitas (retrato/tablet) a câmera recua um pouco mais para a malha caber inteira
    function fatorEnquadramento() {
      const aspecto = camera.aspect || 1;
      return Math.min(1.8, Math.max(1, 1.25 / aspecto));
    }

    function aplicarPosicaoCamera() {
      cameraAngles.radius = Math.max(14, Math.min(48, cameraAngles.radius));
      cameraAngles.phi = Math.max(0.1, Math.min(Math.PI / 2 + 0.1, cameraAngles.phi));

      // alvo um pouco mais baixo: a cena sobe na tela e não fica atrás da doca de controles
      const centroAlvo = new THREE.Vector3(0, 2.6, 4.5);
      const r = cameraAngles.radius * fatorEnquadramento();

      camera.position.x = centroAlvo.x + r * Math.sin(cameraAngles.phi) * Math.sin(cameraAngles.theta);
      camera.position.y = centroAlvo.y + r * Math.cos(cameraAngles.phi);
      camera.position.z = centroAlvo.z + r * Math.sin(cameraAngles.phi) * Math.cos(cameraAngles.theta);
      camera.lookAt(centroAlvo);
    }

    // Guarda a última perspectiva aplicada: mover o cubo não deve reposicionar a câmera
    let presetAtual = '';

    function definirPresetCamera(preset: string) {
      presetAtual = preset;
      if (preset === 'enem') {
        cameraAngles.radius = 30;
        cameraAngles.theta = 0;
        cameraAngles.phi = 1.15;
      } else if (preset === 'superior') {
        cameraAngles.radius = 28;
        cameraAngles.theta = 0;
        cameraAngles.phi = 0.08;
      } else if (preset === 'frontal') {
        cameraAngles.radius = 28;
        cameraAngles.theta = -Math.PI / 4;
        cameraAngles.phi = Math.PI / 2.3;
      } else if (preset === 'lateral') {
        cameraAngles.radius = 28;
        cameraAngles.theta = Math.PI / 4;
        cameraAngles.phi = Math.PI / 2.3;
      }
      aplicarPosicaoCamera();
    }

    definirPresetCamera(initialState.params.anguloCamera || 'enem');

    // Eventos de Toque e Mouse para Orbitar
    function onPointerDown(e: PointerEvent) {
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return;
      const dx = e.clientX - prevPointer.x;
      const dy = e.clientY - prevPointer.y;

      cameraAngles.theta -= dx * 0.006;
      cameraAngles.phi += dy * 0.006;
      aplicarPosicaoCamera();

      prevPointer = { x: e.clientX, y: e.clientY };
    }

    function onPointerUp(e: PointerEvent) {
      isDragging = false;
      canvas.releasePointerCapture?.(e.pointerId);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      cameraAngles.radius += e.deltaY * 0.02;
      aplicarPosicaoCamera();
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchDist = Math.hypot(dx, dy);
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        cameraAngles.radius += (pinchDist - dist) * 0.035;
        pinchDist = dist;
        aplicarPosicaoCamera();
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    // 7. LOOP DE RENDERIZAÇÃO
    let animId: number;

    // Inicialização na posição inicial (6, 2, 7)
    atualizarPorEstado(initialState.params);
    dottedLinesGroup.visible = initialState.params.mostrarLinhasProjecao !== false;
    ghostCube.visible = initialState.params.mostrarFantasmaInicial !== false;
    rotulosPlanosGroup.visible = initialState.params.mostrarRotulosPlanos !== false;

    function renderLoop() {
      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    }

    renderLoop();

    // 8. INTERFACE DE CONTROLE EXTERNO DO MÓDULO
    return {
      update: (newState: DrawerState) => {
        atualizarPorEstado(newState.params);

        dottedLinesGroup.visible = newState.params.mostrarLinhasProjecao !== false;
        ghostCube.visible = newState.params.mostrarFantasmaInicial !== false;
        rotulosPlanosGroup.visible = newState.params.mostrarRotulosPlanos !== false;

        // Só troca a câmera quando o professor escolhe outra perspectiva
        // (antes, cada movimento do cubo voltava o zoom para o padrão)
        if (newState.params.anguloCamera && newState.params.anguloCamera !== presetAtual) {
          definirPresetCamera(newState.params.anguloCamera);
        }
      },

      step: (_direction: 1 | -1) => {
        // Manipulação livre pelo grid
      },

      play: () => {},
      pause: () => {},

      reset: () => {
        posicionarCuboNaMalha(6, 2, 7);
        definirPresetCamera('enem');
      },

      resize: (w: number, h: number) => {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        aplicarPosicaoCamera();
      },

      destroy: () => {
        cancelAnimationFrame(animId);

        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('wheel', onWheel);
        canvas.removeEventListener('touchstart', onTouchStart);
        canvas.removeEventListener('touchmove', onTouchMove);

        disposables.forEach((item) => {
          if ('dispose' in item && typeof item.dispose === 'function') {
            item.dispose();
          }
        });
        renderer.dispose();
        container.innerHTML = '';
      },
    };
  },
};
