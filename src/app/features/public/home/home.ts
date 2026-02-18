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
    
    if (error === 'token') {
      console.error('❌ Erreur d\'authentification Google détectée');
      this.toast.show(
        '❌ Erreur lors de la connexion avec Google. Veuillez réessayer.',
        'error'
      );
      
      // Nettoyer l'URL en supprimant le paramètre error
      window.history.replaceState({}, '', window.location.pathname);
    }
  }
}
