import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-glava-strani',
  templateUrl: './glava-strani.component.html',
  styleUrls: ['./glava-strani.component.css']
})
export class GlavaStraniComponent implements OnInit {

  @Input() vsebina: any;

  constructor() { }

  ngOnInit(): void {
  }

}
