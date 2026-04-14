/**
 * Helpers pour le composant Relances
 * 
 * Regroupe les fonctions utilitaires de formatage et calculs
 */

import { Candidature } from '../../../../../core/models/candidature.model';
import { Relance } from '../../../../../core/models/relance.model';

/**
 * Calcule le nombre de jours écoulés depuis une date ISO.
 *
 * @param dateStr Date au format ISO 8601
 * @returns Nombre de jours entiers écoulés (0 si date invalide)
 */
export function getDaysSince(dateStr: string): number {
  if (!dateStr) return 0;

  const diff = new Date().getTime() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Formate une date ISO en format français (DD/MM/YYYY).
 *
 * @param iso Date au format ISO 8601
 * @returns Date formatée ou `'—'` si la date est invalide
 */
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


/**
 * Normalise une heure vers le format HH:mm.
 *
 * Accepte les formats : `HH:mm`, `HH:mm:ss`, et ISO avec `T`.
 *
 * @param heure Heure brute
 * @returns Heure au format HH:mm, ou la valeur originale si non reconnue
 */
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


/**
 * Calcule le pourcentage de relances effectuées pour une candidature.
 *
 * @param candidature Candidature avec ses relances
 * @returns Pourcentage entier (0–100), 0 si aucune relance
 */
export function getProgress(candidature: Candidature): number {
  if (!candidature.relances?.length) return 0;

  const done = candidature.relances.filter((r) => r.faite).length;
  return Math.round((done / candidature.relances.length) * 100);
}


/**
 * Indique si une relance est en retard (date dépassée et non effectuée).
 *
 * @param relance Relance à tester
 * @returns `true` si la date est passée et la relance n'est pas marquée faite
 */
export function isRelanceOverdue(relance: Relance): boolean {
  if (relance.faite) return false;
  return new Date(relance.dateRelance) < new Date();
}

/**
 * Compte le total des relances effectuées sur toutes les candidatures.
 *
 * @param candidatures Liste des candidatures
 * @returns Nombre total de relances marquées comme faites
 */
export function getTotalDoneRelances(candidatures: Candidature[]): number {
  return candidatures.reduce(
    (acc, c) => acc + (c.relances?.filter(r => r.faite).length ?? 0),
    0
  );
}


/**
 * Compte le nombre de candidatures ayant au moins une relance en retard.
 *
 * @param candidatures Liste des candidatures
 * @returns Nombre de candidatures avec relance(s) en retard
 */
export function getPendingRelancesCount(candidatures: Candidature[]): number {
  return candidatures.filter((c) =>
    c.relances?.some((r) => !r.faite && isRelanceOverdue(r))
  ).length;
}

/**
 * Retourne la relance d'un rang donné pour une candidature.
 *
 * @param candidature Candidature source
 * @param rang        Rang souhaité (1 = J+7, 2 = J+14, 3 = J+21)
 * @returns La relance correspondante ou `undefined` si introuvable
 */
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

/**
 * Indique si la candidature a au moins un entretien passé avec résultat positif.
 *
 * @param candidature Candidature à tester
 * @returns `true` si un entretien est passé avec `resultat = 'engage'`
 */
export function hasEntretienReussi(candidature: Candidature): boolean {
  return (candidature.entretiens ?? []).some(
    e => e.statut === 'passe' && e.resultat === 'engage'
  );
}

/**
 * Indique si la candidature a au moins un entretien passé avec résultat négatif.
 *
 * @param candidature Candidature à tester
 * @returns `true` si un entretien est passé avec `resultat = 'negative'`
 */
export function hasEntretienRate(candidature: Candidature): boolean {
  return (candidature.entretiens ?? []).some(
    e => e.statut === 'passe' && e.resultat === 'negative'
  );
}


