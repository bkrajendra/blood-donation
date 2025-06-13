import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Statistics } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 style="color: #dc2626;">Live Dashboard</h2>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div class="form-group" style="margin: 0;">
            <select 
              class="form-input" 
              [(ngModel)]="selectedYear" 
              (change)="onYearChange()"
              style="min-width: 150px;">
              <option value="">All Time</option>
              <option *ngFor="let year of availableYears" [value]="year">{{year}}</option>
            </select>
          </div>
          <span style="color: #64748b; font-size: 0.875rem;">
            Last updated: {{lastUpdated | date:'short'}}
          </span>
          <button class="btn btn-secondary" (click)="refreshStats()" [disabled]="loading">
            {{loading ? 'Refreshing...' : 'Refresh'}}
          </button>
        </div>
      </div>

      <div *ngIf="loading && !stats" class="loading">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <div *ngIf="stats" class="stats-grid slide-up">
        <div class="stat-card">
          <div class="stat-value">{{stats.total}}</div>
          <div class="stat-label">Total Registrations</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
            {{selectedYear ? selectedYear : 'All Time'}}
          </div>
        </div>

        <div class="stat-card" style="border-left-color: #16a34a;">
          <div class="stat-value" style="color: #16a34a;">{{stats.donated}}</div>
          <div class="stat-label">Successfully Donated</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
            {{selectedYear ? selectedYear : 'All Time'}}
          </div>
        </div>

        <div class="stat-card" style="border-left-color: #f59e0b;">
          <div class="stat-value" style="color: #f59e0b;">{{stats.pending}}</div>
          <div class="stat-label">Pending Checkup</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
            {{selectedYear ? selectedYear : 'All Time'}}
          </div>
        </div>

        <div class="stat-card" style="border-left-color: #ef4444;">
          <div class="stat-value" style="color: #ef4444;">{{stats.rejected}}</div>
          <div class="stat-label">Not Eligible</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
            {{selectedYear ? selectedYear : 'All Time'}}
          </div>
        </div>
      </div>

      <div *ngIf="stats" class="card slide-up">
        <h3 style="margin-bottom: 1.5rem; color: #374151;">
          Donation Progress 
          <span style="font-size: 1rem; color: #64748b; font-weight: normal;">
            ({{selectedYear ? selectedYear : 'All Time'}})
          </span>
        </h3>
        
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span style="font-weight: 600;">Success Rate</span>
            <span style="font-weight: 600; color: #16a34a;">{{stats.donationRate}}%</span>
          </div>
          <div style="width: 100%; height: 20px; background-color: #e5e7eb; border-radius: 10px; overflow: hidden;">
            <div 
              style="height: 100%; background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%); transition: width 0.5s ease;"
              [style.width.%]="stats.donationRate">
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem;">
          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">
              {{getSuccessEmoji()}}
            </div>
            <div style="font-size: 1.25rem; font-weight: 600; color: #16a34a;">
              {{stats.donated}} Donations
            </div>
            <div style="color: #64748b; font-size: 0.875rem;">
              Lives Saved: {{stats.donated * 3}}
            </div>
          </div>

          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">
              ⏳
            </div>
            <div style="font-size: 1.25rem; font-weight: 600; color: #f59e0b;">
              {{stats.pending}} Pending
            </div>
            <div style="color: #64748b; font-size: 0.875rem;">
              Awaiting Checkup
            </div>
          </div>

          <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">
              📊
            </div>
            <div style="font-size: 1.25rem; font-weight: 600; color: #6366f1;">
              {{getTotalBloodVolume()}}ml
            </div>
            <div style="color: #64748b; font-size: 0.875rem;">
              Total Blood Collected
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="stats" class="card slide-up">
        <h3 style="margin-bottom: 1.5rem; color: #374151;">
          Impact Summary 
          <span style="font-size: 1rem; color: #64748b; font-weight: normal;">
            ({{selectedYear ? selectedYear : 'All Time'}})
          </span>
        </h3>
        <div style="background: linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%); padding: 1.5rem; border-radius: 8px;">
          <p style="font-size: 1.125rem; line-height: 1.6; margin: 0;">
            🎉 <strong>Congratulations!</strong> 
            {{selectedYear ? 'In ' + selectedYear + ', we' : 'Through this blood donation drive, we'}} have collected 
            <strong style="color: #dc2626;">{{getTotalBloodVolume()}}ml</strong> of blood from 
            <strong style="color: #dc2626;">{{stats.donated}}</strong> generous donors. 
            This amount can potentially save up to 
            <strong style="color: #dc2626;">{{stats.donated * 3}}</strong> lives, making a significant 
            impact on our community's health and well-being.
          </p>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: Statistics | null = null;
  availableYears: number[] = [];
  selectedYear: string = '';
  loading = false;
  lastUpdated = new Date();
  private intervalId: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAvailableYears();
    this.loadStats();
    
    // Auto-refresh every 30 seconds
    this.intervalId = setInterval(() => {
      this.loadStats();
    }, 30000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async loadAvailableYears() {
    try {
      this.availableYears = await this.apiService.getAvailableYears().toPromise() || [];
    } catch (error) {
      console.error('Error loading available years:', error);
    }
  }

  async loadStats() {
    try {
      const year = this.selectedYear ? parseInt(this.selectedYear) : undefined;
      this.stats = await this.apiService.getStatistics(year).toPromise() || null;
      this.lastUpdated = new Date();
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  async onYearChange() {
    await this.loadStats();
  }

  async refreshStats() {
    this.loading = true;
    await this.loadStats();
    this.loading = false;
  }

  getSuccessEmoji(): string {
    if (!this.stats) return '🩸';
    
    if (this.stats.donated >= 50) return '🏆';
    if (this.stats.donated >= 25) return '🎯';
    if (this.stats.donated >= 10) return '⭐';
    return '🩸';
  }

  getTotalBloodVolume(): number {
    return this.stats ? this.stats.donated * 450 : 0; // Average blood donation is 450ml
  }
}