"use strict";
globalThis.FIAPQuestion = function (id, phase, competency, chapter, pages, prompt, entries, explanation, level = "Aplicar") {
  const position = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 5;
  const ordered = [...entries];
  const correct = ordered.shift();
  ordered.splice(position, 0, correct);
  return { id, phase, competency, prompt, options: ordered.map(entry => entry[0]),
    rationales: ordered.map(entry => entry[1]), correctIndex: position, explanation, level,
    source: { phase, chapter, pages } };
};
globalThis.FIAPBank = { finals: [], minis: {} };
(function (q, bank) {
  const L = "Fundamentos e lógica", P = "Programação e algoritmos", S = "Estruturas e sistemas",
    M = "Matemática, dados e IA", E = "Energia, sustentabilidade e sociedade";
  bank.minis[1] = [
    q("m1-1",1,E,1,"13–15","Há 76 kWh disponíveis, 60 kWh de demanda prevista e reserva obrigatória de 18 kWh. Os valores já consideram perdas. Qual decisão respeita a regra?",[
      ["Não liberar: a folga de 16 kWh é menor que a reserva.","76−60=16, abaixo dos 18 exigidos; faltam 2 kWh para a reserva."],
      ["Liberar: basta a disponibilidade superar 60 kWh.","Verifica somente a demanda e ignora a reserva obrigatória."],
      ["Liberar: a demanda deve ser reduzida pela reserva, para 42 kWh.","A reserva deve permanecer após atender a demanda, não reduzir a demanda."],
      ["Não liberar: 76 kWh representam potência insuficiente.","kWh mede energia; nenhuma potência de descarga foi informada."],
      ["Liberar se uma ferramenta de IA considerar a missão segura.","Uma opinião não altera a desigualdade nem substitui a regra verificável."]
    ],"Formalize disponível ≥ demanda + reserva. Seriam necessários pelo menos 78 kWh. Conferir demanda não dispensa conferir reserva."),
    q("m1-2",1,L,2,"22–28","Qual associação diferencia Babbage, Ada Lovelace e Turing, nessa ordem?",[
      ["Máquina analítica; instruções e potencial simbólico; modelo abstrato de computação.","As contribuições correspondem, respectivamente, a Babbage, Ada e Turing."],
      ["Transistor; ENIAC; tear de cartões perfurados.","Esses artefatos estão associados a outros inventores e projetos."],
      ["Máquina analítica; transistor; criação do ENIAC.","Ada não inventou o transistor e Turing não criou o ENIAC."],
      ["Jogo da imitação; CPU comercial; Pascalina.","O jogo da imitação liga-se a Turing, e as demais atribuições também estão trocadas."],
      ["Três nomes para uma mesma máquina eletrônica de 1946.","São pessoas, épocas e contribuições diferentes, não sinônimos de uma máquina."]
    ],"Recupere a ideia junto ao nome. Projetar uma máquina, descrever instruções e formalizar computação são contribuições relacionadas, mas distintas.","Recordar"),
    q("m1-3",1,L,3,"17–23","Qual valor decimal corresponde a 0,101₂?",[
      ["0,625", "1×2⁻¹ + 0×2⁻² + 1×2⁻³ = 0,5+0,125."],
      ["0,101", "Copiar os algarismos não preserva o valor ao mudar de base."],
      ["0,75", "Corresponderia a 0,11₂; o último 1 dado está no peso 1/8."],
      ["5", "5 é 101₂ sem o separador fracionário."],
      ["0,5", "Ignora o último bit, que contribui com 1/8."]
    ],"À direita do separador, os pesos são potências negativas da base. Expanda cada posição antes de somar."),
    q("m1-4",1,M,6,"23–30","Uma equipe calcula médias usando todos os registros, preenche ausências e só depois separa treino e teste. Qual é o problema?",[
      ["O pré-processamento usou informação do teste e pode contaminar a avaliação.","As médias foram aprendidas também com dados reservados; deveriam ser ajustadas no treino."],
      ["Usar médias transforma o modelo em aprendizado por reforço.","Reforço envolve ações e recompensas; a média não determina o paradigma."],
      ["Preencher ausências impossibilita qualquer regressão.","Imputação pode ser adequada, desde que definida e validada corretamente."],
      ["Não há problema porque os rótulos não foram usados.","Vazamento também pode ocorrer por estatísticas das entradas."],
      ["A avaliação será válida se o desempenho do treino for alto.","Desempenho de treino não repara vazamento nem prova generalização."]
    ],"A separação deve proteger a avaliação. Aprenda transformações com treino e aplique as mesmas transformações aos demais conjuntos.","Analisar"),
    q("m1-5",1,E,8,"8–25","Qual proposta é mais consistente com Green IT e responsabilidade social?",[
      ["Medir energia por serviço, prolongar vida útil e acompanhar resíduos.","Combina mensuração comparável e etapas relevantes do ciclo de vida."],
      ["Trocar todos os equipamentos anualmente por modelos mais novos.","Ignora fabricação, descarte e necessidade real da substituição."],
      ["Usar apenas a conta de luz menor, sem avaliar o serviço entregue.","A redução pode refletir menos atividade, não eficiência."],
      ["Transferir processamento e declarar impacto zero.","O impacto pode apenas ter sido deslocado ao fornecedor."],
      ["Usar certificação ISO 26000 como prova suficiente.","A ISO 26000 é orientativa e não certificável; não substitui mensuração."]
    ],"Avalie serviço equivalente e ciclo de vida. A identificação correta da ISO 26000 e sua natureza orientativa constam nas notas de fontes.","Analisar")
  ];
  bank.minis[2] = [
    q("m2-1",2,L,2,"21–48","S=E AND (A OR B), com três entradas booleanas independentes. Qual afirmação é correta?",[
      ["A tabela tem oito linhas e E=0 força S=0.","São 2³ combinações; AND com E=0 zera a saída."],
      ["A tabela tem seis linhas.","As combinações multiplicam: 2×2×2, não 3×2."],
      ["A=1 sempre força S=1.","O AND externo ainda exige E=1."],
      ["A=B=1 força o OR a zero.","Isso seria XOR; OR inclusivo permanece 1."],
      ["E=1 força S=1 mesmo com A=B=0.","Com ambos em zero, o OR e a saída são zero."]
    ],"Analise o grupo A OR B e depois a condição obrigatória E. Cubra todas as combinações da tabela."),
    q("m2-2",2,P,4,"28–30","Em C, x começa em 0. Compare while (x > 0) { x++; } com do { x++; } while (x < 0);. Em execuções independentes, quais os valores finais?",[
      ["0 e 1, respectivamente.","while não entra; do executa uma vez antes de encontrar a condição falsa."],
      ["1 nos dois.","O primeiro não executa porque 0>0 é falso."],
      ["0 nos dois.","do…while executa antes do primeiro teste."],
      ["Execução infinita nos dois.","As condições são falsas nos momentos de verificação relevantes."],
      ["0 e −1, respectivamente.","x++ incrementa, não decrementa."]
    ],"Identifique o momento do teste: pré-teste pode executar zero vezes; pós-teste executa ao menos uma vez."),
    q("m2-3",2,P,5,"19–35","Registros por ordem de chegada serão ordenados por prioridade, mantendo a chegada entre prioridades iguais. Qual propriedade é necessária?",[
      ["Estabilidade da ordenação.","Preserva a ordem relativa original dos itens com chave igual."],
      ["Busca binária, independentemente da ordenação.","Busca encontra itens e não garante a preservação de empates."],
      ["Custo O(1) para ordenar qualquer entrada.","Isso não define estabilidade nem representa ordenação geral."],
      ["Remover registros de prioridade repetida.","Perde dados em vez de preservar sua ordem."],
      ["Usar obrigatoriamente o menor espaço auxiliar.","Uso de memória e estabilidade são propriedades independentes."]
    ],"A questão pede uma garantia sobre empates, não sobre tempo ou memória. Identifique a propriedade correspondente.","Analisar"),
    q("m2-4",2,M,6,"26–28","Qual é o domínio real de f(x)=ln(x−2)?",[
      ["x>2.","O argumento do logaritmo deve ser estritamente positivo."],
      ["x≥2.","Em x=2 o argumento é zero e ln(0) não é definido nos reais."],
      ["Todos os reais.","Argumentos não positivos não pertencem ao domínio real."],
      ["x<2.","Essa condição produz argumento negativo."],
      ["Apenas x=2.","Justamente nesse ponto a expressão é indefinida."]
    ],"Aplique a restrição ao argumento completo: x−2>0. Não confunda o domínio do logaritmo com o da raiz quadrada."),
    q("m2-5",2,E,8,"12–24","Um relatório associa 17 ODS a 169 metas e exige responsáveis, mensuração e transparência. Qual leitura é consistente?",[
      ["Os números são da Agenda 2030 e as exigências incluem governança.","A Agenda possui 17 objetivos e 169 metas; responsabilidades e transparência compõem governança."],
      ["São 169 ODS e 17 metas, todos sobre energia.","Inverte números e reduz indevidamente o alcance dos objetivos."],
      ["Os ODS foram definidos pela Agenda 21 em 1992.","ODS ligam-se à Agenda 2030, adotada em 2015."],
      ["Governança é apenas reduzir emissões.","Emissões pertencem à dimensão ambiental; governança inclui controle e responsabilidade."],
      ["Publicar a meta dispensa acompanhar resultados.","Uma declaração não comprova implementação nem cumprimento."]
    ],"Associe 2015, Agenda 2030, 17 objetivos e 169 metas. Qualidade do relato depende de governança.","Recordar")
  ];
  bank.minis[3] = [
    q("m3-1",3,L,2,"24–35","Na linha A=0, B=1 e saída=0, qual maxtermo vale zero exatamente nessa combinação?",[
      ["A + B'.", "A=0 e B'=0; o OR vale zero quando ambos os literais são zero."],
      ["A'·B.","É o mintermo que vale 1 nessa linha."],
      ["A' + B.","Os dois literais valem 1 na combinação dada."],
      ["A·B.","É produto e vale zero em três combinações, não apenas nesta."],
      ["A + B.","Com B=1, essa soma vale 1."]
    ],"Maxtermos são somas para as saídas zero. Negue a variável cujo valor de entrada é 1."),
    q("m3-2",3,P,3,"25–31","Uma função Python executa print(2 + 3) e termina sem return. O que ocorre em resultado = funcao()?",[
      ["Exibe 5 e associa None a resultado.","print apresenta a saída; sem retorno explícito, a função devolve None."],
      ["Associa 5 sem exibir nada.","Isso descreve return 5, não print(5)."],
      ["Associa o texto '5'.", "A apresentação na tela não vira retorno textual automaticamente."],
      ["Sempre gera erro por faltar return.","Python permite funções sem retorno explícito."],
      ["Associa True porque a operação teve sucesso.","Sucesso de execução não gera um retorno booleano implícito."]
    ],"Diferencie saída na tela e valor devolvido ao chamador. A distinção importa ao encadear cálculos."),
    q("m3-3",3,S,4,"25–29","Duas chaves diferentes produzem o mesmo índice numa tabela hash. Qual interpretação é correta?",[
      ["Houve colisão; uma política de resolução pode manter ambos os registros.","Encadeamento e sondagem são exemplos de tratamento sem perda automática."],
      ["As chaves são necessariamente iguais.","Entradas distintas podem produzir o mesmo índice."],
      ["Toda consulta terá O(1) garantido no pior caso.","O pior caso pode ser linear; não confunda com custo esperado."],
      ["O registro mais antigo deve ser descartado.","Perda de dados não é solução universal correta para colisões."],
      ["A tabela se torna automaticamente uma AVL.","Colisão não implica transformação automática da estrutura."]
    ],"Hash exige função de dispersão, capacidade e política de colisão. Custo esperado e pior caso são diferentes."),
    q("m3-4",3,M,5,"35–37","Uma equipe aplica PCA aos sensores sem rótulos de falha. Qual conclusão é correta?",[
      ["Pode reduzir dimensões por variância, sem garantir a melhor classificação.","PCA é não supervisionado e variância não equivale automaticamente a poder discriminativo."],
      ["Aprende diretamente a falha por supervisão.","Os rótulos não participam do ajuste descrito."],
      ["Mantém obrigatoriamente a dimensão original.","A seleção de componentes pode reduzir dimensão e perder informação."],
      ["A escala das variáveis nunca influencia o resultado.","Escalas diferentes podem dominar a variância; pré-processamento importa."],
      ["Elimina a necessidade de avaliar o classificador posterior.","Transformar dados não valida o modelo que usará os componentes."]
    ],"Distinguir o objetivo da transformação do objetivo da previsão evita atribuir ao PCA uma garantia inexistente.","Analisar"),
    q("m3-5",3,M,7,"20–22","Observados: [4, 7]. Previsões: [5, 5]. Com resíduo=y−ŷ e MSE=Σresíduo²/n, qual resultado é correto?",[
      ["Resíduos [−1, 2]; MSE=2,5.","(1+4)/2=2,5, usando observado menos previsto."],
      ["Resíduos [1, −2]; MSE=2,5.","O MSE coincide pelo quadrado, mas os sinais dos resíduos estão invertidos."],
      ["Resíduos [−1, 2]; MSE=0,5.","0,5 é média dos resíduos, não média dos seus quadrados."],
      ["Resíduos [−1, 2]; MSE=5.","5 é a soma dos quadrados; falta dividir por n=2."],
      ["Resíduos [4, 7]; MSE=0.","Observados não são resíduos e as previsões não são exatas."]
    ],"Calcule o erro com sinal e depois eleve ao quadrado. MSE evita o cancelamento de erros positivos e negativos.")
  ];
  bank.minis[4] = [
    q("m4-1",4,S,3,"18–30","Uma rota com duas arestas custa 12; outra com três custa 7. Todos os pesos são não negativos. Qual método minimiza o custo?",[
      ["Dijkstra usando os pesos.","Busca menor soma de pesos sob a condição de não negatividade."],
      ["BFS ignorando pesos, pois menos arestas sempre custa menos.","O enunciado mostra o contrário: três arestas custam menos."],
      ["DFS, que sempre retorna a rota mais barata primeiro.","DFS não possui essa garantia."],
      ["Busca binária nos nomes dos vértices.","Busca por chave ordenada não resolve menor caminho."],
      ["Escolher só a aresta localmente mais barata a cada passo.","Essa estratégia não equivale a manter distâncias e relaxar arestas com Dijkstra."]
    ],"O objetivo é soma de custos, não quantidade de saltos. Defina peso e pré-condições antes de escolher o algoritmo."),
    q("m4-2",4,M,4,"23–25","Para f(x)=x³, f'(0)=0 e f''(0)=0. O que se pode afirmar?",[
      ["O teste de segunda derivada é inconclusivo e em 0 não há extremo local.","x³ permanece crescente e atravessa zero, apesar da tangente horizontal."],
      ["Há necessariamente mínimo local.","Derivada zero define um candidato, não garante mínimo."],
      ["Há necessariamente máximo local.","Segunda derivada zero não estabelece máximo."],
      ["A função é constante em todo o domínio.","Derivada nula num ponto não implica função constante."],
      ["A função é indefinida em zero.","x³ é definida e diferenciável nesse ponto."]
    ],"Verifique o comportamento local ou o sinal da derivada. Um ponto estacionário pode ser uma inflexão."),
    q("m4-3",4,M,5,"9–15","Uma regressão usa 40 observações, três preditores e intercepto. Quais dimensões permitem ŷ=Xβ?",[
      ["X: 40×4; β: 4×1.","São três colunas de preditores mais uma de 1 para o intercepto."],
      ["X: 40×3; β: 3×1.","Falta o intercepto solicitado."],
      ["X: 4×40; β: 4×1.","Inverte observações e coeficientes e torna o produto incompatível."],
      ["X: 40×40; β: 3×1.","Não corresponde à organização por observações e preditores."],
      ["X: 3×4; β: 40×1.","As dimensões não representam os dados nem permitem o produto."]
    ],"A previsão precisa ter 40×1. Confira as dimensões internas e a coluna adicional do intercepto."),
    q("m4-4",4,E,7,"7–10","Uma bateria de 30 kWh permite utilizar 80% e entrega 90% dessa energia após perdas. Com carga de 3 kW e potência admissível suficiente, qual a autonomia?",[
      ["7,2 h.","30×0,8×0,9=21,6 kWh; 21,6/3=7,2 h."],
      ["10 h.","Ignora limite de utilização e perdas."],
      ["8 h.","Desconta utilização, mas ignora eficiência de entrega."],
      ["9 h.","Aplica eficiência, mas ignora o limite de 80%."],
      ["21,6 h.","21,6 é energia em kWh; ainda precisa dividir pela potência."]
    ],"Calcule energia efetivamente entregue e depois tempo de atendimento. Mantenha unidades coerentes em cada etapa."),
    q("m4-5",4,E,8,"25–36","Qual iniciativa combina economia circular e avaliação de ciclo de vida?",[
      ["Projetar para reparo e reuso e comparar impactos por serviço ao longo da vida útil.","Preserva valor e usa uma base funcional para comparar alternativas."],
      ["Considerar só reciclagem e declarar impacto total nulo.","Reciclagem é uma etapa e também tem impactos."],
      ["Trocar bens funcionais a cada lançamento.","Pode ampliar fabricação e descarte sem benefício equivalente."],
      ["Comparar consumo total sem observar tarefas entregues.","Pode favorecer a alternativa que realiza menos serviço."],
      ["Ignorar fornecedores por estarem fora da organização.","O ciclo de vida pode incluir impactos fora da fronteira organizacional."]
    ],"O raciocínio circular inclui projeto, manutenção, reuso e recursos ao longo do ciclo, além da destinação de resíduos.","Analisar")
  ];
})(globalThis.FIAPQuestion, globalThis.FIAPBank);
