# Interface de estudo

Fonte visual principal: [design system observado da FIAP](fiap-design-system.md), copiado do documento de referência do acervo. O material é independente e não apresenta a identidade como endosso institucional.

A superfície principal é de leitura; avaliação usa controles de formulário. Navegação persistente, um capítulo por vez e busca por conteúdo reduzem a carga de orientação. A visão geral permite escolher assunto, capítulo ou prática. O índice fica num menu lateral recolhível: o botão da barra de leitura (fixa abaixo do cabeçalho) e o atalho Ctrl+B (⌘B) alternam o menu, e a escolha fica salva. Recolhido, a coluna de estudo centraliza em até 72rem; o texto mantém 75 caracteres e os blocos largos (mapas, laboratórios, tabelas) usam o espaço extra. Em celular, o índice abre como gaveta, com fundo escurecido, Esc para fechar e foco devolvido ao botão.

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
| Ramos de mapa e faixas da trilha | `#ed145b` `#25dbef` `#4eec85` `#fcea10` `#fd7223` `#acc1cc` | `#c4104b` `#0b8a9b` `#178a47` `#8a7c00` `#c2530f` `#5c7480` |

O botão magenta usa texto preto, como a referência FIAP, para contraste. Texto pequeno usa neutros. Cantos retos, linhas finas, títulos leves e hierarquia clara preservam a identidade. O SVG oficial permanece sem recoloração.

Segoe UI Variable, Segoe UI, Aptos e Arial formam a pilha local. As fontes comerciais da FIAP não são copiadas. Código usa Consolas/Cascadia Code. Leitura possui medida máxima de 75ch, corpo de 16–17px e entrelinha ampla. Controles principais possuem alvos de ao menos 44px. O foco é visível e o estado tem texto ou atributos ARIA, além de cor.

O tema padrão é escuro, por preferência do autor, com alternância para claro. As cores secundárias vêm dos tokens de baixo uso do CSS da FIAP e aparecem só em linhas, bordas e marcadores; o texto continua nos neutros, com contraste garantido nos dois temas.

O movimento é discreto e explica estado: GSAP abre e fecha ramos dos mapas, desenha as conexões da trilha na primeira abertura, revela os passos do laboratório de bases e lê os restos na ordem certa enquanto o resultado se forma, e percorre a trajetória do gradiente no laboratório 3D. O menu usa transição de CSS. Com `prefers-reduced-motion`, tudo vai direto ao estado final. Não há rolagem capturada, vídeo, mídia remota nem carregamento de fontes externas: as fontes do KaTeX acompanham o pacote.

## Componentes de estudo

- **Trecho citado:** cada parte do resumo mostra “PDF p.” na margem direita quando há espaço, ou ao lado do título em telas estreitas.
- **Fórmula:** bloco com borda superior magenta, expressão em KaTeX e legenda dos símbolos.
- **Tabela de passos e conta armada:** a coluna que forma a resposta recebe um véu magenta discreto; a última linha da conta traz o sinal de igual.
- **Mapa mental:** árvore horizontal com ramos coloridos; vira árvore vertical abaixo de 40rem de largura e sai inteira na impressão.
- **Trilha do semestre:** grade de fases por faixas de assunto, com curvas entre capítulos; passar o mouse ou focar destaca o que o capítulo retoma e prepara. Abaixo de 56rem vira lista com as conexões em texto.
- **Laboratórios:** conversor de bases com passo a passo e laboratório 3D de gradiente. A visualização 3D só carrega o three.js quando aberta e mantém todos os números numa tabela acessível.

## Comportamentos

Busca aceita acentos ou sua ausência. Selecionar assunto restringe os capítulos do seletor. O índice e as migalhas de navegação indicam o caminho atual. O segundo semestre aparece como preparação, sem conteúdo ou questões fictícias. Sua seleção não altera o progresso do primeiro.

Leitura marcada é autodeclaração, separada de respostas corretas. Questões exigem envio completo antes da correção. Incompletude leva o foco ao primeiro item pendente; correção leva ao resultado. Os detalhes por alternativa fornecem retorno ao capítulo.

Impressão expande as revisões do semestre e os aprofundamentos e omite avaliações, navegação e o atalho de pular para a revisão. Usa uma paleta própria, independente do tema escolhido: fundo branco, texto escuro e superfícies cinza-claro para exemplos, tabelas e código. Metadados e respostas dos blocos expansíveis seguem essa mesma paleta. Ao encerrar a impressão, os blocos retornam ao estado de abertura anterior.

Tema, leituras e resultados ficam no navegador, com aviso se a persistência falhar.
