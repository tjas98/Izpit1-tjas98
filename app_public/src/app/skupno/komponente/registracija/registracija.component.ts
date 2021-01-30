import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';
import { ZgodovinaService } from '../../storitve/zgodovina.service';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  public napakaNaObrazcu: string = "";

  public prijavniPodatki = {
    ime: "",
    elektronskiNaslov: "",
    geslo: ""
  }

  public vsebinaStrani = {
    glava: {
      naslov: "Kreiranje novega uporabniškega računa",
      podnaslov: ""
    },
    stranskaOrodnaVrstica: ""
  }

  constructor(
    private usmerjevalnik: Router,
    private avtentikacijaStoritev: AvtentikacijaService,
    private zgodovinaStoritev: ZgodovinaService,
    private povezavaStoritev: PovezavaService
  ) { }

  public posiljanjePodatkov(): void {
    this.napakaNaObrazcu = "";
    if (
      !this.prijavniPodatki.ime ||
      !this.prijavniPodatki.elektronskiNaslov ||
      !this.prijavniPodatki.geslo
    ) {
      this.napakaNaObrazcu = "Zahtevani so vsi podatki, prosim poskusite znova!";
    } else {
      this.izvediRegistracijo();
    }
  }

  private izvediRegistracijo(): void {
    this.avtentikacijaStoritev
      .registracija(this.prijavniPodatki)
      .then(() => {
        this.usmerjevalnik.navigateByUrl(
          this.zgodovinaStoritev.vrniPredhodnjeUrlNasloveBrezPrijaveInRegistracije()
        );
      })
      .catch(sporocilo => this.napakaNaObrazcu = sporocilo);
  }

  ngOnInit(): void {
  }

}
