# Design system observado — FIAP Faculdade

Registro do que a FIAP Faculdade publica na web. Coletado em 15 de outubro de 2026. Serve a este repositório como referência visual. Não é um manual de marca entregue pela instituição e não autoriza uso comercial da marca.

O sistema de produto deste repositório continua em `DESIGN.md` (Computational Build, guia de Git). Aquele arquivo empresta o magenta e o logo. Este arquivo descreve a superfície institucional.

## Fontes

| Fonte | O que entrou | Limite |
|---|---|---|
| [Graduação FIAP](https://www.fiap.com.br/graduacao/) | HTML, 16 folhas em `/graduacao/_next/static/css/`, SVGs em `/graduacao/svg/` | Tokens e padrões de interface. Não é um guideline escrito. |
| [fiap.com.br/svg/fiap.svg](https://www.fiap.com.br/svg/fiap.svg) | Wordmark histórico já copiado no repositório | SHA-256 `9CE856F1EE4A57AB08C441044BE74843CB6E26CED9BE5DF5756B41C630A49E92` |
| [Instagram @fiapoficial](https://www.instagram.com/fiapoficial/) | Bio e bordões repetidos nas legendas | Imagens dos posts não foram baixadas. |
| [Facebook](https://www.facebook.com/fiapoficial), [LinkedIn school](https://www.linkedin.com/school/fiap/), [LinkedIn company](https://www.linkedin.com/company/fiap/), [X @fiap](https://twitter.com/fiap), [YouTube /tvfiap](https://www.youtube.com/tvfiap/) | Presença oficial ligada no rodapé da Graduação | As páginas de perfil não entregaram paleta adicional. |
| [Brandfetch fiap.com.br](https://brandfetch.com/fiap.com.br) | Nenhuma medida | A página respondeu 403 para leitura automática. Os tokens abaixo vêm do CSS oficial, que é mais completo do que o cartão público do Brandfetch. |

## Marca

- Nome público: FIAP. Razão institucional publicada no site: FIAP Centro Universitário, mantida no ecossistema do [Grupo Alun](https://alun.com.br/) junto de Alura, PM3 e StartSe.
- Posicionamento na Graduação: faculdade de tecnologia, inovação e empreendedorismo. A página diz "a melhor faculdade do mundo tech" e "tech com alma".
- Bordão recorrente no site e no Instagram: **Let's rock the future.**
- Bio do Instagram em outubro de 2026: "A melhor faculdade de tecnologia do país e referência em IA."
- Tom: segunda pessoa, frases curtas, português com nomes de produto em inglês (Global Solution, Startup One, NEXT, Tech Test, hands-on). Rótulos e muitos títulos saem em caixa alta.
- No Instagram o perfil usa emoji (🤘 🖤 🤖). No site institucional o emoji não é o recurso de interface.

## Logo

Três desenhos públicos, a mesma geometria de wordmark.

| Variante | URL | Caixa | Preenchimento |
|---|---|---|---|
| Wordmark histórico | `https://www.fiap.com.br/svg/fiap.svg` | `100 × 28` | `#ed145b` |
| Wordmark da Graduação | `https://www.fiap.com.br/graduacao/svg/logo-fiap-magenta.svg` | `228 × 62` | `#ed145b` |
| Wordmark sobre fundo escuro alternativo | `https://www.fiap.com.br/graduacao/svg/logo-fiap-gray.svg` | `120 × 33` | `#acc1cc` |

O arquivo `logo-graduacao.svg` é outro lockup: a palavra "graduação" em `#acc1cc` com uma barra magenta. O rodapé repete o wordmark magenta com um traço de contorno de `0.174`.

Não há, nas fontes lidas, regra publicada de área de respiro, tamanho mínimo ou fundos proibidos. A prévia conserva a proporção do vetor e não recolore o magenta oficial para outro hex.

O binário já guardado em `1st semester/study-guides/git-github/assets/fiap.svg` é o wordmark histórico, byte a byte.

## Cor

Os nomes abaixo são os custom properties do CSS da Graduação. A contagem é o número de referências a cada token nos 16 arquivos. Cor de marca é a que pinta o logo e a ação. As outras existem no código.

### Identidade

| Token | Hex | RGB | Papel observado | Usos |
|---|---|---|---|---|
| `--color-magenta` | `#ed145b` | 237, 20, 91 | Logo, hover e fundo de botão, fio de link ativo, sinal | 230 |
| `--color-white` | `#ffffff` | 255, 255, 255 | Título e texto de alto contraste | base |
| `--color-black` | `#000000` | 0, 0, 0 | Texto sobre botão magenta e centro do fundo | base |
| `--color-gray-slate` | `#75838b` | 117, 131, 139 | Texto corrido, apoio | 186 |
| `--color-blue-pastel` | `#acc1cc` | 172, 193, 204 | Wordmark alternativo, links secundários | 66 |

Alfas publicados do magenta: 25% `--color-magenta-25`, 40% `--color-magenta-half`, 85% `--color-magenta-85`.

`#ed145b` contra branco ou contra o canvas escuro fica abaixo de 4,5:1. No site, o botão magenta carrega texto preto, não branco. Texto pequeno permanece branco ou slate. O magenta fica em massa, fio, fundo ou logo.

### Canvas

O `body` da Graduação usa Gotham sobre este gradiente:

```css
background: linear-gradient(90deg, #343a3c -47.96%, #000000 50.16%, #343a3c 146.41%);
background-color: #000000;
```

`--color-background` é `#343a3c`. À volta dele há uma escada de pretos nomeados. Dois tokens repetem o nome com hex diferente: `--color-black-eerie` aparece como `#191c1d` e como `#1b1d20`.

| Token | Hex | Uso provável |
|---|---|---|
| `--color-black-chinese` | `#131516` | superfície mais funda |
| `--color-black-eerie` | `#191c1d` / `#1b1d20` | superfície |
| `--color-black-erie` | `#1a1d20` | superfície |
| `--color-black-erie-dark` | `#1a1a1a` | superfície |
| `--color-black-jungle` | `#1c2022` | superfície |
| `--color-blackboard` | `#1c1c1c` | superfície |
| `--color-carbon` | `#202325` | superfície |
| `--color-stygian` | `#1d2123` | superfície |
| `--color-dark-gunmetal` | `#232729` | superfície |
| `--color-deep-onyx` | `#292e31` | superfície |
| `--color-charleston-green` | `#2a2a2a` | linha e bloco |
| `--color-outer-space` | `#424b4f` | cinza de estrutura |
| `--color-nickel` | `#667279` | rótulo |
| `--color-storm` | `#6e7d85` | texto auxiliar |
| `--color-grey-cadet` | `#91a3ad` | texto auxiliar |
| `--color-gray-cadet-blue` | `#a6bac6` | texto claro sobre preto |
| `--color-gray-dark` | `#aaaaaa` | texto |
| `--color-silver-coin` | `#bbbbbb` | texto |
| `--color-white-tech` | `#f5f5f5` | branco quebrado |
| `--color-gray-water` | `#cfe9f7` | azul muito claro |

### Tokens nomeados com uso baixo

Presentes no CSS. Não entram como segunda cor de marca enquanto o uso continuar pontual.

| Token | Hex | Usos |
|---|---|---|
| `--color-ruby` | `#ea1d5d` | 8 |
| `--color-orange-red` | `#fd7223` | 7 |
| `--color-olive` | `#887e00` | 5 |
| `--color-deep-jungle-green` | `#00464d` | 4 |
| `--color-vivid-yellow` | `#fcea10` | 2 |
| `--color-green-malachite` | `#4eec85` | 2 |
| `--color-fluorescent-blue` | `#25dbef` | 2 |
| `--color-salle-green` | `#0c7b3a` | 2 |

## Tipografia

Quatro famílias declaradas em `@font-face`, servidas pelo próprio domínio. Os arquivos são comerciais. Este repositório não copia os `.woff2`.

| Família CSS | Token | Pesos no `@font-face` | Onde aparece |
|---|---|---|---|
| Gotham HTF | `--font-gotham` | 100 Thin, 200 XLight, 300 Light, 400 Book, 500 Medium, 600 Bold, 700 Black, 800 Ultra | `body`, navegação, botões e rótulos. 181 referências. O título gigante sai em 200 ou 300, não em preto pesado. |
| Roboto | `--font-roboto` | 200, 300, 400, 500, 700, 900, com itálico | Texto longo, valores numéricos, notas. Pesos 200 e 300 são frequentes. 113 referências. |
| Flecha M | `--font-flecha-m` | 300 Light, 400 Regular | Títulos de destaque em branco, poucos blocos. 5 referências. |
| FK Grotesk | `--font-fk-grotesk` | 200 Thin, 400 Regular, 500 Medium | Botão e texto pontuais. 4 referências. |

O mapeamento de Gotham no CSS não segue a tabela usual: o arquivo `GothamHTF-Bold` está em `font-weight: 600` e `GothamHTF-Black` em `700`. No miolo das folhas, o peso 300 aparece 158 vezes, o 400 aparece 154 e o 500 aparece 138. O 700 aparece 8 vezes.

O título de vitrine é Gotham Light, caixa alta, entrelinha perto de 1 e tracking levemente negativo. Vários desses títulos usam `#acc1cc`, não branco. Letreiros e a faixa "Tecnologia / Inovação / Hands-on" saem vazados: preenchimento transparente e `-webkit-text-stroke` de cerca de `0.1rem` em branco ou slate. Há também um stroke mais largo, `0.4rem`, com opacidade 0.3.

Escala fluida. O `html` não usa `16px`. A raiz muda por faixa, em `vw`:

| Faixa observada | `font-size` da raiz |
|---|---|
| uma das folhas | `0.390625vw` |
| outra | `0.78125vw` |
| outra | `1.015625vw` |

Em `0.78125vw`, uma viewport de 1280px faz `1rem = 10px`. Os tamanhos mais repetidos no CSS, nessa leitura, ficam assim:

| Recorrência | `font-size` | Leitura em 1280px |
|---|---|---|
| alta | `1.4rem`–`2rem` | 14–20px, texto e UI |
| alta | `2.2rem`–`3.4rem` | 22–34px, subtítulo |
| média | `4rem`–`5rem` | 40–50px, título |
| presente | `8rem` | 80px, display |

Tracking recorrente: `-0.03em`, `-0.06em`, `-0.01em`, e alguns rótulos em tracking positivo. `text-transform: uppercase` aparece 208 vezes. Entrelinhas de corpo em torno de `2.4rem`–`2.8rem` na mesma escala de 10px.

A prévia HTML usa Segoe UI no lugar de Gotham, Roboto e Flecha. O desenho da página mostra cor, caixa e hierarquia. Não mostra o desenho das fontes licenciadas.

## Forma, layout e breakpoints

- Cantos quase retos. `border-radius: 0` convive com poucos raios grandes (`20px`, `3.6rem`) e com `50%` / `100%` em controles circulares.
- Ação principal: fundo `#ed145b`, texto `#000000`, Gotham em caixa alta. O hover de vários botões também vai para o magenta.
- Links ativos ganham fio magenta de cerca de `1px` (`0.1rem` na escala deles).
- Larguras de mídia mais repetidas: `1280px` (907 regras), `600px` (743), `1280px` em retrato (421), depois `1024px`, `768px`, `1440px` e `1920px`.
- O site é uma peça de marketing de viewport cheia, com títulos enormes e muito ar. Não é um dashboard de cards iguais.

## Voz, em frases curtas que o site e o Instagram repetem

- "Let's rock the future."
- "Sua vida tech começa aqui."
- "Somos tech com alma."
- "Aprender fazendo é o nosso método."
- "Você na melhor faculdade do mundo tech."

Para material deste repositório, a voz de produto já definida em `PRODUCT.md` continua valendo: direta, didática, sem insinuar comunicação oficial. Este arquivo só registra como a faculdade fala em público.

## Redes ligadas pelo site

- Instagram: [instagram.com/fiapoficial](https://www.instagram.com/fiapoficial/)
- Facebook: [facebook.com/fiapoficial](https://www.facebook.com/fiapoficial)
- LinkedIn: [linkedin.com/school/fiap](https://www.linkedin.com/school/fiap/) e [linkedin.com/company/fiap](https://www.linkedin.com/company/fiap/)
- X: [twitter.com/fiap](https://twitter.com/fiap)
- YouTube: [youtube.com/tvfiap](https://www.youtube.com/tvfiap/)
- Grupo: [alun.com.br](https://alun.com.br/)

## Relação com o Computational Build

| | Este arquivo | `DESIGN.md` |
|---|---|---|
| Escopo | Identidade observada da faculdade | Guia de Git deste repositório |
| Magenta | `#ed145b`, cor de marca | Único sinal expressivo do guia |
| Fundo | Gradiente `#343a3c` → preto → `#343a3c` | Carbono `#0e0f10` de laboratório |
| Tipo | Gotham HTF, Roboto, Flecha M, FK Grotesk | Segoe UI Variable, Aptos, Cascadia, de propósito, sem copiar Gotham |
| Logo | Três SVGs oficiais | O wordmark histórico já vendorizado |

Quando os dois discordam, a interface do guia segue `DESIGN.md`. Este arquivo evita que o guia seja confundido com o manual da faculdade.

## Lacunas

- Não há manual público de marca com área de proteção, misuses e tom gráfico fechado.
- O Brandfetch de `fiap.com.br` não pôde ser lido daqui.
- As fotos e os carrosséis do Instagram não foram arquivados.
- O uso de amarelo, verde, ciano e laranja não foi mapeado componente a componente. Ficam como tokens de baixo uso.
- Fontes comerciais não entram no repositório.
