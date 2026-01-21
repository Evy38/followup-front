import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ToastComponent } from '../../shared/toast/toast.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  templateUrl: './public-layout.html',
  styleUrls: ['./public-layout.css'],
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastComponent,
    RouterOutlet,
  ],
})
export class PublicLayoutComponent {}
