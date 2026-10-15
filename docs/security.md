# Privacidade e escopo de publicação

O projeto contém conteúdo autoral, referências bibliográficas e o SVG de marca. Os PDFs privados, marcas d’água, dados de colegas, arquivos de ambiente, chaves, histórico Git e configuração da máquina não entram na exportação.

A identificação pessoal visível fica no rodapé: nome abreviado, RM autorizado e perfil público do autor. Não há formulário de identificação, coleta de respostas, analytics ou sincronização. Os exemplos são fictícios e didáticos.

O navegador persiste preferências e progresso por semestre em `fiap.csRevisa.<semestre>.v1`. O primeiro semestre pode importar o estado legado `fiap.firstSemesterExam.v2` quando ainda não há estado novo. O original não é removido. Não se usa `localStorage.clear()`.

Dados restaurados são validados: IDs de questões, ordens sem duplicatas, alternativas, capítulos, notas calculadas e limites. Não se confia em uma nota salva nem se interpreta conteúdo do armazenamento como HTML. As alternativas e buscas são escapadas na renderização; o HTML dos capítulos é conteúdo estático revisado.

O simulador é uma ferramenta de estudo offline. Seu gabarito integra o código distribuído e o armazenamento local pode ser alterado pelo dono do navegador. O limite de tentativas é pedagógico, não um controle antifraude.

O servidor opcional liga apenas em `127.0.0.1` e serve uma lista explícita de arquivos de runtime; não expõe `.git`, diretórios, documentação ou arquivos da máquina. A página bloqueia conexões de aplicação por CSP, usa assets locais e aplica `noopener noreferrer` aos links externos.

O exportador usa uma lista permitida, rejeita links simbólicos e destinos existentes. O verificador procura formatos comuns de tokens, material de chaves, e-mails, CPF e caminhos locais; relata apenas arquivo/categoria, sem repetir eventuais valores. Isso não equivale a uma auditoria da conta ou da máquina inteira.
