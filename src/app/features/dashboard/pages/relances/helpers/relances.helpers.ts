/**
 * Helpers pour le composant Relances
 * 
 * Regroupe les fonctions utilitaires de formatage et calculs
 */

import { Candidature } from '../../../models/candidature.model';
import { Relance } from '../../../models/relance.model';

export function getDaysSince(dateStr: string): number {
  if (!dateStr) return 0;

  const diff = new Date().getTime() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatDate(iso: string): string {
  if (!iso) return '—';

  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(d);
  } catch {
    return '—';
  }
}


export function formatHeure(heure: string): string {
  if (!heure) return '';

  // Format déjà correct hh:mm
  if (/^\d{2}:\d{2}$/.test(heure)) return heure;

  // Format ISO avec T
  const matchISO = heure.match(/T(\d{2}):(\d{2})/);
  if (matchISO) return `${matchISO[1]}:${matchISO[2]}`;

  // Format hh:mm:ss
  if (/^\d{2}:\d{2}:\d{2}/.test(heure)) return heure.slice(0, 5);

  return heure;
}


export function getProgress(candidature: Candidature): number {
  if (!candidature.relances?.length) return 0;

  const done = candidature.relances.filter((r) => r.faite).length;
  return Math.round((done / candidature.relances.length) * 100);
}


export function isRelanceOverdue(relance: Relance): boolean {
  if (relance.faite) return false;
  return new Date(relance.dateRelance) < new Date();
}

export function getTotalDoneRelances(candidatures: Candidature[]): number {
  return candidatures.reduce(
    (acc, c) => acc + (c.relances?.filter(r => r.faite).length ?? 0),
    0
  );
}


export function getPendingRelancesCount(candidatures: Candidature[]): number {
  return candidatures.filter((c) =>
    c.relances?.some((r) => !r.faite && isRelanceOverdue(r))
  ).length;
}

export function getRelanceByRang(
  candidature: Candidature,
  rang: number
): Relance | undefined {
  return candidature.relances?.find((r) => r.rang === rang);
}

/**
 * Calcule le nombre d'entretiens prévus
 */
export function getNbEntretiensPrevus(candidature: Candidature): number {
  return candidature.entretiens?.filter(e => e.statut === 'prevu').length ?? 0;
}

/**
 * Vérifie si la candidature a au moins un entretien prévu
 */
export function hasEntretienPrevu(c: Candidature): boolean {
  return !!c.entretiens?.some(e => e.statut === 'prevu');
}

export function hasEntretienReussi(candidature: Candidature): boolean {
  return (candidature.entretiens ?? []).some(
    e => e.statut === 'passe' && e.resultat === 'engage'
  );
}

export function hasEntretienRate(candidature: Candidature): boolean {
  return (candidature.entretiens ?? []).some(
    e => e.statut === 'passe' && e.resultat === 'negative'
  );
}


export function getEtatCandidature(candidature: Candidature): string {
  const entretiens = candidature.entretiens ?? [];

  // Cas sans entretien : se base sur statutReponse
  if (!entretiens.length) {
    switch (candidature.statutReponse) {
      case 'negative':
        return 'Refusé';
      case 'echanges':
        return 'Échanges en cours';
      case 'engage':
        return 'Engagé';
      case 'attente':
      default:
        return 'En attente de retour';
    }
  }

  // Cas avec entretiens : affiche le prochain prévu
  const prochains = entretiens
    .filter(e => e.statut === 'prevu')
    .sort((a, b) =>
      `${a.dateEntretien}T${a.heureEntretien}`.localeCompare(
        `${b.dateEntretien}T${b.heureEntretien}`
      )
    );

  if (prochains.length) {
    const e = prochains[0];
    return `Entretien prévu le ${formatDate(e.dateEntretien)} à ${e.heureEntretien}`;
  }

  // Entretiens passés : cherche le résultat
  const passes = entretiens.filter(e => e.statut === 'passe');

  if (passes.some(e => e.resultat === 'engage')) {
    return 'Entretien réussi';
  }

  if (passes.some(e => e.resultat === 'negative')) {
    return 'Entretien refusé';
  }

  return 'Entretien passé – en attente de retour';
}