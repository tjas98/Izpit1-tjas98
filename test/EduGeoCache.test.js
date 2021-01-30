/**
 * Funkcionalni testi
 */
(async function EduGeoCache() {
  // Knjižnice
  const { exec } = require("child_process");
  const { describe, it, after, before } = require("mocha");
  const { Builder, By, until } = require("selenium-webdriver");
  const chrome = require("selenium-webdriver/chrome");
  const expect = require("chai").expect;
  
  // Parametri
  let aplikacijaUrl = "https://edugeocache-sp-2020-2021.herokuapp.com/";
  let seleniumStreznikUrl = "http://localhost:4445/wd/hub";
  let brskalnik, jwtZeton;

  const axios = require('axios').create({
    baseURL: aplikacijaUrl + "api/",
    timeout: 5000
  });
  
  // Obvladovanje napak
  process.on("unhandledRejection", (napaka) => {
    console.log(napaka);
  });

  // Počakaj določeno število sekund na zahtevani element na strani
  let pocakajStranNalozena = async (brskalnik, casVS, xpath) => {
    await brskalnik.wait(() => {
      return brskalnik.findElements(By.xpath(xpath)).then(elementi => {
        return elementi[0];
      });
    }, casVS * 1000, `Stran se ni naložila v ${casVS} s.`);
  };

  try {

    before(() => {
      brskalnik = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options()
        .addArguments("start-maximized")
        .addArguments("disable-infobars")
        .addArguments("allow-insecure-localhost")
        .addArguments("allow-running-insecure-content")
      )
      .usingServer(seleniumStreznikUrl)
      .build();
    });

    describe("Seznam lokacij", function() {
      this.timeout(30 * 1000);
      before(() => { brskalnik.get(aplikacijaUrl); });

      it("število lokacij na začetni strani", async () => {
        await pocakajStranNalozena(brskalnik, 10, "//h4");
        let lokacije = await brskalnik.findElements(By.css(".card"));
        expect(lokacije).to.be.an("array").to.have.lengthOf(2);
      });

    });

    describe("Informacije o aplikaciji", function() {
      this.timeout(30 * 1000);
      before(() => { brskalnik.get(aplikacijaUrl); });

      it("izberi informacije o aplikaciji", async function() {
        await pocakajStranNalozena(brskalnik, 10, "//h1");
        let povezava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Informacije o aplikaciji')]"));
        expect(povezava).to.not.be.empty;
        await povezava.click();
      });

      context("ustreznost podatkov na strani z informacijami", function() {
        it("naslov strani", async function() {
          await pocakajStranNalozena(brskalnik, 10, "//h1");
          let naslov = await brskalnik.findElement(By.css("h1"));
          expect(naslov).to.not.be.empty;
          await naslov.getText().then(function(vsebina) {
            expect(vsebina).to.be.equal("Informacije o aplikaciji");
          });
        });

        it("besedilo informacij o aplikaciji", async function() {
          let besedilo = await brskalnik.findElement(
            By.xpath("//div[contains(text(), 'lahko odpravite dolgčas')]")
          );
          expect(besedilo).to.not.be.empty;
          expect(await besedilo.getText()).to.have.string(
            "EduGeoCache se uporablja za " +
            "iskanje zanimivih lokacij v bližini, kjer lahko " +
            "odpravite dolgčas."
          );
        });

      });

    });

    describe("Podrobnosti lokacije", function() {
      this.timeout(30 * 1000);
      before(() => { brskalnik.get(aplikacijaUrl); });

      it("izberi ZOO Ljubljana", async function() {
        await pocakajStranNalozena(brskalnik, 10, "//h4");
        let povezava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'ZOO Ljubljana')]"));
        expect(povezava).to.not.be.empty;
        await povezava.click();
      });

      context("ustreznost podatkov na strani s podrobnostmi", function() {

        it("naslov lokacije", async function() {
          await pocakajStranNalozena(brskalnik, 10, "//iframe");
          let naslov = await brskalnik.findElement(By.css("h1"));
          expect(naslov).to.not.be.empty;
          expect(await naslov.getText()).to.be.equal("ZOO Ljubljana");
        });

        it("lastnosti lokacije", async function() {
          let tretjaLastnost = await brskalnik.findElement(
            By.xpath("//h2[contains(text(), 'Lastnosti')]/../span[3]"));
          expect(tretjaLastnost).to.not.be.empty;
          expect(await tretjaLastnost.getText())
            .to.be.equal("parkirišče je na voljo");
        });

        it("stranska orodna vrstica", async function() {
          let stranskaOrodnaVrstica = await brskalnik.findElement(
            By.css("p.lead"));
          expect(stranskaOrodnaVrstica).to.not.be.empty;
          expect(await stranskaOrodnaVrstica.getText())
            .to.have.string("ZOO Ljubljana je na EduGeoCache");
        });

      });

    });

    describe("Registracija novega uporabnika", function() {
      this.timeout(30 * 1000);
      before(async function() { await brskalnik.get(aplikacijaUrl); });

      it("izbriši uporabnika iz podatkovne baze", async function() {
        let dockerAtlasBrisiUporabnika = 
            "docker exec -i sp-edugeocache-mongodb bash -c " + "\"mongo " + 
            "\\\"mongodb+srv://edugeocache-qfwjv.mongodb.net/EduGeoCache\\\" " + 
            "--username app --password secure-access --eval " + 
            "'db.Uporabniki.remove({elektronskiNaslov: \\\"janez@kranjski.net\\\"})'" + "\"";
        exec(dockerAtlasBrisiUporabnika).on("close", (koda) => {
          expect(koda).to.be.equal(0);
        });
      });

      it("prijava uporabnika", async function() {
        let povezava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Prijava')]"));
        expect(povezava).to.not.be.empty;
        await povezava.click();
      });

      it("izbira registracije", async function() {
        await pocakajStranNalozena(brskalnik, 10,
          "//button[contains(text(), 'Prijavi')]");
        let povezava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'registrirajte')]"));
        expect(povezava).to.not.be.empty;
        await povezava.click();
      });

      it("vnos podatkov uporabnika", async function() {
        await pocakajStranNalozena(brskalnik, 10,
          "//button[contains(text(), 'Registriraj')]");
        let ime = await brskalnik.findElement(By.css("input[name='ime']"));
        expect(ime).to.not.be.empty;
        ime.sendKeys("Janez Kranjski");
        let email = await brskalnik.findElement(
          By.css("input[name='elektronskiNaslov']"));
        expect(email).to.not.be.empty;
        email.sendKeys("janez@kranjski.net");
        let geslo = await brskalnik.findElement(By.css("input[name='geslo']"));
        expect(geslo).to.not.be.empty;
        geslo.sendKeys("test");
        brskalnik.findElement(
          By.xpath("//button[contains(text(), 'Registriraj')]")).click();
      });

      it("preveri ali je uporabnik prijavljen", async function() {
        await pocakajStranNalozena(brskalnik, 10, "//h4");
        let uporabnik = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Janez Kranjski')]"));
        expect(uporabnik).to.not.be.empty;
      });

      it("pridobi JWT žeton", async function() {
        jwtZeton = await brskalnik.executeScript(function() {
          return localStorage.getItem("edugeocache-zeton");
        });
        expect(jwtZeton).to.not.be.empty;
      });

    });

    describe("Dodajanje komentarja", async function() {
      this.timeout(30 * 1000);
      before(async function() { await brskalnik.get(aplikacijaUrl); });

      it("izbriši uporabnikov(e) komentar(je) iz podatkovne baze", async function() {
        await pocakajStranNalozena(brskalnik, 10, "//h4");
        let povezava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'ZOO Ljubljana')]")
        );
        let idLokacije = await povezava.getAttribute("href").then(povezava => {
          return povezava.match(/^http.+?\/(\w+?)$/)[1];
        });
        expect(idLokacije).to.not.be.empty;
        axios({
          method: 'get',
          url: 'lokacije/' + idLokacije
        })
        .then(async (odgovor) => {
          let komentarji = odgovor.data.komentarji;
          komentarji
            .filter(x => { return x.avtor == "Janez Kranjski"; })
            .map(x => x._id)
            .forEach(async idKomentar => {
              axios({
                method: 'delete',
                url: 'lokacije/' + idLokacije + "/komentarji/" + idKomentar,
                headers: { 'Authorization': 'Bearer ' + jwtZeton }
              })
              .then(async (odgovor) => {
                expect(odgovor.status).to.be.equal(204);
              });
            });
        });
        await brskalnik.get(aplikacijaUrl);
      });

      it("izberi ZOO Ljubljana", async function() {
        await pocakajStranNalozena(brskalnik, 10, "//h4");
        let povezava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'ZOO Ljubljana')]"));
        expect(povezava).to.not.be.empty;
        await povezava.click();
      });

      it("preveri ali je prikazana stran ZOO Ljubljana", async function() {
        await pocakajStranNalozena(brskalnik, 10, "//h2");
        let naslov = await brskalnik.findElement(By.css("h1"));
        expect(naslov).to.not.be.empty;
        expect(await naslov.getText()).to.be.equal("ZOO Ljubljana");
      });

      it("klik na gumb za dodajanje komentarja", async function() {
        let gumb = await brskalnik.findElement(
          By.xpath("//button[contains(text(), 'Dodaj komentar')]"));
        expect(gumb).to.not.be.empty;
        await gumb.click();
        await pocakajStranNalozena(brskalnik, 10,
          "//button[contains(text(), 'Dodaj moj komentar')]");
        gumb = await brskalnik.findElement(
          By.xpath("//button[contains(text(), 'Dodaj moj komentar')]"));
        expect(gumb).to.not.be.empty;
        await brskalnik.findElement(By.css("option:nth-child(3)")).click();
        await brskalnik.findElement(By.css("textarea[name='komentar']"))
          .sendKeys("Najbolj so mi všeč igrala.");
        await gumb.click();
      });

      it("preveri ali je komentar dodan", async function() {
        await pocakajStranNalozena(brskalnik, 10,
          "//span[@class='komentar-avtor' and " +
            "contains(text(), 'Janez Kranjski')]");
        let zadnjiKomentar = await brskalnik.findElement(
          By.xpath("//div[contains(@class, 'komentar')][1]"));
        expect(zadnjiKomentar).to.not.be.empty;
        expect(await zadnjiKomentar
          .findElement(By.xpath(".//span[@class='komentar-avtor']"))
          .getText()
        ).to.be.equal("Janez Kranjski");
        expect(await zadnjiKomentar
          .findElement(By.xpath("./div[2]"))
          .getText()
        ).to.be.equal("Najbolj so mi všeč igrala.");
      });

    });

    describe("Odjava uporabnika", async function() {
      this.timeout(30 * 1000);
      before(function() { brskalnik.get(aplikacijaUrl); });

      it("preveri ali je uporabnik prijavljen", async function() {
        await pocakajStranNalozena(brskalnik, 10, "//h4");
        let uporabnik = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Janez Kranjski')]"));
        expect(uporabnik).to.not.be.empty;
      });

      it("zahtevaj odjavo", async function() {
        let uporabnik = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Janez Kranjski')]"));
        expect(uporabnik).to.not.be.empty;
        await uporabnik.click();
        let odjava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Odjava')]"));
        expect(odjava).to.not.be.empty;
        await odjava.click();
      });

      it("preveri ali je uporabnik odjavljen", async function() {
        let prijava = await brskalnik.findElement(
          By.xpath("//a[contains(text(), 'Prijava')]"));
        expect(prijava).to.not.be.empty;
      });

    });

    after(async () => {
      brskalnik.quit();
    });

  } catch (napaka) {
    console.log("Med testom je prišlo do napake!");
  }
})();