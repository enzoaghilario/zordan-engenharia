# Método: história da Zordan

- Substituir somente a terceira cena pelo melhor trecho de 5,5 segundos do take enviado; preservar as cinco outras cenas, transições de 1 segundo e pôster.
- Gerar versões sem áudio em 1080p e 720p, próximas de 16 MB e 5 MB.
- Exibir as seis frases fornecidas sobre o vídeo, sincronizadas com as cenas; destacar o fechamento em duas linhas.
- Ao terminar, mostrar o fundo verde-escuro e a logo por cerca de quatro segundos, desaparecer suavemente e reiniciar a sequência.
- Mover o rótulo e o título para abaixo do vídeo, antes dos quatro passos; preservar o restante da página.
- Conferir o ciclo completo no computador e em celular de 375px, depois solicitar a publicação.

## Detalhes técnicos
- Composição atual: 31,4 segundos; mudanças de frase no ponto médio das transições: 5s, 9,5s, 14s, 18,5s e 23s.
- Frases em HTML/React, acompanhando `currentTime`, inclusive ao reiniciar ou avançar o vídeo.
- Preservar carregamento por IntersectionObserver e escolha de arquivo por largura da tela.
- Remover loop nativo; controlar a pausa final e reinício com limpeza dos temporizadores.
- Respeitar prefers-reduced-motion: sem movimento, blur ou fades.
- Testar os limites de sincronização e os quatro segundos da logo.