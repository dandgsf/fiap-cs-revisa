# Interface de estudo

Fonte visual principal: [design system observado da FIAP](fiap-design-system.md), copiado do documento de referência do acervo. O material é independente e não apresenta a identidade como endosso institucional.

A superfície principal é de leitura; avaliação usa controles de formulário. Navegação persistente, um capítulo por vez e busca por conteúdo reduzem a carga de orientação. A visão geral permite escolher assunto, capítulo ou prática. Em celular, o índice vira um menu expansível.

## Tokens e decisões

| Papel | Escuro | Claro |
| --- | --- | --- |
| Marca / ação / seleção | `#ed145b` | `#ed145b` |
| Canvas | `#131516` | `#f5f5f5` |
| Superfície | `#191c1d` | `#ffffff` |
| Superfície elevada | `#202325` | `#e7ecee` |
| Texto | `#f5f5f5` | `#131516` |
| Texto secundário | `#acc1cc` | `#42535d` |
| Linhas | `#424b4f` | `#c5cdd1` |

O botão magenta usa texto preto, como a referência FIAP, para contraste. Texto pequeno usa neutros. Cantos retos, linhas finas, títulos leves e hierarquia clara preservam a identidade. O SVG oficial permanece sem recoloração.

Segoe UI Variable, Segoe UI, Aptos e Arial formam a pilha local. As fontes comerciais da FIAP não são copiadas. Código usa Consolas/Cascadia Code. Leitura possui medida máxima de 75ch, corpo de 16–17px e entrelinha ampla. Controles principais possuem alvos de ao menos 44px. O foco é visível e o estado tem texto ou atributos ARIA, além de cor.

O tema padrão é escuro, por preferência do autor, com alternância para claro. O movimento é discreto; `prefers-reduced-motion` desliga animações e transições. Não há rolagem capturada, vídeo, mídia remota nem carregamento de fontes externas.

## Comportamentos

Busca aceita acentos ou sua ausência. Selecionar assunto restringe os capítulos do seletor. O índice e as migalhas de navegação indicam o caminho atual. O segundo semestre aparece como preparação, sem conteúdo ou questões fictícias. Sua seleção não altera o progresso do primeiro.

Leitura marcada é autodeclaração, separada de respostas corretas. Questões exigem envio completo antes da correção. Incompletude leva o foco ao primeiro item pendente; correção leva ao resultado. Os detalhes por alternativa fornecem retorno ao capítulo.

Impressão expande as revisões do semestre e os aprofundamentos e omite avaliações, navegação e o atalho de pular para a revisão. Usa uma paleta própria, independente do tema escolhido: fundo branco, texto escuro e superfícies cinza-claro para exemplos, tabelas e código. Metadados e respostas dos blocos expansíveis seguem essa mesma paleta. Ao encerrar a impressão, os blocos retornam ao estado de abertura anterior.

Tema, leituras e resultados ficam no navegador, com aviso se a persistência falhar.
