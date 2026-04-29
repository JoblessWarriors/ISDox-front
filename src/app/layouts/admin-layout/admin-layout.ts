import { Component } from '@angular/core';
import { AdminHomepage } from '../../admin/admin-homepage/admin-homepage';
import { SpinnerComponent } from '../../service/spinner/spinner-component';
import { ToastModule } from 'primeng/toast';
import { AdminNavbar } from '../../admin/admin-navbar/admin-navbar';

@Component({
  selector: 'app-admin-layout',
  imports: [
    AdminHomepage,
    SpinnerComponent,
    ToastModule,
    AdminNavbar
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

}
