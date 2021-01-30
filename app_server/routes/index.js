var express = require('express');
var router = express.Router();

const ctrlLokacije = require('../controllers/lokacije');
const ctrlOstalo = require('../controllers/ostalo');

/* Lokacijske strani */
router.get('/', ctrlLokacije.seznam);
router.get('/lokacija/:idLokacije', ctrlLokacije.podrobnostiLokacije);
router
  .route('/lokacija/:idLokacije/komentar/nov')
  .get(ctrlLokacije.dodajKomentar)
  .post(ctrlLokacije.shraniKomentar);

/* Ostale strani */
router.get('/informacije', ctrlOstalo.informacije);

module.exports = router;
