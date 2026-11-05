# Logos na faixa de parceria

## O que muda
A faixa que desliza abaixo do vídeo do Método vai mostrar as duas marcas, e não só os nomes escritos:

```text
EM PARCERIA COM  —  [logo Zordan]   ×   Grupo Kurihara & Figueiredo   ✦  ...
```

- **Zordan:** a mesma logo do topo do site (o hexágono com "ZORDAN ENGENHARIA"), em cor clara.
- **Kurihara:** o topo do site deles não usa uma imagem de logo, e sim o nome escrito em letra serifada com o "&" destacado. Vou repetir esse estilo com o texto "Grupo Kurihara & Figueiredo". O "&" fica no verde-claro do nosso site, no lugar do bronze deles. A frase "Advogados Associados" não vai aparecer.
- A faixa continua deslizando, fica parada para quem prefere menos movimento e não deixa a página mais larga no celular.

## Detalhes técnicos
- Em `src/routes/index.tsx`, trocar o conteúdo que se repete na faixa por `<Logo />` em cor clara e pela marca Kurihara montada em spans (`display` serifada e itálica, "&" em `text-accent`).
- O `aria-label` diz "Zordan Engenharia em parceria com o Grupo Kurihara e Figueiredo".
- Conferir em 1280px e 375px que a página não rola para o lado; salvar o nome da parceria na memória.
