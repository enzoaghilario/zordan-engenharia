import p1 from "@/assets/ig/post-1.jpg";
import p2 from "@/assets/ig/post-2.jpg";
import p3 from "@/assets/ig/post-3.jpg";
import p4 from "@/assets/ig/post-4.jpg";
import p5 from "@/assets/ig/post-5.jpg";
import p6 from "@/assets/ig/post-6.jpg";
import p7 from "@/assets/ig/post-7.jpg";
import p8 from "@/assets/ig/post-8.jpg";
import p9 from "@/assets/ig/post-9.jpg";
import p10 from "@/assets/ig/post-10.jpg";
import p11 from "@/assets/ig/post-11.jpg";
import p12 from "@/assets/ig/post-12.jpg";

export const INSTAGRAM_URL = "https://www.instagram.com/zordanengenharia/";
const ig = (path: string) => `https://www.instagram.com/${path}`;

export type Post = { img: string; title: string; tag: string; date: string; url: string; video?: boolean };

/** Publicações reais do perfil @zordanengenharia */
export const obras: Post[] = [
  { img: p1, title: "Terraplenagem e base de vias", tag: "Infraestrutura", date: "19 Ago 2026", url: ig("zordanengenharia/reel/DcPKDbBBYMj/"), video: true },
  { img: p2, title: "Compactação de loteamento", tag: "Urbanização", date: "05 Ago 2026", url: ig("zordanengenharia/reel/DbqzQOOJu7A/"), video: true },
  { img: p6, title: "Residência em acabamento", tag: "Residencial", date: "22 Jan 2026", url: ig("zordanengenharia/reel/DT0oe-mDh0K/"), video: true },
  { img: p11, title: "Fundação e alvenaria estrutural", tag: "Execução", date: "23 Dez 2025", url: ig("zordanengenharia/reel/DSoARpmDloN/"), video: true },
  { img: p7, title: "Nossa cidade, vista do alto", tag: "Território", date: "14 Jan 2026", url: ig("zordanengenharia/reel/DTghj79DvNI/"), video: true },
  { img: p8, title: "Onde construímos o futuro", tag: "Território", date: "06 Jan 2026", url: ig("zordanengenharia/reel/DTL59lgjiNJ/"), video: true },
];

export const patrocinio: Post[] = [
  { img: p3, title: "Dani Mola em quadra", tag: "Beach Tennis", date: "30 Mai 2026", url: ig("daniel_mola18/p/DY-G72bjrlZ/") },
  { img: p4, title: "Marca que veste campeões", tag: "Beach Tennis", date: "26 Mar 2026", url: ig("daniel_mola18/p/DWXhIo4Dt_Y/") },
  { img: p5, title: "Rotina de atleta", tag: "Beach Tennis", date: "28 Jan 2026", url: ig("daniel_mola18/reel/DUEeQjkD4YH/"), video: true },
  { img: p12, title: "Parceria Zordan × Dani Mola", tag: "Beach Tennis", date: "14 Dez 2025", url: ig("zordanengenharia/reel/DSQg3AAATrx/"), video: true },
];

export const datas: Post[] = [
  { img: p9, title: "Feliz 2026 — novas bases, sonhos bem construídos", tag: "Institucional", date: "31 Dez 2025", url: INSTAGRAM_URL },
  { img: p10, title: "Feliz Natal — cada sonho construído", tag: "Institucional", date: "24 Dez 2025", url: INSTAGRAM_URL },
];
