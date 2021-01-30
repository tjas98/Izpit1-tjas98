# Spletno programiranje 2020/2021


## 1. rok pisnega izpita


### Vzpostavitev okolja


Vsak študent ima na voljo svoj lasten repozitorij, v katerega neposredno rešuje nalogo – gre za **dopolnitev obstoječe aplikacije EduGeoCache**, ki smo jo razvijali na predavanjih. Najprej si na svoj računalnik prenesite vsebino oddaljenega repozitorija z naslednjimi ukazi:

```
$ git clone https://github.com/sp-2020-2021/izpit1-{github-uporabniško-ime}
$ cd izpit1-{github-uporabniško-ime}
```

Aplikacija EduGeoCache za svoje delovanje potrebuje **podatkovno bazo MongoDB**. Če v sistemu podatkovne baze še nimate nameščene, jo namestite in poženite v skladu z navodilu [predavanja **P3.2**](https://teaching.lavbic.net/SP/2020-2021/MongoDB-Mongoose-REST.html#povezovanje-express-aplikacije-in-mongodb-z-mongoose).

Nato poskrbite za **namestitev** potrebnih **Node.js** in **Angular knjižnic**:

```
$ npm install
$ cd app_public
$ npm install
```

Nato poskrbite za **uvoz testnih podatkov** v podatkovno bazo MongoDB:

Če uporabljate **podatkovno bazo v okolju Docker**, uporabite naslednje ukaze:

```
$ cd ..
$ npm run lokacije-uvoz
$ npm run uporabniki-uvoz
```

Če uporabljate **lokalno nameščeno podatkovno bazo**, uporabite naslednje ukaze:

```
$ cd ..
$ mongoimport --db EduGeoCache --collection Lokacije --mode upsert --upsertFields naziv --jsonArray --file ./app_api/models/testni-podatki.json; mongo EduGeoCache --eval 'db.Lokacije.find().forEach(function(dokument) { for (var i = 0; i < dokument.komentarji.length; i++) { dokument.komentarji[i]._id = ObjectId() } db.Lokacije.update({ \"_id\" : dokument._id }, dokument) })'
$ mongoimport --db EduGeoCache --collection Uporabniki --mode upsert --upsertFields elektronskiNaslov --jsonArray --file ./app_api/models/testni-uporabniki.json
```

Sedaj lahko **poženete REST API strežnik** in preverite, če je npr. dokumentacija REST API metod na voljo na spletnem naslovu http://localhost:3000/api/docs.

```
$ nodemon
```

Prav tako lahko **poženete Angular razvojni strežnik** in preverite delovanje aplikacije na spletnem naslovu http://localhost:4200/.

```
$ cd app_public
$ ng serve
```


### Navodila naloge


**Navodila naloge** so v času trajanja izpita na voljo v okviru [naloge na spletni učilnici](https://ucilnica.fri.uni-lj.si/mod/quiz/view.php?id=41585).