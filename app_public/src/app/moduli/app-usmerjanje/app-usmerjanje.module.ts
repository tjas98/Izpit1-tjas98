import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DomacaStranComponent } from '../../skupno/komponente/domaca-stran/domaca-stran.component';
import { InformacijeComponent } from '../../skupno/komponente/informacije/informacije.component';
import { StranSPodrobnostmiComponent } from '../../skupno/komponente/stran-s-podrobnostmi/stran-s-podrobnostmi.component';
import { RegistracijaComponent } from '../../skupno/komponente/registracija/registracija.component';
import { PrijavaComponent } from '../../skupno/komponente/prijava/prijava.component';

const poti: Routes = [
  {
    path: '',
    component: DomacaStranComponent
  }, {
    path: 'informacije',
    component: InformacijeComponent
  }, {
    path: 'lokacija/:idLokacije',
    component: StranSPodrobnostmiComponent
  }, {
    path: 'registracija',
    component: RegistracijaComponent
  }, {
    path: 'prijava',
    component: PrijavaComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(poti)
  ],
  exports: [RouterModule]
})
export class AppUsmerjanjeModule { }
