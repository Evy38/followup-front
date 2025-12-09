import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  templateUrl: './private-layout.html',
  styleUrls: ['./private-layout.css'],
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
})
export class PrivateLayoutComponent {}
