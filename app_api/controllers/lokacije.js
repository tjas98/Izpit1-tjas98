const mongoose = require('mongoose');
const Lokacija = mongoose.model('Lokacija');

const lokacijeSeznamPoRazdalji = (req, res) => {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const razdalja = parseFloat(req.query.maxRazdalja);

  if (!lng || !lat) {
    return res.status(400).json({
      "sporočilo": "Parametra lng in lat sta obvezna."
    });
  }

  Lokacija
    .aggregate([{
      "$geoNear": {
        "near": {
          "type": "Point",
          "coordinates": [lng, lat]
        },
        "distanceField": "razdalja",
        "spherical": true,
        "maxDistance": (isNaN(razdalja) ? 20 : razdalja) * 1000
      }
    }])
    .limit(10)
    .exec((napaka, lokacije) => {
      if (napaka) {
        res.status(500).json(napaka);
      } else {
        res.status(200).json(
          lokacije.map(lokacija => {
            return {
              "_id": lokacija._id,
              "naslov": lokacija.naslov,
              "naziv": lokacija.naziv,
              "ocena": lokacija.ocena,
              "lastnosti": lokacija.lastnosti,
              "razdalja": lokacija.razdalja / 1000
            };
          })
        );
      }
    });
};

const lokacijeKreiraj = (req, res) => {
  Lokacija.create({
    naziv: req.body.naziv,
    naslov: req.body.naslov,
    lastnosti: req.body.lastnosti.split(","),
    koordinate: [
      parseFloat(req.body.lng),
      parseFloat(req.body.lat)
    ],
    delovniCas: [{
      dnevi: req.body.dnevi1,
      odprtje: req.body.odprtje1,
      zaprtje: req.body.zaprtje1,
      zaprto: req.body.zaprto1
    }, {
      dnevi: req.body.dnevi2,
      odprtje: req.body.odprtje2,
      zaprtje: req.body.zaprtje2,
      zaprto: req.body.zaprto2
    }]
  }, (napaka, lokacija) => {
    if (napaka) {
      res.status(400).json(napaka);
    } else {
      res.status(201).json(lokacija);
    }
  });
};

const lokacijePreberiIzbrano = (req, res) => {
  Lokacija
    .findById(req.params.idLokacije)
    .exec((napaka, lokacija) => {
      if (!lokacija) {
        return res.status(404).json({
          "sporočilo": 
            "Ne najdem lokacije s podanim enoličnim identifikatorjem idLokacije."
        });
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      res.status(200).json(lokacija);
    });
};

const lokacijePosodobiIzbrano = (req, res) => {
  if (!req.params.idLokacije) {
    return res.status(404).json({
      "sporočilo":
        "Ne najdem lokacije, idLokacije je obvezen parameter."
    });
  }
  Lokacija
    .findById(req.params.idLokacije)
    .select('-komentarji -ocena')
    .exec((napaka, lokacija) => {
      if (!lokacija) {
        return res.status(404).json({"sporočilo": "Ne najdem lokacije!"});
      } else if (napaka) {
        return res.status(500).json(napaka);
      }
      lokacija.naziv = req.body.naziv;
      lokacija.naslov = req.body.naslov;
      lokacija.lastnosti = req.body.lastnosti.split(",");
      lokacija.koordinate = [
        parseFloat(req.body.lng),
        parseFloat(req.body.lat)
      ];
      lokacija.delovniCas = [{
        dnevi: req.body.dnevi1,
        odprtje: req.body.odprtje1,
        zaprtje: req.body.zaprtje1,
        zaprto: req.body.zaprto1
      }, {
        dnevi: req.body.dnevi2,
        odprtje: req.body.odprtje2,
        zaprtje: req.body.zaprtje2,
        zaprto: req.body.zaprto2
      }];
      lokacija.save((napaka, lokacija) => {
        if (napaka) {
          res.status(404).json(napaka);
        } else {
          res.status(200).json(lokacija);
        }
      });
    });
};

const lokacijeIzbrisiIzbrano = (req, res) => {
  const {idLokacije} = req.params;
  if (idLokacije) {
    Lokacija
      .findByIdAndRemove(idLokacije)
      .exec((napaka) => {
        if (napaka) {
          return res.status(500).json(napaka);
        }
        res.status(204).json(null);
      });
  } else {
    res.status(404).json({
      "sporočilo":
        "Ne najdem lokacije, idLokacije je obvezen parameter."
    });
  }
};

module.exports = {
  lokacijeSeznamPoRazdalji,
  lokacijeKreiraj,
  lokacijePreberiIzbrano,
  lokacijePosodobiIzbrano,
  lokacijeIzbrisiIzbrano
};