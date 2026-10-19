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

### Marcação dos capítulos

Os campos `body`, `worked` e `extension` são HTML estático revisado. Use estes blocos; o renderizador e os testes dependem deles.

- **Trecho citado.** Agrupe cada ideia em `<section class="excerpt" data-pages="33–36"><h4>Título do trecho</h4>…</section>`. As páginas indicam onde aquela ideia está no PDF individual, contadas desde a capa, com travessão (`–`) entre limites e `;` entre faixas separadas. Prefira faixas curtas e específicas à faixa inteira do capítulo. O guia mostra “PDF p. 33–36” na margem do trecho. Questões e simulados nunca mostram páginas antes da correção.
- **Fórmula destacada.** `<div class="formula"><p class="formula-title">Nome da fórmula</p><div class="tex-block">TeX</div><dl class="formula-legend"><div><dt><span class="tex">símbolo</span></dt><dd>significado</dd></div></dl></div>`. Use a legenda para cada símbolo que o aluno precisa ler.
- **Matemática no texto.** `<span class="tex">2^{n}-1</span>`. O TeX fica numa linha só, sem tabulação nem quebra. Dentro de template literal, escreva a barra em dobro (`\\frac`, `\\cdot`, `\\text{…}`); `npm test` renderiza cada fórmula com o KaTeX e acusa barra perdida. Em HTML, escreva `<` como `&lt;` e `&` como `&amp;`.
- **Tabela de passos.** `<div class="table-scroll wide"><table class="steps"><caption>…</caption>…</table></div>`. Marque a coluna que forma a resposta com `class="step-key"`, contadores com `class="step-muted"` e a última linha com `class="step-final"`. Logo depois, `<p class="read-order">` explica como ler a tabela (por exemplo, restos de baixo para cima).
- **Conta armada.** `<ol class="calc"><li>passo</li>…<li class="calc-result">resultado</li></ol>`, um passo por linha, sempre com a conferência de volta quando houver.
- **Laboratório.** `<div class="lab" data-lab="bases" data-value="1985" data-from="10" data-to="6"></div>` abre o conversor de bases com esse exemplo; `<div class="lab" data-lab="surface"></div>` abre o laboratório 3D de gradiente.

Nunca copie frases dos PDFs nem os rodapés que identificam o aluno. Escreva a explicação com suas palavras e cite as páginas.

Cada questão possui ID único, fase, competência, nível, enunciado, cinco alternativas distintas, uma correta, justificativa para todas as alternativas e referência de páginas. A lista `bank.chapters['p1-c2']`, por exemplo, aponta para as questões da fase 1, capítulo 2. As referências não dependem do endereço do acervo privado.

Prefira situações que exijam interpretar, calcular, comparar ou rastrear. Evite apenas trocar números para inflar a contagem. Justifique os distratores pelo erro de raciocínio que representam. Não chame uma questão de oficial sem documentação que sustente essa origem.

Antes de compartilhar, execute `npm test`, confira os temas claro/escuro e o celular e exporte para uma pasta nova com `npm run export -- <destino>`. Execute novamente `npm test` dentro da cópia exportada. Nunca inclua respostas salvas do navegador.
