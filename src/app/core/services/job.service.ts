/**
 * Service de récupération des offres d'emploi.
 *
 * Interroge le backend (`GET /api/jobs`) qui agrège les offres depuis l'API Adzuna.
 * Gère la pagination et normalise les réponses pour s'adapter aux différentes
 * formes que peut retourner l'API (tableau direct, `{ data, pagination }`, `{ jobs }`).
 *
 * @see AnnoncesComponent — Composant consommateur principal
 * @see AnnonceFilterService — Fournit les filtres ville/poste
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Job } from '../models/job.model';
import { environment } from '../../../environments/environment';

/** Réponse paginée de l'API jobs. */
export interface JobsResponse {
  /** Liste des annonces de la page courante */
  jobs: Job[];
  
  /** Indicateur de présence d'autres pages */
  hasMore: boolean;
  
  /** Nombre total d'annonces disponibles (optionnel) */
  total?: number;
}

/**
 * Service d'offres d'emploi.
 *
 * Point d'entrée unique pour la récupération et la normalisation des offres.
 * La normalisation (`normalizeJob`) gère les différences de nommage entre
 * l'API Adzuna et le format interne (camelCase / snake_case).
 */
@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly API_URL = `${environment.apiUrl}/jobs`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère les offres d'emploi avec pagination
   * 
   * @param filtre Filtres de recherche (ville, poste)
   * @param page Numéro de page (commence à 1)
   * @returns Observable contenant les jobs et l'indicateur hasMore
   */
  getJobs(filtre?: { ville?: string; poste?: string }, page: number = 1): Observable<JobsResponse> {
    const params: any = { page: page.toString() };

    if (filtre?.ville) params.ville = filtre.ville;
    if (filtre?.poste) params.poste = filtre.poste;

    return this.http.get<any>(this.API_URL, { params }).pipe(
      map((response) => this.normalizeJobsResponse(response))
    );
  }

  private normalizeJobsResponse(response: any): JobsResponse {
    if (Array.isArray(response)) {
      return { jobs: this.normalizeJobs(response), hasMore: false };
    }

    if (response?.data) {
      return {
        jobs: this.normalizeJobs(response.data),
        hasMore: response.pagination?.hasMore ?? false,
        total: response.pagination?.total ?? response.total,
      };
    }

    if (response?.jobs) {
      return {
        jobs: this.normalizeJobs(response.jobs),
        hasMore: response.hasMore ?? false,
        total: response.total,
      };
    }

    return { jobs: [], hasMore: false };
  }

  private normalizeJobs(list: any[]): Job[] {
    return (list ?? []).map((raw) => this.normalizeJob(raw));
  }

  private normalizeJob(raw: any): Job {
    const externalId = raw?.externalId ?? raw?.id ?? raw?.external_id ?? '';
    const title = raw?.title ?? '';
    const company = raw?.company?.name ?? raw?.company ?? '';
    const location = raw?.location ?? raw?.city ?? '';
    const contractType = raw?.contractType ?? raw?.job_type ?? raw?.contract_type ?? 'Non spécifié';
    const salaryMin = raw?.salaryMin ?? raw?.salary_min ?? null;
    const salaryMax = raw?.salaryMax ?? raw?.salary_max ?? null;
    const redirectUrl = raw?.redirectUrl ?? raw?.redirect_url ?? '';

    return {
      ...raw,
      externalId: String(externalId),
      title,
      company,
      location,
      contractType,
      salaryMin,
      salaryMax,
      redirectUrl,
    } as Job;
  }
}