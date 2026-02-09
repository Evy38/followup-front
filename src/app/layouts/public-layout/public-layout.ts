import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/public-navbar/public-navbar.component';
import { ToastComponent } from '../../shared/toast/toast.component';
import { PublicFooterComponent } from '../../shared/public-footer/public-footer.component';

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
    PublicFooterComponent,
  ],
})
export class PublicLayoutComponent {}
