import { Component, inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PageEnum } from '../enums/page-enum';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  private cookieService = inject(CookieService);

  ngOnInit(): void {
    this.cookieService.set('lastVisitedPage', PageEnum.HOME, 
      { sameSite: 'Strict' });
  }
}
