import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppUsmerjanjeModule } from './moduli/app-usmerjanje/app-usmerjanje.module';

import { SeznamLokacijComponent } from './skupno/komponente/seznam-lokacij/seznam-lokacij.component';
import { RazdaljaPipe } from './skupno/cevi/razdalja.pipe';
import { OgrodjeComponent } from './skupno/komponente/ogrodje/ogrodje.component';
import { InformacijeComponent } from './skupno/komponente/informacije/informacije.component';
import { DomacaStranComponent } from './skupno/komponente/domaca-stran/domaca-stran.component';
import { GlavaStraniComponent } from './skupno/komponente/glava-strani/glava-strani.component';
import { StranskaOrodnaVrsticaComponent } from './skupno/komponente/stranska-orodna-vrstica/stranska-orodna-vrstica.component';
import { HtmlPrelomVrsticePipe } from './skupno/cevi/html-prelom-vrstice.pipe';
import { ZvezdiceComponent } from './skupno/komponente/zvezdice/zvezdice.component';
import { PodrobnostiLokacijeComponent } from './skupno/komponente/podrobnosti-lokacije/podrobnosti-lokacije.component';
import { StranSPodrobnostmiComponent } from './skupno/komponente/stran-s-podrobnostmi/stran-s-podrobnostmi.component';
import { DovoliUrlPipe } from './skupno/cevi/dovoli-url.pipe';
import { NajnovejsiNajprejPipe } from './skupno/cevi/najnovejsi-najprej.pipe';
import { RegistracijaComponent } from './skupno/komponente/registracija/registracija.component';
import { PrijavaComponent } from './skupno/komponente/prijava/prijava.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    SeznamLokacijComponent,
    RazdaljaPipe,
    OgrodjeComponent,
    InformacijeComponent,
    DomacaStranComponent,
    GlavaStraniComponent,
    StranskaOrodnaVrsticaComponent,
    HtmlPrelomVrsticePipe,
    ZvezdiceComponent,
    PodrobnostiLokacijeComponent,
    StranSPodrobnostmiComponent,
    DovoliUrlPipe,
    NajnovejsiNajprejPipe,
    RegistracijaComponent,
    PrijavaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppUsmerjanjeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { 
      enabled: environment.production
    })
  ],
  providers: [],
  bootstrap: [OgrodjeComponent]
})
export class AppModule { }
