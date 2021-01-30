var apiParametri = {
  streznik: 'http://localhost:' + (process.env.PORT || 3000)
};
if (process.env.NODE_ENV === 'production') {
  apiParametri.streznik = 'https://edugeocache-sp-2020-2021.herokuapp.com';
}
const axios = require('axios').create({
  baseURL: apiParametri.streznik,
  timeout: 5000
});

/* Vrni začetno stran s seznamom lokacij */
const seznam = (req, res) => {
  axios
    .get('/api/lokacije', {
      params: {
        lng: 14.469027,
        lat: 46.050129,
        maxRazdalja: 100
      }
    })
    .then((odgovor) => {
      let sporocilo =
        odgovor.data.length ? null : "V bližini ni najdenih lokacij.";
      odgovor.data.map(lokacija => {
        lokacija.razdalja = formatirajRazdaljo(lokacija.razdalja);
        return lokacija;
      });
      prikaziZacetniSeznam(req, res, odgovor.data, sporocilo);
    })
    .catch(() => {
      prikaziZacetniSeznam(req, res, [], "Napaka API-ja pri iskanju lokacij.");
    });
};

const prikaziZacetniSeznam = (req, res, seznamBliznjihLokacij, sporocilo) => {
  res.render('lokacije-seznam', {
    title: 'EduGeoCache - Poiščite zanimive lokacije blizu vas!',
    glavaStrani: {
      naslov: 'EduGeoCache',
      podnaslov: 'Poiščite zanimive lokacije blizu vas!'
    },
    stranskaOrodnaVrstica: 'Iščete lokacijo za kratkočasenje? EduGeoCache vam pomaga pri iskanju zanimivih lokacij v bližini. Mogoče imate kakšne posebne želje? Naj vam EduGeoCache pomaga pri iskanju bližnjih zanimivih lokacij.',
    lokacije: seznamBliznjihLokacij,
    sporocilo: sporocilo
  });
};

/* Vrni podrobnosti lokacije */
const podrobnostiLokacije = (req, res) => {
  pridobiPodrobnostiLokacije(req, res, (req, res, vsebina) => {
    prikaziPodrobnostiLokacije(req, res, vsebina);
  });
};

const pridobiPodrobnostiLokacije = (req, res, povratniKlic) => {
  axios
    .get('/api/lokacije/' + req.params.idLokacije)
    .then((odgovor) => {
      odgovor.data.koordinate = {
        lng: odgovor.data.koordinate[0],
        lat: odgovor.data.koordinate[1]
      };
      povratniKlic(req, res, odgovor.data);
    })
    .catch((napaka) => {
      prikaziNapako(req, res, napaka);
    });
};

const prikaziPodrobnostiLokacije = (req, res, podrobnostiLokacije) => {
  res.render('lokacija-podrobnosti', {
    title: podrobnostiLokacije.naziv,
    glavaStrani: {
      naslov: podrobnostiLokacije.naziv
    },
    stranskaOrodnaVrstica: {
      kontekst: 'je na EduGeoCache, ker je zanimiva lokacija, ki si jo lahko ogledate, ko ste brez idej za kratek izlet.',
      poziv: 'Če vam je lokacija všeč, ali pa tudi ne, dodajte svoj komentar in s tem pomagajte ostalim uporabnikom pri odločitvi.'
    },
    lokacija: podrobnostiLokacije
  });
};

/* Vrni stran za dodajanje komentarjev */
const dodajKomentar = (req, res) => {
  pridobiPodrobnostiLokacije(req, res, (req, res, vsebina) => {
    prikaziObrazecZaKomentar(req, res, vsebina);
  });
};

const prikaziObrazecZaKomentar = (req, res, {naziv}) => {
  res.render('lokacija-nov-komentar', {
    title: 'Dodaj komentar za ' + naziv,
    glavaStrani: {
      naslov: 'Komentiraj ' + naziv
    },
    napaka: req.query.napaka
  });
};

/* Shrani komentar na strežnik */
const shraniKomentar = (req, res) => {
  const idLokacije = req.params.idLokacije;
  if (!req.body.naziv || !req.body.ocena || !req.body.komentar) {
    res.redirect('/lokacija/' + idLokacije + '/komentar/nov?napaka=vrednost');
  } else {
    axios({
      method: 'post',
      url: '/api/lokacije/' + idLokacije + '/komentarji',
      data: {
        naziv: req.body.naziv,
        ocena: req.body.ocena,
        komentar: req.body.komentar
      }
    }).then(() => {
      res.redirect('/lokacija/' + idLokacije);
    }).catch((napaka) => {
      prikaziNapako(req, res, napaka);
    });
  }
};

const formatirajRazdaljo = (razdalja) => {
  let enota = 'm';
  if (razdalja > 1) {
    razdalja = parseFloat(razdalja).toFixed(1);
    enota = 'km';
  } else {
    razdalja = Math.round(razdalja * 1000);
  }
  return razdalja + ' ' + enota;
};

const prikaziNapako = (req, res, napaka) => {
  let naslov = "Nekaj je šlo narobe!";
  let vsebina = napaka.isAxiosError ? 
    "Napaka pri dostopu do oddaljenega vira preko REST API dostopa!" : 
    undefined;
  vsebina = (
      vsebina != undefined && 
      napaka.response && napaka.response.data["sporočilo"]
    ) ? napaka.response.data["sporočilo"] : vsebina;
  vsebina = (
      vsebina != undefined && 
      napaka.response && napaka.response.data["message"]
    ) ? napaka.response.data["message"] : vsebina;
  vsebina = (vsebina == undefined) ? 
    "Nekaj nekje očitno ne deluje." : vsebina;
  if (
    napaka.response && 
    napaka.response.data["_message"] == "Lokacija validation failed"
  ) {
    res.redirect(
      '/lokacija/' + req.params.idLokacije + 
      '/komentar/nov?napaka=vrednost'
    );
  } else {
    res.render('genericno-besedilo', {
      title: naslov,
      vsebina: vsebina
    });    
  }
};

module.exports = {
  seznam,
  podrobnostiLokacije,
  dodajKomentar,
  shraniKomentar
};