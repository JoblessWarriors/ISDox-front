import { Component } from '@angular/core';
import { Navbar } from "../../navbar/navbar";
import { SpinnerComponent } from "../../service/spinner/spinner-component";
import { RouterOutlet } from "@angular/router";
import { ToastModule, Toast } from 'primeng/toast';

@Component({
  selector: 'app-normal-layout',
  imports: [
    Navbar, 
    SpinnerComponent, 
    RouterOutlet,
    ToastModule
  ],
  templateUrl: './normal-layout.html',
  styleUrl: './normal-layout.css',
})
export class NormalLayout {

}
