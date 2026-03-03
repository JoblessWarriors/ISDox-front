import { Component, inject, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import { PageEnum } from '../enums/page-enum';

@Component({
  selector: 'app-documents',
  imports: [],
  templateUrl: './documents.html',
  styleUrl: './documents.css',
})
export class Documents implements OnInit{
  private cookieService = inject(CookieService);

  ngOnInit(): void {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.DOCUMENTS, 
      { sameSite: 'Strict' });
  }

}
