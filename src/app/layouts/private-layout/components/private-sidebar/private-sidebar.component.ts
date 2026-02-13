import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-private-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './private-sidebar.component.html',
  styleUrls: ['./private-sidebar.component.css'],
})
export class PrivateSidebarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  auth = inject(AuthService);

  userMenuOpen = false;
  sidebarOpen = false;
  isAdmin = false;

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;
    });
  }


  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  logout() {
    this.auth.logout();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  // /**
  //  * Vérifie si l'utilisateur connecté a le rôle ROLE_ADMIN
  //  * 
  //  * @description Met à jour la propriété isAdmin
  //  * pour afficher ou masquer le menu Admin dans la sidebar
  //  */
  // private checkAdminRole(): void {
  //   this.authService.me().subscribe({
  //     next: (response) => {
  //       if (response?.user) {
  //         this.isAdmin = response.user.roles?.includes('ROLE_ADMIN') ?? false;
  //         console.log('🔐 [PrivateSidebar] isAdmin:', this.isAdmin);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('❌ [PrivateSidebar] Erreur vérification rôle:', err);
  //       this.isAdmin = false;
  //     }
  //   });
  // }
}
