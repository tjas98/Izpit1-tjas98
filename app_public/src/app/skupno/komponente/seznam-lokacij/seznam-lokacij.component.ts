import { Component, OnInit } from '@angular/core';
import { EdugeocachePodatkiService } from '../../storitve/edugeocache-podatki.service';
import { GeoLokacijaService } from '../../storitve/geo-lokacija.service';
import { Lokacija } from '../../razredi/lokacija';

@Component({
  selector: 'app-seznam-lokacij',
  templateUrl: './seznam-lokacij.component.html',
  styleUrls: ['./seznam-lokacij.component.css']
})
export class SeznamLokacijComponent implements OnInit {

  constructor(
    private edugeocachePodatkiStoritev: EdugeocachePodatkiService,
    private geoLokacijaStoritev: GeoLokacijaService
  ) { }

  public lokacije: Lokacija[];

  public sporocilo: string;

  private pridobiLokacije = (polozaj: any): void => {
    this.sporocilo = "Iščem bližnje zanimive lokacije.";
    const lat: number = polozaj.coords.latitude;
    const lng: number = polozaj.coords.longitude
    this.edugeocachePodatkiStoritev
      .pridobiLokacije(lat, lng)
      .then(najdeneLokacije => {
        this.sporocilo = najdeneLokacije.length > 0 ? "" : "Ni najdenih lokacij.";
        this.lokacije = najdeneLokacije;
      })
      .catch(napaka => this.prikaziNapako(napaka));
  }

  private prikaziNapako = (napaka: any): void => {
    this.sporocilo = napaka.message || napaka;
  }

  private niGeolokacije = (): void => {
    this.sporocilo = "Spletni brskalnik ne podpira geolociranja.";
  }

  private pridobiPolozaj = (): void => {
    this.sporocilo = "Pridobivam trenutni položaj odjemalca ...";
    this.geoLokacijaStoritev.pridobiLokacijo(
      this.pridobiLokacije,
      this.prikaziNapako,
      this.niGeolokacije
    )
  }

  ngOnInit(): void {
    this.pridobiPolozaj();
  }

}
