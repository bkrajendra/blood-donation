import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/donor', pathMatch: 'full' },
  { 
    path: 'donor', 
    loadComponent: () => import('./components/donor-registration/donor-registration.component').then(m => m.DonorRegistrationComponent)
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
  }
];