import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app">
      <header class="header">
        <div class="container">
          <h1>Confluxsys Blood Donation Drive 🩸</h1>
        </div>
      </header>
      
      <nav class="nav">
        <div class="container">
          <ul class="nav-links">
            <li><a routerLink="/donor" routerLinkActive="active" class="nav-link">Donor Registration</a></li>
            <li><a routerLink="/admin" routerLinkActive="active" class="nav-link">Admin Panel</a></li>
            <li><a routerLink="/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a></li>
            <li><a routerLink="/reports" routerLinkActive="active" class="nav-link">Reports</a></li>
          </ul>
        </div>
      </nav>
      
      <main class="container" style="padding-top: 2rem;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {
  title = 'Confluxsys Blood Donation Drive 🩸';
}