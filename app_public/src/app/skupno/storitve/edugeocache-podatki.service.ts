import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Lokacija, Komentar } from '../razredi/lokacija';
import { Uporabnik } from '../razredi/uporabnik';
import { RezultatAvtentikacije } from '../razredi/rezultat-avtentikacije';
import { environment } from '../../../environments/environment';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';

@Injectable({
  providedIn: 'root'
})
export class EdugeocachePodatkiService {

  constructor(
    private http: HttpClient,
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage
  ) { }

  private apiUrl = environment.apiUrl;

  public prijava(uporabnik: Uporabnik): Promise<RezultatAvtentikacije> {
    return this.avtentikacija('prijava', uporabnik);
  }

  public registracija(uporabnik: Uporabnik): Promise<RezultatAvtentikacije> {
    return this.avtentikacija('registracija', uporabnik);
  }

  private avtentikacija(urlNaslov: string, uporabnik: Uporabnik): Promise<RezultatAvtentikacije> {
    const url: string = `${this.apiUrl}/${urlNaslov}`;
    return this.http
      .post(url, uporabnik)
      .toPromise()
      .then(rezultat => rezultat as RezultatAvtentikacije)
      .catch(this.obdelajNapako);
  }

  public pridobiLokacije(lat: number, lng: number): Promise<Lokacija[]> {
    const maxRazdalja: number = 100;
    const url: string = `${this.apiUrl}/lokacije?lng=${lng}&lat=${lat}&maxRazdalja=${maxRazdalja}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Lokacija[])
      .catch(this.obdelajNapako);
  }

  public pridobiPodrobnostiLokacije(idLokacije: string): Promise<Lokacija> {
    const url: string = `${this.apiUrl}/lokacije/${idLokacije}`;
    return this.http
      .get(url)
      .toPromise()
      .then(odgovor => odgovor as Lokacija)
      .catch(this.obdelajNapako);
  }

  public dodajKomentarLokaciji(idLokacije: string, podatkiObrazca: Komentar): Promise<Komentar> {
    const url: string = `${this.apiUrl}/lokacije/${idLokacije}/komentarji`;
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.shramba.getItem('edugeocache-zeton')}`
      })
    };
    return this.http
      .post(url, podatkiObrazca, httpLastnosti)
      .toPromise()
      .then(odgovor => odgovor as Komentar)
      .catch(this.obdelajNapako);
  }

  private obdelajNapako(napaka: any): Promise<any> {
    console.error('Prišlo je do napake', napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
    return Promise.reject(napaka.error["sporočilo"] || napaka.error.errmsg || napaka.message || napaka);
  }

  public crniSeznam() {
    const httpLastnosti = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.shramba.getItem('edugeocache-zeton')}`
      })
    };
    return this.http.get(this.apiUrl + '/odjava', httpLastnosti)
  }
}
