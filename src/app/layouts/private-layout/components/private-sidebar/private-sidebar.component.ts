import { Component, OnInit, inject, HostListener } from '@angular/core';
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userMenuTrigger = target.closest('.user-menu-trigger');
    const userMenu = target.closest('.user-menu');
    
    // Fermer le menu si on clique en dehors
    if (!userMenuTrigger && !userMenu && this.userMenuOpen) {
      this.userMenuOpen = false;
    }
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

}
