import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/donor', pathMatch: 'full' },
  { 
    path: 'donor', 
    loadComponent: () => import('./components/donor-registration/donor-registration.component').then(m => m.DonorRegistrationComponent)
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
    // canActivate: [AuthGuard, RoleGuard],
    // data: { roles: ['bd_admin'] }
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
  },
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
    { 
    path: 'unauthorized', 
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  }
];