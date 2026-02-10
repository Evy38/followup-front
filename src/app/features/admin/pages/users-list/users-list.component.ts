
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  // ============================================================
  // SERVICES INJECTÉS
  // ============================================================
  private readonly userService = inject(UserService);

  // ============================================================
  // PROPRIÉTÉS DU COMPOSANT
  // ============================================================
  
  /** Liste complète des utilisateurs */
  users: User[] = [];
  
  /** Liste filtrée affichée à l'écran */
  filteredUsers: User[] = [];
  
  /** État de chargement des données */
  loading = false;
  
  /** Message d'erreur éventuel */
  errorMessage: string | null = null;
  
  /** Terme de recherche pour le filtrage */
  searchTerm = '';

  // ============================================================
  // LIFECYCLE HOOKS
  // ============================================================

  /**
   * Initialisation du composant
   * Charge la liste des utilisateurs au démarrage
   */
  ngOnInit(): void {
    this.loadUsers();
  }

  // ============================================================
  // MÉTHODES PUBLIQUES
  // ============================================================

  loadUsers(): void {
    this.loading = true;
    this.errorMessage = null;

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ [UsersListComponent] Erreur de chargement:', error);
        this.errorMessage = error.message || 'Impossible de charger les utilisateurs';
        this.loading = false;
      }
    });
  }

  /**
   * Filtre la liste des utilisateurs selon le terme de recherche
   * 
   */
  onSearch(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      // Pas de recherche : affiche tous les utilisateurs
      this.filteredUsers = this.users;
      return;
    }

    // Filtre par email, prénom ou nom
    this.filteredUsers = this.users.filter((user) => {
      const email = user.email?.toLowerCase() || '';
      const firstName = user.firstName?.toLowerCase() || '';
      const lastName = user.lastName?.toLowerCase() || '';

      return (
        email.includes(term) ||
        firstName.includes(term) ||
        lastName.includes(term)
      );
    });

    console.log(`🔍 [UsersListComponent] Recherche "${term}" : ${this.filteredUsers.length} résultat(s)`);
  }

  /**
   * Réinitialise la recherche et affiche tous les utilisateurs
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredUsers = this.users;
    console.log('🔄 [UsersListComponent] Recherche réinitialisée');
  }

  // ============================================================
  // GETTERS (PROPRIÉTÉS CALCULÉES)
  // ============================================================

  /**
   * Nombre total d'utilisateurs
   */
  get totalUsers(): number {
    return this.users.length;
  }

  /**
   * Nombre d'administrateurs
   */
  get totalAdmins(): number {
    return this.users.filter((user) => user.roles?.includes('ROLE_ADMIN')).length;
  }

  /**
   * Nombre d'utilisateurs standard
   */
  get totalRegularUsers(): number {
    return this.users.filter((user) => !user.roles?.includes('ROLE_ADMIN')).length;
  }

  /**
   * Nombre d'utilisateurs avec email vérifié
   */
  get totalVerifiedUsers(): number {
    return this.users.filter((user) => user.isVerified).length;
  }

  // ============================================================
  // MÉTHODES UTILITAIRES
  // ============================================================

  /**
   * Vérifie si un utilisateur est administrateur
   * 
   * @param user Utilisateur à vérifier
   * @returns true si l'utilisateur a ROLE_ADMIN
   */
  isAdmin(user: User): boolean {
    return user.roles?.includes('ROLE_ADMIN') ?? false;
  }

  /**
   * Retourne un badge de rôle formaté
   * 
   * @param user Utilisateur
   * @returns Chaîne affichable (ex: "Admin", "Utilisateur")
   */
  getRoleBadge(user: User): string {
    return this.isAdmin(user) ? 'Admin' : 'Utilisateur';
  }

  /**
   * Retourne un badge de statut de vérification
   * 
   * @param user Utilisateur
   * @returns Chaîne affichable (ex: "Vérifié", "Non vérifié")
   */
  getVerificationBadge(user: User): string {
    return user.isVerified ? 'Vérifié' : 'Non vérifié';
  }
}