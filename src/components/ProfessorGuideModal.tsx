import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { calcularNoServidor, listarFuncoesCalculo } from '@/lib/matematica.functions';
import type { FuncaoId } from '@/lib/matematica';
import enemQ138Figura from '@/assets/enem2025-q138-figura.png.asset.json';
import { 
  X, 
  BookOpen, 
  Code2, 
  PlusCircle, 
  Play, 
  Check, 
  Copy, 
  Terminal, 
  Sparkles,
  Lightbulb
} from 'lucide-react';
import { DrawerModule } from '../drawers/types';

type PythonCalculationResponse = { ok: boolean; dados?: unknown; erro?: string };
type PythonCalculationInput = { funcao: FuncaoId; params?: Record<string, unknown> };

interface ProfessorGuideModalProps {
  gaveta: DrawerModule;
  isOpen: boolean;
  onClose: () => void;
  abaInicial?: 'didatico' | 'python' | 'adicionar';
}

export const ProfessorGuideModal: React.FC<ProfessorGuideModalProps> = ({
  gaveta,
  isOpen,
  onClose,
  abaInicial = 'didatico',
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'didatico' | 'python' | 'adicionar'>(abaInicial);
  const [resultadoPython, setResultadoPython] = useState<PythonCalculationResponse | null>(null);
  const [copiado, setCopiado] = useState(false);
  const listarFuncoes = useServerFn(listarFuncoesCalculo);
  const calcular = useServerFn(calcularNoServidor);
  const pythonFunctions = useQuery({
    queryKey: ['calculos', 'funcoes'],
    queryFn: () => listarFuncoes(),
    enabled: isOpen,
  });
  const calculatePython = useMutation({
    mutationKey: ['calculos', 'calcular'],
    mutationFn: (vars: { data: PythonCalculationInput }) =>
      calcular({ data: vars.data }) as Promise<PythonCalculationResponse>,
  });

  // Sincroniza aba inicial quando a modal é aberta
  React.useEffect(() => {
    if (isOpen) {
      setAbaAtiva(abaInicial);
      setResultadoPython(null);
    }
  }, [isOpen, abaInicial]);

  if (!isOpen) return null;

  const testarExecucaoPython = async () => {
    setResultadoPython(null);

    let funcao: PythonCalculationInput['funcao'] = 'resolver_cubo_enem';
    let params: any = {
      x_inicial: 6.0,
      y_inicial: 2.0,
      z_inicial: 7.0,
      delta_yz: -3.0,
      delta_xz: 5.0,
      delta_xy: -4.0,
    };

    if (gaveta.id === 'geometria-cubo-3d') {
      funcao = 'geometria_cubo';
      params = { arestas: 3, espacamento: 1.2 };
    } else if (gaveta.id === 'enem-ciclovia-lagoa-policiais') {
      funcao = 'cobertura_ciclovia';
      params = { raio_km: 1.0, pi_aprox: 3.0, alcance_m: 200, num_policiais: 15, posicao_p_m: 1000 };
    } else if (gaveta.id === 'enem-diretoria-10-casais') {
      funcao = 'diretoria_casais';
      params = { num_casais: 10, num_cargos: 3 };
    } else if (gaveta.id === 'template-em-branco') {
      funcao = 'combinacoes';
      params = { n: 5, k: 2 };
    }

    try {
      const res = await calculatePython.mutateAsync({ data: { funcao, params } });
      setResultadoPython(res);
    } catch (err) {
      setResultadoPython({
        ok: false,
        erro: err instanceof Error ? err.message : 'Não foi possível executar o cálculo.',
      });
    }
  };

  const copiarCodigo = (texto: string) => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 z-10 animate-in zoom-in-95 duration-150">
        
        {/* Cabeçalho */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Painel de Apoio ao Professor
            </h2>
            <p className="text-xs text-slate-500">
              {gaveta.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-slate-200 bg-white px-5 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setAbaAtiva('didatico')}
            className={`pb-2.5 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              abaAtiva === 'didatico'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Enunciado & Didática</span>
          </button>

          <button
            onClick={() => setAbaAtiva('python')}
            className={`pb-2.5 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              abaAtiva === 'python'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Integração Python</span>
          </button>

          <button
            onClick={() => setAbaAtiva('adicionar')}
            className={`pb-2.5 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              abaAtiva === 'adicionar'
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Como Adicionar Nova Questão</span>
          </button>
        </div>

        {/* Conteúdo com Rolagem */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          
          {/* ABA 1: CONTEXTO DIDÁTICO */}
          {abaAtiva === 'didatico' && (
            <div className="space-y-4 text-slate-700">
              {/* Enunciado */}
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 uppercase tracking-wide text-[10px]">
                  Enunciado para os Alunos:
                </span>
                <p className="text-sm font-medium text-blue-950 leading-relaxed">
                  {gaveta.mathContext.enunciado}
                </p>
              </div>

              {/* Imagem Original da Prova (se for a questão do ENEM) */}
              {gaveta.id === 'enem-cubo-projecoes-3d' && (
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-[11px]">
                      Figura Original da Prova (ENEM):
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Posição Inicial: (x=6, y=2, z=7)
                    </span>
                  </div>
                  <div className="flex justify-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <img
                      src={enemQ138Figura.url}
                      alt="Figura da questão do ENEM mostrando o cubo e suas projeções ortogonais"
                      className="max-h-56 object-contain rounded"
                    />
                  </div>
                </div>
              )}

              {/* Fórmulas */}
              {gaveta.mathContext.formula && (
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Relação Matemática / Fórmula:
                  </span>
                  <p className="font-mono text-xs text-emerald-300 font-semibold tracking-wide">
                    {gaveta.mathContext.formula}
                  </p>
                </div>
              )}

              {/* Explicação */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-xs">
                  Intuição Geométrica & Raciocínio:
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {gaveta.mathContext.explicacao}
                </p>
              </div>

              {/* Dica Pedagógica */}
              {gaveta.mathContext.dicaPedagogica && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 text-[11px] block">
                      Dica para Sala de Aula:
                    </span>
                    <p className="text-amber-800 leading-relaxed mt-0.5">
                      {gaveta.mathContext.dicaPedagogica}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ABA 2: INTEGRAÇÃO PYTHON */}
          {abaAtiva === 'python' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 text-xs">
                  Como funciona a ponte com Python:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Os cálculos de combinatória e geometria são executados no servidor pelo módulo{' '}
                  <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">
                    src/lib/matematica.ts
                  </code>, um porte fiel do script original{' '}
                  <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[11px]">
                    docs/matematica.py
                  </code>. O servidor executa o cálculo e repassa os dados para o navegador.
                </p>
              </div>

              {/* Chamada associada */}
              {gaveta.mathContext.codigoPython && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-700">
                    Função Python associada a esta questão:
                  </span>
                  <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl flex items-center justify-between">
                    <span>{gaveta.mathContext.codigoPython}</span>
                    <button
                      onClick={() => copiarCodigo(gaveta.mathContext.codigoPython!)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                      title="Copiar código"
                    >
                      {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700">
                  Funções Python disponíveis:
                </span>
                {pythonFunctions.isLoading ? (
                  <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3" aria-label="Carregando funções Python">
                    <div className="h-3 w-2/5 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
                    <div className="h-3 w-3/5 animate-pulse rounded bg-slate-200" />
                  </div>
                ) : pythonFunctions.isError ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-800">
                    <span>Não foi possível carregar a lista de funções Python.</span>
                    <button
                      type="button"
                      onClick={() => void pythonFunctions.refetch()}
                      className="shrink-0 rounded-lg border border-rose-300 bg-white px-2.5 py-1 font-semibold hover:bg-rose-100"
                    >
                      Tentar novamente
                    </button>
                  </div>
                ) : pythonFunctions.data?.ok ? (
                  <div className="grid gap-1.5 sm:grid-cols-2">
                    {pythonFunctions.data.funcoes.map((funcao) => (
                      <div key={funcao.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <code className="font-mono text-[11px] font-semibold text-emerald-800">{funcao.id}</code>
                        <p className="mt-0.5 text-[11px] text-slate-600">{funcao.nome}</p>
                        {funcao.params.length > 0 && (
                          <p className="mt-1 font-mono text-[10px] text-slate-400">{funcao.params.join(', ')}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800">
                    A API não retornou funções disponíveis.
                  </p>
                )}
              </div>

              {/* Botão de Teste ao Vivo */}
              <div className="pt-2">
                <button
                  onClick={testarExecucaoPython}
                  disabled={calculatePython.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-xs disabled:opacity-50 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {calculatePython.isPending ? 'Calculando no Python 3...' : 'Executar Teste de Cálculo via API Python'}
                  </span>
                </button>
              </div>

              {/* Retorno ao vivo do Python */}
              {calculatePython.isPending && (
                <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900 p-3" aria-label="Executando cálculo">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-slate-700" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-slate-700" />
                </div>
              )}
              {resultadoPython && (
                <div className="mt-3 p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1 font-mono text-[11px] border border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      Resposta JSON do Python:
                    </span>
                    <span>Status: {resultadoPython.ok ? 'Sucesso 200' : 'Erro'}</span>
                  </div>
                  <pre className="max-h-48 overflow-y-auto pt-2 text-slate-300">
                    {JSON.stringify(resultadoPython.dados || resultadoPython.erro, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* ABA 3: COMO ADICIONAR NOVA QUESTÃO */}
          {abaAtiva === 'adicionar' && (
            <div className="space-y-4 text-slate-700">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  Guia Rápido: Como Adicionar uma Nova Gaveta
                </h4>
                <p className="text-slate-600">
                  O projeto foi desenhado como gavetas independentes. Para criar sua próxima questão:
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-3 pl-1 font-medium text-slate-800">
                <li className="space-y-1">
                  <span>Crie uma nova pasta em <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">src/drawers/</code>:</span>
                  <p className="font-normal text-slate-600 pl-5 text-[11px]">
                    Exemplo: <code className="font-mono">src/drawers/permutacao-didatica/index.ts</code> (pode duplicar a pasta <code className="font-mono">template-novo</code>).
                  </p>
                </li>

                <li className="space-y-1">
                  <span>Implemente a interface <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">DrawerModule</code>:</span>
                  <p className="font-normal text-slate-600 pl-5 text-[11px]">
                    Preencha o título, descrição, enunciado matemático, controles da doca e a função <code className="font-mono">mount</code> (onde você desenha em Three.js ou Canvas 2D).
                  </p>
                </li>

                <li className="space-y-1">
                  <span>Registre no índice central:</span>
                  <p className="font-normal text-slate-600 pl-5 text-[11px]">
                    Abra <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">src/drawers/index.ts</code> e adicione sua nova gaveta na lista <code className="font-mono">todasAsGavetas</code>.
                  </p>
                </li>

                <li className="space-y-1">
                  <span>(Opcional) Adicione funções Python:</span>
                  <p className="font-normal text-slate-600 pl-5 text-[11px]">
                    Se a questão exigir cálculos combinatórios pesados, basta escrever a função em <code className="font-mono">src/lib/matematica.ts</code>!
                  </p>
                </li>
              </ol>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600">
                💡 <strong>Dica:</strong> Um arquivo de instruções completo também está disponível no projeto em <code className="font-mono font-bold text-slate-800">docs/COMO_ADICIONAR_GAVETA.md</code>.
              </div>
            </div>
          )}

        </div>

        {/* Rodapé da Modal */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
