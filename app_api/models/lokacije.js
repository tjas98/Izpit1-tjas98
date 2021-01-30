const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   DelovniCas:
 *    type: object
 *    properties:
 *     dnevi:
 *      type: string
 *     odprtje:
 *      type: string
 *     zaprtje:
 *      type: string
 *     zaprto:
 *      type: boolean
 *    required:
 *     - dnevi
 *     - zaprto
 */
const delovniCasShema = new mongoose.Schema({
  dnevi: {type: String, required: true},
  odprtje: String,
  zaprtje: String,
  zaprto: {type: Boolean, required: true}
});

/**
 * @swagger
 * components:
 *  schemas:
 *   KomentarAzuriranje:
 *    description: Podatki komentarja pri ažuriranju
 *    type: object
 *    properties:
 *     naziv:
 *      type: string
 *      example: Dejan Lavbič
 *     ocena:
 *      type: integer
 *      minimum: 0
 *      maximum: 5
 *      example: 1
 *     komentar:
 *      type: string
 *      example: Uff, brez komentarja.
 *    required:
 *     - naziv
 *     - ocena
 *     - komentar
 *   KomentarBranje:
 *    description: Podatki komentarja pri branju
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      format: uuid
 *      example: 5e04bfb6a3aff223697cbbcb
 *     avtor:
 *      type: string
 *      example: Dejan Lavbič
 *     ocena:
 *      type: integer
 *      minimum: 0
 *      maximum: 5
 *      example: 1
 *     besediloKomentarja:
 *      type: string
 *      example: Uff, brez komentarja.
 *     datum:
 *      type: string
 *      format: date-time
 *      example: 2019-12-26T14:12:06.488Z
 *    required:
 *     - _id
 *     - avtor
 *     - ocena
 *     - besediloKomentarja
 *     - datum
 *   KomentarLokacija:
 *    description: Podatki komentarja z nazivom in enoličnim identifikatorjem lokacije
 *    type: object
 *    properties:
 *     lokacija:
 *      type: object
 *      properties:
 *       id:
 *        type: string
 *        format: uuid
 *        example: 5ded18eb51386c3799833191
 *       naziv:
 *        type: string
 *        example: Trojane
 *      required:
 *       - id
 *       - naziv
 *     komentar:
 *      type: object
 *      $ref: "#/components/schemas/KomentarBranje"
 *    required:
 *     - lokacija
 *     - komentar
 */
const komentarjiShema = new mongoose.Schema({
  avtor: {type: String, required: true},
  ocena: {type: Number, required: true, min: 0, max: 5},
  besediloKomentarja: {type: String, required: true},
  datum: {type: Date, "default": Date.now}
});

/**
 * Sheme podatkov
 * @swagger
 * components:
 *  schemas:
 *   LokacijaBranjePovzetek:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      format: uuid
 *      description: enolični identifikator
 *      example: 5ded18eb51386c3799833191
 *     naziv:
 *      type: string
 *      example: Trojane
 *     naslov:
 *      type: string
 *      description: poštni naslov
 *      example: Trojane 11, 1222 Trojane
 *     ocena:
 *      type: integer
 *      description: povprečna ocena vseh komentarjev
 *      example: 4
 *     lastnosti:
 *      type: array
 *      items:
 *       type: string
 *      example:
 *       - krofi
 *       - hrana
 *     razdalja:
 *      type: number
 *      description: razdalja do trenutne lokacije
 *      example: 5200
 *    required:
 *     - _id
 *     - naziv
 *     - naslov
 *     - ocena
 *     - lastnosti
 *     - razdalja
 *   LokacijaAzuriranjePovzetekZahteva:
 *    type: object
 *    properties:
 *     naziv:
 *      type: string
 *      example: Trojane
 *     naslov:
 *      type: string
 *      description: poštni naslov
 *      example: Trojane 11, 1222 Trojane
 *     lastnosti:
 *      type: string
 *      example: krofi,hrana
 *     lng:
 *      type: number
 *      description: zemljepisna dolžina
 *      example: 14.883872
 *     lat:
 *      type: number
 *      description: zemljepisna širina
 *      example: 46.188109
 *     dnevi1:
 *      description: Dnevi 1. termina delovnega časa
 *      type: string
 *      example: ponedeljek - petek
 *     odprtje1:
 *      description: Odprtje 1. termina delovnega časa
 *      type: string
 *      example: "05:30"
 *     zaprtje1:
 *      description: Zaprtje 1. termina delovnega časa
 *      type: string
 *      example: "23:00"
 *     zaprto1:
 *      description: Zaprto na 1. termina delovnega časa
 *      type: boolean
 *      example: "false"
 *     dnevi2:
 *      description: Dnevi 2. termina delovnega časa
 *      type: string
 *      example: sobota - nedelja
 *     odprtje2:
 *      description: Odprtje 2. termina delovnega časa
 *      type: string
 *      example: "06:00"
 *     zaprtje2:
 *      description: Zaprtje 2. termina delovnega časa
 *      type: string
 *      example: "23:00"
 *     zaprto2:
 *      description: Zaprto na 2. termina delovnega časa
 *      type: boolean
 *      example: "false"
 *    required:
 *     - naziv
 *     - naslov
 *     - lastnosti
 *     - lng
 *     - lat
 *   LokacijaAzuriranjePovzetekOdgovor:
 *    type: object
 *    properties:
 *     naziv:
 *      type: string
 *      example: Trojane
 *     naslov:
 *      type: string
 *      description: poštni naslov
 *      example: Trojane 11, 1222 Trojane
 *     lastnosti:
 *      type: array
 *      items:
 *       type: string
 *      example:
 *       - krofi
 *       - hrana
 *     kordinate:
 *      type: array
 *      items:
 *       type: number
 *      example:
 *       - 14.883872
 *       - 46.188109
 *     delovniCas:
 *      type: array
 *      items:
 *       type: DelovniCas
 *      example:
 *       - dnevi: ponedeljek - petek
 *         odprtje: 05:30
 *         zaprtje: 23:00
 *         zaprto: false
 *       - dnevi: sobota - nedelja
 *         odprtje: 06:00
 *         zaprtje: 23:00
 *         zaprto: false
 *     ocena:
 *      type: integer
 *      description: povprečna ocena vseh komentarjev
 *      example: 0
 *    required:
 *     - naziv
 *     - naslov
 *     - lastnosti
 *     - koordinate
 *     - delovniCas
 *     - ocena
 *   LokacijaBranjePodrobnosti:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      format: uuid
 *      description: enolični identifikator
 *      example: 5ded18eb51386c3799833191
 *     naziv:
 *      type: string
 *      example: Trojane
 *     naslov:
 *      type: string
 *      description: poštni naslov
 *      example: Trojane 11, 1222 Trojane
 *     koordinate:
 *      type: array
 *      description: GPS koordinate (zemljepisna dolžina in širina)
 *      items:
 *       type: number
 *      example:
 *       - 14.883872
 *       - 46.188109
 *     ocena:
 *      type: integer
 *      description: povprečna ocena vseh komentarjev
 *      example: 4
 *     lastnosti:
 *      type: array
 *      items:
 *       type: string
 *      example:
 *       - krofi
 *       - hrana
 *     delovniCas:
 *      type: array
 *      items:
 *       type: DelovniCas
 *      example:
 *       - dnevi: ponedeljek - petek
 *         odprtje: 05:30
 *         zaprtje: 23:00
 *         zaprto: false
 *       - dnevi: sobota - nedelja
 *         odprtje: 06:00
 *         zaprtje: 23:00
 *         zaprto: false
 *     komentarji:
 *      type: array
 *      items:
 *       type: KomentarBranje
 *      example:
 *       - _id: 5de111349b2fa34e120eb6bd
 *         avtor: Dejan Lavbič
 *         ocena: 5
 *         besediloKomentarja: Odlična lokacija, ne morem je prehvaliti.
 *         datum: 2019-11-07T00:00:00.000Z
 *       - _id: 5de111349b2fa34e120eb6be
 *         avtor: Kim Jong Un
 *         ocena: 1
 *         besediloKomentarja: Čisti dolgčas, še kava je zanič.
 *         datum: 2019-11-08T00:00:00.000Z
 *    required:
 *     - _id
 *     - naziv
 *     - naslov
 *     - koordinate
 *     - ocena
 *     - lastnosti
 *     - delovniCas
 *     - komentarji
 */
const lokacijeShema = new mongoose.Schema({
  naziv: {type: String, required: true},
  naslov: String,
  ocena: {type: Number, "default": 0, min: 0, max: 5},
  lastnosti: [String],
  koordinate: {type: [Number], index: '2dsphere'},
  delovniCas: [delovniCasShema],
  komentarji: [komentarjiShema]
});

mongoose.model('Lokacija', lokacijeShema, 'Lokacije');