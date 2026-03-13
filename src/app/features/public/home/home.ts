import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ToastService } from '../../../core/ui/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  ngOnInit(): void {
    const error = this.route.snapshot.queryParamMap.get('error');
    
    if (error === 'account_deleted') {
      this.toast.show(
        'Ce compte a été supprimé. La connexion est impossible.',
        'error'
      );
      window.history.replaceState({}, '', window.location.pathname);
    } else if (error === 'token') {
      console.error('❌ Erreur d\'authentification Google détectée');
      this.toast.show(
        '❌ Erreur lors de la connexion avec Google. Veuillez réessayer.',
        'error'
      );
      window.history.replaceState({}, '', window.location.pathname);
    }
  }
}
