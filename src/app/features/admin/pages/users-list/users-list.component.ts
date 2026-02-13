
import { Component, OnInit, inject, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { ToastService } from '../../../../core/ui/toast.service';
import { User } from '../../../../core/models/user.model';
import { ConfirmModalComponent } from '../../../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);

  // ============================================================
  // SERVICES INJECTÉS
  // ============================================================
  private readonly userService = inject(UserService);
  private readonly toast = inject(ToastService);

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

  // Modal de confirmation pour hard delete
  showDeleteModal = false;
  userToDelete: User | null = null;
  deletingUser = false;

  // Filtre de statut
  selectedFilter: 'active' | 'deleted' | 'all' = 'all';

  // Gestion des updates de role
  updatingRoleIds = new Set<number>();
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
        this.applyFilters();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ [UsersListComponent] Erreur de chargement:', error);
        this.errorMessage = error.message || 'Impossible de charger les utilisateurs';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Change le filtre de statut
   */
  changeFilter(filter: 'active' | 'deleted' | 'all'): void {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  /**
   * Applique les filtres (statut + recherche)
   */
  private applyFilters(): void {
    // Filtrer par statut d'abord
    let filtered = this.users.filter(user => {
      const hasDeletionRequest = this.hasValue(user.deletionRequestedAt);
      const notHardDeleted = !this.hasValue(user.deletedAt);
      
      switch (this.selectedFilter) {
        case 'active':
          return !hasDeletionRequest && notHardDeleted;
        case 'deleted':
          return hasDeletionRequest && notHardDeleted;
        case 'all':
        default:
          return notHardDeleted;
      }
    });

    // Puis appliquer la recherche
    const term = this.searchTerm.toLowerCase().trim();
    if (term) {
      filtered = filtered.filter((user) => {
        const email = user.email?.toLowerCase() || '';
        const firstName = user.firstName?.toLowerCase() || '';
        const lastName = user.lastName?.toLowerCase() || '';

        return (
          email.includes(term) ||
          firstName.includes(term) ||
          lastName.includes(term)
        );
      });
    }

    this.filteredUsers = filtered;
  }

  /**
   * Vérifie si une valeur (date ou autre) est définie/non-null
   * Gère les dates comme objets ou chaînes
   */
  private hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }

  /**
   * Filtre la liste des utilisateurs selon le terme de recherche
   * 
   */
  onSearch(): void {
    this.applyFilters();
  }

  /**
   * Réinitialise la recherche et affiche tous les utilisateurs
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
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

  /**
   * Nombre d'utilisateurs en attente de suppression
   */
  get totalPendingDeletion(): number {
    return this.users.filter((user) => user.deletionRequestedAt && !user.deletedAt).length;
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

  isUpdatingRole(user: User): boolean {
    return this.updatingRoleIds.has(user.id);
  }

  toggleAdminRole(user: User): void {
    if (this.isUpdatingRole(user)) return;

    const makeAdmin = !this.isAdmin(user);
    const nextRoles = this.buildRoles(makeAdmin);

    this.updatingRoleIds.add(user.id);

    this.userService.updateUser(user.id, { roles: nextRoles }).subscribe({
      next: (updated) => {
        user.roles = updated.roles;
        this.applyFilters();
        this.toast.show(
          makeAdmin
            ? `Rôle admin accordé à ${user.email}`
            : `Rôle admin retiré pour ${user.email}`,
          'success'
        );
        this.updatingRoleIds.delete(user.id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.show(err.message || 'Erreur lors de la mise à jour du rôle', 'error');
        console.error('❌ [UsersListComponent] Erreur mise à jour rôle:', err);
        this.updatingRoleIds.delete(user.id);
        this.cdr.detectChanges();
      }
    });
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

  /**
   * Vérifie si un utilisateur est marqué pour suppression (soft delete)
   * 
   * @param user Utilisateur à vérifier
   * @returns true si l'utilisateur a demandé la suppression
   */
  isMarkedForDeletion(user: User): boolean {
    const hasDeletionRequest = this.hasValue(user.deletionRequestedAt);
    const notHardDeleted = !this.hasValue(user.deletedAt);
    return hasDeletionRequest && notHardDeleted;
  }

  private buildRoles(makeAdmin: boolean): string[] {
    return makeAdmin ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER'];
  }

  /**
   * Ouvre la modal de confirmation pour hard delete
   * 
   * @param user Utilisateur à supprimer
   */
  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  /**
   * Ferme la modal de confirmation
   */
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  /**
   * TrackBy pour optimiser le ngFor
   */
  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  /**
   * Confirme la suppression (hard delete) d'un utilisateur
   */
  confirmDeleteUser(): void {
    if (!this.userToDelete) return;

    this.deletingUser = true;
    const userId = this.userToDelete.id;
    const userEmail = this.userToDelete.email;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.deletingUser = false;
        this.showDeleteModal = false;
        this.toast.show(`Utilisateur ${userEmail} supprimé avec succès`, 'success');
        
        // Rechargement de la liste
        this.loadUsers();
      },
      error: (err) => {
        this.deletingUser = false;
        this.toast.show(err.message || 'Erreur lors de la suppression', 'error');
        console.error('❌ [UsersListComponent] Erreur suppression:', err);
      }
    });
  }
}