import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-private-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './private-sidebar.component.html',
  styleUrls: ['./private-sidebar.component.css'],
})
export class PrivateSidebarComponent {
  private auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
