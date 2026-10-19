"use strict";
(function () {
  const bank = globalThis.FIAPBank;
  const added = [];
  const competencies = { logic: "Fundamentos e lógica", code: "Programação e algoritmos", system: "Estruturas e sistemas", math: "Matemática, dados e IA", energy: "Energia, sustentabilidade e sociedade" };
  const mapping = { 1: {2:"logic",3:"logic",4:"code",5:"code",6:"math",7:"energy",8:"energy"}, 2: {2:"logic",3:"code",4:"system",5:"code",6:"math",7:"system",8:"energy"}, 3: {2:"logic",3:"code",4:"system",5:"math",6:"system",7:"math",8:"energy"}, 4: {2:"code",3:"system",4:"math",5:"math",6:"math",7:"energy",8:"energy"} };
  function q(phase, chapter, prompt, pages, answers, level = "Aplicar") {
    const pairs = answers.map(answer => answer.split(" :: "));
    const index = added.length % 5;
    const ordered = Array.from({length:5}, (_, i) => pairs[(i-index+5)%5]);
    added.push({ id:`treino-${phase}-${chapter}-${added.filter(item => item.phase===phase && item.source.chapter===chapter).length+1}`, phase,
      competency:competencies[mapping[phase][chapter]], level, prompt, options:ordered.map(a=>a[0]),
      correctIndex:index, rationales:ordered.map(a=>a[1]), explanation:pairs[0][1], source:{phase,chapter,pages} });
  }
  q(1,2,"Num projeto de 1945, as instruções deixam de ser definidas por cabos e chaves: passam a ficar na memória junto com os dados, e a máquina as busca uma a uma durante a execução. Trocar de programa significa carregar outra sequência de instruções. Qual conceito essa organização descreve?","24; 34",[
    "Programa armazenado. :: As instruções são representadas em memória e buscadas pela máquina; isso caracteriza o programa armazenado.",
    "Memória obrigatoriamente não volátil. :: Guardar instruções durante a execução não exige preservá-las sem energia.",
    "Processamento exclusivamente paralelo. :: A descrição não afirma execução simultânea de instruções.",
    "Computação exclusivamente mecânica. :: Programa armazenado descreve organização, não exige mecanismo mecânico.",
    "Ausência de unidade de controle. :: A unidade de controle continua responsável por organizar a execução."
  ],"Compreender");
  q(1,2,"Ao comparar computadores de bordo de diferentes décadas, um engenheiro observa que cada geração substituiu o componente eletrônico principal da anterior por outro mais integrado, menor e mais confiável. Qual sequência representa essa substituição, da mais antiga para a mais recente?","35–39",[
    "Válvulas, transistores, circuitos integrados, microprocessadores. :: A sequência passa de componentes discretos para integração crescente; o microprocessador reúne a CPU num circuito integrado.",
    "Transistores, válvulas, microprocessadores, circuitos integrados. :: Válvulas precedem transistores; a sequência proposta inverte essa relação.",
    "Circuitos integrados, válvulas, transistores, microprocessadores. :: A integração em circuitos não antecede a geração de válvulas.",
    "Válvulas, circuitos integrados, transistores, microprocessadores. :: Os transistores discretos antecedem os circuitos integrados.",
    "Microprocessadores, transistores, válvulas, circuitos integrados. :: Microprocessadores são posteriores às gerações de componentes discretos."
  ],"Compreender");
  q(1,3,"O log de depuração da Aurora registra o byte de status como 3A₁₆. Para conferir quais sinalizadores estão ligados, você precisa escrever esse byte em binário, com os oito bits explícitos. Qual é a representação correta?","22–23; 30",[
    "00111010 :: Cada dígito hexadecimal corresponde a quatro bits: 3 é 0011 e A é 1010. A concatenação produz 00111010.",
    "00110100 :: O segundo grupo 0100 representa 4, não o dígito hexadecimal A.",
    "10100011 :: Os grupos foram invertidos; essa sequência representa A3.",
    "00111001 :: O segundo grupo 1001 representa 9, não A.",
    "01110100 :: Esse número é 74 em hexadecimal, o dobro de 3A em valor decimal."
  ]);
  q(1,3,"No protocolo de telemetria da Aurora, o campo de temperatura de um módulo usa seis bits sem sinal. A equipe precisa saber quantas leituras distintas o campo consegue codificar e qual é o maior valor inteiro que ele transmite. Qual par está correto?","31–33",[
    "64 valores; máximo 63. :: São 2⁶ combinações. Como a contagem começa em zero, os valores vão de 0 a 63.",
    "64 valores; máximo 64. :: A quantidade de combinações inclui zero; o máximo é uma unidade menor.",
    "63 valores; máximo 63. :: O intervalo de zero a 63 inclui 64 valores, não 63.",
    "32 valores; máximo 31. :: Isso corresponde a cinco bits sem sinal, não seis.",
    "128 valores; máximo 127. :: Isso corresponderia a sete bits sem sinal."
  ]);
  q(1,4,"Um script recebe a quantidade de células de bateria como texto e calcula quantos pacotes completos de cinco células podem ser montados. Depois de `a = '12'`, `b = int(a)` e `c = b // 5`, qual é o valor de `c` e qual é o seu tipo?","23; 29–30",[
    "2, do tipo int. :: int converte o texto em inteiro; 12 // 5 é a divisão com piso, cujo resultado inteiro é 2.",
    "2.4, do tipo float. :: Esse seria o resultado de 12 / 5, com divisão comum.",
    "'2', do tipo str. :: A conversão para int ocorre antes da divisão; c não é texto.",
    "7, do tipo int. :: A expressão divide por 5; ela não subtrai 5 de 12.",
    "Erro porque input sempre retorna texto. :: O trecho não usa input e converte explicitamente a antes de calcular."
  ]);
  q(1,4,"No fluxograma do procedimento de decolagem, um passo verifica se a pressão dos tanques está dentro da faixa segura e, conforme a resposta, segue por dois caminhos rotulados como sim e não. Qual símbolo deve representar esse passo?","7–9; 28",[
    "Losango. :: O losango representa a decisão; suas saídas permitem distinguir os caminhos conforme a condição.",
    "Retângulo. :: O retângulo representa processamento, como uma atribuição ou cálculo.",
    "Paralelogramo. :: O paralelogramo é usado para entrada ou saída de dados.",
    "Terminal arredondado. :: O terminal representa início ou fim do fluxo.",
    "Seta isolada. :: A seta indica direção; o teste fica no símbolo de decisão."
  ],"Compreender");
  q(1,4,"Um script de bordo calcula um índice de ajuste com a expressão `17 % 5 + 2 ** 3`, escrita sem parênteses. Aplicando a precedência dos operadores de Python, qual valor o script obtém?","23; 27",[
    "10 :: A potência produz 8, o resto de 17 dividido por 5 é 2, e a soma resulta em 10.",
    "11 :: 17 // 5 é 3, mas o operador pedido é %, que fornece resto 2.",
    "64 :: A soma não entra como base da potência; a precedência mantém 2 ** 3 separado.",
    "13 :: Somar o divisor 5 à potência ignora a operação de resto.",
    "24 :: O enunciado pede soma do resto com a potência, não multiplicação."
  ]);
  q(1,5,"Para evitar divisão por zero, o script de bordo protege um cálculo de taxa com a expressão `x != 0 and 10 / x > 2`. Numa leitura em que o sensor devolve `x = 0`, o que essa expressão produz em Python?","20–21",[
    "False, sem avaliar a divisão. :: O primeiro operando de and é falso. O curto-circuito evita avaliar 10 / x e, assim, a divisão por zero.",
    "ZeroDivisionError sempre. :: A divisão não é avaliada quando o primeiro teste de and é falso.",
    "True porque zero é um número válido. :: A expressão testa x != 0, que é falso para x igual a zero.",
    "None. :: As comparações presentes são booleanas; o primeiro teste retorna False.",
    "10. :: A expressão não retorna o numerador; ela combina dois testes lógicos."
  ]);
  q(1,5,"A regra de vigilância da Aurora aceita leituras de pressão de 10 a 20 bar, incluindo os dois limites; qualquer valor fora dessa faixa dispara um alerta. Qual condição em Python representa a faixa aceita para a leitura `x`?","22; 29",[
    "10 <= x <= 20 :: As duas comparações incluem a igualdade, aceitando os limites e todos os valores entre eles.",
    "10 < x < 20 :: Essa condição exclui exatamente 10 e 20, contrariando o enunciado.",
    "x >= 10 or x <= 20 :: Essa condição aceita qualquer número real: basta satisfazer um dos lados.",
    "x <= 10 and x >= 20 :: Um número real não pode satisfazer simultaneamente essas duas desigualdades.",
    "x == 10 or x == 20 :: Essa condição aceita apenas os extremos, não o interior da faixa."
  ]);
  q(1,5,"Um sistema de avaliação de treinamento classifica a nota de um tripulante com uma cadeia que testa primeiro `if nota >= 5:` e depois `elif nota >= 8:`. Para `nota = 9`, qual ramo da cadeia é executado?","16–19",[
    "Apenas o primeiro if. :: A primeira condição já é verdadeira; os ramos elif restantes da mesma cadeia não são avaliados para execução.",
    "Os dois ramos. :: Isso poderia ocorrer com if independentes, mas não nessa cadeia if/elif.",
    "Apenas o elif, por ser mais específico. :: Python segue a ordem escrita, não escolhe automaticamente a condição mais específica.",
    "Nenhum, porque há sobreposição. :: Condições sobrepostas não impedem executar o primeiro ramo verdadeiro.",
    "Um ramo aleatório. :: A escolha é determinística e depende da ordem das condições."
  ]);
  q(1,6,"Um perceptron de bordo decide se uma leitura indica risco (saída 1) ou não (saída 0). Ele recebe x = (2, 1), usa os pesos w = (0,5; −1) e o viés b = 0,2, e a ativação degrau devolve 1 quando z ≥ 0. Qual é o valor de z e qual é a saída?","29–30",[
    "z = 0,2 e saída 1. :: A soma ponderada é 2 × 0,5 + 1 × (−1) + 0,2 = 0,2. Como z é não negativo, a saída é 1.",
    "z = 0 e saída 1. :: Esse cálculo ignora o viés de 0,2.",
    "z = −0,2 e saída 0. :: O viés é adicionado com sinal positivo, não subtraído.",
    "z = 2,2 e saída 1. :: O segundo peso é −1; sua contribuição não é +1.",
    "z = 0,2 e saída 0. :: A soma está correta, mas o limiar informado exige saída 1 para z >= 0."
  ]);
  q(1,6,"Um engenheiro tenta treinar um único perceptron para reproduzir a porta XOR, que vale 1 apenas quando as duas entradas binárias diferem, e o treino nunca converge. Com uma rede de duas camadas e ativações não lineares, o problema é resolvido. Qual explicação justifica essa diferença?","29–31",[
    "XOR exige uma fronteira não linear nas entradas originais. :: As classes XOR não são separáveis por uma única reta; camadas com ativações não lineares podem construir uma separação apropriada.",
    "XOR não possui rótulos. :: XOR é uma tarefa perfeitamente rotulada; a limitação é geométrica.",
    "Um perceptron aceita somente uma entrada. :: Perceptrons podem receber várias entradas; isso não resolve a separabilidade.",
    "Aumentar apenas o viés resolve qualquer fronteira. :: O viés desloca a fronteira, mas não elimina a limitação linear.",
    "Empilhar camadas estritamente lineares sempre resolve. :: A composição de transformações lineares continua linear."
  ],"Analisar");
  q(1,6,"Durante o treino de uma rede neural supervisionada que estima o consumo dos motores da Aurora, cada iteração processa um minilote de exemplos rotulados. Qual sequência descreve corretamente o que acontece em uma etapa de treinamento?","32–33",[
    "Prever, calcular perda, obter gradientes e atualizar parâmetros. :: A propagação direta gera a previsão; a perda quantifica o erro; a retropropagação calcula gradientes e o otimizador atualiza os parâmetros.",
    "Atualizar o teste, apagar a perda e fixar os pesos. :: O teste deve permanecer reservado; apagar a perda não é um procedimento de treino.",
    "Usar a retropropagação apenas para obter a previsão. :: A previsão pertence à propagação direta; retropropagação calcula gradientes.",
    "Alterar os rótulos até coincidirem com a previsão. :: Os alvos são a referência de treino, não devem ser ajustados para esconder erros.",
    "Medir somente a acurácia final sem alterar parâmetros. :: Isso descreve avaliação parcial, não uma etapa de aprendizado."
  ],"Compreender");
  q(1,6,"No ajuste de um peso da rede de bordo, a regra de atualização é w_novo = w − α · g, em que g é o gradiente da perda em relação ao peso. Com w = 0,8, taxa de aprendizagem α = 0,1 e g = 0,3, qual é o próximo valor do peso?","32",[
    "0,77 :: Multiplique o passo pelo gradiente: 0,1 × 0,3 = 0,03. Subtraia do peso atual: 0,8 − 0,03 = 0,77.",
    "0,83 :: Esse valor soma o gradiente escalado, em vez de subtraí-lo.",
    "0,5 :: Esse valor subtrai o gradiente sem aplicar a taxa de aprendizagem.",
    "0,08 :: Multiplicar apenas o peso pela taxa não é a atualização informada.",
    "0,03 :: Esse é o tamanho do ajuste, não o peso após a atualização."
  ]);
  q(1,6,"A equipe da Aurora precisa de dois modelos: um que reconheça rachaduras em imagens do casco e outro que interprete relatórios escritos pela tripulação. Ao justificar a arquitetura de cada um, a equipe deve citar o mecanismo central correto. Qual associação entre arquitetura e mecanismo está correta?","34; 37–38",[
    "CNN: filtros locais compartilhados; transformer: atenção. :: CNNs exploram padrões locais por filtros reutilizados; transformers relacionam elementos por atenção. A escolha deve considerar o tipo de dados.",
    "CNN: apenas regressão linear; transformer: apenas imagens. :: CNNs não se limitam à regressão linear; transformers são usados também com linguagem e outras modalidades.",
    "RNN: ausência de estado; MLP: atenção obrigatória. :: RNNs transportam estado e uma MLP não exige atenção.",
    "Deep learning: qualquer modelo treinado por muitas épocas. :: Profundidade se refere às camadas da rede, não ao número de épocas.",
    "Dropout: exclusão permanente dos neurônios durante inferência. :: Dropout é uma técnica de regularização aplicada durante o treinamento."
  ],"Compreender");
  q(1,7,"Um aquecedor de bordo de 750 W funciona durante quatro horas seguidas com potência constante. Para lançar o dado no balanço energético da missão, que usa kWh, quanto ele consumiu?","9; 13",[
    "3 kWh :: Converta 750 W em 0,75 kW e multiplique por quatro horas: E = 0,75 × 4 = 3 kWh.",
    "3 kW :: kW mede potência; o resultado de potência vezes tempo é energia.",
    "187,5 Wh :: Dividir potência pelo tempo não calcula a energia consumida.",
    "3.000 kWh :: 3.000 é o resultado em Wh; falta convertê-lo para kWh.",
    "0,75 kWh :: Esse seria o consumo em uma hora, não em quatro."
  ]);
  q(1,7,"Um conversor de energia da Aurora recebe 50 kWh durante um ciclo de operação e entrega 35 kWh úteis aos sistemas de bordo; o restante se perde como calor. Qual é o rendimento do conversor nesse ciclo?","15; 20",[
    "70% :: Rendimento é a razão entre saída útil e entrada: 35/50 = 0,70, ou 70%.",
    "30% :: Esse é o percentual não convertido em saída útil, não o rendimento.",
    "142,9% :: Essa razão inverte entrada e saída útil.",
    "15% :: 15 kWh é a diferença de energia, não uma porcentagem.",
    "85% :: Somar as energias e tratar o resultado como percentual não define rendimento."
  ]);
  q(1,7,"Dois data centers que processam dados da missão, um com 2 MW de carga de TI e outro com 200 kW, informam o mesmo PUE no mesmo período. Um gestor quer usar esse único número para comparar as instalações. O que se pode concluir apenas a partir do indicador?","21–22",[
    "A razão entre energia total e energia de TI é a mesma. :: PUE descreve essa razão. Igualdade de PUE não garante igualdade de consumo absoluto, emissões ou serviço entregue.",
    "O consumo total é idêntico. :: Instalações de escalas diferentes podem apresentar a mesma razão PUE.",
    "As emissões são idênticas. :: A fonte de energia e o consumo absoluto também afetam as emissões.",
    "Ambos têm a mesma eficiência computacional. :: PUE não mede trabalho útil de computação por unidade de energia.",
    "Ambos usam somente energia renovável. :: O indicador não identifica a origem da energia."
  ],"Analisar");
  q(1,8,"Em vez de renovar todo o parque de notebooks a cada dois anos, uma empresa passa a reparar e atualizar os equipamentos e a medir o consumo de energia por serviço entregue. A diretoria pergunta qual princípio sustenta essa política. Qual é a justificativa correta?","16; 19–22",[
    "Avaliar o ciclo de vida e a eficiência para um serviço comparável. :: A análise considera fabricação, uso e descarte, além de medir o consumo em relação ao trabalho efetivamente entregue.",
    "Trocar sempre reduz o impacto total. :: A fabricação e o descarte também têm impactos; a troca precisa de análise.",
    "Desconsiderar a fabricação por ocorrer fora da empresa. :: Transferir a etapa a outro agente não elimina seu impacto no ciclo de vida.",
    "Igualar eficiência a menor gasto financeiro. :: Preço e impacto não são a mesma grandeza; o serviço também precisa ser comparável.",
    "Eliminar toda medição depois da compra. :: Sem acompanhar resultados, não há evidência de melhora operacional."
  ],"Analisar");
  q(1,8,"Uma startup implanta um aplicativo de agendamento para a unidade básica de saúde de um bairro. Ao mapear as partes interessadas do projeto, segundo a ISO 26000, a equipe precisa considerar quem afeta ou é afetado pelas decisões, e não apenas quem paga. Qual grupo representa essas partes interessadas?","9–10",[
    "Usuários, trabalhadores, fornecedores e comunidade afetada. :: Stakeholders incluem quem afeta ou é afetado pelas decisões, e não somente os donos do investimento.",
    "Apenas acionistas. :: Acionistas são uma categoria de stakeholder, não o conjunto inteiro.",
    "Apenas desenvolvedores com acesso ao código. :: Pessoas afetadas pelo sistema também são partes interessadas.",
    "Apenas consumidores pagantes. :: Trabalhadores e comunidades podem ser afetados sem comprar o serviço.",
    "Somente instituições certificadoras. :: Certificadoras não esgotam as partes interessadas no sistema."
  ],"Compreender");
  q(1,8,"Um relatório de Green IT separa duas frentes: reduzir o impacto ambiental da própria infraestrutura de TI e usar a TI para reduzir o impacto de outra atividade da organização. Qual par de iniciativas exemplifica, respectivamente, a primeira e a segunda frente?","15–16",[
    "Consolidar servidores; controlar irrigação com sensores, respectivamente. :: Consolidar trata da infraestrutura de TI; sensores de irrigação usam TI para otimizar o consumo de recursos de outra atividade.",
    "Controlar irrigação; consolidar servidores, respectivamente. :: A ordem inverte as duas categorias definidas.",
    "Ambas significam apenas reciclar computadores. :: Reciclagem é uma parte do ciclo de vida, não todas as estratégias.",
    "Ambas eliminam a necessidade de medir resultados. :: As duas iniciativas exigem evidências de seus efeitos.",
    "Somente a segunda pode consumir eletricidade. :: As duas estratégias envolvem sistemas que podem consumir energia."
  ],"Compreender");
  q(2,2,"Os dois sensores de travamento de uma escotilha da Aurora estão ativos ao mesmo tempo, ou seja, A = 1 e B = 1. Esses sinais alimentam, em paralelo, uma porta NAND e uma porta XOR de duas entradas. Quais são as saídas da NAND e da XOR, respectivamente?","52–54; 65–67",[
    "0 e 0. :: AND de 1 com 1 é 1 e sua negação NAND é 0; XOR de duas entradas iguais também resulta em 0.",
    "1 e 0. :: O valor de XOR está correto, mas NAND nega o AND verdadeiro.",
    "0 e 1. :: XOR só é 1 quando exatamente uma das duas entradas é 1.",
    "1 e 1. :: As duas saídas contradizem as definições para duas entradas em 1.",
    "A saída depende da ordem A, B. :: NAND e XOR são comutativas; a ordem das duas entradas não muda o resultado."
  ]);
  q(2,2,"O circuito de autorização de pouso da Aurora recebe cinco sinais booleanos independentes: combustível suficiente, área livre, vento dentro do limite, sensores íntegros e comando da torre. Para validar o projeto, a equipe vai escrever a tabela-verdade completa, sem omitir nenhuma combinação. Quantas linhas essa tabela precisa ter?","22–24",[
    "32 :: Cada entrada tem dois estados, portanto são 2⁵ = 32 combinações possíveis.",
    "10 :: Multiplicar cinco por dois não enumera todas as combinações simultâneas.",
    "25 :: O número de combinações cresce como potência de dois, não como o quadrado das entradas.",
    "16 :: Dezesseis linhas correspondem a quatro entradas independentes.",
    "64 :: Sessenta e quatro linhas correspondem a seis entradas independentes."
  ]);
  q(2,3,"Um script em Python faz a contagem regressiva das janelas de ignição da Aurora com `for i in range(5, 0, -2):`, imprimindo `i` a cada volta. Quais valores aparecem na saída, e em que ordem?","23–24",[
    "5, 3, 1 :: O passo é −2 e o limite final é exclusivo; depois de 1, o próximo valor seria −1 e já ultrapassaria o limite.",
    "5, 3, 1, 0 :: O passo não leva de 1 a 0, e o limite final não é incluído.",
    "5, 4, 3, 2, 1 :: Essa sequência usaria passo −1, não −2.",
    "0, 2, 4 :: A sequência começa em 5 e caminha em sentido decrescente.",
    "Nenhum valor. :: O início é maior que o fim e o passo é negativo; a sequência é válida."
  ]);
  q(2,3,"O registro de temperatura de um painel da Aurora contém as leituras `[3, -2, 0, 5]`. Um laço deve ignorar apenas os valores negativos, que indicam falha de sensor, e acumular os demais para calcular a média das leituras válidas. Quais valores de soma e de contagem devem entrar nessa média?","17–18; 26",[
    "Soma 8 e contagem 3. :: Os valores aceitos são 3, 0 e 5. O zero é válido e entra na contagem, mesmo sem aumentar a soma.",
    "Soma 8 e contagem 2. :: Essa resposta exclui indevidamente o zero da contagem.",
    "Soma 6 e contagem 4. :: Essa resposta mantém o valor negativo que deveria ser filtrado.",
    "Soma 8 e contagem 4. :: O denominador deve contar apenas os dados aceitos pelo filtro.",
    "Soma 10 e contagem 3. :: Excluir −2 significa não somá-lo; não significa acrescentar seu módulo."
  ]);
  q(2,3,"Um programa da Aurora percorre setores num laço externo e, para cada setor, percorre os sensores num laço interno. Quando encontra um sensor em falha, o laço interno executa `break`. Qual é o efeito desse `break` sobre a execução?","21–22",[
    "Encerra somente o laço interno. :: break encerra o laço mais próximo; o externo prossegue conforme seu próprio fluxo de controle.",
    "Encerra todos os laços automaticamente. :: Para encerrar também o externo, seria necessário outro mecanismo explícito.",
    "Pula apenas a iteração interna atual. :: Esse é o papel de continue, não de break.",
    "Reinicia as variáveis dos dois laços. :: break altera o fluxo, não reinicializa variáveis automaticamente.",
    "Encerra sempre a função inteira. :: Encerrar a função é o papel de return; break age sobre o laço."
  ],"Compreender");
  q(2,4,"A pilha de comandos de desfazer do console da Aurora começa vazia e recebe, nesta ordem, `push(4)`, `push(7)`, `pop()`, `push(9)` e `pop()`. Seguindo a política LIFO, quais valores são retirados pelos dois `pop()` e qual permanece na pilha?","36–37",[
    "Saem 7 e 9; permanece 4. :: Pilha é LIFO: cada pop retira o item mais recentemente inserido que ainda está presente.",
    "Saem 4 e 7; permanece 9. :: Essa seria a política FIFO de uma fila, não LIFO de pilha.",
    "Saem 7 e 4; permanece 9. :: Depois de inserir 9, ele passa a ocupar o topo e sai no pop seguinte.",
    "Saem 9 e 7; permanece 4. :: O primeiro pop ocorre antes de 9 ser inserido.",
    "Saem 4 e 9; permanece 7. :: O primeiro pop retira 7, que já está acima de 4."
  ]);
  q(2,4,"Na fila de autorização de pouso da Aurora, os módulos A, B e C entram nessa ordem. Em seguida, a torre autoriza um módulo, o módulo D entra na fila e a torre autoriza mais um. Respeitando a política FIFO, quais módulos são autorizados?","37",[
    "A e B. :: FIFO atende primeiro quem chegou primeiro; a inserção de D no fim não altera a precedência de B.",
    "C e D. :: Isso corresponde a retirar os mais recentes, comportamento de pilha.",
    "A e D. :: Depois de A, B e C ainda estão à frente de D.",
    "B e C. :: A é o primeiro da fila e precisa sair antes de B.",
    "C e B. :: A ordem proposta ignora a política de chegada da fila."
  ]);
  q(2,4,"A lista simplesmente encadeada de eventos de pouso da Aurora é acessada apenas pelo ponteiro `head`. Um evento urgente, já alocado e preenchido no nó `novo`, deve entrar no início da lista sem que nenhum evento antigo se perca. Qual sequência de atribuições faz essa inserção?","37–38",[
    "novo.next = head; depois head = novo. :: Primeiro preserve a referência para a cabeça antiga no novo nó; depois faça a cabeça apontar para ele.",
    "head = novo; depois novo.next = head. :: Essa sequência faz novo apontar para si e perde a referência antiga se ela não foi salva.",
    "novo.next = NULL; depois head = novo, sempre. :: Essa sequência descarta o encadeamento anterior quando a lista não estava vazia.",
    "head.next = novo; sem alterar head. :: Isso insere após a cabeça, não no início, e pode perder o restante se mal ligado.",
    "Somente mudar o valor de head.next. :: O novo primeiro nó precisa tornar-se a cabeça da lista."
  ]);
  q(2,4,"Os registros de telemetria da Aurora ficam numa lista simplesmente encadeada acessada apenas por `head`, sem nenhum índice auxiliar. Para exibir o k-ésimo registro, o programa precisa chegar ao nó correspondente. Qual é o custo dessa operação no pior caso, em função do número n de nós?","38",[
    "O(n), pois pode ser necessário percorrer os nós. :: Não há cálculo direto do endereço do k-ésimo nó; a busca segue referências a partir da cabeça.",
    "O(1), como em um vetor. :: Acesso direto por índice é propriedade de um vetor, não desta representação encadeada.",
    "O(log n), por divisão ao meio. :: A estrutura descrita não oferece atalhos para saltar diretamente ao meio.",
    "O(n²), obrigatoriamente. :: Um único percurso é linear; não é necessário percorrer a lista n vezes.",
    "O(1), porque o nó possui um valor. :: Guardar um valor no nó não elimina o custo de localizá-lo."
  ]);
  q(2,4,"Na lista encadeada de tarefas da Aurora, A → B → C, a tarefa B foi cancelada e o programa já tem uma referência para o nó A. A remoção deve tirar B do encadeamento e preservar A e C, na mesma ordem. Que operação realiza essa remoção?","37–38",[
    "Fazer A.next apontar para C e liberar B quando apropriado. :: O predecessor passa a referenciar o sucessor do nó removido. Em C, a memória retirada deve ser gerenciada sem uso posterior indevido.",
    "Fazer B.next apontar para A. :: Isso não remove B e pode introduzir um ciclo.",
    "Definir A.next como NULL. :: Essa alteração desliga tanto B quanto C do percurso a partir de A.",
    "Apagar o valor de B sem mudar referências. :: O nó B continua ocupando a mesma posição no encadeamento.",
    "Fazer head apontar para C. :: Essa alteração também remove A do início, contrariando a preservação solicitada."
  ]);
  q(2,4,"A fila de mensagens da Aurora é implementada com nós encadeados e dois ponteiros, um para o início e outro para o fim. Em certo momento, a fila contém um único nó, que será retirado por `dequeue`. Que cuidado a implementação precisa ter nessa retirada?","37–38",[
    "Atualizar início e fim para representar fila vazia. :: Quando o último nó sai, nenhum dos ponteiros deve continuar apontando para a memória retirada.",
    "Manter fim apontando para o nó liberado. :: Isso deixa uma referência inválida que pode causar erro na próxima inserção.",
    "Criar um ciclo no último nó. :: Uma fila encadeada usual não precisa de um ciclo para representar ausência de itens.",
    "Decrementar o valor armazenado. :: Alterar o dado não remove o nó da estrutura.",
    "Trocar FIFO por LIFO. :: O estado vazio não altera a política de atendimento da fila."
  ],"Analisar");
  q(2,4,"Uma rotina em C remove o primeiro nó da lista de alertas da Aurora fazendo `head = head->next` e liberando o nó antigo. Numa execução, a lista está vazia, com `head == NULL`. Qual deve ser a primeira decisão da rotina antes de remover a cabeça?","37–38",[
    "Verificar se head é NULL antes de acessar head->next. :: Desreferenciar um ponteiro nulo não é uma operação válida. O caso vazio deve ser tratado antes de seguir o encadeamento.",
    "Acessar head->next para descobrir se está vazia. :: Essa operação já desreferencia o ponteiro nulo e pode causar comportamento indefinido.",
    "Liberar head e ler seus campos em seguida. :: Mesmo quando free(NULL) é permitido, isso não torna válido ler campos por um ponteiro nulo.",
    "Supor que todo ponteiro possui um nó. :: NULL representa justamente a ausência de um nó válido.",
    "Ordenar a lista antes de remover. :: Ordenação não resolve o caso de estrutura vazia."
  ],"Analisar");
  q(2,5,"Um relatório de diagnóstico da Aurora percorre os n registros uma vez para calcular a média e, depois, num segundo laço independente e não aninhado, percorre de novo os n registros para contar os valores acima dessa média. Qual é a ordem de crescimento do custo total?","8–10",[
    "O(n). :: Os custos somam n + n = 2n; o fator constante dois não altera a ordem linear.",
    "O(n²). :: Dois laços sequenciais somam custos; o caso quadrático usual envolve aninhamento dependente de n.",
    "O(log n). :: Não há redução multiplicativa do espaço de busca na descrição.",
    "O(1). :: O número de operações ainda cresce com n.",
    "O(2ⁿ). :: Duas passagens não equivalem a enumerar todas as combinações binárias."
  ]);
  q(2,6,"Um script em NumPy da Aurora calcula f(x) = √(x − 3) para cada leitura x de um sensor e passou a registrar `nan` em parte das entradas. Para filtrar as leituras antes do cálculo, a equipe quer aceitar apenas valores do domínio real da função. Qual é esse domínio?","11; 28",[
    "x >= 3. :: O radicando precisa ser não negativo: x − 3 >= 0, portanto x >= 3.",
    "x > 3. :: A raiz de zero existe; excluir x = 3 restringiria indevidamente o domínio.",
    "x <= 3. :: Isso tornaria o radicando negativo para valores menores que três.",
    "Todos os reais. :: Valores abaixo de três não produzem raiz quadrada real.",
    "Apenas x = 3. :: Qualquer valor maior que três também produz radicando não negativo."
  ]);
  q(2,6,"A cultura de micro-organismos de um biorreator da Aurora é multiplicada por 1,1 a cada período de observação, de modo que P(n) = P₀ · 1,1ⁿ. Que tipo de crescimento esse modelo descreve e qual é o aumento relativo por período?","24–26",[
    "Exponencial, com aumento de 10% por período. :: O fator multiplicativo constante 1,1 faz os incrementos absolutos dependerem do tamanho já acumulado.",
    "Afim, somando sempre 1,1 indivíduo. :: Multiplicar por um fator não equivale a somar uma quantidade fixa.",
    "Quadrático por definição. :: A descrição fornece uma recorrência multiplicativa, característica do modelo exponencial.",
    "Decrescente, porque 0,1 é menor que 1. :: O fator aplicado é 1,1, maior que um, e produz crescimento.",
    "Constante, porque o fator não muda. :: O fator é constante, mas o valor da população é multiplicado a cada período."
  ],"Compreender");
  q(2,7,"Durante a execução de uma instrução no computador de bordo da Aurora, a CPU precisa manter operandos, endereços e o estado da operação num armazenamento interno de acesso imediato, sem recorrer à memória principal. Qual componente cumpre esse papel?","33–35",[
    "Registradores. :: Registradores são armazenamento interno de acesso imediato para operandos, endereços e estados usados pela CPU.",
    "Disco rígido. :: O disco é armazenamento secundário persistente, não armazenamento interno imediato da CPU.",
    "Teclado. :: O teclado é um dispositivo de entrada.",
    "Memória virtual em disco. :: Memória virtual é uma abstração do sistema; não corresponde aos registradores internos.",
    "Barramento de saída. :: Um barramento transporta sinais; não substitui os registradores como armazenamento de operandos."
  ],"Compreender");
  q(2,7,"Um programa de bordo da Aurora passa a maior parte do tempo esperando leituras do armazenamento de dados científicos e gasta pouco tempo calculando. A equipe vai trocar a CPU por outra com o dobro de capacidade de cálculo. Essa troca garante que o tempo total de execução caia pela metade?","30–31",[
    "Não; a espera por entrada/saída pode continuar sendo o gargalo. :: Acelerar uma parte não elimina o tempo gasto em outra. É preciso identificar qual recurso limita a execução.",
    "Sim, independentemente do programa. :: O tempo não depende apenas de cálculo; a hipótese ignora o gargalo de disco.",
    "Sim, porque capacidade de disco equivale a frequência. :: Capacidade de armazenamento e frequência de CPU medem grandezas diferentes.",
    "Não, porque CPUs nunca influenciam desempenho. :: CPUs influenciam as partes de computação; a questão é sua participação no tempo total.",
    "Sim, se o arquivo tiver nome curto. :: O tamanho do nome não resolve o gargalo de leitura descrito."
  ],"Analisar");
  q(2,7,"A especificação do computador de bordo da Aurora lista 16 GB de RAM e 1 TB de SSD, e um integrante da equipe trata os dois números como a mesma reserva de memória. Qual afirmação distingue corretamente a memória RAM do armazenamento secundário em um computador típico?","33–35",[
    "RAM mantém dados em uso; armazenamento secundário preserva arquivos. :: RAM sustenta o trabalho corrente e costuma ser volátil; SSDs e discos mantêm dados após desligamento.",
    "RAM é sempre maior e permanente. :: Nem capacidade maior nem persistência caracterizam a RAM típica.",
    "Um SSD executa diretamente toda a lógica da CPU. :: Armazenamento não substitui a execução de instruções pela CPU.",
    "Os dois termos são sinônimos de registrador. :: Registradores, memória principal e armazenamento ocupam papéis diferentes.",
    "Mais armazenamento elimina qualquer falta de RAM. :: Capacidade em disco não elimina os custos e limites da memória principal."
  ],"Compreender");
  q(2,8,"O conselho da base Aurora definiu responsáveis por cada indicador, criou critérios de auditoria independente e aprovou regras para evitar conflitos de interesse na compra de equipamentos. Qual dimensão ESG essas medidas descrevem mais diretamente?","11–12; 23–24",[
    "Governança. :: Responsabilidades, transparência, controles e integridade pertencem à dimensão de governança.",
    "Ambiental, exclusivamente. :: A descrição não trata diretamente de emissões, recursos ou resíduos.",
    "Social, exclusivamente. :: Há possíveis efeitos sociais, mas o mecanismo descrito é de controle e governança.",
    "Somente eficiência energética. :: Eficiência energética não cobre auditoria e conflitos de interesse.",
    "Nenhuma, pois ESG trata apenas de clima. :: ESG também inclui dimensões social e de governança."
  ],"Compreender");
  q(2,8,"A fábrica de peças da Aurora reduziu o consumo total de energia de 100 para 80 unidades entre dois trimestres, mas a produção caiu de 100 para 50 peças no mesmo período. O comunicado interno celebra a “queda de 20% no consumo”. O consumo de energia por peça melhorou?","25–26",[
    "Não; sobe de 1 para 1,6 unidade por peça. :: Divida energia por produção nos dois períodos: 100/100 = 1 e 80/50 = 1,6. O consumo total menor oculta piora de intensidade.",
    "Sim; cai exatamente 20%. :: A queda de 20% é do total, não do consumo por peça.",
    "Permanece 1 por peça. :: A produção caiu proporcionalmente mais que a energia.",
    "Cai para 0,625 por peça. :: 50/80 inverte a razão; isso mede peças por energia.",
    "Não é possível calcular nenhuma razão. :: O enunciado fornece energia e produção de ambos os períodos."
  ]);
  q(3,2,"Pela lei de De Morgan, qual expressão equivale a NOT (A AND B)?","5–56",[
    "(NOT A) OR (NOT B). :: Negar uma conjunção equivale à disjunção das negações: basta que pelo menos uma condição original falhe.",
    "(NOT A) AND (NOT B). :: Essa expressão exige que ambas sejam falsas, uma condição mais restrita.",
    "A OR B. :: A negação dos operandos não pode ser eliminada na transformação.",
    "A AND (NOT B). :: Essa expressão nega apenas um operando e mantém A obrigatoriamente verdadeiro.",
    "NOT (A OR B). :: Essa expressão equivale a (NOT A) AND (NOT B), não ao enunciado."
  ]);
  q(3,2,"Pela lei de absorção, a expressão booleana A OR (A AND B) simplifica para quê?","5–56",[
    "A. :: Se A é verdadeiro, toda a expressão é verdadeira; se A é falso, os dois termos são falsos. B não altera a saída.",
    "B. :: Com A verdadeiro e B falso, a expressão vale verdadeiro; portanto não equivale a B.",
    "A AND B. :: Com A verdadeiro e B falso, esse termo é falso enquanto a expressão original é verdadeira.",
    "NOT A. :: Essa resposta inverte os resultados da expressão absorvida.",
    "A XOR B. :: XOR mudaria a saída quando A e B fossem ambos verdadeiros."
  ]);
  q(3,3,"Uma função f(n) retorna 1 para n = 0 e n × f(n − 1) para n > 0. Qual é f(4)?","8–60",[
    "24. :: As chamadas multiplicam 4 × 3 × 2 × 1 e chegam ao caso-base f(0) = 1; o resultado é 24.",
    "10. :: Dez seria a soma de 1 a 4, mas a função multiplica.",
    "16. :: A recorrência calcula fatorial, não n ao quadrado.",
    "0. :: O caso-base retorna 1, preservando o produto; ele não multiplica por zero.",
    "Recursão infinita para n = 4. :: O argumento diminui e alcança zero, onde existe retorno sem nova chamada."
  ]);
  q(3,3,"Uma função Python recebe uma lista e executa lista.append(5), sem reatribuir o parâmetro. O chamador observa o quê?","8–60",[
    "A lista original passa a conter o novo elemento. :: O parâmetro referencia o mesmo objeto mutável; append modifica esse objeto, e o chamador observa a alteração.",
    "Nenhuma mudança, porque toda função copia os argumentos. :: Python não faz uma cópia automática de todo objeto passado a uma função.",
    "A variável original passa a ser None. :: append retorna None, mas o trecho não atribui esse retorno à variável do chamador.",
    "A lista vira tupla. :: append altera o conteúdo da lista, não seu tipo.",
    "O parâmetro se torna uma variável global. :: Compartilhar referência não altera o escopo do nome do parâmetro."
  ],"Analisar");
  q(3,4,"Uma árvore binária de busca insere 5, 2, 8, 1 e 3, sem duplicatas. Qual é o percurso em ordem?","6–30",[
    "1, 2, 3, 5, 8. :: O percurso esquerda, raiz, direita de uma BST visita as chaves em ordem crescente quando a propriedade de busca é respeitada.",
    "5, 2, 1, 3, 8. :: Essa é a ordem de um percurso pré-ordem nesta árvore, não em ordem.",
    "1, 3, 2, 8, 5. :: Essa sequência corresponde ao percurso pós-ordem.",
    "5, 2, 8, 1, 3. :: Essa é uma sequência por níveis para a árvore, não o percurso pedido.",
    "8, 5, 3, 2, 1. :: Essa ordem decrescente exigiria visitar direita antes de esquerda."
  ]);
  q(3,4,"Duas chaves distintas produzem o mesmo índice em uma tabela hash. O que isso caracteriza?","6–30",[
    "Colisão, que pode ser tratada por encadeamento ou endereçamento aberto. :: O espaço de índices é limitado e pode receber chaves diferentes; a implementação precisa de uma política para localizá-las corretamente.",
    "Prova de que as chaves são iguais. :: Igualdade de hash não implica igualdade das chaves.",
    "Obrigação de perder um dos registros. :: Políticas de colisão preservam registros com índices coincidentes.",
    "Balanceamento de uma árvore AVL. :: Colisão é uma questão de tabelas hash, não rotação de AVL.",
    "Garantia de busca O(1) no pior caso. :: Muitas colisões podem degradar o custo; o caso esperado não é uma garantia universal."
  ],"Compreender");
  q(3,5,"Se A tem dimensão 2×3 e B tem dimensão 3×4, qual é a dimensão do produto matricial AB?","7–37",[
    "2×4. :: As dimensões internas 3 coincidem, permitindo o produto. As dimensões externas 2 e 4 determinam a matriz resultante.",
    "3×3. :: As dimensões internas validam a operação, mas não são as dimensões do resultado.",
    "2×3. :: O número de colunas do resultado vem de B, que possui quatro.",
    "3×4. :: O número de linhas do resultado vem de A, que possui duas.",
    "O produto é indefinido. :: O número de colunas de A coincide com o número de linhas de B."
  ]);
  q(3,6,"Qual é uma responsabilidade típica do sistema operacional?","5–35",[
    "Gerenciar processos, memória e acesso a dispositivos. :: O sistema operacional coordena recursos e fornece abstrações para que programas usem a máquina com controle e compartilhamento.",
    "Substituir fisicamente a unidade lógica e aritmética. :: A ULA é hardware; o sistema operacional não a substitui fisicamente.",
    "Garantir que todo programa esteja correto. :: O sistema pode isolar e gerenciar execução, mas não garante correção de toda aplicação.",
    "Eliminar a necessidade de memória. :: Programas e o próprio sistema operacional precisam de memória.",
    "Transformar qualquer algoritmo em tempo constante. :: A complexidade depende do algoritmo e do problema, não é eliminada pelo sistema."
  ],"Compreender");
  q(3,6,"Um programa está armazenado no disco, enquanto uma instância dele executa com estado e recursos. Como chamamos essa instância?","5–35",[
    "Processo. :: Processo é uma instância de programa em execução, com estado e recursos associados; o arquivo do programa é uma descrição passiva.",
    "Compilador. :: Compilador transforma programas; não nomeia qualquer instância em execução.",
    "Registrador. :: Registrador é um componente de armazenamento da CPU, não a instância inteira.",
    "Periférico. :: Periférico é um dispositivo, não o estado de execução de um programa.",
    "Sistema de numeração. :: Sistemas de numeração representam valores, não processos."
  ],"Compreender");
  q(3,6,"Durante a execução de programas concorrentes, por que o escalonamento da CPU é necessário?","5–35",[
    "Para decidir quais processos prontos recebem tempo de CPU. :: O escalonador organiza o uso de um recurso compartilhado de acordo com uma política, conciliando diferentes necessidades de execução.",
    "Para dar uma CPU física exclusiva a cada arquivo. :: Concorrência pode compartilhar a mesma CPU; arquivos não recebem necessariamente CPUs próprias.",
    "Para impedir qualquer interrupção. :: Interrupções podem ser essenciais para recuperar o controle e alternar execuções.",
    "Para substituir todos os processos por dados estáticos. :: O objetivo é coordenar a execução, não eliminá-la.",
    "Para garantir que todos terminem no mesmo instante. :: Políticas de escalonamento não garantem durações iguais para trabalhos diferentes."
  ],"Compreender");
  q(3,7,"Um modelo prevê 12 kWh e a observação real é 15 kWh. Usando resíduo = observado − previsto, qual é o resíduo?","6–24",[
    "+3 kWh. :: Pela convenção informada, 15 − 12 = 3. O sinal positivo indica que o modelo subestimou a observação.",
    "−3 kWh. :: Esse resultado usa a convenção inversa, previsto menos observado.",
    "27 kWh. :: Somar observado e previsto não mede o desvio entre eles.",
    "3 kW. :: A unidade continua sendo energia, kWh, e não potência.",
    "0 kWh. :: As duas quantidades são diferentes e o resíduo não é zero."
  ]);
  q(3,7,"Uma regressão foi ajustada com temperaturas de 15 a 30 °C e usada para prever em 60 °C. Qual cuidado é central?","6–24",[
    "É extrapolação; a relação ajustada pode não valer nessa faixa. :: O novo valor está fora do intervalo observado. Bom ajuste dentro da amostra não garante comportamento adequado em um regime distante.",
    "É interpolação segura por definição. :: Interpolação ocorre dentro da faixa observada, não além dela.",
    "Basta obter R² alto no treino para garantir a previsão. :: R² de treino não garante validade da extrapolação.",
    "O coeficiente vira automaticamente zero. :: O modelo ainda pode calcular uma saída; o problema é sua validade.",
    "A unidade da temperatura deixa de importar. :: Unidades e transformações continuam essenciais na interpretação."
  ],"Analisar");
  q(3,8,"No modelo ideal que mantém área e densidade do ar constantes, a potência eólica disponível é proporcional a v³. Se v triplica, qual é o fator?","7–30",[
    "27. :: Como a dependência é cúbica, (3v)³/v³ = 3³ = 27, sob as condições declaradas.",
    "3. :: Esse fator corresponderia a dependência linear, não cúbica.",
    "6. :: Somar expoente e multiplicador não calcula a variação da potência.",
    "9. :: Nove seria o fator de uma dependência quadrática.",
    "81. :: O expoente fornecido é três, não quatro."
  ]);
  q(3,8,"Um painel fotovoltaico converte diretamente qual forma de energia em eletricidade?","7–30",[
    "Energia da radiação luminosa. :: No efeito fotovoltaico, a radiação permite gerar eletricidade em materiais adequados; não se exige uma turbina térmica.",
    "Somente calor transportado por vapor. :: Essa descrição se aproxima de conversão termelétrica, não do efeito fotovoltaico direto.",
    "Energia cinética do vento. :: Esse é o recurso explorado por turbinas eólicas.",
    "Energia química de combustíveis. :: Um painel fotovoltaico não exige combustão para converter a radiação.",
    "Energia gravitacional de água represada. :: Essa é a fonte primária de uma instalação hidrelétrica."
  ],"Compreender");
  q(3,8,"Uma fonte solar produz energia variável ao longo do dia. Qual decisão melhora a análise de atendimento de uma carga contínua?","7–30",[
    "Comparar perfis de geração e demanda e avaliar armazenamento ou complementaridade. :: Energia total diária não informa se a potência estará disponível no instante necessário; os perfis temporais precisam ser compatibilizados.",
    "Comparar apenas a potência nominal do painel com a energia diária. :: Potência e energia são grandezas diferentes; essa comparação omite o tempo.",
    "Supor potência nominal constante durante toda a noite. :: A geração fotovoltaica depende de radiação disponível.",
    "Ignorar perdas para demonstrar a viabilidade real. :: Perdas e limites podem alterar o atendimento efetivo da carga.",
    "Concluir que renovável significa geração sempre constante. :: Renovabilidade e constância de geração não são equivalentes."
  ],"Analisar");
  q(4,2,"Em Python, a = [1, 2]; b = a; b.append(3). Qual é o valor de a depois dessas instruções?","11–60",[
    "[1, 2, 3]. :: a e b referenciam a mesma lista. A mutação feita por b é observável também por a.",
    "[1, 2]. :: A atribuição b = a não cria uma cópia independente da lista.",
    "None. :: append retorna None, mas esse retorno não foi atribuído a a.",
    "[3]. :: append acrescenta um item, sem substituir os itens existentes.",
    "Erro por haver dois nomes para a lista. :: Python permite que diferentes nomes referenciem o mesmo objeto."
  ]);
  q(4,2,"Qual é a diferença entre append([2, 3]) e extend([2, 3]) aplicados separadamente à lista [1]?","11–60",[
    "append produz [1, [2, 3]]; extend produz [1, 2, 3]. :: append acrescenta um objeto único; extend percorre o iterável e acrescenta cada elemento.",
    "Ambos produzem [1, 2, 3]. :: append preserva a lista fornecida como um único elemento aninhado.",
    "append produz [1, 2, 3]; extend produz [1, [2, 3]]. :: Essa alternativa inverte as operações.",
    "Ambos devolvem uma nova lista sem modificar a original. :: Os dois métodos modificam a lista em que são chamados.",
    "extend só funciona com uma lista inicialmente vazia. :: extend pode acrescentar elementos a uma lista que já contém itens."
  ]);
  q(4,2,"Após a = [[1], [2]]; b = a.copy(); b[0].append(9), o que acontece?","11–60",[
    "a[0] e b[0] passam a valer [1, 9]. :: A cópia rasa cria a lista externa, mas preserva referências às listas internas. A mutação da lista interna é compartilhada.",
    "Só b[0] muda, pois copy faz cópia profunda. :: list.copy é uma cópia rasa; não duplica recursivamente todos os objetos internos.",
    "a passa a ser igual a b por identidade. :: As listas externas são diferentes; são as referências internas que continuam compartilhadas.",
    "Nenhuma lista muda, pois cópias são imutáveis. :: Listas copiadas continuam mutáveis.",
    "b[0] vira o número 9. :: append acrescenta um item à lista interna, sem substituí-la por um número."
  ],"Analisar");
  q(4,3,"Em um grafo não ponderado, qual estratégia encontra um caminho com o menor número de arestas a partir de uma origem?","6–30",[
    "BFS, explorando níveis com uma fila. :: A busca em largura visita primeiro os vértices a uma aresta, depois a duas e assim por diante, preservando a distância em saltos.",
    "DFS sempre, por usar profundidade. :: DFS pode encontrar um caminho, mas ele não é necessariamente o de menos arestas.",
    "Escolher qualquer aresta sem registrar visitas. :: Essa estratégia não garante menor caminho e pode repetir ciclos.",
    "Ordenar apenas os nomes dos vértices. :: A ordem alfabética não representa distância no grafo.",
    "Usar uma pilha no lugar da fila sem mudar a estratégia. :: A pilha altera a ordem para exploração em profundidade."
  ]);
  q(4,3,"Há arestas A→B de custo 2, A→C de custo 7 e B→C de custo 3. Qual é o menor custo de A até C?","6–30",[
    "5, pelo caminho A→B→C. :: O caminho indireto custa 2 + 3 = 5, menor que o custo 7 da aresta direta.",
    "7, porque o caminho direto sempre é melhor. :: Menos arestas não implica menor soma de pesos.",
    "3, usando apenas B→C. :: É necessário partir de A; falta considerar o custo de chegar a B.",
    "2, usando apenas A→B. :: Esse caminho termina em B, não em C.",
    "12, somando todas as arestas. :: Um caminho não precisa usar todas as arestas disponíveis."
  ]);
  q(4,4,"Qual é o limite de (eˣ − 1)/x quando x tende a zero?","30–31",[
    "1. :: A substituição produz 0/0. Sob as hipóteses atendidas aqui, L’Hôpital dá o limite eˣ/1, que tende a 1.",
    "0. :: O numerador tender a zero não basta, pois o denominador também tende a zero.",
    "Infinito positivo. :: A anulação simultânea não implica divergência; a razão tende a um valor finito.",
    "−1. :: A derivada de eˣ − 1 é eˣ, não −eˣ.",
    "Não existe porque a expressão não está definida em zero. :: Um limite pode existir mesmo quando a função não está definida no ponto."
  ]);
  q(4,4,"Um aluno aplica L’Hôpital ao limite de (x + 1)/(x + 2) quando x tende a zero e obtém 1. Qual é a análise correta?","30–31",[
    "A regra foi aplicada sem indeterminação; o limite é 1/2. :: A substituição direta dá 1/2, com denominador não nulo. Não há forma 0/0 ou ∞/∞ que autorize esse uso da regra.",
    "A resposta 1 é correta para qualquer fração de polinômios. :: Derivar as partes não preserva arbitrariamente o limite de uma fração.",
    "O limite não existe porque o numerador é menor. :: A comparação de tamanhos não impede um limite finito.",
    "É preciso aplicar L’Hôpital mais duas vezes. :: Repetir uma regra cuja hipótese falha não corrige a aplicação.",
    "O limite é 2, pela inversão da fração. :: A fração original tende a 1/2; não há motivo para invertê-la."
  ],"Analisar");
  q(4,4,"Usando Taylor de primeira ordem de √x em a = 4, com f(4) = 2 e f′(4) = 1/4, qual é a aproximação de √4,04?","32–33",[
    "2,01. :: O incremento h é 0,04. A linearização dá 2 + (1/4) × 0,04 = 2,01, uma aproximação local.",
    "2,04. :: Essa conta esquece o fator da derivada, que é 1/4.",
    "3,01. :: O valor de referência é 2; não se adiciona uma unidade extra.",
    "1,99. :: A derivada é positiva e o argumento aumentou; o incremento linear é positivo.",
    "1,01. :: Essa conta omite parte do valor f(4), que deve ser somado ao incremento."
  ]);
  q(4,4,"Usando eˣ ≈ 1 + x + x²/2 perto de zero, qual valor aproxima e⁰·¹?","32–33",[
    "1,105. :: Substitua x = 0,1: 1 + 0,1 + 0,01/2 = 1,105. Os termos de ordem superior foram omitidos.",
    "1,11. :: O termo quadrático é dividido por dois; não é somado integralmente.",
    "1,2. :: O termo de segunda ordem não é igual ao termo linear.",
    "0,105. :: Essa resposta esquece o termo constante 1.",
    "1,005. :: Essa resposta omite o termo linear 0,1."
  ]);
  q(4,4,"Qual associação descreve corretamente três abordagens usadas no capítulo de cálculo?","6–7; 37–41",[
    "SymPy: simbólica; SciPy minimize: otimização numérica; JAX grad: diferenciação automática. :: As ferramentas têm papéis distintos: manipular expressões, buscar numericamente um mínimo e diferenciar operações de um programa.",
    "SymPy e JAX usam obrigatoriamente diferenças finitas. :: A diferenciação simbólica e a automática não dependem de aproximar uma derivada por diferenças finitas.",
    "SciPy minimize prova sempre o mínimo global de qualquer função. :: O resultado depende do problema, método, ponto inicial e restrições; sucesso numérico não prova globalidade geral.",
    "JAX grad transforma qualquer resultado em texto LaTeX. :: grad produz uma função derivada por diferenciação automática, não um formatador LaTeX.",
    "SymPy diff apenas avalia a função original em um ponto. :: diff constrói uma derivada simbólica; avaliação e diferenciação são operações distintas."
  ],"Compreender");
  q(4,4,"Para J(θ) = θ², θ = 3 e taxa α = 0,1, qual é uma etapa de gradiente descendente?","34–41",[
    "θ novo = 2,4. :: O gradiente é 2θ = 6. A atualização é 3 − 0,1 × 6 = 2,4, reduzindo o valor desta função.",
    "θ novo = 3,6. :: Somar o gradiente faz ascensão neste caso, não descida.",
    "θ novo = 2,1. :: Esse valor usa J(θ) = 9 como gradiente, mas o gradiente é 6.",
    "θ novo = 0,6. :: 0,6 é o tamanho do ajuste, não o parâmetro atualizado.",
    "θ novo = 0. :: O passo informado não leva ao mínimo exato em uma única atualização."
  ]);
  q(4,5,"Para testar H₀: β₁ = 0, a estimativa é 6 e seu erro padrão é 2. Qual é a estatística t?","21–24",[
    "3. :: A estatística é (estimativa − valor sob H₀)/erro padrão: (6 − 0)/2 = 3.",
    "12. :: Multiplicar estimativa por erro padrão não calcula a estatística t.",
    "4. :: Subtrair o erro padrão da estimativa não produz a padronização do teste.",
    "1/3. :: Essa alternativa inverte a razão entre estimativa e erro padrão.",
    "6. :: Essa resposta ignora o erro padrão que deve aparecer no denominador."
  ]);
  q(4,5,"Um teste de coeficiente produz p = 0,08 e o nível de significância escolhido é α = 0,05. Qual decisão é adequada?","21–24",[
    "Não rejeitar H₀; a evidência é insuficiente nesse nível. :: Como p é maior que α, o teste não rejeita H₀. Isso não prova que o coeficiente seja exatamente zero.",
    "Rejeitar H₀ porque 0,08 é maior que 0,05. :: A regra usual de rejeição exige p menor ou igual ao nível escolhido.",
    "Concluir que H₀ tem 8% de probabilidade de ser verdadeira. :: Valor-p não é a probabilidade posterior da hipótese nula.",
    "Concluir que não existe efeito em nenhuma população. :: Não rejeitar H₀ não demonstra ausência universal de efeito.",
    "Alterar α depois de observar p para obter significância. :: Escolher o limiar para forçar uma conclusão compromete a interpretação do teste."
  ],"Analisar");
  q(4,5,"Em regressão com intercepto, n = 23 e k = 2 preditores, SQreg = 120 e SQres = 60. Qual é F = (SQreg/k)/(SQres/(n−k−1))?","21–24",[
    "20. :: Os graus de liberdade residuais são 23 − 2 − 1 = 20. Logo F = (120/2)/(60/20) = 60/3 = 20.",
    "2. :: Dividir as somas de quadrados sem ajustar pelos graus de liberdade não calcula F.",
    "40. :: O numerador também deve ser dividido por k = 2.",
    "60. :: Esse é o quadrado médio explicado, antes de dividi-lo pelo quadrado médio residual.",
    "3. :: Esse é o quadrado médio residual, não a estatística F final."
  ]);
  q(4,5,"O teste F do modelo completo contra um modelo apenas com intercepto rejeita H₀. O que isso sustenta sob as hipóteses do teste?","21–24",[
    "Há evidência de contribuição conjunta dos preditores. :: A hipótese nula conjunta afirma que todos os coeficientes dos preditores são zero. Rejeitá-la não implica significância individual de cada um.",
    "Todos os coeficientes são individualmente significativos. :: O teste conjunto não garante rejeição em cada teste t individual.",
    "O modelo prova causalidade. :: Associação estatística no ajuste não estabelece uma relação causal.",
    "A previsão futura será perfeita. :: Significância conjunta não elimina erros de previsão nem garante generalização.",
    "Não é mais necessário examinar resíduos. :: Diagnósticos de pressupostos e adequação continuam necessários."
  ],"Analisar");
  q(4,5,"Ao regredir um preditor sobre os demais, obtém-se R² = 0,80. Qual é seu VIF?","26–28",[
    "5. :: VIF = 1/(1 − 0,80) = 1/0,20 = 5. O R² usado é o da regressão auxiliar do preditor.",
    "0,20. :: Esse valor é 1 − R²; falta tomar seu inverso.",
    "0,80. :: VIF não é o próprio R² da regressão auxiliar.",
    "1,25. :: Essa conta usa 1/R², que não é a fórmula de VIF.",
    "80. :: Converter R² em percentual não calcula inflação de variância."
  ]);
  q(4,5,"Em uma comparação apropriada, um VIF de 9 corresponde a qual fator de inflação do erro padrão do coeficiente?","26–28",[
    "3, pois o erro padrão é a raiz da variância. :: VIF multiplica a variância. O fator sobre o erro padrão é √9 = 3, não 9.",
    "9, pois variância e erro padrão são iguais. :: Erro padrão é a raiz da variância; não são a mesma grandeza.",
    "81, elevando o VIF ao quadrado. :: O fator sobre o erro padrão exige raiz quadrada, não quadrado.",
    "1/9, pois a colinearidade reduz sempre a incerteza. :: Colinearidade aumenta a dificuldade de separar efeitos; VIF mede inflação.",
    "0, porque o coeficiente precisa ser eliminado. :: VIF é diagnóstico; não impõe erro padrão zero nem exclusão automática."
  ]);
  q(4,6,"Um classificador estima p = 0,60 e prevê positivo quando p >= limiar. Qual efeito tem mudar o limiar de 0,50 para 0,70 nessa observação?","6–23",[
    "A classificação muda de positiva para negativa; p continua 0,60. :: O limiar transforma uma estimativa em decisão. Alterá-lo não muda, por si só, a probabilidade calculada pelo modelo.",
    "A probabilidade sobe automaticamente para 0,70. :: O limiar é uma regra de decisão, não um reajuste da probabilidade.",
    "A classificação permanece positiva porque p > 0. :: É preciso comparar p com o limiar definido, não apenas com zero.",
    "O modelo necessariamente precisa ser treinado de novo. :: É possível alterar a regra de decisão usando as mesmas probabilidades estimadas.",
    "A observação deixa de ter qualquer classe prevista. :: Com regra binária definida, abaixo do limiar a previsão é negativa."
  ]);
  q(4,7,"Uma bateria de 30 kWh permite usar 80% da capacidade e entrega essa energia com eficiência de 90%. Com carga constante de 3 kW, qual autonomia estimada?","7–28",[
    "7,2 horas. :: A energia entregue é 30 × 0,8 × 0,9 = 21,6 kWh. Dividindo por 3 kW, a autonomia é 7,2 h, se o limite de potência permitir a carga.",
    "10 horas. :: Esse cálculo usa toda a capacidade nominal, ignorando profundidade de descarga e perdas.",
    "8 horas. :: Esse cálculo considera a fração utilizável, mas ignora a eficiência de entrega.",
    "9 horas. :: Esse cálculo considera eficiência, mas ignora o limite de 80% de utilização.",
    "21,6 horas. :: 21,6 é a energia em kWh; ainda é preciso dividir pela potência da carga."
  ]);
  q(4,7,"Uma bateria tem 40 kWh disponíveis, mas potência máxima de saída de 2 kW. Ela atende sozinha uma carga instantânea de 5 kW?","7–28",[
    "Não; a carga supera o limite de potência. :: Energia acumulada e taxa de entrega são restrições distintas. Mesmo com energia suficiente para horas de operação, 2 kW não sustentam sozinhos 5 kW.",
    "Sim, porque 40 é maior que 5. :: Os números têm unidades diferentes; comparar diretamente kWh e kW é inválido.",
    "Sim, durante exatamente oito horas. :: Essa autonomia ignora a violação do limite de potência.",
    "Sim, desde que não haja perda de energia. :: Eficiência perfeita não aumenta o limite máximo de saída especificado.",
    "Não, porque kWh mede corrente elétrica. :: A conclusão negativa está correta por outro motivo: kWh mede energia, não corrente."
  ],"Analisar");
  q(4,8,"Uma indústria aproveita calor residual de outra como insumo de seu processo. Qual conceito descreve essa relação?","5–36",[
    "Simbiose industrial. :: Uma saída de um processo torna-se recurso de outro. A vantagem deve ser avaliada considerando qualidade, continuidade, transporte e impacto do sistema completo.",
    "Obsolescência programada. :: Esse conceito trata de encurtar a vida útil de produtos, não de aproveitar fluxos entre processos.",
    "Descarte linear obrigatório. :: Aproveitar uma saída como insumo busca justamente reduzir o descarte linear.",
    "Virtualização de servidores. :: Virtualização não é o mecanismo material de troca de calor descrito.",
    "Impacto ambiental automaticamente nulo. :: Reuso pode reduzir impacto, mas exige avaliação; não implica impacto zero."
  ],"Compreender");
  q(4,8,"Um serviço fica 30% mais eficiente por operação, mas sua utilização triplica. Que cuidado essa situação ilustra?","5–36",[
    "Efeito rebote e necessidade de avaliar o consumo total. :: A eficiência por operação pode ser compensada pelo aumento de uso. Se cada operação usa 70% da energia anterior e o uso triplica, o total chega a 210%.",
    "Redução garantida de 30% no consumo total. :: Essa conclusão mantém implicitamente o número de operações constante, contrariando o enunciado.",
    "Prova de que eficiência não pode ser medida. :: A eficiência é mensurável; precisa ser interpretada junto da escala de uso.",
    "Consumo total obrigatoriamente igual ao anterior. :: O aumento de uso e a redução unitária não se anulam nos fatores dados.",
    "Fim de qualquer impacto de fabricação. :: A mudança operacional não elimina os impactos das demais etapas do ciclo de vida."
  ],"Analisar");
  q(4,8,"Para comparar o impacto ambiental de dois servidores com capacidades diferentes, qual base torna a comparação mais informativa?","5–36",[
    "O mesmo serviço funcional, com fronteiras e período explícitos. :: A comparação precisa relacionar impactos ao trabalho equivalente entregue e às mesmas etapas do ciclo de vida.",
    "Somente o tamanho físico de cada gabinete. :: Tamanho não descreve sozinho o serviço entregue nem o impacto do ciclo de vida.",
    "Somente o preço de compra. :: Custo financeiro e impacto ambiental não são equivalentes.",
    "O consumo de um ligado e do outro desligado. :: Os serviços prestados não seriam equivalentes nessa comparação.",
    "O número de cores no painel de monitoramento. :: A aparência do painel não é uma medida do desempenho ambiental."
  ],"Analisar");
  const existing = [...Object.values(bank.minis).flat(), ...bank.finals.flatMap(set=>set.questions)];
  bank.extra = added;
  bank.chapters = {};
  bank.chapterIds = [];
  bank.reviewPhases = [1, 2];
  for (const phase of globalThis.FIAPCourse.phases) for (const ch of phase.chapters) {
    const key = `p${phase.id}-c${ch.number}`;
    bank.chapterIds.push(key);
    bank.chapters[key] = [...existing, ...added].filter(q=>q.phase===phase.id && q.source.chapter===ch.number);
  }
})();
