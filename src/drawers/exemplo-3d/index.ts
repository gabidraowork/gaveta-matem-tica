/**
 * GAVETA DEMONSTRATIVA 3D: Geometria Espacial & Cubo Unitário
 * 
 * Demonstração completa em Three.js totalmente isolada em módulo próprio.
 * Permite ao professor e aos alunos:
 * - Girar a cena 3D arrastando com o dedo ou mouse
 * - Dar zoom com pinça (toque) ou roda do mouse
 * - "Explodir" os blocos unitários para contar cubos de vértices, faces e miolo
 * - Controlar rotação contínua (Play/Pause), passo a passo e reiniciar
 */

import * as THREE from 'three';
import { DrawerInstance, DrawerModule, DrawerState } from '../types';

export const Exemplo3DDrawer: DrawerModule = {
  id: 'geometria-cubo-3d',
  title: 'Decomposição Cúbica 3D',
  subtitle: 'Geometria Espacial · Contagem de Blocos & Simetria',
  description: 'Visualização tridimensional de um cubo n×n×n decomposto em blocos unitários com controle de explosão espacial e malha cartesiana.',
  category: 'geometria-3d',
  badge: 'Three.js 3D',
  iconName: 'Box',

  mathContext: {
    enunciado: 'Dado um cubo maciço de aresta n dividido em n³ pequenos cubos unitários, como se distribuem os cubos de acordo com a quantidade de faces externas pintadas?',
    formula: 'V(n) = n³ · Cubos nos vértices: 8 · Cubos nas arestas: 12(n-2) · Faces: 6(n-2)² · Miolo: (n-2)³',
    explicacao: 'Use o controle de "Afastamento (Explosão)" para separar os cubos no espaço tridimensional. Essa visualização permite que os alunos enxerguem com clareza o núcleo interno (que não tem faces expostas) e a diferença entre blocos de arestas e vértices.',
    dicaPedagogica: 'Peça aos alunos para contarem quantos cubos existem na visualização 3×3×3 (total 27). Em seguida, afaste os blocos e mostre que apenas 1 cubo fica escondido no centro sem nenhuma face visível!',
    codigoPython: 'geometria_cubo(arestas=3, espacamento=1.2)',
  },

  controls: [
    {
      id: 'dimensao',
      label: 'Divisão por Eixo (n)',
      type: 'select',
      defaultValue: 3,
      options: [
        { label: '2×2×2 (8 cubos unitários)', value: 2 },
        { label: '3×3×3 (27 cubos unitários)', value: 3 },
        { label: '4×4×4 (64 cubos unitários)', value: 4 },
      ],
      description: 'Define a ordem n do cubo espacial.',
    },
    {
      id: 'afastamento',
      label: 'Afastamento / Explosão',
      type: 'range',
      min: 0,
      max: 1.5,
      step: 0.05,
      defaultValue: 0.35,
      unit: '',
      description: 'Separa os blocos unitários para inspecionar o interior.',
    },
    {
      id: 'mostrarEixos',
      label: 'Eixos Cartesianos (X, Y, Z)',
      type: 'toggle',
      defaultValue: true,
      description: 'Exibe os eixos tridimensionais de referência.',
    },
    {
      id: 'estiloBlocos',
      label: 'Estilo dos Blocos',
      type: 'select',
      defaultValue: 'colorido',
      options: [
        { label: 'Colorido por Camada', value: 'colorido' },
        { label: 'Acrílico Translúcido', value: 'translucido' },
        { label: 'Aramado Matemático', value: 'aramado' },
      ],
      description: 'Altera o material dos cubos.',
    },
  ],

  mount: (container: HTMLElement, initialState: DrawerState): DrawerInstance => {
    // 1. CONFIGURAÇÃO BÁSICA DO THREE.JS
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc); // Fundo papel claro acadêmico

    // Câmera Perspectiva
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(7, 5, 8);
    camera.lookAt(0, 0, 0);

    // Renderizador WebGL otimizado
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

    // 2. ILUMINAÇÃO DE ESTÚDIO ACADÊMICO
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 15, 10);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.4);
    fillLight.position.set(-10, -5, -10);
    scene.add(fillLight);

    // 3. GRADE CARTESIANA DE REFERÊNCIA NO CHÃO
    const grid = new THREE.GridHelper(12, 12, 0x94a3b8, 0xe2e8f0);
    grid.position.y = -2.2;
    scene.add(grid);

    // Eixos X (vermelho), Y (verde), Z (azul)
    const axesHelper = new THREE.AxesHelper(3.5);
    axesHelper.position.y = -2.18;
    scene.add(axesHelper);

    // 4. GRUPO PRINCIPAL DO CUBO INTERATIVO
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Cores pedagógicas vibrantes e elegantes para as camadas
    const palette = [
      0x2563eb, // Azul Royal
      0x059669, // Esmeralda
      0xd97706, // Âmbar
      0x7c3aed, // Violeta
      0xdc2626, // Coral
    ];

    // Recursos descartáveis (para limpeza adequada de memória)
    const disposables: (THREE.BufferGeometry | THREE.Material)[] = [];

    // Função que reconstrói os blocos quando o tamanho ou estilo mudam
    function reconstruirCubos(n: number, afastamento: number, estilo: string) {
      // Limpar blocos existentes
      while (cubeGroup.children.length > 0) {
        const obj = cubeGroup.children[0] as THREE.Mesh;
        cubeGroup.remove(obj);
      }

      const cubeSize = 0.92;
      const baseGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      disposables.push(baseGeometry);

      const offset = ((n - 1) * (1 + afastamento)) / 2;

      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          for (let z = 0; z < n; z++) {
            let material: THREE.Material;

            if (estilo === 'translucido') {
              material = new THREE.MeshPhysicalMaterial({
                color: palette[(x + y + z) % palette.length],
                transparent: true,
                opacity: 0.6,
                roughness: 0.15,
                metalness: 0.1,
              });
            } else if (estilo === 'aramado') {
              material = new THREE.MeshBasicMaterial({
                color: palette[(x + y + z) % palette.length],
                wireframe: true,
              });
            } else {
              // Colorido padrão
              material = new THREE.MeshStandardMaterial({
                color: palette[(x + y + z) % palette.length],
                roughness: 0.35,
                metalness: 0.15,
              });
            }
            disposables.push(material);

            const mesh = new THREE.Mesh(baseGeometry, material);
            const posX = x * (1 + afastamento) - offset;
            const posY = y * (1 + afastamento) - offset;
            const posZ = z * (1 + afastamento) - offset;

            mesh.position.set(posX, posY, posZ);
            mesh.userData = { originalX: x, originalY: y, originalZ: z };

            // Adiciona arestas pretas nítidas para visualização matemática precisa
            if (estilo !== 'aramado') {
              const edgesGeom = new THREE.EdgesGeometry(baseGeometry);
              const edgesMat = new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 1.5 });
              disposables.push(edgesGeom, edgesMat);
              const wireframe = new THREE.LineSegments(edgesGeom, edgesMat);
              mesh.add(wireframe);
            }

            cubeGroup.add(mesh);
          }
        }
      }
    }

    // 5. ESTADO LOCAL E CONTROLE ORBITAL UNIVERSAL (MOUSE + TOUCH)
    let isPlaying = initialState.isPlaying;
    let autoRotateSpeed = 0.015 * initialState.speed;
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let initialPinchDistance = 0;

    // Estado da câmera em coordenadas esféricas
    let spherical = {
      radius: 12,
      theta: Math.PI / 4,
      phi: Math.PI / 3.2,
    };

    function atualizarCamera() {
      // Clamping de segurança
      spherical.radius = Math.max(4, Math.min(22, spherical.radius));
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    }
    atualizarCamera();

    // Eventos de Ponteiro Unificados (Desktop & Mobile)
    function onPointerDown(e: PointerEvent) {
      isDragging = true;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e: PointerEvent) {
      if (!isDragging) return;

      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      spherical.theta -= deltaX * 0.007;
      spherical.phi -= deltaY * 0.007;
      atualizarCamera();

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    }

    function onPointerUp(e: PointerEvent) {
      isDragging = false;
      canvas.releasePointerCapture?.(e.pointerId);
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      spherical.radius += e.deltaY * 0.012;
      atualizarCamera();
    }

    // Pinça multitoque em celular
    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance = Math.hypot(dx, dy);
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const delta = initialPinchDistance - currentDistance;
        spherical.radius += delta * 0.03;
        initialPinchDistance = currentDistance;
        atualizarCamera();
      }
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    // 6. LOOP DE ANIMAÇÃO
    let animationFrameId: number;
    let currentRotationY = 0;

    function renderLoop() {
      if (isPlaying) {
        currentRotationY += autoRotateSpeed;
        cubeGroup.rotation.y = currentRotationY;
      }
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    // Inicialização da geometria dos cubos
    const nInicial = Number(initialState.params.dimensao || 3);
    const afastamentoInicial = Number(initialState.params.afastamento ?? 0.35);
    const estiloInicial = String(initialState.params.estiloBlocos || 'colorido');
    reconstruirCubos(nInicial, afastamentoInicial, estiloInicial);

    axesHelper.visible = initialState.params.mostrarEixos !== false;

    renderLoop();

    // 7. RETORNO DA INSTÂNCIA DO MÓDULO COM MÉTODOS DE CONTROLE
    return {
      update: (newState: DrawerState) => {
        isPlaying = newState.isPlaying;
        autoRotateSpeed = 0.015 * newState.speed;

        axesHelper.visible = newState.params.mostrarEixos !== false;

        const novoN = Number(newState.params.dimensao || 3);
        const novoAfastamento = Number(newState.params.afastamento ?? 0.35);
        const novoEstilo = String(newState.params.estiloBlocos || 'colorido');

        reconstruirCubos(novoN, novoAfastamento, novoEstilo);
      },

      step: (direction: 1 | -1) => {
        // Gira 45 graus ou avança o afastamento
        currentRotationY += direction * (Math.PI / 4);
        cubeGroup.rotation.y = currentRotationY;
      },

      play: () => {
        isPlaying = true;
      },

      pause: () => {
        isPlaying = false;
      },

      reset: () => {
        spherical.radius = 12;
        spherical.theta = Math.PI / 4;
        spherical.phi = Math.PI / 3.2;
        atualizarCamera();
        currentRotationY = 0;
        cubeGroup.rotation.y = 0;
      },

      resize: (w: number, h: number) => {
        if (!renderer || !camera) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      },

      destroy: () => {
        cancelAnimationFrame(animationFrameId);

        canvas.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        canvas.removeEventListener('wheel', onWheel);
        canvas.removeEventListener('touchstart', onTouchStart);
        canvas.removeEventListener('touchmove', onTouchMove);

        // Desalocar geometrias e materiais para prevenir vazamento de memória
        disposables.forEach((item) => item.dispose());
        renderer.dispose();
        container.innerHTML = '';
      },
    };
  },
};
