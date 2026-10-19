# FIAP CS Revisa

Revisões e simulados independentes de Computer Science da FIAP. O conteúdo segue **semestre → fase → assunto → capítulo** e pode crescer ao longo do curso. Esta versão disponibiliza o primeiro semestre; o segundo está identificado como em preparação.

Material autoral de estudo, sem vínculo oficial com a FIAP. Não é uma previsão de prova nem substitui integralmente os PDFs e exercícios da disciplina.

## Estudar

### Opção 1 — baixar e abrir, sem instalação

1. [Baixe o pacote da versão mais recente](https://github.com/dandgsf/fiap-cs-revisa/releases/latest/download/fiap-cs-revisa.zip).
2. Extraia **todo** o ZIP para uma pasta no seu computador. Não abra o HTML dentro do arquivo compactado.
3. Abra `fiap-cs-revisa/index.html` em um navegador atualizado, como Chrome, Edge ou Firefox.
4. Escolha o semestre e comece por **Explorar a revisão**.

Os arquivos de `assets/` e `content/` precisam acompanhar o HTML. Depois do download, a revisão e as questões funcionam sem internet. Links externos de referências e do GitHub precisam de conexão. Não é necessário criar conta nem instalar dependências.

Também é possível usar **Code → Download ZIP** na [página do repositório](https://github.com/dandgsf/fiap-cs-revisa), extrair tudo e abrir o `index.html` da pasta extraída.

### Opção 2 — abrir em localhost

Com Git e Node.js instalados (Node.js 22 ou superior recomendado; mínimo técnico 20), execute:

```powershell
git clone https://github.com/dandgsf/fiap-cs-revisa.git
cd fiap-cs-revisa
npm start
```

Acesse **http://127.0.0.1:4317**. Não precisa executar `npm install`: as bibliotecas usadas (GSAP, KaTeX e three.js) já acompanham o pacote em `assets/vendor/`. Se você baixou o ZIP, abra o terminal na pasta que contém `package.json` e execute apenas `npm start`.

Mantenha o terminal aberto enquanto estuda; **Ctrl+C** encerra o servidor. Se a porta estiver ocupada, execute `npm start -- --port 4318` e acesse `http://127.0.0.1:4318`. O servidor escuta somente na própria máquina; esse endereço não é um link para compartilhar com colegas.

## Percurso

Escolha semestre e fase. Dentro da fase, use os assuntos e capítulos do índice, os seletores ou a busca. Cada capítulo apresenta foco de revisão, mapa mental, explicação em trechos com as páginas do PDF, exemplo resolvido, confusão frequente, recuperação ativa e treino disponível. Conteúdo de apoio fica em blocos expansíveis.

O que ajuda a estudar nesta versão:

- **Menu recolhível.** O botão **Ocultar menu** (ou **Ctrl+B**, **⌘B** no Mac) esconde o índice e libera a largura da página; a escolha fica salva. No celular, o índice abre como gaveta.
- **Páginas do PDF por trecho.** Cada parte do resumo mostra “PDF p.” com as páginas exatas de onde a ideia veio, para você conferir no material da disciplina.
- **Mapas mentais.** Cada capítulo traz um mapa colorido; clique nos ramos para recolher e nas folhas para ver o detalhe.
- **Trilha do semestre.** Acima das fases, a trilha mostra como os assuntos se conectam entre as fases e o que você já leu.
- **Fórmulas e contas passo a passo.** Fórmulas aparecem destacadas, com a legenda de cada símbolo, e as contas são resolvidas linha a linha, com a conferência de volta.
- **Laboratórios.** No capítulo de sistemas numéricos, o laboratório de bases converte qualquer número entre as bases 2 e 16 mostrando cada passo. No capítulo de cálculo, o laboratório 3D mostra o gradiente descendente na função de Himmelblau do PDF.

Para aproveitar o percurso completo:

1. Escolha um capítulo. Leia a explicação e tente resolver o exemplo antes de consultar a solução.
2. Em **Explique antes de abrir**, responda de memória e depois confira. Abra os aprofundamentos quando precisar.
3. Marque **Revisei e consigo explicar o raciocínio** quando fizer sentido para você.
4. Responda a prática do capítulo e envie todas as respostas. Use o **caderno de erros** e os links **Rever o trecho** para voltar à parte do resumo que cobre cada questão.
5. Faça o mini simulado de cada fase e, após revisar o semestre, os simulados finais. As regras de desbloqueio estão abaixo.

Use a busca para localizar conceitos, a alternância de tema para ajustar a leitura e **Imprimir semestre** para imprimir ou salvar as revisões em PDF. A impressão reúne os capítulos e aprofundamentos; não inclui as avaliações. O segundo semestre ainda não tem conteúdo disponível.

O tema padrão é escuro FIAP; há opção clara. Marcar uma leitura é uma autodeclaração, não comprovação de domínio. O navegador mantém seu progresso individual; compartilhar os arquivos não compartilha respostas.

## Questões e simulados

- **129 questões únicas:** 50 da versão anterior e 79 novas, com cinco alternativas e justificativas por alternativa. Na versão 1.1, todos os enunciados foram reescritos com cenário, dados e pergunta precisa; alternativas e gabaritos não mudaram.
- **28 capítulos temáticos:** pelo menos quatro questões por capítulo; oito em redes neurais/IA, estruturas lineares/C, cálculo e regressão múltipla.
- **Quatro capítulos integradores:** contexto do projeto; um mantém uma questão anterior e os demais não têm treino próprio.
- **Quatro mini simulados:** cinco questões por fase, refeitos sem limite.
- **Três simulados finais:** dez questões em cada conjunto, distintos entre si; não há cronômetro para responder.

Questões dos mini simulados e finais também pertencem ao treino por capítulo. As contagens não devem ser somadas como se fossem bancos independentes. O aluno pode conhecer uma questão durante o treino antes de encontrá-la no final.

Todas as questões de uma prática devem ser respondidas antes da correção. Durante a resolução, nenhuma página do PDF aparece. O retorno mostra acertos, desempenho por competência, comentário de cada alternativa e, para cada questão, o capítulo e as páginas do PDF, com um link para o trecho do resumo. Refazer uma prática substitui somente a tentativa daquela prática; preserva os finais.

O percurso mantém o requisito anterior de **10 minutos ativos nas fases 1 e 2** antes dos finais. Conta somente a leitura visível de um capítulo, com janela focada e interação recente. Pausa após 90 segundos sem interação, durante impressão, ao sair da janela e durante o treino. As outras fases também precisam ser revisadas. Tempo não mede aprendizado.

## Organização independente

```text
index.html
assets/                    Interface, estilos, renderização e motor de avaliação
  labs/                    Laboratório de bases e laboratório 3D de gradiente
  vendor/                  GSAP, KaTeX e three.js, com licenças (sem instalação)
content/
  catalog.js               Semestres → fases → assuntos → capítulos
  semesters/
    01/
      phases/01.js ...     Revisões do primeiro semestre
      questions.js        Mini simulados preservados
      final-exams.js       Três conjuntos finais preservados
      practice.js         Questões adicionais e índice por capítulo
      sources.js          Catálogo bibliográfico, sem PDFs
      roadmap.js          Trilha do semestre: faixas e conexões entre capítulos
scripts/                   Servidor local e exportação por lista permitida
tests/                     Validação do conteúdo, estado, correção e privacidade
docs/                      Critérios editoriais, identidade FIAP e segurança
```

Nenhum caminho de execução depende do acervo acadêmico original. Veja [como contribuir](CONTRIBUTING.md), [critérios de conteúdo](docs/content-policy.md), [interface](docs/design.md) e [privacidade](docs/security.md).

## Validar e exportar

```powershell
npm test
npm run export -- "output/fiap-cs-revisa"
```

O destino precisa ser novo: o exportador recusa sobrescrever uma pasta existente. Execute `npm test` novamente dentro da cópia exportada. O pacote inclui somente os arquivos explicitamente permitidos em `scripts/project-files.mjs`; não carrega PDFs, arquivos de ambiente, repositórios aninhados nem histórico Git do acervo.

O repositório público é [dandgsf/fiap-cs-revisa](https://github.com/dandgsf/fiap-cs-revisa). As versões estáveis estão em [Releases](https://github.com/dandgsf/fiap-cs-revisa/releases), com o histórico em [CHANGELOG.md](CHANGELOG.md). Compartilhe o link da versão ou o ZIP completo. Os PDFs oficiais permanecem no ambiente acadêmico de cada aluno.

Para atualizar um clone sem alterações locais, execute `git pull --ff-only`. Quem usa ZIP deve baixar e extrair a nova versão. O progresso não acompanha o ZIP: ele pertence ao navegador e à origem em que você estudou.

## Dúvidas frequentes

- **O simulado final está bloqueado:** revise capítulos das fases 1 e 2 por dez minutos ativos em cada uma. Deixar a página parada ou em segundo plano não completa esse requisito. Confira o contador de cada fase; marcar capítulos como lidos não substitui o tempo.
- **O botão de correção não conclui:** responda todas as questões. O foco leva ao primeiro item que falta.
- **Meu progresso não apareceu:** use o mesmo navegador, perfil, endereço e porta. Navegação privada, limpeza de dados do site e mudança de origem podem impedir a recuperação. Não há conta nem sincronização entre dispositivos.
- **O HTML abriu sem conteúdo ou aparência:** confira se o ZIP inteiro foi extraído e se `assets/` e `content/` estão junto de `index.html`. Se o navegador restringir arquivos locais, use a opção localhost.
- **Encontrei um erro:** [abra uma issue](https://github.com/dandgsf/fiap-cs-revisa/issues), informe semestre, fase, capítulo e o problema. Para corrigir código ou conteúdo, consulte [CONTRIBUTING.md](CONTRIBUTING.md). Não envie tokens, dados pessoais, respostas salvas nem PDFs privados.

## Persistência e acessibilidade

Cada semestre usa uma chave própria em `localStorage`. Se ainda não houver estado novo, o primeiro semestre importa o estado compatível de `fiap.firstSemesterExam.v2`, preservando o original. Arquivos copiados para outro caminho, outra porta, outro navegador ou perfil podem ter armazenamento separado. Em `file://`, a persistência depende do navegador; um aviso informa quando ela não está disponível.

Não há servidor de contas, analytics ou transmissão de respostas. O gabarito está no código offline e o limite de tentativas não é antifraude. Não há coleta de nome ou RM do aluno.

Abas aceitam setas, Home e End; formulários usam rótulos, foco visível e mensagens de incompletude. Resultados não dependem só de cor. O menu recolhe com **Ctrl+B** (fora dos campos de texto), a gaveta do celular fecha com **Esc** e o foco volta ao botão. Mapas mentais e a trilha também têm versão em texto, e o laboratório 3D mostra todos os cálculos numa tabela, mesmo sem WebGL. A impressão expande as revisões, os mapas e as fórmulas e omite os simulados e os laboratórios. Movimento reduzido é respeitado: as animações vão direto ao estado final.

A autoria visível fica discretamente no rodapé, com nome abreviado, RM autorizado e link público do GitHub.
