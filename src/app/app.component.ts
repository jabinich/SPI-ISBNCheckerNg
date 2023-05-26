import { Component } from '@angular/core';
import { IsbnService } from './isbn.service';
import { ISBN } from './isbn.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SPI-ISBNCheckerNg';

  input: string = "";
  // isFormat: boolean = false;
  // isValid: boolean = false;
  // isbnType: string = "";
  // isbnFinal: string = "";

  isbn: ISBN = {} as ISBN;

  isServError: boolean = false;

  //Texte für die Ausgabe nach Prüfung
  txtError: string = "";
  txtWarning: string = "";
  txtValidity: string = "";

  //Sichtbarkeit 
  visError: boolean = false;
  visWarning: boolean = false;
  visValidity: boolean = false;

  constructor(private ibsnService: IsbnService){}

  validate(): void {
    this.ibsnService.validate(this.input).subscribe({
      next: (isbn) => {
        this.isbn = isbn;
        this.setResultOutput();
      },
      error: (err) => {
        console.debug('Error', err);
        this.isServError = true;
        this.setResultOutput();
      }
    });
  }

  setResultOutput(): void {
    this.resetInput();

    if (this.isServError){
      this.visError = true;
      this.visWarning = false;
      this.visValidity = false;

      this.txtError = 'Serverfehler!';
    }
    else if (this.isbn.isvalid) { //ISBN gültig
      this.visError = false;
      this.visWarning = false;
      this.visValidity = true;

      this.txtValidity = 'Gültige ' + this.isbn.isbntype + ': ' + this.isbn.isbnfinal;
    }
    else if (this.isbn.isformat){ //Format richtig, die Prüfziffer falsch
      this.visError = true;
      this.visWarning = true;
      this.visValidity = true;

      this.txtError = 'Die eingegebene ' + this.isbn.isformat + ' ist nicht gültig.';
      this.txtWarning = 'Die Prüfziffer wurde korrigirt.';
      this.txtValidity = this.isbn.isbnfinal;
    }
    else if (this.isbn.isbnfinal == ""){ //Format ganz falsch, nicht 9 oder 12 stellig
      this.visError = true;
      this.visWarning = false;
      this.visValidity = false;

      this.txtError = 'Falsches Format! Bitte erneut eingeben.';
    }
    else { //Format falsch es fehlt nur die Prüfziffer
      this.visError = true;
      this.visWarning = true;
      this.visValidity = true;

      this.txtError = 'Der eingegebenen '+ this.isbn.isbntype +' fehlt die Prüfziffer.';
      this.txtWarning = 'Die Prüfziffer wurde berechnet.';
      this.txtValidity = this.isbn.isbnfinal;
    }
  }

  resetInput(): void {
    this.input = "";

    this.isServError = false;
    this.visError = false;
    this.visWarning = false;
    this.visValidity = false;

  }

}
