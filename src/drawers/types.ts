/**
 * Tipos e Interfaces da Gaveta de Visualizações Matemáticas
 * 
 * Cada questão adicionada à aplicação implementa a interface `DrawerModule`.
 * Este padrão garante que novas questões possam ser integradas sem alterar o
 * restante da aplicação.
 */

export type DrawerCategory = 
  | 'geometria-3d'
  | 'combinatoria'
  | 'probabilidade'
  | 'algebra'
  | 'diagramas'
  | 'template';

export interface DrawerControlOption {
  label: string;
  value: string | number | boolean;
}

export interface DrawerControlConfig {
  id: string;
  label: string;
  type: 'range' | 'select' | 'toggle' | 'number';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: DrawerControlOption[];
  description?: string;
}

export interface DrawerState {
  isPlaying: boolean;
  step: number;
  speed: number; // Ex: 0.5, 1, 2
  params: Record<string, any>;
}

export interface DrawerInstance {
  /** Atualiza o estado da cena quando parâmetros ou controles mudam */
  update: (state: DrawerState) => void;
  /** Avança ou recua um passo discreto na animação/sequência */
  step?: (direction: 1 | -1) => void;
  /** Inicia animação contínua */
  play?: () => void;
  /** Pausa a animação */
  pause?: () => void;
  /** Reinicia a visualização para o estado inicial */
  reset?: () => void;
  /** Destrói objetos 3D, remove listeners e limpa a memória */
  destroy: () => void;
  /** Notifica resize de container */
  resize?: (width: number, height: number) => void;
}

export interface MathContextInfo {
  enunciado: string;
  formula?: string;
  explicacao: string;
  dicaPedagogica?: string;
  codigoPython?: string;
}

export interface DrawerModule {
  id: string;
  questionNumber?: number | string;
  title: string;
  subtitle: string;
  description: string;
  category: DrawerCategory;
  badge?: string;
  iconName: 'Box' | 'Layers' | 'GitBranch' | 'PieChart' | 'Compass' | 'FileCode2' | 'Shield' | 'Users';
  
  /** Informações didáticas para apoio do professor em sala de aula */
  mathContext: MathContextInfo;
  
  /** Controles específicos que aparecerão na doca inferior */
  controls: DrawerControlConfig[];
  
  /**
   * Função de montagem chamada ao selecionar a gaveta.
   * Recebe o elemento HTML do palco e deve retornar a instância com os métodos de controle.
   */
  mount: (container: HTMLElement, state: DrawerState) => DrawerInstance;
}
