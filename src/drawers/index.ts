/**
 * REGISTRO CENTRAL DE GAVETAS MATEMÁTICAS
 * 
 * Para adicionar uma nova questão como gaveta:
 * 1. Crie a pasta do módulo em `src/drawers/sua-questao/`
 * 2. Exporte o objeto implementando `DrawerModule`
 * 3. Importe-o aqui e adicione no array `todasAsGavetas` abaixo!
 */

import { DrawerModule, DrawerCategory } from './types';
import { QuestaoEnemCuboDrawer } from './questao-enem-cubo-projecoes';
import { QuestaoEnemCicloviaDrawer } from './questao-enem-ciclovia-policiais';
import { QuestaoEnemDiretoriaCasaisDrawer } from './questao-enem-diretoria-casais';
import { Exemplo3DDrawer } from './exemplo-3d';
import { TemplateNovoDrawer } from './template-novo';
import { QuestaoEnemCupulaGiralongadaDrawer } from './questao-enem-cupula-giralongada';
import { QuestaoEnemSolucaoS1S2Drawer } from './questao-enem-solucao-s1-s2';

export * from './types';

/**
 * Lista de todas as gavetas disponíveis na aplicação.
 * Cada item representa uma questão ou demonstração independente.
 */
export const todasAsGavetas: DrawerModule[] = [
  QuestaoEnemDiretoriaCasaisDrawer,
  QuestaoEnemCuboDrawer,
  QuestaoEnemCicloviaDrawer,
  QuestaoEnemCupulaGiralongadaDrawer,
  QuestaoEnemSolucaoS1S2Drawer,
  Exemplo3DDrawer,
  TemplateNovoDrawer,
];

/**
 * Categorias disponíveis com rótulos amigáveis em português
 */
export const categoriasInfo: Record<DrawerCategory, { label: string; cor: string }> = {
  'geometria-3d': { label: 'Geometria Espacial 3D', cor: 'text-blue-700 bg-blue-50 border-blue-200' },
  'combinatoria': { label: 'Análise Combinatória', cor: 'text-amber-700 bg-amber-50 border-amber-200' },
  'probabilidade': { label: 'Probabilidade & Estatística', cor: 'text-purple-700 bg-purple-50 border-purple-200' },
  'algebra': { label: 'Álgebra & Funções', cor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  'diagramas': { label: 'Diagramas & Mapas', cor: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  'template': { label: 'Modelos & Extensões', cor: 'text-slate-700 bg-slate-100 border-slate-300' },
};

/**
 * Busca uma gaveta pelo ID único
 */
export function buscarGavetaPorId(id: string): DrawerModule | undefined {
  return todasAsGavetas.find((g) => g.id === id);
}

/**
 * Filtra gavetas por categoria
 */
export function filtrarGavetasPorCategoria(categoria: DrawerCategory | 'todas'): DrawerModule[] {
  if (categoria === 'todas') return todasAsGavetas;
  return todasAsGavetas.filter((g) => g.category === categoria);
}

/**
 * Gaveta selecionada por padrão ao abrir o aplicativo
 */
export const gavetaPadrao = todasAsGavetas[0];
