# Bibliotecas de terceiros

Os arquivos em `assets/vendor/` acompanham o guia para que tudo funcione offline, sem instalação. Eles não foram modificados. O hash SHA-256 de cada arquivo fica registrado em `scripts/vendor-manifest.mjs` e é conferido por `npm test`.

| Biblioteca | Versão | Arquivos | Licença | Origem |
| --- | --- | --- | --- | --- |
| GSAP | 3.15.0 | `gsap/gsap.min.js` | GSAP Standard 'no charge' License | https://gsap.com/standard-license |
| KaTeX | 0.19.0 | `katex/katex.min.js`, `katex/katex.min.css`, `katex/fonts/*.woff2` | MIT | https://github.com/KaTeX/KaTeX |
| three.js | 0.159.0 | `three/three.min.js` (carregado só no laboratório 3D) | MIT | https://github.com/mrdoob/three.js |

## GSAP 3.15.0

Distribuído pela GreenSock sob a GSAP Standard 'no charge' License, que permite o uso gratuito, inclusive comercial, nos termos publicados em https://gsap.com/standard-license. O cabeçalho original do arquivo foi preservado.

## KaTeX 0.19.0

The MIT License (MIT)

Copyright (c) 2013-2020 Khan Academy and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## three.js 0.159.0

The MIT License

Copyright © 2010-2023 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
