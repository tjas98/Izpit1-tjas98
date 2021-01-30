const hbs = require('hbs');

hbs.registerHelper('zvezdice', (ocena) => {
  let zvezdice = '';
  for (let i = 1; i <= 5; i++)
    zvezdice += '<i class="fa' + (ocena >= i ? 's' : 'r') + ' fa-star"></i>';
  return zvezdice;
});

hbs.registerHelper('zamenjaj', (besedilo, nizPrej, nizPotem) => {
  return besedilo.replace(new RegExp(nizPrej, 'g'), nizPotem);
});

hbs.registerHelper('formatirajDatum', (nizDatum) => {
  const datum = new Date(nizDatum);
  const imenaMesecev = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];
  const d = datum.getDate();
  const m = imenaMesecev[datum.getMonth()];
  const l = datum.getFullYear();
  return `${d}. ${m}, ${l}`;
});

hbs.registerHelper('ujemanjeNiza', (vrednost1, vrednost2, moznosti) => {
  return (vrednost1 == vrednost2) ? moznosti.fn(this) : moznosti.inverse(this);
});