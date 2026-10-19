"use strict";
(function (q, bank) {
  const L = "Fundamentos e lógica", P = "Programação e algoritmos", S = "Estruturas e sistemas",
    M = "Matemática, dados e IA", E = "Energia, sustentabilidade e sociedade";
  bank.finals.push({ id: "A", questions: [
    q("a1",1,L,3,"22–23; 43–47","O byte sem sinal 10110110₂ identifica o sensor que disparou um alerta na Aurora. O painel exibe esse identificador em decimal, e o log de depuração, em hexadecimal. Qual par representa o mesmo valor nas duas notações?",[
      ["182 e B6.","128+32+16+4+2=182; grupos 1011 e 0110 correspondem a B e 6."],
      ["182 e 6B.","O decimal está correto, mas os grupos hexadecimais foram invertidos."],
      ["180 e B4.","Esse par ignora o bit de peso 2 presente no número fornecido."],
      ["86 e 56.","Corresponde a outro byte; perde o peso 128 e altera a representação."],
      ["256 e FF.","FF vale 255, e nenhum byte sem sinal representa 256."]
    ],"Expanda os pesos ou agrupe de quatro em quatro. Use uma conversão para conferir a outra: 11×16+6=182."),
    q("a2",1,L,6,"5–6","Ao montar a linha do tempo da IA para o relatório da Aurora, um estudante precisa associar três anos a marcos diferentes: 1936, 1950 e 1956. Ele sabe que dois desses marcos envolvem Alan Turing e que um deles marca a consolidação do campo como área de pesquisa. Qual sequência associa corretamente os três anos, nessa ordem?",[
      ["Máquina teórica de Turing; jogo da imitação; reunião de Dartmouth.","Os marcos distinguem computabilidade, discussão de inteligência e consolidação da IA."],
      ["ENIAC; transistor; máquina analítica.","Esses projetos pertencem a outros marcos e épocas."],
      ["Dartmouth; máquina teórica de Turing; jogo da imitação.","As contribuições estão deslocadas no tempo."],
      ["Pascalina; linguagem C; microprocessador.","Não corresponde a nenhum dos três marcos pedidos."],
      ["Jogo da imitação; Dartmouth; máquina teórica de Turing.","Troca 1936 com 1950 e 1956."]
    ],"A fase 1, capítulo 2, pp. 27–28, situa a máquina teórica em 1936; o capítulo 6 distingue 1950 de 1956. Associe ano à contribuição, não só ao nome.","Recordar"),
    q("a3",1,P,5,"16–21","O script de bordo classifica a carga da bateria e, depois da cadeia, aplica uma regra de vigilância independente:\n```\ncarga = 85\nestado = 'normal'\nif carga >= 80:\n    estado = 'alta'\nelif carga >= 50:\n    estado = 'media'\nif estado == 'alta' and carga < 90:\n    estado = 'monitorar'\n```\nQual é o valor final de `estado`?",[
      ["monitorar", "O primeiro bloco define alta, o elif é ignorado e o if independente redefine para monitorar."],
      ["alta", "Ignora a condição independente executada depois da cadeia."],
      ["media", "O elif não executa após o primeiro if verdadeiro."],
      ["normal", "O primeiro teste é verdadeiro e modifica o estado inicial."],
      ["Erro obrigatório por usar dois if.","É válido usar uma cadeia e depois um if independente."]
    ],"Rastreie as instruções em ordem e diferencie uma alternativa da cadeia de uma decisão posterior independente."),
    q("a4",2,P,3,"22–24","Um script de teste da Aurora começa com `total = 0` e executa `for n in range(1, 7):`. No corpo do laço, executa `continue` quando `n % 2 == 0` e, nos demais casos, faz `total += n`. Qual é o valor final de `total`?",[
      ["9", "Somam-se os ímpares 1,3,5; 6 é o último valor do range e é descartado."],
      ["12", "É a soma dos pares 2,4,6, que foram pulados."],
      ["21", "É a soma sem aplicar o continue aos pares."],
      ["16", "Inclui indevidamente 7; o limite final do range é exclusivo."],
      ["1", "continue não encerra todo o laço; apenas pula uma iteração."]
    ],"Liste os valores produzidos, aplique o filtro e só então acumule. O final exclusivo e a diferença entre break e continue são decisivos."),
    q("a5",2,E,8,"5; 7–8; 12–13","A seção histórica do relatório da colônia Aurora precisa datar quatro marcos: a conferência ambiental da ONU que levou à criação do PNUMA, o relatório que popularizou a expressão “desenvolvimento sustentável”, a conferência que produziu a Agenda 21 e a adoção dos 17 ODS. Qual linha do tempo associa corretamente ano e marco?",[
      ["1972 Estocolmo; 1987 Brundtland; 1992 Rio-92; 2015 Agenda 2030.","Associa conferência ambiental, relatório, Rio-92 e agenda dos ODS aos marcos corretos."],
      ["1972 Rio-92; 1987 Estocolmo; 1992 Agenda 2030; 2015 Brundtland.","Todos os eventos foram deslocados; Rio-92 já explicita seu ano."],
      ["1987 Agenda 21; 1992 Brundtland; 2015 Estocolmo.","Agenda 21 liga-se à Rio-92, Brundtland a 1987 e Estocolmo a 1972."],
      ["1992 Agenda 2030, com 169 ODS e 17 metas.","A agenda é de 2015 e os números de objetivos e metas estão invertidos."],
      ["2015 criação da Pascalina e lançamento da Agenda 21.","Mistura um artefato computacional do século XVII com uma agenda de 1992."]
    ],"Memorize o par data–significado. Agenda 21 e Agenda 2030 são marcos diferentes; a última reúne 17 ODS e 169 metas.","Recordar"),
    q("a6",3,L,2,"49–53","O alarme de pressão do módulo foi escrito como F = A·B + A·B', em que A indica pressão abaixo do limite e B indica eclusa aberta. Antes de montar o circuito, você quer a expressão mais simples que preserve todas as linhas da tabela-verdade. Qual é ela?",[
      ["F=A.","F=A(B+B')=A·1=A, pela distributiva e complemento."],
      ["F=B.","Com A=0 e B=1, a original vale 0, mas B vale 1."],
      ["F=A+B.","Com A=0 e B=1, essa expressão vale 1 e a original vale 0."],
      ["F=0.","Quando A=1, um dos dois termos será 1."],
      ["F=A'.", "A função não inverte A; ela o reproduz."]
    ],"Fatore o termo comum. O complemento de B cobre as duas possibilidades de B, tornando a saída independente dessa variável."),
    q("a7",3,M,5,"12–14","Um controlador combina duas leituras de sensor aplicando a matriz de ganhos A = [[2, 1], [0, 3]] ao vetor coluna x = [[4], [2]]. Calcule o produto matricial Ax, multiplicando cada linha de A pela coluna x, e indique a dimensão do resultado.",[
      ["[[10],[6]], dimensão 2×1.","Linha 1: 2×4+1×2=10; linha 2: 0×4+3×2=6."],
      ["[[8,2],[0,6]], dimensão 2×2.","Esse resultado tenta multiplicar elementos isolados, não linhas por colunas."],
      ["[[6],[5]], dimensão 2×1.","Soma valores sem efetuar os produtos escalares exigidos."],
      ["[[10,6]], dimensão 1×2.","Os valores estão corretos, mas o resultado do produto é vetor coluna."],
      ["O produto é impossível porque as matrizes têm formatos diferentes.","Os formatos podem diferir; as dimensões internas 2 coincidem."]
    ],"Primeiro confira (2×2)(2×1)=(2×1); depois multiplique cada linha da matriz pela coluna do vetor."),
    q("a8",3,M,7,"7–8; 11","O modelo ajustado para a demanda de água é ŷ = 12 + 3x, com x em módulos ocupados e ŷ em litros por hora. Em uma hora com x = 4, o consumo observado foi y = 27. Usando resíduo = y − ŷ, qual leitura da previsão, do resíduo e do coeficiente está correta?",[
      ["Previsão 24, resíduo 3; cada unidade de x associa-se a +3 em ŷ.","12+3×4=24; y−ŷ=27−24=3; a inclinação é 3."],
      ["Previsão 27, resíduo 0; o modelo sempre acerta a observação.","Confunde o valor observado com a previsão calculada."],
      ["Previsão 24, resíduo −3; o modelo superestimou.","O modelo subestimou, pois o observado é maior; o resíduo y−ŷ é positivo."],
      ["Previsão 60; a inclinação é 12.","Multiplica indevidamente o intercepto e troca os coeficientes."],
      ["Previsão 24; a inclinação prova que x causa y.","O cálculo não estabelece causalidade."]
    ],"Distinga intercepto, inclinação, previsão e observação. Resíduo tem convenção explícita de sinal, e associação não prova causalidade."),
    q("a9",4,S,3,"25–30","Uma rede não direcionada tem A–B=4, A–C=1, C–B=2, B–D=1 e C–D=7. Qual caminho de A até D tem menor custo?",[
      ["A–C–B–D, custo 4.","1+2+1=4, menor que A–B–D=5 e A–C–D=8."],
      ["A–B–D, custo 5, pois possui menos arestas.","Menos arestas não implica menor soma de pesos."],
      ["A–C–D, custo 8, pois começa pela menor aresta.","Escolher a primeira aresta barata não determina o melhor restante da rota."],
      ["A–C–B–D, custo 3.","3 é a quantidade de arestas; a soma dos pesos é 4."],
      ["Nenhum algoritmo se aplica porque os pesos são positivos.","Pesos não negativos satisfazem a pré-condição de Dijkstra."]
    ],"Compare custos completos. Dijkstra atualiza distâncias e predecessores; ele não escolhe apenas a menor aresta visível."),
    q("a10",4,M,6,"10–19","Um modelo estima p(falha)=0,38. A política emite alerta para p≥0,30; positivo significa falha. Qual decisão e interpretação são corretas?",[
      ["Emitir alerta; se não houver falha real, será um falso positivo.","0,38 supera o limiar; alerta sem evento real é falso positivo."],
      ["Não emitir alerta porque p<0,50.","O limiar explicitado é 0,30, não obrigatoriamente 0,50."],
      ["Emitir alerta; se não houver falha, será falso negativo.","Falso negativo é uma falha real não alertada."],
      ["Garantir que haverá falha porque a regra disparou.","Classificação por limiar não transforma probabilidade em certeza."],
      ["Trocar p por 1−p antes de comparar, mantendo positivo=falha.","Isso mudaria o evento de referência e contradiz a definição dada."]
    ],"Leia qual evento é positivo e qual limiar foi escolhido. O custo dos erros orienta a política, mas não elimina a incerteza.","Analisar")
  ] });
  bank.finals.push({ id: "B", questions: [
    q("b1",1,M,6,"10; 18–19; 26","A equipe de manutenção da Aurora tem três anos de registros de sensores de vibração e temperatura, cada um com um rótulo histórico: 0 para operação normal e 1 para falha. As falhas são raras, e o objetivo é sinalizar com antecedência as próximas. Qual formulação do problema é adequada?",[
      ["Classificação supervisionada, com avaliação da classe de falha além da acurácia.","Há alvo rotulado e previsão de classe; uma classe rara pode ser ignorada por alta acurácia."],
      ["Regressão contínua apenas porque o rótulo usa números.","0/1 codifica categorias; o objetivo continua sendo classificação."],
      ["Clustering supervisionado sem utilizar rótulos.","Agrupamento sem rótulos não corresponde à tarefa supervisionada descrita."],
      ["Reforço porque todo registro possui uma medição.","Medição não é recompensa resultante de uma ação de agente."],
      ["Treinar e avaliar nos mesmos dados garante desempenho futuro.","Isso não mede generalização e favorece avaliação otimista."]
    ],"A natureza do alvo e a informação disponível definem a tarefa. Identificadores numéricos de classes não são quantidades contínuas."),
    q("b2",1,E,7,"21–22","No mesmo período de medição, o data center que processa a telemetria da Aurora consumiu 150 kWh no total, dos quais 100 kWh nos equipamentos de TI. A equipe precisa relatar o indicador de eficiência da instalação e o que ele revela. Qual análise é correta?",[
      ["PUE=1,5; 50 kWh correspondem ao consumo auxiliar.","150/100=1,5 e 150−100=50, na mesma fronteira e período."],
      ["PUE≈0,67; quanto menor que 1, melhor.","Inverte numerador e denominador do PUE."],
      ["PUE=50; o indicador é a diferença das energias.","PUE é razão, não diferença."],
      ["PUE=1,5 prova emissões nulas.","PUE não informa a fonte de energia nem as emissões."],
      ["A TI consumiu potência de 100 kW.","Foi fornecida energia de 100 kWh; a potência exige informação temporal adequada."]
    ],"A energia auxiliar e a razão PUE descrevem aspectos diferentes. Nenhuma das duas demonstra sozinha sustentabilidade total."),
    q("b3",2,L,2,"52–54; 65–67","Um circuito de diagnóstico da Aurora combina dois sinais de falha, A e B, booleanos e independentes, pela expressão S = (A OR B) AND NOT(A AND B). Avaliando as quatro combinações possíveis de entrada, em quais casos S vale 1 e a que porta lógica de duas entradas o circuito equivale?",[
      ["Somente quando exatamente uma entrada vale 1; equivale a XOR.","OR aceita 01, 10 e 11, mas NOT(A AND B) elimina 11; restam 01 e 10."],
      ["Sempre que alguma entrada vale 1; equivale a OR.","Com A=B=1, o NOT do AND vale 0 e bloqueia a saída."],
      ["Somente quando as duas entradas valem 1; equivale a AND.","Nesse caso o segundo fator vale 0, portanto a saída é 0."],
      ["Somente quando as entradas são iguais; equivale a XNOR.","Os casos iguais 00 e 11 produzem 0; XNOR é a negação do resultado obtido."],
      ["Em todos os casos exceto 11; equivale a NAND.","NAND também aceita 00, mas o fator A OR B desse circuito não aceita 00."]
    ],"Teste as quatro combinações: 00→0, 01→1, 10→1 e 11→0. A composição realiza OU-exclusivo. Negar apenas um fator não equivale a negar a expressão inteira.","Analisar"),
    q("b4",2,P,5,"19–24","O sistema de telemetria da Aurora guarda 1 000 leituras na ordem em que chegaram, sem ordenação, e um desenvolvedor aplicou busca binária diretamente sobre esse vetor para localizar leituras específicas. Os testes passam em alguns casos e falham em outros. Qual correção conceitual é necessária?",[
      ["Garantir ordenação coerente ou escolher outra busca; considerar também o custo de ordenar.","A eliminação de metades só é válida quando a ordem sustenta a comparação."],
      ["Nenhuma: basta haver quantidade par de valores.","Paridade do tamanho não substitui ordenação."],
      ["Nenhuma: O(log n) garante correção em qualquer entrada.","Complexidade não elimina pré-condições do algoritmo."],
      ["Ordenar apenas o primeiro e o último valor.","Isso não estabelece ordem no intervalo interno."],
      ["Usar sempre quick sort porque seu pior caso é O(n).", "Quick sort não tem pior caso O(n); sua versão usual pode chegar a O(n²)."]
    ],"Antes de citar uma complexidade, verifique as condições sob as quais o algoritmo é correto. Para poucas consultas, ordenar pode não compensar.","Analisar"),
    q("b5",2,M,6,"22–24","Um balão-sonda lançado da base Aurora tem a altura modelada por h(t) = −t² + 8t + 3, com h em quilômetros e t em horas. A telemetria só registra a janela admissível 0 ≤ t ≤ 2. Em que instante dessa janela ocorre a maior altura registrada e qual é o seu valor?",[
      ["t=2, com h=15.","O vértice está em t=4, fora do intervalo; a função cresce de 0 a 2."],
      ["t=4, com h=19.","É o vértice da parábola completa, mas não pertence ao domínio admissível."],
      ["t=0, com h=3.","Esse valor é menor que h(2)=15."],
      ["t=8, com h=3.","O ponto está fora do intervalo e não maximiza a parábola."],
      ["Não existe máximo porque a função é quadrática.","Uma função contínua nesse intervalo fechado possui máximo."]
    ],"A solução precisa respeitar o domínio. Não basta calcular o vértice e ignorar as restrições do cenário."),
    q("b6",3,S,4,"10–12; 24–25","O registro de telemetria precisa responder a consultas como 'todas as leituras com carimbo de tempo entre 1000 e 1500' e garantir busca O(log n) no pior caso, mesmo quando as chaves chegam em ordem crescente. Supondo implementação correta, qual estrutura atende melhor às duas exigências?",[
      ["Uma árvore de busca balanceada, como AVL.","Mantém ordem e altura logarítmica, apoiando busca e intervalos."],
      ["BST comum, pois toda árvore binária já é balanceada.","Uma BST comum pode degenerar em cadeia."],
      ["Tabela hash, pois sempre mantém chaves em ordem crescente.","Hash não oferece essa ordenação nem garantia universal de pior caso constante."],
      ["Pilha, pois LIFO organiza intervalos numéricos.","LIFO define ordem de remoção, não ordenação por chave."],
      ["Fila, pois FIFO elimina a necessidade de busca.","Ordem de chegada não resolve consultas por intervalo de chaves."]
    ],"A estrutura deve satisfazer duas condições: ordem de chaves e altura controlada. Balanceamento evita o pior caso linear da BST comum.","Analisar"),
    q("b7",3,S,6,"18–19; 31","O computador de bordo tem um único núcleo e atende três tarefas: leitura de sensores, compressão de imagens e envio de telemetria. Enquanto uma delas espera a resposta de um dispositivo de entrada/saída, o sistema operacional entrega a CPU a outra. Qual descrição dessa execução é correta?",[
      ["Há concorrência por intercalação, sem exigir execução simultânea das instruções das tarefas.","O sistema organiza progresso de várias tarefas ao longo do tempo."],
      ["Há necessariamente paralelismo entre todas as tarefas.","Intercalação não significa simultaneidade."],
      ["Não pode existir concorrência com um núcleo.","Concorrência não exige múltiplos núcleos."],
      ["Cada processo é apenas um arquivo sem estado de execução.","Processo é uma instância em execução, com estado e recursos."],
      ["O kernel é somente a janela gráfica que o usuário vê.","O kernel gerencia recursos e serviços fundamentais; não é só interface."]
    ],"Separe o modo de organização das tarefas da simultaneidade física. Essa distinção evita confundir concorrência e paralelismo."),
    q("b8",3,M,5,"17–18; 26–27","Um array NumPy `leituras` tem shape (4, 3): quatro instantes nas linhas e três sensores nas colunas. A equipe calcula `media = leituras.mean(axis=0)`, de shape (3,), e executa `leituras - media` para centralizar cada coluna. O que acontece nessa subtração?",[
      ["O broadcasting é compatível e o resultado mantém shape (4,3).", "O último eixo tem tamanho 3 nos dois; o vetor é aplicado às quatro linhas."],
      ["O resultado tem shape (3,4) por transposição automática.","Broadcasting não transpõe os eixos."],
      ["É impossível porque os arrays precisam ter ndim idêntico.","Broadcasting permite dimensões diferentes quando seus eixos são compatíveis."],
      ["A operação é produto matricial e gera shape (4,).", "O enunciado pede subtração por coluna, não multiplicação matricial."],
      ["O vetor deve ter shape (4,) porque há quatro linhas.","Para médias por coluna, há três valores; (4,) não alinha com o último eixo 3."]
    ],"Compare dimensões da direita para a esquerda: devem coincidir ou uma delas deve ser 1. Interprete também o significado de cada eixo."),
    q("b9",4,M,4,"16–25","C(x)=x²−10x+29 para 0≤x≤8. Qual valor minimiza C no intervalo?",[
      ["x=5, com C=4.","C'=2x−10 zera em 5; C''=2>0 e as extremidades têm custos maiores."],
      ["x=10, com C=29.","Está fora do intervalo e não é o ponto estacionário."],
      ["x=0, com C=29.","O custo é maior que o do ponto interno x=5."],
      ["x=8, com C=13.","É admissível, mas C(5)=4 é menor."],
      ["Qualquer x, pois a segunda derivada é constante.","Segunda derivada constante não implica função constante."]
    ],"Encontre candidatos pela primeira derivada, classifique quando possível e compare com as extremidades admissíveis."),
    q("b10",4,M,6,"8–18","A probabilidade inicial é 0,20. Mantidas as outras variáveis, um aumento unitário de um preditor multiplica as odds por 2. Qual a nova probabilidade?",[
      ["1/3, aproximadamente 0,333.","Odds iniciais=0,2/0,8=0,25; novas=0,5; p=0,5/(1+0,5)=1/3."],
      ["0,40.","Dobrar odds não é dobrar diretamente a probabilidade."],
      ["0,50.","0,50 são as novas odds, não a nova probabilidade."],
      ["0,25.","0,25 são as odds iniciais, não o resultado final."],
      ["1,20.","Probabilidade não pode superar 1; o efeito não é soma de uma unidade."]
    ],"Faça três passos: probabilidade para odds, aplicação do fator e odds para probabilidade. O coeficiente logístico atua nas log-odds.")
  ] });
  bank.finals.push({ id: "C", questions: [
    q("c1",1,L,2,"33–39","Para uma exposição sobre a evolução do hardware de bordo, a equipe da Aurora vai ordenar as quatro primeiras gerações de computadores eletrônicos pela tecnologia que caracteriza cada uma, sem depender das datas de fronteira, que variam entre as fontes. Qual sequência corresponde à classificação estudada?",[
      ["Válvulas → transistores → circuitos integrados → microprocessadores.","A sequência acompanha substituição e aumento da integração dos componentes."],
      ["Transistores → válvulas → microprocessadores → cartões perfurados.","Inverte etapas e recoloca um meio de controle anterior ao final."],
      ["Circuitos integrados → válvulas → transistores → microprocessadores.","Circuitos integrados não antecedem as válvulas na sequência estudada."],
      ["Microprocessadores → transistores → válvulas → circuitos integrados.","A ordem mistura avanços com retornos tecnológicos."],
      ["Quatro nomes para o mesmo componente físico.","São tecnologias e níveis de integração distintos."]
    ],"Os intervalos de anos podem variar entre fontes; a tecnologia principal é o critério mais consistente para reconhecer a geração.","Recordar"),
    q("c2",1,P,4,"23; 29–30","Um script de bordo recebe a contagem de módulos como texto e calcula um índice de carga. Considere o trecho `a = '12'`, `b = 3` e `r = int(a) // b + 2 ** 2`. Qual é o valor de `r` e qual é o seu tipo?",[
      ["8, um inteiro.","int(a)=12; 12//3=4; 2**2=4; soma=8."],
      ["124, um inteiro.","Não há concatenação: a foi convertido antes do cálculo."],
      ["8, necessariamente texto.","As operações numéricas após int não produzem texto nesse caso."],
      ["16, um inteiro.","Agrupa a expressão como (4+2)² ou outra ordem indevida; potência precede soma."],
      ["Erro porque a começou como string.","int(a) converte o texto numérico válido antes da divisão."]
    ],"Rastreie tipo e precedência. Conversão explícita permite cálculo; // e ** têm significados próprios."),
    q("c3",2,L,7,"31","Ao justificar a escolha do processador de bordo, um relatório da Aurora afirma que a Lei de Moore garante que cada nova geração de chips executa qualquer programa duas vezes mais rápido. Considerando a nota de fontes da revisão sobre as datas e o objeto da projeção de Gordon Moore, qual afirmação interpreta corretamente a lei?",[
      ["Moore publicou a projeção em 1965 e a revisou em 1975; ela trata de integração, não garante dobrar a velocidade de todo programa.","Distingue os marcos da previsão e seu objeto; a nota corrige a simplificação temporal do PDF."],
      ["Turing publicou em 1950 uma lei que garante duplicar a frequência mensalmente.","Troca autor, data, objeto e intervalo."],
      ["É uma lei física que obriga qualquer algoritmo a ficar duas vezes mais rápido.","É projeção empírica tecnológica, não obrigação física ou algorítmica."],
      ["Foi criada por Dennis Ritchie para definir o tamanho de int.","Ritchie está ligado a C; a lei não define tamanhos de tipos."],
      ["Afirma que dobrar RAM sempre dobra desempenho.","RAM não é a grandeza central da projeção e desempenho depende do gargalo."]
    ],"A nota usa a documentação histórica da Intel: previsão de 1965 e revisão de 1975. Integração de componentes não é desempenho garantido.","Recordar"),
    q("c4",2,S,5,"8–11; 17–21","O catálogo ordenado de peças de reposição da Aurora vai crescer de 1 024 para 2 048 itens. No pior caso, o número de comparações da busca linear cresce proporcionalmente a n, e o da busca binária, proporcionalmente a log₂ n. Qual comparação descreve o efeito dessa duplicação sobre as duas buscas?",[
      ["O custo linear aproximadamente dobra; a escala logarítmica aumenta de 10 para 11.","n dobra, enquanto log₂(1024)=10 e log₂(2048)=11."],
      ["Ambas precisam aproximadamente do dobro de comparações.","Ignora a diferença de crescimento entre n e log n."],
      ["A busca binária passa necessariamente de 10 para 20 segundos.","Big-O não especifica segundos, e o crescimento logarítmico não dobra."],
      ["A busca linear se torna O(1) porque o array está ordenado.","Ordem não muda o percurso linear escolhido."],
      ["A busca binária dispensa ordenação quando n é potência de dois.","Potência de dois não elimina a pré-condição de ordem."]
    ],"Compare crescimento, não tempo de relógio. Os valores logarítmicos explicam a escala, sem fixar contagem exata para toda implementação."),
    q("c5",3,P,3,"53–57","A função `soma(n)` devolve 0 quando `n == 0` e, nos demais casos, `n + soma(n - 1)`; o contrato aceita apenas inteiros não negativos. Rastreie a pilha de chamadas de `soma(4)` até o caso-base e de volta. Qual valor é devolvido e por que a recursão termina?",[
      ["10; o argumento diminui até o caso base 0.","4+3+2+1+0=10; a redução respeita o contrato."],
      ["24; toda recursão calcula fatorial.","Aqui a operação é soma, não multiplicação."],
      ["4; return impede qualquer chamada recursiva.","A expressão do retorno avalia a chamada antes de concluir."],
      ["10; termina mesmo se o argumento for negativo sem validação.","Com n negativo e decremento, a função se afasta de zero."],
      ["Não termina porque funções não podem chamar a si mesmas.","Recursão é válida quando existe progresso para um caso base."]
    ],"Identifique operação, caso base e redução. O contrato de domínio faz parte da justificativa de término."),
    q("c6",3,E,8,"21–22","No modelo idealizado P = ½·ρ·A·v³·Cp, o vento em uma turbina da colônia passa de 5 m/s para 10 m/s, com densidade do ar, área varrida e Cp constantes. Qual é o efeito sobre a potência disponível no vento e qual limite de interpretação vale para a máquina real?",[
      ["Oito vezes a potência disponível; não garante oito vezes a saída de uma turbina real.","2³=8, mas potência nominal, controle e regimes de operação limitam a extração."],
      ["Duas vezes, sem limites de operação.","Ignora o expoente cúbico e as restrições reais."],
      ["Seis vezes, pois 2×3=6.","Potência cúbica exige elevar 2 ao cubo, não multiplicar por 3."],
      ["Oito vezes a energia anual em qualquer local.","Velocidade pontual e potência idealizada não determinam energia anual."],
      ["A potência não muda porque a fonte é renovável.","Renovabilidade não torna a potência independente da velocidade."]
    ],"Separe a consequência algébrica dentro do modelo da promessa operacional fora de suas hipóteses."),
    q("c7",4,P,2,"19–30","Em Python: m=[[0,0]]*2; m[0][1]=7. Qual é o conteúdo final de m?",[
      ["[[0,7],[0,7]]", "As duas posições externas apontam para a mesma lista interna; a mutação aparece nas duas."],
      ["[[0,7],[0,0]]", "Seria o resultado se as linhas fossem objetos independentes."],
      ["[[7,0],[0,0]]", "Além de ignorar aliasing, altera a coluna errada."],
      ["[[0,0],[0,7]]", "A referência compartilhada impede que só a segunda representação mude."],
      ["Erro porque listas Python são imutáveis.","Listas são mutáveis; tuplas são imutáveis quanto às referências de elementos."]
    ],"Repetir uma lista externa pode repetir referências. Para linhas independentes, construa cada linha numa compreensão."),
    q("c8",4,M,5,"7–19","No modelo ŷ=6+4x₁−2x₂, qual é o efeito de aumentar x₁ em 2 e x₂ em 1, e como interpretar o coeficiente de x₂?",[
      ["A previsão aumenta 6; uma unidade de x₂ associa-se a −2, mantendo x₁ constante.","Δŷ=4×2−2×1=6; o efeito parcial exige fixar os demais preditores."],
      ["A previsão aumenta 12; o intercepto entra no cálculo da diferença.","O intercepto cancela ao comparar duas previsões do mesmo modelo."],
      ["A previsão diminui 2; x₁ deixa de importar.","Os dois preditores mudam e suas contribuições devem ser somadas."],
      ["A previsão aumenta 6; o coeficiente prova causalidade de x₂.","A conta está correta, mas o modelo sozinho não prova causalidade."],
      ["A previsão aumenta 8; coeficientes negativos são ignorados.","O coeficiente negativo participa normalmente do cálculo."]
    ],"Calcule diferenças pelos coeficientes dos preditores. Interpretação parcial não significa causalidade."),
    q("c9",4,E,7,"7–10; 22–28","Há 12 kWh utilizáveis numa bateria cujo limite de descarga é 2 kW. Uma carga exige 3 kW constantes por 2 h. A bateria pode atendê-la sozinha?",[
      ["Não: há energia suficiente, mas a potência admissível é insuficiente.","A carga exige 6 kWh, abaixo de 12, porém 3 kW excedem o limite de 2 kW."],
      ["Sim: 12 kWh são maiores que 3 kW.","Compara grandezas de unidades diferentes e ignora a limitação de potência."],
      ["Sim: atenderia por 4 h sem considerar qualquer limite.","12/3=4 h só seria aplicável se a bateria pudesse fornecer 3 kW."],
      ["Não: seriam necessários 18 kWh.","A energia pedida é 3×2=6 kWh, não 18."],
      ["Depende apenas de a fonte original ser renovável.","A origem não elimina a restrição de descarga."]
    ],"Capacidade e potência são condições independentes. Verifique ambas antes de calcular autonomia operacional.","Analisar"),
    q("c10",4,M,6,"19–20","Com falha como classe positiva, um classificador tem VP=12, FP=4, FN=3, VN=81. Quais precisão e recall?",[
      ["Precisão 75%; recall 80%.","12/(12+4)=75%; 12/(12+3)=80%."],
      ["Precisão 80%; recall 75%.","Troca os denominadores das duas métricas."],
      ["Precisão 93%; recall 93%.","93% é a acurácia (12+81)/100, não ambas as métricas."],
      ["Precisão 12%; recall 3%.","Usa partes do total sem os denominadores que definem as métricas."],
      ["Precisão 100%; recall 100%, pois VP é maior que FP e FN.","Existem falsos positivos e negativos, portanto as duas métricas são menores que 100%."]
    ],"Precisão começa pelos alertas produzidos; recall começa pelas falhas reais. Nomeie o denominador antes de calcular.")
  ] });
})(globalThis.FIAPQuestion, globalThis.FIAPBank);
