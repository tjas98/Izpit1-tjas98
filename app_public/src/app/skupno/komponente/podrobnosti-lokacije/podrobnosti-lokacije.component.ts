import { Component, OnInit, Input } from '@angular/core';
import { Lokacija, Komentar } from '../../razredi/lokacija';
import { EdugeocachePodatkiService } from '../../storitve/edugeocache-podatki.service';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';

@Component({
  selector: 'app-podrobnosti-lokacije',
  templateUrl: './podrobnosti-lokacije.component.html',
  styleUrls: ['./podrobnosti-lokacije.component.css']
})
export class PodrobnostiLokacijeComponent implements OnInit {

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  public novKomentar: Komentar = {
    naziv: '',
    ocena: 5,
    komentar: ''
  };

  public obrazecPrikazan: boolean = false;

  public obrazecNapaka: string;

  private soPodatkiUstrezni(): boolean {
    if (this.novKomentar.naziv && this.novKomentar.ocena && this.novKomentar.komentar) {
      return true;
    } else {
      return false;
    }
  }

  private ponastaviInSkrijObrazec(): void {
    this.obrazecPrikazan = false;
    this.novKomentar.naziv = "";
    this.novKomentar.ocena = 5;
    this.novKomentar.komentar = "";
  }

  public dodajNovKomentar(): void {
    this.obrazecNapaka = "";
    this.novKomentar.naziv = this.vrniUporabnika();
    if (this.soPodatkiUstrezni()) {
      this.edugeocachePodatkiStoritev
        .dodajKomentarLokaciji(this.lokacija._id, this.novKomentar)
        .then((komentar: Komentar) => {
          console.log("Komentar shranjen", komentar);
          let komentarji = this.lokacija.komentarji.slice(0);
          komentarji.unshift(komentar);
          this.lokacija.komentarji = komentarji;
          this.ponastaviInSkrijObrazec();
        })
        .catch(napaka => this.obrazecNapaka = napaka);
    } else {
      this.obrazecNapaka = "Zahtevani so vsi podatki, prosim poskusite ponovno!";
    }
  }

  public jePrijavljen(): boolean {
    return this.avtentikacijaStoritev.jePrijavljen();
  }

  public vrniUporabnika(): string {
    const { ime } = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return ime ? ime : 'Gost';
  }

  @Input() lokacija: Lokacija;

  constructor(
    private edugeocachePodatkiStoritev: EdugeocachePodatkiService,
    private avtentikacijaStoritev: AvtentikacijaService,
    private povezavaStoritev: PovezavaService
  ) { }

  ngOnInit(): void {
  }

}
