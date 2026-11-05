# Faixa de parceria — Zordan × Grupo Kurihara e Figueiredo

## O que muda
Entre o vídeo da seção Método e o título "[03] — Método" entra uma faixa verde-escura que desliza sozinha na horizontal, de ponta a ponta da tela, com linhas finas em cima e embaixo (mesmo estilo das divisórias do site).

Conteúdo repetido em loop:
```text
EM PARCERIA COM  —  [logo Kurihara e Figueiredo]  GRUPO KURIHARA E FIGUEIREDO  ✦  ZORDAN ENGENHARIA  ✦ ...
```
- "Em parceria com" em letras pequenas espaçadas; nomes em letra serifada itálica, cor clara.
- Logo do grupo em branco/clara para combinar com o fundo verde.
- Sem cantos arredondados nem caixas.
- Quem prefere menos movimento vê a faixa parada.
- No celular: letras menores e a faixa continua sem alargar a página.

## Depende de você
- Enviar a logo do Grupo Kurihara e Figueiredo (de preferência PNG com fundo transparente ou SVG). Até lá, a faixa mostra só o nome.

## Detalhes técnicos
- Reaproveitar o utilitário `animate-marquee` existente (conteúdo duplicado, translate -50%), com `overflow-hidden` e `w-full min-w-0`.
- Inserir em `src/routes/index.tsx` logo após `<MetodoVideo />`, antes do bloco de rótulo/título.
- Logo como arquivo em `public/` (ou asset), com `alt` descritivo; `prefers-reduced-motion` desliga a animação.
- Conferir em 1280px e 375px sem rolagem horizontal; salvar a parceria na memória do projeto.
