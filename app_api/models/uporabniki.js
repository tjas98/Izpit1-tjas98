const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Potrebna je ponovna registracija uporabnika, da se šteje tudi nov parameter crniSeznam

/**
 * @swagger
 * components:
 *  schemas:
 *   UporabnikPrijava:
 *    type: object
 *    description: Podatki uporabnika za prijavo
 *    properties:
 *     elektronskiNaslov:
 *      type: string
 *      description: elektronski naslov
 *      example: dejan@lavbic.net
 *     geslo:
 *      type: string
 *      format: password
 *      example: test
 *    required:
 *     - elektronskiNaslov
 *     - geslo
 *   UporabnikRegistracija:
 *    type: object
 *    description: Podatki uporabnika za registracijo
 *    properties:
 *     ime:
 *      type: string
 *      description: ime in priimek
 *      writeOnly: true
 *      example: Dejan Lavbič
 *     elektronskiNaslov:
 *      type: string
 *      description: elektronski naslov
 *      example: dejan@lavbic.net
 *     geslo:
 *      type: string
 *      format: password
 *      example: test
 *    required:
 *     - ime
 *     - elektronskiNaslov
 *     - geslo
 *   AvtentikacijaOdgovor:
 *    type: object
 *    description: Rezultat uspešne avtentikacije uporabnika
 *    properties:
 *     žeton:
 *      type: string
 *      description: JWT žeton
 *      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGZhMjBlZDlhZGM0MzIyNmY0NjhkZjMiLCJlbGVrdHJvbnNraU5hc2xvdiI6ImRlamFuQGxhdmJpYy5uZXQiLCJpbWUiOiJEZWphbiBMYXZiacSNIiwiZGF0dW1Qb3Rla2EiOjE1Nzc5NTU2NjMsImlhdCI6MTU3NzM1MDg2M30.PgSpqjK8qD2dHUsXKwmqzhcBOJXUUwtIOHP3Xt6tbBA
 *    required:
 *     - žeton
 *   Napaka:
 *    type: object
 *    description: Podrobnosti napake
 *    required:
 *     - sporočilo
 *    properties:
 *     sporočilo:
 *      type: string
 *    example:
 *     sporočilo: Parametri so obvezni.
 */
const uporabnikiShema = new mongoose.Schema({
  elektronskiNaslov: { type: String, unique: true, required: true },
  ime: { type: String, required: true },
  zgoscenaVrednost: { type: String, required: true },
  nakljucnaVrednost: { type: String, required: true },
  crniSeznam: {
    type: [Number]
  }
});

uporabnikiShema.methods.nastaviGeslo = function (geslo) {
  this.nakljucnaVrednost = crypto.randomBytes(16).toString('hex');
  this.zgoscenaVrednost = crypto
    .pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000, 64, 'sha512')
    .toString('hex');
};

uporabnikiShema.methods.preveriGeslo = function (geslo) {
  let zgoscenaVrednost = crypto
    .pbkdf2Sync(geslo, this.nakljucnaVrednost, 1000, 64, 'sha512')
    .toString('hex');
  return this.zgoscenaVrednost == zgoscenaVrednost;
};

uporabnikiShema.methods.generirajJwt = function () {
  const datumPoteka = new Date();
  datumPoteka.setDate(datumPoteka.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    elektronskiNaslov: this.elektronskiNaslov,
    ime: this.ime,
    exp: parseInt(datumPoteka.getTime() / 1000, 10)
  }, process.env.JWT_GESLO);
};

mongoose.model('Uporabnik', uporabnikiShema, 'Uporabniki');

/**
 * @swagger
 *  components:
 *   examples:
 *    NeNajdemLokacije:
 *     summary: ne najdem lokacije
 *     value:
 *      sporočilo: Ne najdem lokacije.
 *    NeNajdemKomentarja:
 *     summary: ne najdem komentarja
 *     value:
 *      sporočilo: Ne najdem komentarja.
 *    NiNobenegaKomentarja:
 *     summary: ni nobenega komentarja
 *     value:
 *      sporočilo: Ni nobenega komentarja.
 *    NiZetona:
 *     summary: ni JWT žetona
 *     value:
 *      sporočilo: "UnauthorizedError: No authorization token was found."
 *    VsiPodatki:
 *     summary: zahtevani so vsi podatki
 *     value:
 *      sporočilo: Zahtevani so vsi podatki.
 *    EMailNiUstrezen:
 *     summary: elektronski naslov ni ustrezen
 *     value:
 *      sporočilo: Elektronski naslov ni ustrezen!
 */