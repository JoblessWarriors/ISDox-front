import { Component, inject } from '@angular/core';
import { SpinnerService } from './spinner-service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner-component',
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './spinner-component.html',
  styleUrl: './spinner-component.css',
})
export class SpinnerComponent {
  protected spinnerService = inject(SpinnerService);
}
