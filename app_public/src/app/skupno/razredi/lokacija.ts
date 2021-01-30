class DelovniCas {
  dnevi: string;
  odprtje: string;
  zaprtje: string;
  zaprto: boolean;
}

export class Komentar {
  naziv: string;
  ocena: number;
  komentar: string;
}

export class Lokacija {
  _id: string;
  naziv: string;
  naslov: string;
  ocena: number;
  lastnosti: string[];
  razdalja: number;
  koordinate: number[];
  delovniCas: DelovniCas;
  komentarji: Komentar[];
}