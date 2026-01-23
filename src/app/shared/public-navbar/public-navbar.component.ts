import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.css'],
})
export class NavbarComponent {}
