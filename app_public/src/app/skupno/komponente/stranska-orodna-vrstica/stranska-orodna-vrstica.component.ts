import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stranska-orodna-vrstica',
  templateUrl: './stranska-orodna-vrstica.component.html',
  styleUrls: ['./stranska-orodna-vrstica.component.css']
})
export class StranskaOrodnaVrsticaComponent implements OnInit {

  @Input() vsebina: string;

  constructor() { }

  ngOnInit(): void {
  }

}
