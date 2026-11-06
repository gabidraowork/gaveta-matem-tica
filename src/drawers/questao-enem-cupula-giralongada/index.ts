import * as THREE from "three";
import { DrawerInstance, DrawerModule, DrawerState } from "../types";

// Ajuste estas três constantes para trocar as cores compartilhadas entre fórmula e modelo.
const ELEMENT_COLORS = { V: 0xd94b45, A: 0x3976c5, F: 0x39856b };
const FACE_BASE = 0xe7e5dc;
const FACE_DIM = 0xc9c9c1;

type Face = {
  vertices: number[];
  kind: "pentágono" | "triângulo" | "quadrado" | "decágono";
};
type Point2 = { x: number; y: number };

export const QuestaoEnemCupulaGiralongadaDrawer: DrawerModule = {
  id: "enem-cupula-giralongada-j24",
  questionNumber: 14,
  title: "Questão 14 · Cúpula pentagonal giroalongada",
  subtitle: "Geometria Espacial · Poliedro de Johnson J24",
  description:
    "Explore o sólido, observe suas faces e acompanhe a relação de Euler.",
  category: "geometria-3d",
  badge: "ENEM · Q14",
  iconName: "Layers",
  mathContext: {
    enunciado:
      "A cúpula pentagonal giralongada é um poliedro de Johnson, cujas faces são polígonos regulares, mas que não é um poliedro de Platão, de Arquimedes, prisma ou antiprisma. As figuras apresentam esse poliedro em duas posições e uma de suas planificações. Quantos vértices tem esse poliedro? DICA: V + F = A + 2 (vértices + faces = arestas + 2), “relação de Euler”.",
    formula: "V + F = A + 2",
    explicacao:
      "Gire o sólido e alterne entre as duas vistas e a planificação. Selecione V, A ou F para observar como cada elemento participa da relação de Euler. A contagem fica a cargo da turma.",
    dicaPedagogica:
      "Convide os estudantes a identificar os elementos no modelo antes de aplicar a relação de Euler. A planificação ajuda a acompanhar as faces e suas arestas compartilhadas.",
  },
  controls: [],

  mount: (
    container: HTMLElement,
    initialState: DrawerState,
  ): DrawerInstance => {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    container.innerHTML = "";
    container.style.position = "relative";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f4ee);
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.up.set(0, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    const canvas = renderer.domElement;
    canvas.className = "block h-full w-full cursor-grab active:cursor-grabbing";
    canvas.setAttribute(
      "aria-label",
      "Modelo tridimensional interativo da cúpula pentagonal giroalongada",
    );
    canvas.setAttribute("role", "img");
    container.appendChild(canvas);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d8ce, 1.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(7, -9, 12);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xdce8f3, 0.55);
    fillLight.position.set(-8, 5, 3);
    scene.add(fillLight);

    const disposable: Array<
      THREE.BufferGeometry | THREE.Material | THREE.Texture
    > = [];
    const modelGroup = new THREE.Group();
    const netGroup = new THREE.Group();
    scene.add(modelGroup, netGroup);

    // Para substituir o sólido, troque a construção abaixo e mantenha faces e vértices indexados.
    const R10 = 1 / (2 * Math.sin(Math.PI / 10));
    const R5 = 1 / (2 * Math.sin(Math.PI / 5));
    const hCup = Math.sqrt(
      1 - (R10 ** 2 + R5 ** 2 - 2 * R10 * R5 * Math.cos(Math.PI / 10)),
    );
    const hAnti = Math.sqrt(1 - (2 * R10 * Math.sin(Math.PI / 20)) ** 2);
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = Math.PI / 10 + (2 * Math.PI * i) / 5;
      points.push(
        new THREE.Vector3(R5 * Math.cos(angle), R5 * Math.sin(angle), hCup),
      );
    }
    for (let j = 0; j < 10; j++) {
      const angle = (2 * Math.PI * j) / 10;
      points.push(
        new THREE.Vector3(R10 * Math.cos(angle), R10 * Math.sin(angle), 0),
      );
    }
    for (let j = 0; j < 10; j++) {
      const angle = Math.PI / 10 + (2 * Math.PI * j) / 10;
      points.push(
        new THREE.Vector3(R10 * Math.cos(angle), R10 * Math.sin(angle), -hAnti),
      );
    }

    const faces: Face[] = [];
    faces.push({ vertices: [0, 1, 2, 3, 4], kind: "pentágono" });
    for (let i = 0; i < 5; i++) {
      const next = (i + 1) % 5;
      const b0 = 5 + 2 * i;
      const b1 = 5 + ((2 * i + 1) % 10);
      const b2 = 5 + ((2 * i + 2) % 10);
      faces.push({ vertices: [i, b0, b1], kind: "triângulo" });
      faces.push({ vertices: [i, next, b2, b1], kind: "quadrado" });
    }
    for (let j = 0; j < 10; j++) {
      const next = (j + 1) % 10;
      const b0 = 5 + j;
      const b1 = 5 + next;
      const c0 = 15 + j;
      const c1 = 15 + next;
      faces.push({ vertices: [b0, b1, c0], kind: "triângulo" });
      faces.push({ vertices: [b1, c1, c0], kind: "triângulo" });
    }
    faces.push({
      vertices: Array.from({ length: 10 }, (_, i) => 15 + i),
      kind: "decágono",
    });

    const edges = new Map<string, [number, number]>();
    faces.forEach((face) =>
      face.vertices.forEach((a, index) => {
        const b = face.vertices[(index + 1) % face.vertices.length];
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (!edges.has(key)) edges.set(key, [a, b]);
      }),
    );

    const faceObjects: THREE.Mesh[] = [];
    const edgeObjects: THREE.Line[] = [];
    const vertexObjects: THREE.Mesh[] = [];
    const faceGeometries: THREE.BufferGeometry[] = [];
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x68716f,
      transparent: true,
      opacity: 0.78,
    });
    const selectedEdgeMaterial = new THREE.LineBasicMaterial({
      color: ELEMENT_COLORS.A,
      transparent: true,
      opacity: 1,
    });
    const mutedEdgeMaterial = new THREE.LineBasicMaterial({
      color: 0xaeb2ad,
      transparent: true,
      opacity: 0.35,
    });
    const vertexMaterial = new THREE.MeshStandardMaterial({
      color: 0x7d817b,
      roughness: 0.42,
    });
    const selectedVertexMaterial = new THREE.MeshStandardMaterial({
      color: ELEMENT_COLORS.V,
      roughness: 0.34,
    });
    const dimVertexMaterial = new THREE.MeshStandardMaterial({
      color: 0xb6b8b1,
      transparent: true,
      opacity: 0.44,
    });
    const faceMaterials = faces.map(
      () =>
        new THREE.MeshStandardMaterial({
          color: FACE_BASE,
          roughness: 0.62,
          metalness: 0,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.94,
        }),
    );
    disposable.push(
      edgeMaterial,
      selectedEdgeMaterial,
      mutedEdgeMaterial,
      vertexMaterial,
      selectedVertexMaterial,
      dimVertexMaterial,
      ...faceMaterials,
    );

    faces.forEach((face, faceIndex) => {
      const vertices = face.vertices.map((index) => points[index]);
      const positions: number[] = [];
      for (let i = 1; i < vertices.length - 1; i++) {
        positions.push(
          vertices[0].x,
          vertices[0].y,
          vertices[0].z,
          vertices[i].x,
          vertices[i].y,
          vertices[i].z,
          vertices[i + 1].x,
          vertices[i + 1].y,
          vertices[i + 1].z,
        );
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      geometry.computeVertexNormals();
      disposable.push(geometry);
      faceGeometries.push(geometry);
      const mesh = new THREE.Mesh(geometry, faceMaterials[faceIndex]);
      mesh.userData = { kind: "F" };
      modelGroup.add(mesh);
      faceObjects.push(mesh);
    });
    edges.forEach(([a, b]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        points[a],
        points[b],
      ]);
      disposable.push(geometry);
      const line = new THREE.Line(geometry, edgeMaterial);
      line.userData = { kind: "A" };
      modelGroup.add(line);
      edgeObjects.push(line);
    });
    const vertexGeometry = new THREE.SphereGeometry(0.035, 12, 8);
    disposable.push(vertexGeometry);
    points.forEach((point) => {
      const sphere = new THREE.Mesh(vertexGeometry, vertexMaterial);
      sphere.position.copy(point);
      sphere.userData = { kind: "V" };
      modelGroup.add(sphere);
      vertexObjects.push(sphere);
    });

    // Busca determinística por uma árvore de corte: cada face nova é rebatida sobre uma aresta comum.
    // A SAT 2D rejeita qualquer candidato cujo interior cruze uma face já colocada.
    const faceCoords: Array<Map<number, Point2> | undefined> = new Array(
      faces.length,
    );
    const adjacency: Array<Array<{ faceIndex: number; a: number; b: number }>> =
      faces.map(() => []);
    const edgeOwners = new Map<
      string,
      Array<{ faceIndex: number; a: number; b: number }>
    >();
    faces.forEach((face, faceIndex) =>
      face.vertices.forEach((a, index) => {
        const b = face.vertices[(index + 1) % face.vertices.length];
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        const owners = edgeOwners.get(key) || [];
        owners.push({ faceIndex, a, b });
        edgeOwners.set(key, owners);
      }),
    );
    edgeOwners.forEach((owners) => {
      if (owners.length === 2) {
        adjacency[owners[0].faceIndex].push({
          faceIndex: owners[1].faceIndex,
          a: owners[0].a,
          b: owners[0].b,
        });
        adjacency[owners[1].faceIndex].push({
          faceIndex: owners[0].faceIndex,
          a: owners[1].a,
          b: owners[1].b,
        });
      }
    });
    const rootFace = faces[0];
    const rootRadius = 1 / (2 * Math.sin(Math.PI / rootFace.vertices.length));
    const rootCoords = new Map<number, Point2>();
    rootFace.vertices.forEach((id, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / rootFace.vertices.length;
      rootCoords.set(id, {
        x: rootRadius * Math.cos(angle),
        y: rootRadius * Math.sin(angle),
      });
    });
    const overlapTolerance = 1e-8;
    function polygonInteriorOverlaps(first: Point2[], second: Point2[]) {
      for (const axesFrom of [first, second]) {
        for (let i = 0; i < axesFrom.length; i++) {
          const p = axesFrom[i];
          const q = axesFrom[(i + 1) % axesFrom.length];
          const axisX = p.y - q.y;
          const axisY = q.x - p.x;
          const firstProjection = first.map(
            (point) => point.x * axisX + point.y * axisY,
          );
          const secondProjection = second.map(
            (point) => point.x * axisX + point.y * axisY,
          );
          const firstMin = Math.min(...firstProjection);
          const firstMax = Math.max(...firstProjection);
          const secondMin = Math.min(...secondProjection);
          const secondMax = Math.max(...secondProjection);
          if (
            firstMax <= secondMin + overlapTolerance ||
            secondMax <= firstMin + overlapTolerance
          )
            return false;
        }
      }
      return true;
    }
    function segmentContact(
      a: Point2,
      b: Point2,
      c: Point2,
      d: Point2,
    ): { kind: "point"; point: Point2 } | { kind: "overlap" } | null {
      const rx = b.x - a.x;
      const ry = b.y - a.y;
      const sx = d.x - c.x;
      const sy = d.y - c.y;
      const denominator = rx * sy - ry * sx;
      const qpx = c.x - a.x;
      const qpy = c.y - a.y;
      if (Math.abs(denominator) > overlapTolerance) {
        const t = (qpx * sy - qpy * sx) / denominator;
        const u = (qpx * ry - qpy * rx) / denominator;
        if (
          t < -overlapTolerance ||
          t > 1 + overlapTolerance ||
          u < -overlapTolerance ||
          u > 1 + overlapTolerance
        )
          return null;
        return { kind: "point", point: { x: a.x + t * rx, y: a.y + t * ry } };
      }
      if (Math.abs(qpx * ry - qpy * rx) > overlapTolerance) return null;
      const lengthSquared = rx * rx + ry * ry;
      if (lengthSquared < overlapTolerance) return null;
      const t0 = (qpx * rx + qpy * ry) / lengthSquared;
      const t1 = ((d.x - a.x) * rx + (d.y - a.y) * ry) / lengthSquared;
      const low = Math.max(0, Math.min(t0, t1));
      const high = Math.min(1, Math.max(t0, t1));
      if (high < low - overlapTolerance) return null;
      if (high - low > overlapTolerance) return { kind: "overlap" };
      const t = (low + high) / 2;
      return { kind: "point", point: { x: a.x + t * rx, y: a.y + t * ry } };
    }
    function hasInvalidBoundaryContact(
      firstIndex: number,
      firstMap: Map<number, Point2>,
      secondIndex: number,
      secondMap: Map<number, Point2>,
    ) {
      const firstFace = faces[firstIndex];
      const secondFace = faces[secondIndex];
      for (let i = 0; i < firstFace.vertices.length; i++) {
        const aId = firstFace.vertices[i];
        const bId = firstFace.vertices[(i + 1) % firstFace.vertices.length];
        for (let j = 0; j < secondFace.vertices.length; j++) {
          const cId = secondFace.vertices[j];
          const dId = secondFace.vertices[(j + 1) % secondFace.vertices.length];
          const contact = segmentContact(
            firstMap.get(aId)!,
            firstMap.get(bId)!,
            secondMap.get(cId)!,
            secondMap.get(dId)!,
          );
          if (!contact) continue;
          if (contact.kind === "overlap") {
            const sameSharedEdge =
              (aId === cId && bId === dId) || (aId === dId && bId === cId);
            if (!sameSharedEdge) return true;
            continue;
          }
          const isSharedVertexContact = firstFace.vertices.some((vertexId) => {
            if (!secondFace.vertices.includes(vertexId)) return false;
            const firstPoint = firstMap.get(vertexId)!;
            const secondPoint = secondMap.get(vertexId)!;
            return (
              Math.hypot(
                firstPoint.x - secondPoint.x,
                firstPoint.y - secondPoint.y,
              ) <= overlapTolerance &&
              Math.hypot(
                firstPoint.x - contact.point.x,
                firstPoint.y - contact.point.y,
              ) <= overlapTolerance
            );
          });
          if (!isSharedVertexContact) return true;
        }
      }
      return false;
    }
    function unfoldAcrossEdge(
      parentIndex: number,
      parentMap: Map<number, Point2>,
      link: { faceIndex: number; a: number; b: number },
    ) {
      const parentFace = faces[parentIndex];
      const childFace = faces[link.faceIndex];
      const count = childFace.vertices.length;
      const startIndex = childFace.vertices.findIndex(
        (id, i) =>
          (id === link.a && childFace.vertices[(i + 1) % count] === link.b) ||
          (id === link.b && childFace.vertices[(i + 1) % count] === link.a),
      );
      if (startIndex < 0) return null;
      const startId = childFace.vertices[startIndex];
      const nextId = childFace.vertices[(startIndex + 1) % count];
      const p0 = parentMap.get(startId)!;
      const p1 = parentMap.get(nextId)!;
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const parentCenter = parentFace.vertices.reduce(
        (sum, id) => {
          const p = parentMap.get(id)!;
          return {
            x: sum.x + p.x / parentFace.vertices.length,
            y: sum.y + p.y / parentFace.vertices.length,
          };
        },
        { x: 0, y: 0 },
      );
      const edgeMid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const sideParent =
        dx * (parentCenter.y - edgeMid.y) - dy * (parentCenter.x - edgeMid.x);
      let bestCoords: Point2[] | null = null;
      for (const sign of [-1, 1]) {
        const coords: Point2[] = [
          { x: p0.x, y: p0.y },
          { x: p1.x, y: p1.y },
        ];
        let vx = dx;
        let vy = dy;
        for (let i = 2; i < count; i++) {
          const angle = sign * ((2 * Math.PI) / count);
          const nextX = vx * Math.cos(angle) - vy * Math.sin(angle);
          const nextY = vx * Math.sin(angle) + vy * Math.cos(angle);
          coords.push({
            x: coords[i - 1].x + nextX,
            y: coords[i - 1].y + nextY,
          });
          vx = nextX;
          vy = nextY;
        }
        const center = coords.reduce(
          (sum, point) => ({
            x: sum.x + point.x / count,
            y: sum.y + point.y / count,
          }),
          { x: 0, y: 0 },
        );
        const sideChild =
          dx * (center.y - edgeMid.y) - dy * (center.x - edgeMid.x);
        if (sideParent * sideChild < 0) {
          bestCoords = coords;
          break;
        }
      }
      if (!bestCoords) return null;
      const mapping = new Map<number, Point2>();
      childFace.vertices.forEach((id, i) => mapping.set(id, bestCoords![i]));
      return mapping;
    }

    type UnfoldingTreeEdge = {
      faceIndex: number;
      parentIndex: number;
      a: number;
      b: number;
    };
    let searchedCandidates = 0;
    const maximumCandidates = 512;
    function searchUnfolding(
      placed: Map<number, Map<number, Point2>>,
      tree: UnfoldingTreeEdge[],
    ): {
      placed: Map<number, Map<number, Point2>>;
      tree: UnfoldingTreeEdge[];
    } | null {
      if (placed.size === faces.length) return { placed, tree };
      if (searchedCandidates >= maximumCandidates) return null;
      const options: Array<{
        parentIndex: number;
        link: { faceIndex: number; a: number; b: number };
      }> = [];
      placed.forEach((_mapping, parentIndex) => {
        adjacency[parentIndex].forEach((link) => {
          if (!placed.has(link.faceIndex)) options.push({ parentIndex, link });
        });
      });
      options.sort(
        (first, second) =>
          first.link.faceIndex - second.link.faceIndex ||
          first.parentIndex - second.parentIndex ||
          first.link.a - second.link.a ||
          first.link.b - second.link.b,
      );
      for (const option of options) {
        searchedCandidates++;
        if (searchedCandidates > maximumCandidates) return null;
        const childMap = unfoldAcrossEdge(
          option.parentIndex,
          placed.get(option.parentIndex)!,
          option.link,
        );
        if (!childMap) continue;
        const childPolygon = faces[option.link.faceIndex].vertices.map(
          (id) => childMap.get(id)!,
        );
        let intersects = false;
        placed.forEach((existingMap, existingIndex) => {
          if (intersects) return;
          const existingPolygon = faces[existingIndex].vertices.map(
            (id) => existingMap.get(id)!,
          );
          intersects =
            polygonInteriorOverlaps(childPolygon, existingPolygon) ||
            hasInvalidBoundaryContact(
              option.link.faceIndex,
              childMap,
              existingIndex,
              existingMap,
            );
        });
        if (intersects) continue;
        const nextPlaced = new Map(placed);
        nextPlaced.set(option.link.faceIndex, childMap);
        const result = searchUnfolding(nextPlaced, [
          ...tree,
          {
            faceIndex: option.link.faceIndex,
            parentIndex: option.parentIndex,
            a: option.link.a,
            b: option.link.b,
          },
        ]);
        if (result) return result;
      }
      return null;
    }
    const unfolding = searchUnfolding(new Map([[0, rootCoords]]), []);
    if (!unfolding)
      throw new Error(
        "Não foi encontrada uma planificação J24 sem sobreposição dentro do limite de busca.",
      );
    unfolding.placed.forEach((mapping, faceIndex) => {
      faceCoords[faceIndex] = mapping;
    });
    if (unfolding.tree.length !== faces.length - 1)
      throw new Error("A planificação J24 não formou uma árvore conectada.");
    unfolding.tree.forEach(({ faceIndex, parentIndex, a, b }) => {
      const childMap = faceCoords[faceIndex]!;
      const parentMap = faceCoords[parentIndex]!;
      [a, b].forEach((vertexId) => {
        const childPoint = childMap.get(vertexId)!;
        const parentPoint = parentMap.get(vertexId)!;
        if (
          Math.hypot(
            childPoint.x - parentPoint.x,
            childPoint.y - parentPoint.y,
          ) > overlapTolerance
        ) {
          throw new Error(
            "Uma dobradiça da planificação J24 não coincide com a aresta compartilhada.",
          );
        }
      });
    });
    for (let i = 0; i < faces.length; i++) {
      for (let j = i + 1; j < faces.length; j++) {
        const polygonA = faces[i].vertices.map((id) => faceCoords[i]!.get(id)!);
        const polygonB = faces[j].vertices.map((id) => faceCoords[j]!.get(id)!);
        if (
          polygonInteriorOverlaps(polygonA, polygonB) ||
          hasInvalidBoundaryContact(i, faceCoords[i]!, j, faceCoords[j]!)
        ) {
          throw new Error(
            "A validação geométrica detectou sobreposição ou contato não compartilhado na planificação J24.",
          );
        }
      }
    }
    const allNetPoints = faceCoords.flatMap((mapping) =>
      mapping ? Array.from(mapping.values()) : [],
    );
    const bounds = allNetPoints.reduce(
      (box, p) => ({
        minX: Math.min(box.minX, p.x),
        maxX: Math.max(box.maxX, p.x),
        minY: Math.min(box.minY, p.y),
        maxY: Math.max(box.maxY, p.y),
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
    );
    const netScale =
      4.8 / Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY, 1);
    const netCenter = {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2,
    };
    faces.forEach((face, faceIndex) => {
      const mapping = faceCoords[faceIndex];
      if (!mapping) return;
      const positions: number[] = [];
      const coords = face.vertices.map((id) => mapping.get(id)!);
      for (let i = 1; i < coords.length - 1; i++) {
        [coords[0], coords[i], coords[i + 1]].forEach((p) => {
          positions.push(
            (p.x - netCenter.x) * netScale,
            (p.y - netCenter.y) * netScale,
            0,
          );
        });
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      geometry.computeVertexNormals();
      disposable.push(geometry);
      const material = new THREE.MeshStandardMaterial({
        color: FACE_BASE,
        side: THREE.DoubleSide,
        roughness: 0.65,
        transparent: true,
        opacity: 0.94,
      });
      disposable.push(material);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { kind: "F" };
      netGroup.add(mesh);
      const outlinePoints = coords.map(
        (p) =>
          new THREE.Vector3(
            (p.x - netCenter.x) * netScale,
            (p.y - netCenter.y) * netScale,
            0.008,
          ),
      );
      outlinePoints.push(outlinePoints[0]);
      const outlineGeometry = new THREE.BufferGeometry().setFromPoints(
        outlinePoints,
      );
      disposable.push(outlineGeometry);
      const outline = new THREE.Line(outlineGeometry, edgeMaterial);
      outline.userData = { kind: "A" };
      netGroup.add(outline);
      coords.forEach((p) => {
        const dot = new THREE.Mesh(vertexGeometry, vertexMaterial);
        dot.position.set(
          (p.x - netCenter.x) * netScale,
          (p.y - netCenter.y) * netScale,
          0.014,
        );
        dot.scale.setScalar(0.78);
        dot.userData = { kind: "V" };
        netGroup.add(dot);
      });
    });
    netGroup.visible = false;

    const ui = document.createElement("div");
    ui.className =
      "absolute inset-0 z-10 flex flex-col justify-between p-3 sm:p-4 pointer-events-none";
    ui.innerHTML = `
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="rounded-xl border border-[#d9d8cf] bg-[#fbfaf6]/95 px-3 py-2 shadow-sm backdrop-blur-sm">
          <div class="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#777a72]">ENEM · Q14</div>
          <div class="flex items-center gap-1 font-mono text-lg font-bold sm:text-xl" aria-label="Relação de Euler">
            <button type="button" data-element="V" class="formula-token text-[#d94b45]" title="Destacar vértices" aria-label="Destacar vértices">V</button>
            <span class="text-[#777a72]">+</span>
            <button type="button" data-element="F" class="formula-token text-[#39856b]" title="Destacar faces" aria-label="Destacar faces">F</button>
            <span class="text-[#777a72]">=</span>
            <button type="button" data-element="A" class="formula-token text-[#3976c5]" title="Destacar arestas" aria-label="Destacar arestas">A</button>
            <span class="text-[#777a72]">+ 2</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5 rounded-xl border border-[#d9d8cf] bg-[#fbfaf6]/95 p-1.5 shadow-sm backdrop-blur-sm">
          <button type="button" data-view="perspectiva" class="view-button rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#434a47]" title="Vista em perspectiva do sólido">Perspectiva</button>
          <button type="button" data-view="base" class="view-button rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#434a47]" title="Vista voltada para a base decagonal">Vista da base</button>
          <span class="mx-0.5 self-center text-[#c4c3bb]" aria-hidden="true">|</span>
          <button type="button" data-mode="solido" class="mode-button rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#434a47]" title="Mostrar o sólido">Sólido</button>
          <button type="button" data-mode="planificacao" class="mode-button rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-[#434a47]" title="Mostrar a planificação conectada">Planificação</button>
        </div>
      </div>
      <div class="flex items-end justify-between gap-2">
        <div class="max-w-[19rem] rounded-lg border border-[#deddd5] bg-[#fbfaf6]/90 px-3 py-2 text-[11px] leading-snug text-[#555b57] shadow-sm">
          Arraste para girar · roda ou pinça para aproximar
        </div>
        <div class="rounded-lg border border-[#deddd5] bg-[#fbfaf6]/90 px-2.5 py-1.5 text-[10px] font-medium text-[#676d68]" aria-live="polite" data-status>
          J24 · relação de Euler
        </div>
      </div>`;
    container.appendChild(ui);

    // Rótulo flutuante (requisito 4): mostra "vértice", "aresta" ou "face" ao passar o cursor ou tocar.
    // As cores do rótulo seguem ELEMENT_COLORS, as mesmas da fórmula.
    const ELEMENT_LABELS = { V: "vértice", A: "aresta", F: "face" } as const;
    const toCss = (hex: number) => `#${hex.toString(16).padStart(6, "0")}`;
    const hoverLabel = document.createElement("div");
    hoverLabel.setAttribute("role", "tooltip");
    hoverLabel.setAttribute("aria-live", "polite");
    hoverLabel.className =
      "pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-full rounded-md border bg-[#fbfaf6] px-2 py-1 text-[11px] font-semibold shadow-sm";
    container.appendChild(hoverLabel);
    let hoverHideTimer = 0;
    function showHoverLabel(
      kind: "V" | "A" | "F" | null,
      clientX: number,
      clientY: number,
    ) {
      window.clearTimeout(hoverHideTimer);
      if (!kind) {
        hoverLabel.classList.add("hidden");
        canvas.removeAttribute("title");
        return;
      }
      const rect = container.getBoundingClientRect();
      hoverLabel.textContent = ELEMENT_LABELS[kind];
      hoverLabel.style.color = toCss(ELEMENT_COLORS[kind]);
      hoverLabel.style.borderColor = toCss(ELEMENT_COLORS[kind]);
      hoverLabel.style.left = `${clientX - rect.left}px`;
      hoverLabel.style.top = `${clientY - rect.top - 10}px`;
      hoverLabel.classList.remove("hidden");
      canvas.setAttribute("title", ELEMENT_LABELS[kind]);
    }
    function pickElement(clientX: number, clientY: number) {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(
        mode === "solido" ? modelGroup.children : netGroup.children,
        false,
      );
      // Prioriza vértices e arestas, que são menores e ficam sobre as faces.
      const kinds = hits
        .map((item) => item.object.userData.kind as "V" | "A" | "F" | undefined)
        .filter(Boolean) as Array<"V" | "A" | "F">;
      if (kinds.includes("V")) return "V";
      if (kinds.includes("A")) return "A";
      return kinds[0] ?? null;
    }

    ui.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
      button.className +=
        " pointer-events-auto cursor-pointer transition-colors hover:bg-[#e9e8df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3976c5]";
    });

    let selected: "V" | "A" | "F" | null = null;
    let mode: "solido" | "planificacao" = "solido";
    let preset: "perspectiva" | "base" = "perspectiva";
    const cameraState = { radius: 8.6, theta: -0.75, phi: 1.05 };
    const target = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    raycaster.params.Line.threshold = 0.075;
    const pointer = new THREE.Vector2();
    let pointerDown = false;
    const activePointers = new Set<number>();
    let multiPointerGesture = false;
    let startPointer = { x: 0, y: 0 };
    let previousPointer = { x: 0, y: 0 };
    let pinchDistance = 0;
    let active = true;
    let frameId = 0;
    let lastParamMode: string | undefined;
    let lastPreset: string | undefined;

    function updateCamera() {
      cameraState.radius = Math.max(4.1, Math.min(15, cameraState.radius));
      cameraState.phi = Math.max(
        0.12,
        Math.min(Math.PI - 0.12, cameraState.phi),
      );
      camera.position.set(
        target.x +
          cameraState.radius *
            Math.sin(cameraState.phi) *
            Math.cos(cameraState.theta),
        target.y +
          cameraState.radius *
            Math.sin(cameraState.phi) *
            Math.sin(cameraState.theta),
        target.z + cameraState.radius * Math.cos(cameraState.phi),
      );
      camera.lookAt(target);
    }
    function setPreset(value: "perspectiva" | "base") {
      preset = value;
      cameraState.radius = 8.6;
      if (value === "perspectiva") {
        cameraState.theta = -0.75;
        cameraState.phi = 1.05;
      } else {
        cameraState.theta = -0.28;
        cameraState.phi = 2.64;
      }
      updateCamera();
      updateToolbar();
    }
    function updateToolbar() {
      ui.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach(
        (button) => {
          const chosen = button.dataset.mode === mode;
          button.style.background = chosen ? "#e4e5dc" : "transparent";
          button.style.color = chosen ? "#263c35" : "#434a47";
        },
      );
      ui.querySelectorAll<HTMLButtonElement>("[data-view]").forEach(
        (button) => {
          const chosen = button.dataset.view === preset;
          button.style.background = chosen ? "#e4e5dc" : "transparent";
          button.style.color = chosen ? "#263c35" : "#434a47";
        },
      );
      const status = ui.querySelector<HTMLElement>("[data-status]");
      if (status)
        status.textContent = selected
          ? `Destaque: ${selected === "V" ? "vértices" : selected === "A" ? "arestas" : "faces"}`
          : "J24 · relação de Euler";
    }
    function applyHighlight() {
      faceObjects.forEach((mesh, index) => {
        const mat = faceMaterials[index];
        const isActive = selected === "F";
        mat.color.set(
          selected ? (isActive ? ELEMENT_COLORS.F : FACE_DIM) : FACE_BASE,
        );
        mat.opacity = selected && !isActive ? 0.3 : 0.94;
        mat.emissive.set(selected === "F" ? ELEMENT_COLORS.F : 0x000000);
        mat.emissiveIntensity = selected === "F" ? 0.12 : 0;
        mesh.material = mat;
      });
      edgeObjects.forEach((line) => {
        line.material =
          selected === "A"
            ? selectedEdgeMaterial
            : selected
              ? mutedEdgeMaterial
              : edgeMaterial;
      });
      vertexObjects.forEach((mesh) => {
        mesh.material =
          selected === "V"
            ? selectedVertexMaterial
            : selected
              ? dimVertexMaterial
              : vertexMaterial;
        mesh.scale.setScalar(selected === "V" ? 1.55 : 1);
      });
      netGroup.children.forEach((object) => {
        const kind = object.userData.kind;
        if (kind === "F" && object instanceof THREE.Mesh) {
          const mat = object.material as THREE.MeshStandardMaterial;
          mat.color.set(
            selected === "F"
              ? ELEMENT_COLORS.F
              : selected
                ? FACE_DIM
                : FACE_BASE,
          );
          mat.opacity = selected && selected !== "F" ? 0.3 : 0.94;
          mat.emissive.set(selected === "F" ? ELEMENT_COLORS.F : 0x000000);
          mat.emissiveIntensity = selected === "F" ? 0.12 : 0;
        } else if (kind === "A" && object instanceof THREE.Line) {
          object.material =
            selected === "A"
              ? selectedEdgeMaterial
              : selected
                ? mutedEdgeMaterial
                : edgeMaterial;
        } else if (kind === "V" && object instanceof THREE.Mesh) {
          object.material =
            selected === "V"
              ? selectedVertexMaterial
              : selected
                ? dimVertexMaterial
                : vertexMaterial;
          object.scale.setScalar(selected === "V" ? 1.15 : 0.78);
        }
      });
      ui.querySelectorAll<HTMLButtonElement>("[data-element]").forEach(
        (button) => {
          button.setAttribute(
            "aria-pressed",
            String(button.dataset.element === selected),
          );
        },
      );
      updateToolbar();
    }
    function setMode(nextMode: "solido" | "planificacao") {
      mode = nextMode;
      modelGroup.visible = mode === "solido";
      netGroup.visible = mode === "planificacao";
      cameraState.radius = mode === "solido" ? 8.6 : 8.2;
      updateCamera();
      updateToolbar();
    }
    function onFormulaClick(event: Event) {
      const targetButton = (
        event.target as HTMLElement
      ).closest<HTMLButtonElement>("[data-element]");
      if (!targetButton) return;
      const value = targetButton.dataset.element as "V" | "A" | "F";
      selected = selected === value ? null : value;
      applyHighlight();
    }
    function onToolbarClick(event: Event) {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
        "button",
      );
      if (!button) return;
      if (button.dataset.mode)
        setMode(button.dataset.mode as "solido" | "planificacao");
      if (button.dataset.view)
        setPreset(button.dataset.view as "perspectiva" | "base");
    }
    function onPointerDown(event: PointerEvent) {
      activePointers.add(event.pointerId);
      if (activePointers.size > 1) multiPointerGesture = true;
      pointerDown = true;
      startPointer = previousPointer = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    }
    function onPointerMove(event: PointerEvent) {
      if (!pointerDown && event.pointerType === "mouse") {
        if (event.target === canvas) {
          showHoverLabel(
            pickElement(event.clientX, event.clientY),
            event.clientX,
            event.clientY,
          );
        } else {
          showHoverLabel(null, 0, 0);
        }
        return;
      }
      if (!pointerDown || multiPointerGesture || activePointers.size > 1)
        return;
      showHoverLabel(null, 0, 0);
      const dx = event.clientX - previousPointer.x;
      const dy = event.clientY - previousPointer.y;
      cameraState.theta -= dx * 0.007;
      cameraState.phi += dy * 0.007;
      previousPointer = { x: event.clientX, y: event.clientY };
      updateCamera();
    }
    function onPointerUp(event: PointerEvent) {
      const wasMultiPointer = multiPointerGesture;
      activePointers.delete(event.pointerId);
      if (activePointers.size === 0) {
        pointerDown = false;
        multiPointerGesture = false;
      }
      if (canvas.hasPointerCapture(event.pointerId))
        canvas.releasePointerCapture(event.pointerId);
      if (wasMultiPointer || activePointers.size > 0) return;
      if (
        Math.hypot(
          event.clientX - startPointer.x,
          event.clientY - startPointer.y,
        ) > 5
      )
        return;
      const element = pickElement(event.clientX, event.clientY);
      if (element) {
        selected = selected === element ? null : element;
      } else {
        selected = null;
      }
      // No toque, o rótulo aparece por alguns instantes sobre o elemento tocado.
      if (event.pointerType !== "mouse") {
        showHoverLabel(element, event.clientX, event.clientY);
        hoverHideTimer = window.setTimeout(
          () => showHoverLabel(null, 0, 0),
          1600,
        );
      }
      applyHighlight();
    }
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      cameraState.radius += event.deltaY * 0.009;
      updateCamera();
    }
    function onTouchStart(event: TouchEvent) {
      if (event.touches.length === 2) {
        pinchDistance = Math.hypot(
          event.touches[0].clientX - event.touches[1].clientX,
          event.touches[0].clientY - event.touches[1].clientY,
        );
      }
    }
    function onTouchMove(event: TouchEvent) {
      if (event.touches.length !== 2) return;
      event.preventDefault();
      const nextDistance = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY,
      );
      cameraState.radius += (pinchDistance - nextDistance) * 0.018;
      pinchDistance = nextDistance;
      updateCamera();
    }

    ui.addEventListener("click", onFormulaClick);
    ui.addEventListener("click", onToolbarClick);
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    updateCamera();
    setPreset(
      (initialState.params.orientacao as "perspectiva" | "base") ||
        "perspectiva",
    );
    setMode(
      (initialState.params.visualizacao as "solido" | "planificacao") ||
        "solido",
    );
    applyHighlight();
    function render() {
      if (!active) return;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    }
    render();

    return {
      update: (state: DrawerState) => {
        const nextMode = state.params.visualizacao as
          | "solido"
          | "planificacao"
          | undefined;
        const nextPreset = state.params.orientacao as
          | "perspectiva"
          | "base"
          | undefined;
        if (nextMode && nextMode !== lastParamMode) setMode(nextMode);
        if (nextPreset && nextPreset !== lastPreset) setPreset(nextPreset);
        lastParamMode = nextMode;
        lastPreset = nextPreset;
      },
      reset: () => {
        selected = null;
        setMode("solido");
        setPreset("perspectiva");
        applyHighlight();
      },
      resize: (w: number, h: number) => {
        camera.aspect = w / Math.max(h, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      },
      destroy: () => {
        active = false;
        cancelAnimationFrame(frameId);
        window.clearTimeout(hoverHideTimer);
        ui.removeEventListener("click", onFormulaClick);
        ui.removeEventListener("click", onToolbarClick);
        canvas.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("wheel", onWheel);
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchmove", onTouchMove);
        disposable.forEach((resource) => resource.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
        container.innerHTML = "";
      },
    };
  },
};
