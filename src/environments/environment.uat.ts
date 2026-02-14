// Environnement UAT (User Acceptance Testing)
// Utilisé pour la validation client avant mise en production
export const environment = {
  production: true,
  backendUrl: 'https://followup-api.onrender.com/api', // Même backend que prod pour la démo
  apiUrl: 'https://followup-api.onrender.com/api',
  environmentName: 'UAT' // Utile pour le debugging
};