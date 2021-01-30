import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-domaca-stran',
  templateUrl: './domaca-stran.component.html',
  styleUrls: ['./domaca-stran.component.css']
})
export class DomacaStranComponent implements OnInit {

  glavaStrani = {
    naslov: "EduGeoCache",
    podnaslov: "Poiščite zanimive lokacije blizu vas!"
  }

  stranskaOrodnaVrstica = "Iščete lokacijo za kratkočasenje? EduGeoCache vam pomaga pri iskanju zanimivih lokacij v bližini. Mogoče imate kakšne posebne želje? Naj vam EduGeoCache pomaga pri iskanju bližnjih zanimivih lokacij."

  constructor() { }

  ngOnInit(): void {
  }

}
