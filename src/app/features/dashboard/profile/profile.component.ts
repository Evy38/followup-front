import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService, UpdateProfilePayload } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/ui/toast.service';
import { User } from '../../../core/models/user.model';
import { ConfirmModalComponent } from '../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  user: User | null = null;

  loading = false;
  deletingAccount = false;
  showDeleteModal = false;

  // Form fields
  email = '';
  firstName = '';
  lastName = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    // Utiliser directement les données de l'utilisateur déjà en mémoire
    const currentUser = this.authService.currentUser;
    if (currentUser) {
      this.user = currentUser;
      this.email = currentUser.email;
      this.firstName = currentUser.firstName ?? '';
      this.lastName = currentUser.lastName ?? '';
    } else {
      // Fallback si l'utilisateur n'est pas en mémoire (cas rare)
      this.loadProfile();
    }
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.email = user.email;
        this.firstName = user.firstName ?? '';
        this.lastName = user.lastName ?? '';
      },
      error: () => {
        this.toast.show('Impossible de charger le profil', 'error');
      }
    });
  }

  updateProfile(): void {

    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.toast.show('Les mots de passe ne correspondent pas', 'error');
      return;
    }

    const payload: UpdateProfilePayload = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName
    };

    if (this.newPassword) {
      payload.currentPassword = this.currentPassword;
      payload.newPassword = this.newPassword;
    }

    this.loading = true;

    this.profileService.updateProfile(payload).subscribe({
      next: (updatedUser) => {
        this.loading = false;
        this.authService.updateUserInMemory(updatedUser);
        this.toast.show('Profil mis à jour avec succès', 'success');

        // Reset password fields
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.loading = false;
        this.toast.show(err.message || 'Erreur lors de la mise à jour', 'error');
      }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDeleteAccount(): void {
    this.deletingAccount = true;

    this.profileService.deleteProfile().subscribe({
      next: (response) => {
        this.deletingAccount = false;
        this.showDeleteModal = false;
        this.toast.show(response.message || 'Demande de suppression envoyée', 'success');
        
        // Déconnexion après 2 secondes
        setTimeout(() => {
          this.authService.logout();
        }, 2000);
      },
      error: (err) => {
        this.deletingAccount = false;
        this.toast.show(err.error?.message || 'Erreur lors de la suppression', 'error');
      }
    });
  }
}
