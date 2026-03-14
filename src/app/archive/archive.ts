import { Component, inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { PageEnum } from '../enums/page-enum';

@Component({
  selector: 'app-archive',
  imports: [],
  templateUrl: './archive.html',
  styleUrl: './archive.css',
})
export class Archive implements OnInit{
  private cookieService = inject(CookieService);

  ngOnInit(): void {
    this.cookieService.set('ISDox_lastVisitedPage', PageEnum.ARCHIVE, 
      { path: '/', sameSite: 'Strict' });
  }
}
