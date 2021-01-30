const passport = require('passport');
const mongoose = require('mongoose');
const Uporabnik = mongoose.model('Uporabnik');

const registracija = (req, res) => {
  if (!req.body.ime || !req.body.elektronskiNaslov || !req.body.geslo) {
    return res.status(400).json({"sporočilo": "Zahtevani so vsi podatki"});
  } else if (!(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(req.body.elektronskiNaslov))) {
    return res.status(400).json({"sporočilo": "Elektronski naslov ni ustrezen!"});
  }
  const uporabnik = new Uporabnik();
  uporabnik.ime = req.body.ime;
  uporabnik.elektronskiNaslov = req.body.elektronskiNaslov;
  uporabnik.nastaviGeslo(req.body.geslo);
  uporabnik.save(napaka => {
    if (napaka) {
      if (napaka.name == "MongoError" && napaka.code == 11000) {
        res.status(409).json({
          "sporočilo": "Uporabnik s tem elektronskim naslovom je že registriran"
        });
      } else {
        res.status(500).json(napaka);
      }
    } else {
      res.status(200).json({"žeton": uporabnik.generirajJwt()});
    }
  });
};

const prijava = (req, res) => {
  if (!req.body.elektronskiNaslov || !req.body.geslo) {
    return res.status(400).json({"sporočilo": "Zahtevani so vsi podatki"});
  }
  passport.authenticate('local', (napaka, uporabnik, informacije) => {
    if (napaka)
      return res.status(500).json(napaka);
    if (uporabnik) {
      res.status(200).json({"žeton": uporabnik.generirajJwt()});
    } else {
      res.status(401).json(informacije);
    }
  })(req, res);
};

const crniSeznam = (req, res) => {
  let mail = req.payload.elektronskiNaslov
  let iat = req.payload.iat

  Uporabnik.findOne({elektronskiNaslov: mail}, (napaka, uporabnik) => {
    if (napaka) {
      res.status(500).json(napaka)
    }
    if (uporabnik) {
      uporabnik.crniSeznam.push(iat)
      uporabnik.save()
      return res.status(201).json("Uspesno")
    }
    else {
      return res.status(404).json("Ni uporabnika")
    }
  });
}

module.exports = {
  registracija,
  prijava, 
  crniSeznam
};