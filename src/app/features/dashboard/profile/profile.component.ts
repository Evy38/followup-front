import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService, UpdateProfilePayload } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ToastService } from '../../../core/ui/toast.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  user: User | null = null;

  loading = false;

  // Form fields
  email = '';
  firstName = '';
  lastName = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    this.loadProfile();
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
}
