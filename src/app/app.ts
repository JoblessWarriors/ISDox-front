import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { SpinnerComponent } from "./service/spinner/spinner-component";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Navbar,
    SpinnerComponent
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private translate = inject(TranslateService);

  protected readonly title = signal('ISDox-front');

  constructor() {
    this.translate.addLangs(['ro', 'en-US']);
    this.translate.setFallbackLang('en-US');
    this.translate.use('en-US');
  }
}
