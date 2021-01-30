import { Inject, Injectable } from '@angular/core';
import { SHRAMBA_BRSKALNIKA } from '../razredi/shramba';
import { Uporabnik } from '../razredi/uporabnik';
import { RezultatAvtentikacije } from '../razredi/rezultat-avtentikacije';
import { EdugeocachePodatkiService } from '../storitve/edugeocache-podatki.service';


@Injectable({
  providedIn: 'root'
})
export class AvtentikacijaService {

  constructor(
    @Inject(SHRAMBA_BRSKALNIKA) private shramba: Storage,
    private edugeocachePodatkiStoritev: EdugeocachePodatkiService
  ) { }

  private b64Utf8(niz: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(
          atob(niz),
          (znak: string) => {
            return '%' + ('00' + znak.charCodeAt(0).toString(16)).slice(-2);
          }
        )
        .join('')
    );
  };

  public jePrijavljen(): boolean {
    const zeton: string = this.vrniZeton();
    if (zeton) {
      const koristnaVsebina = JSON.parse(this.b64Utf8(zeton.split('.')[1]));
      return koristnaVsebina.exp > (Date.now() / 1000);
    } else {
      return false;
    }
  }

  public vrniTrenutnegaUporabnika(): Uporabnik {
    if (this.jePrijavljen()) {
      const zeton: string = this.vrniZeton();
      const { elektronskiNaslov, ime } = JSON.parse(this.b64Utf8(zeton.split('.')[1]));
      return { elektronskiNaslov, ime } as Uporabnik;
    }
  }

  public async prijava(uporabnik: Uporabnik): Promise<any> {
    return this.edugeocachePodatkiStoritev
      .prijava(uporabnik)
      .then((rezultatAvtentikacije: RezultatAvtentikacije) => {
        this.shraniZeton(rezultatAvtentikacije["žeton"]);
      });
  }

  public async registracija(uporabnik: Uporabnik): Promise<any> {
    return this.edugeocachePodatkiStoritev
      .registracija(uporabnik)
      .then((rezultatAvtentikacije: RezultatAvtentikacije) => {
        this.shraniZeton(rezultatAvtentikacije["žeton"]);
      })
  }

  public odjava(): void {
    const zeton: string = this.vrniZeton();
    const koristnaVsebina = JSON.parse(this.b64Utf8(zeton.split('.')[1]));
    const { elektronskiNaslov, ime } = JSON.parse(this.b64Utf8(zeton.split('.')[1]));

    this.edugeocachePodatkiStoritev.crniSeznam().subscribe(
      result => {
        this.shramba.removeItem('edugeocache-zeton')
        console.log(result)
      },
      error => {
        console.log(error)
      }
    )
  }

  public vrniZeton(): string {
    return this.shramba.getItem('edugeocache-zeton');
  }

  public shraniZeton(zeton: string): void {
    this.shramba.setItem('edugeocache-zeton', zeton);
  }

}
