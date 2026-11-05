# Logos na faixa de parceria

## O que muda
A faixa que desliza abaixo do vídeo do Método passa a mostrar as duas marcas em vez de só os nomes:

```text
EM PARCERIA COM  —  [logo Zordan]   ×   Kurihara & Figueiredo / ADVOGADOS ASSOCIADOS   ✦  ...
```

- **Zordan:** a mesma logo do topo do site (hexágono + "ZORDAN ENGENHARIA"), em cor clara.
- **Kurihara & Figueiredo:** a marca do topo do site deles não é uma imagem, é escrita em letra serifada — "Kurihara & Figueiredo" com o "&" destacado e "ADVOGADOS ASSOCIADOS" pequeno embaixo. Vou reproduzir exatamente assim, em cor clara, com o "&" no verde-claro do site (em vez do bronze deles, para manter o verde e branco).
- Continua deslizando, para no modo de menos movimento e não alarga a página no celular.

## Atenção
O site deles se apresenta como "Kurihara & Figueiredo Advogados Associados", não "Grupo". A faixa vai seguir a marca deles; o texto escondido para leitores de tela também.

## Detalhes técnicos
- Em `src/routes/index.tsx`, trocar o conteúdo repetido da faixa por `<Logo />` (com classe para cor/tamanho, como `.nav-logo`) + wordmark Kurihara em spans (`display` serifada + `label-mono` para o subtítulo).
- Ajustar `aria-label` da faixa; conferir 1280px e 375px sem rolagem horizontal.
