# Como ampliar a revisão

Use um fork para propor mudanças: crie uma branch no seu fork e abra um pull request para `dandgsf/fiap-cs-revisa`, com base em `main`. Descreva o problema, a alteração e a validação realizada. A manutenção do projeto decide a integração; estudar, abrir issues e propor PRs não exige acesso de escrita ao repositório original.

Antes de alterar um tema, confira o PDF individual e identifique fase, capítulo e páginas. Não copie os PDFs para este repositório. Escreva uma explicação própria, um exemplo resolvido, uma confusão frequente e perguntas de recuperação.

## Novo semestre

1. Crie `content/semesters/02/` (ou o número correspondente), com dados próprios de fases, fontes e questões. Cada fase contém assuntos; cada assunto contém seus capítulos.
2. Carregue os scripts no `index.html` antes de `content/catalog.js`. Use um namespace próprio durante o carregamento, sem sobrescrever os dados do primeiro semestre.
3. Registre o semestre em `FIAPCurriculum.semesters` com `status: "available"`, `phases`, `sources`, `bank` e `reviewPhases`. O banco possui `minis`, três `finals`, `chapters` e `chapterIds`. Configure também `bank.reviewPhases`.
4. IDs de fase e capítulo precisam ser inteiros positivos. Os capítulos de cada assunto devem referenciar os mesmos objetos presentes em `phase.chapters`, sem duplicação entre assuntos. Inclua `title`, `shortTitle`, `summary`, `outcomes`, `memory` e `checklist` na fase; o renderizador usa esses campos.
5. Acrescente os arquivos à lista de `scripts/project-files.mjs` e à validação. Cada semestre terá sua própria chave de progresso automaticamente.

## Capítulos e questões

Um capítulo usa `number`, `title`, `pages`, `body`, `worked`, `pitfall`, `recall`, `focus`, `priority`, `priorityReason`, `minutes` e `subjectId`. `extension` e seu rótulo `extensionTitle` são opcionais. As prioridades aceitas são `core`, `support` e `context`.

Cada questão possui ID único, fase, competência, nível, enunciado, cinco alternativas distintas, uma correta, justificativa para todas as alternativas e referência de páginas. A lista `bank.chapters['p1-c2']`, por exemplo, aponta para as questões da fase 1, capítulo 2. As referências não dependem do endereço do acervo privado.

Prefira situações que exijam interpretar, calcular, comparar ou rastrear. Evite apenas trocar números para inflar a contagem. Justifique os distratores pelo erro de raciocínio que representam. Não chame uma questão de oficial sem documentação que sustente essa origem.

Antes de compartilhar, execute `npm test`, confira os temas claro/escuro e o celular e exporte para uma pasta nova com `npm run export -- <destino>`. Execute novamente `npm test` dentro da cópia exportada. Nunca inclua respostas salvas do navegador.
