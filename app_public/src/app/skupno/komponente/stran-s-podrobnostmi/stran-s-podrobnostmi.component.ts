import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EdugeocachePodatkiService } from '../../storitve/edugeocache-podatki.service';
import { Lokacija } from '../../razredi/lokacija';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-stran-s-podrobnostmi',
  templateUrl: './stran-s-podrobnostmi.component.html',
  styleUrls: ['./stran-s-podrobnostmi.component.css']
})
export class StranSPodrobnostmiComponent implements OnInit {

  constructor(
    private edugeocachePodatkiStoritev: EdugeocachePodatkiService,
    private pot: ActivatedRoute
  ) { }

  lokacija: Lokacija;

  ngOnInit(): void {
    this.pot.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          let idLokacije = params.get('idLokacije');
          return this.edugeocachePodatkiStoritev.pridobiPodrobnostiLokacije(idLokacije);
        })
      )
      .subscribe((lokacija: Lokacija) => {
        this.lokacija = lokacija;
        this.vsebinaStrani.glava.naslov = lokacija.naziv,
        this.vsebinaStrani.stranskaOrodnaVrstica = `${lokacija.naziv} je na EduGeoCache, ker je zanimiva lokacija, ki si jo lahko ogledate, ko ste brez idej za kratek izlet.\n\nČe vam je lokacija všeč, ali pa tudi ne, dodajte svoj komentar in s tem pomagajte ostalim uporabnikom pri odločitvi.`
      })
  }

  public vsebinaStrani = {
    glava: {
      naslov: "",
      podnaslov: ""
    },
    stranskaOrodnaVrstica: ""
  }

}
