import { Component, OnInit } from '@angular/core';
import { AvtentikacijaService } from '../../storitve/avtentikacija.service';
import { PovezavaService } from '../../storitve/povezava.service';
import { Uporabnik } from '../../razredi/uporabnik';

@Component({
  selector: 'app-ogrodje',
  templateUrl: './ogrodje.component.html',
  styleUrls: ['./ogrodje.component.css']
})
export class OgrodjeComponent implements OnInit {

  constructor(
    private avtentikacijaStoritev: AvtentikacijaService,
    private povezavaStoritev: PovezavaService
  ) { }

  public jePovezava(): boolean {
    return this.povezavaStoritev.jePovezava;
  }

  public odjava(): void {
    this.avtentikacijaStoritev.odjava();
  }

  public jePrijavljen(): boolean {
    return this.avtentikacijaStoritev.jePrijavljen();
  }

  public vrniUporabnika(): string {
    const uporabnik: Uporabnik = this.avtentikacijaStoritev.vrniTrenutnegaUporabnika();
    return uporabnik ? uporabnik.ime : 'Gost';
  }

  ngOnInit(): void { }

}
