# Privacidade e escopo de publicação

O projeto contém conteúdo autoral, referências bibliográficas e o SVG de marca. Os PDFs privados, marcas d’água, dados de colegas, arquivos de ambiente, chaves, histórico Git e configuração da máquina não entram na exportação.

A identificação pessoal visível fica no rodapé: nome abreviado, RM autorizado e perfil público do autor. Não há formulário de identificação, coleta de respostas, analytics ou sincronização. Os exemplos são fictícios e didáticos.

O navegador persiste preferências e progresso por semestre em `fiap.csRevisa.<semestre>.v1`. O primeiro semestre pode importar o estado legado `fiap.firstSemesterExam.v2` quando ainda não há estado novo. O original não é removido. Não se usa `localStorage.clear()`.

Dados restaurados são validados: IDs de questões, ordens sem duplicatas, alternativas, capítulos, notas calculadas e limites. Não se confia em uma nota salva nem se interpreta conteúdo do armazenamento como HTML. As alternativas e buscas são escapadas na renderização; o HTML dos capítulos é conteúdo estático revisado.

O simulador é uma ferramenta de estudo offline. Seu gabarito integra o código distribuído e o armazenamento local pode ser alterado pelo dono do navegador. O limite de tentativas é pedagógico, não um controle antifraude.

O servidor opcional liga apenas em `127.0.0.1` e serve uma lista explícita de arquivos de runtime; não expõe `.git`, diretórios, documentação ou arquivos da máquina. A página bloqueia conexões de aplicação por CSP, usa assets locais e aplica `noopener noreferrer` aos links externos.

As bibliotecas de terceiros (GSAP, KaTeX e three.js) ficam em `assets/vendor/`, sem modificação. O hash SHA-256 de cada arquivo está em `scripts/vendor-manifest.mjs`, conferido por `npm test`, e as licenças estão em `assets/vendor/LICENSES.md`. As varreduras de privacidade (rede, e-mail, caminhos locais e formatos de segredo) valem para o código próprio; os arquivos de terceiros ficam cobertos pelo hash, porque o KaTeX tem um método interno chamado `fetch` e o cabeçalho do GSAP traz o contato do autor. O three.js só é carregado quando o laboratório 3D é aberto. A CSP continua com `connect-src 'none'`, `script-src 'self'` e `font-src 'self'`: nenhuma biblioteca abre conexão.

Os textos dos PDFs usados para conferir páginas não acompanham o projeto. Nenhum trecho dos rodapés que identificam o aluno entra no conteúdo; o verificador procura e-mails e o RM fora do rodapé autorizado.

O exportador usa uma lista permitida, rejeita links simbólicos e destinos existentes. O verificador procura formatos comuns de tokens, material de chaves, e-mails, CPF e caminhos locais; relata apenas arquivo/categoria, sem repetir eventuais valores. Isso não equivale a uma auditoria da conta ou da máquina inteira.
