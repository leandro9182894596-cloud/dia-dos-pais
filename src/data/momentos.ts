import foto01 from "../assets/foto-01.jpg.asset.json";
import foto02 from "../assets/foto-02.jpg.asset.json";
import foto03 from "../assets/foto-03.jpg.asset.json";
import foto04 from "../assets/foto-04.jpg.asset.json";
import foto05 from "../assets/foto-05.jpg.asset.json";
import foto06 from "../assets/foto-06.jpg.asset.json";
import foto07 from "../assets/foto-07.jpg.asset.json";
import fotoFamilia from "../assets/foto-familia.jpg.asset.json";

export interface Momento {
  src: string;
  alt: string;
  caption: string;
  mensagem: string;
}

export const MOMENTOS: Momento[] = [
  {
    src: foto03.url,
    alt: "Leandro e Wanda juntinhos",
    caption: "Nosso cantinho, nosso mundo",
    mensagem:
      "Wanda, foi num momento simples como esse que eu entendi: onde você está, ali é o meu lugar.",
  },
  {
    src: foto05.url,
    alt: "Leandro e Wanda em uma festa à noite",
    caption: "Noites que viraram lembranças",
    mensagem:
      "Com você até a noite mais comum vira festa. Eu amo viver o mundo do seu lado.",
  },
  {
    src: foto02.url,
    alt: "Leandro e Wanda no espelho",
    caption: "Sempre juntos, em cada reflexo",
    mensagem:
      "Em todo reflexo eu vejo a mesma coisa: nós dois, escolhendo um ao outro de novo.",
  },
  {
    src: foto07.url,
    alt: "Selfie de Leandro e Wanda sorrindo",
    caption: "Sorrisos que dizem tudo",
    mensagem:
      "Seu sorriso é o meu bom dia favorito. Ele conserta qualquer dia difícil.",
  },
  {
    src: foto01.url,
    alt: "Leandro e Wanda ao ar livre",
    caption: "Passeios simples, felicidade enorme",
    mensagem:
      "Não precisa ser longe nem caro. Basta ser com você que já é o melhor lugar do mundo.",
  },
  {
    src: foto04.url,
    alt: "Leandro abraçando Wanda",
    caption: "Abraço que é o meu lugar favorito",
    mensagem:
      "Seu abraço é minha casa. É onde o meu coração descansa e sabe que chegou.",
  },
  {
    src: foto06.url,
    alt: "Leandro e Wanda em casa",
    caption: "O amor mora nos dias comuns",
    mensagem:
      "Amar você é fácil nos dias bonitos e é escolha firme nos dias difíceis. Eu escolho sempre.",
  },
  {
    src: fotoFamilia.url,
    alt: "Foto da família reunida",
    caption: "A família que o nosso amor abraça",
    mensagem:
      "Nosso amor não é só nosso: ele abraça a nossa família. Obrigado por ser o coração de tudo isso.",
  },
];
