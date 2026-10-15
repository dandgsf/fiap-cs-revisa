# Critérios editoriais e cobertura

A organização é semestre → fase → assunto → capítulo. O assunto é um agrupamento editorial dentro da fase; a referência acadêmica continua sendo o capítulo do PDF individual. As páginas contam desde a capa.

## Prioridade de estudo

- **Essencial:** conceitos e operações transferíveis, com dependência entre assuntos e aplicação em problemas. Inclui lógica, código, estruturas, modelos e interpretação energética.
- **Complementar:** história, nomes, datas e detalhes de apoio. O objetivo é relacionar uma contribuição ao conceito, sem substituir raciocínio por memorização de cronologias.
- **Contexto do projeto:** os quatro capítulos integradores. Preserve o cenário, mas concentre o estudo nos conceitos mobilizados por ele.

Não há matriz oficial da prova no material fornecido. Essas prioridades não estimam probabilidade, frequência, formato ou dificuldade de cobrança. Números, cenários e enunciados dos exercícios são autorais, não questões oficiais.

## Cobertura desta versão

São 32 capítulos representados, dos quais 28 temáticos. Há 129 questões únicas: 50 preservadas e 79 novas. Cada capítulo temático possui no mínimo quatro; os quatro capítulos abaixo possuem oito. Um capítulo integrador possui uma questão preservada; os outros três são contexto, sem treino próprio.

| Ampliação | Referência no PDF individual | O que passou a ser trabalhado |
| --- | --- | --- |
| Redes neurais e deep learning | Fase 1, capítulo 6, p. 28–39 | Perceptron, soma ponderada, viés, XOR, MLP, ativação, retropropagação, atualização de pesos, regularização, CNN, RNN/LSTM e atenção. |
| Estruturas lineares | Fase 2, capítulo 4, p. 35–38 | Vetores, push/pop, enqueue/dequeue, inserção/remoção, encadeamento, referências, custo de busca e casos vazios. |
| Cálculo | Fase 4, capítulo 4, p. 6–7, 30–41 | L’Hôpital e condições, contraexemplo de aplicação indevida, Taylor linear/quadrático, gradiente e papéis de SymPy, SciPy e JAX. |
| Inferência e regressão | Fase 4, capítulo 5, p. 18–28 | Teste t de coeficiente, teste F conjunto, graus de liberdade, valor-p, VIF, inflação de erro padrão e limitações. |

As questões dos mini simulados e dos três finais também aparecem no treino por capítulo. Os finais têm conjuntos distintos entre si, mas não são provas inéditas em relação ao treino. O catálogo mede representação, não cobertura integral nem domínio.

## Exemplos numéricos de conferência

- Perceptron: 2 × 0,5 + 1 × (−1) + 0,2 = 0,2.
- Atualização de peso: 0,8 − 0,1 × 0,3 = 0,77.
- Taylor da raiz: √4,04 ≈ 2 + 0,04/4 = 2,01.
- Taylor exponencial: e⁰·¹ ≈ 1 + 0,1 + 0,1²/2 = 1,105.
- Teste t: 6/2 = 3; a decisão exige valor crítico ou valor-p e as hipóteses do teste.
- Teste F: (120/2)/(60/(23−2−1)) = 20.
- VIF: 1/(1−0,8) = 5; com VIF 9, o fator de erro padrão é 3.

## Referências técnicas opcionais

- [SymPy: cálculo](https://docs.sympy.org/latest/tutorials/intro-tutorial/calculus.html).
- [SciPy: minimize](https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html).
- [JAX: diferenciação automática](https://docs.jax.dev/en/latest/automatic-differentiation.html).

O teste t abordado é o de coeficiente de regressão, não o teste de diferença entre duas médias. Sintaxe de ferramentas fica em aprofundamento. Os exemplos são para interpretação ou execução fora do navegador do guia.
