import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, User, Donation, Statistics } from '../../services/api.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 style="color: #dc2626;">Blood Donation Reports</h2>
        <div style="display: flex; gap: 1rem; align-items: center;">
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
          <button class="btn btn-secondary" (click)="exportReport()">
            📊 Export Report
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div *ngIf="stats" class="stats-grid slide-up">
        <div class="stat-card">
          <div class="stat-value">{{stats.total}}</div>
          <div class="stat-label">Total Participants</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
            {{selectedYear ? selectedYear : 'All Time'}}
          </div>
        </div>

        <div class="stat-card" style="border-left-color: #16a34a;">
          <div class="stat-value" style="color: #16a34a;">{{stats.donated}}</div>
          <div class="stat-label">Successful Donations</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
            {{selectedYear ? selectedYear : 'All Time'}}
          </div>
        </div>

        <div class="stat-card" style="border-left-color: #ef4444;">
          <div class="stat-value" style="color: #ef4444;">{{stats.rejected}}</div>
          <div class="stat-label">Rejected Donations</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
            {{selectedYear ? selectedYear : 'All Time'}}
          </div>
        </div>

        <div class="stat-card" style="border-left-color: #6366f1;">
          <div class="stat-value" style="color: #6366f1;">{{stats.donationRate}}%</div>
          <div class="stat-label">Success Rate</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
            {{selectedYear ? selectedYear : 'All Time'}}
          </div>
        </div>
      </div>

      <!-- Blood Group Analysis -->
      <div class="card slide-up">
        <h3 style="margin-bottom: 1.5rem; color: #374151;">
          Blood Group Distribution 
          <span style="font-size: 1rem; color: #64748b; font-weight: normal;">
            ({{selectedYear ? selectedYear : 'All Time'}})
          </span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
          <div *ngFor="let group of bloodGroupStats" 
               style="background: #f8fafc; padding: 1rem; border-radius: 8px; text-align: center;">
            <div style="font-size: 1.5rem; font-weight: 700; color: #dc2626; margin-bottom: 0.25rem;">
              {{group.count}}
            </div>
            <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem;">
              {{group.bloodGroup}}
            </div>
            <div style="font-size: 0.75rem; color: #9ca3af;">
              {{group.percentage}}%
            </div>
          </div>
        </div>
      </div>

      <!-- Age Group Analysis -->
      <div class="card slide-up">
        <h3 style="margin-bottom: 1.5rem; color: #374151;">
          Age Group Analysis 
          <span style="font-size: 1rem; color: #64748b; font-weight: normal;">
            ({{selectedYear ? selectedYear : 'All Time'}})
          </span>
        </h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
          <div *ngFor="let ageGroup of ageGroupStats" 
               style="background: #f8fafc; padding: 1.5rem; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-weight: 600;">{{ageGroup.range}}</span>
              <span style="font-weight: 700; color: #dc2626;">{{ageGroup.count}}</span>
            </div>
            <div style="width: 100%; height: 8px; background-color: #e5e7eb; border-radius: 4px; overflow: hidden;">
              <div 
                style="height: 100%; background-color: #dc2626; transition: width 0.5s ease;"
                [style.width.%]="ageGroup.percentage">
              </div>
            </div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">
              {{ageGroup.percentage}}% of total
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Donations Table -->
      <div class="card slide-up">
        <h3 style="margin-bottom: 1.5rem; color: #374151;">
          Detailed Donation Records 
          <span style="font-size: 1rem; color: #64748b; font-weight: normal;">
            ({{selectedYear ? selectedYear : 'All Time'}})
          </span>
        </h3>
        
        <div *ngIf="loadingDonations" class="loading">
          <div class="spinner"></div>
        </div>

        <div *ngIf="!loadingDonations && donations.length > 0">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Donor Name</th>
                  <th>Mobile</th>
                  <th>Blood Group</th>
                  <th>Age</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Health Issues</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let donation of donations">
                  <td>{{donation.user?.name}}</td>
                  <td>{{donation.user?.mobile}}</td>
                  <td>{{donation.user?.bloodGroup}}</td>
                  <td>{{donation.user?.age}}</td>
                  <td>{{formatDate(donation.createdAt)}}</td>
                  <td>
                    <span [class]="'status-badge status-' + getStatusClass(donation.status)">
                      {{donation.status}}
                    </span>
                  </td>
                  <td>
                    <span [class]="donation.user?.hasHealthIssues ? 'text-warning' : 'text-success'">
                      {{donation.user?.hasHealthIssues ? 'Yes' : 'No'}}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div *ngIf="!loadingDonations && donations.length === 0" 
             style="text-align: center; padding: 2rem; color: #64748b;">
          No donation records found for {{selectedYear ? selectedYear : 'the selected period'}}.
        </div>
      </div>

      <!-- Summary Report -->
      <div class="card slide-up">
        <h3 style="margin-bottom: 1.5rem; color: #374151;">
          Campaign Summary 
          <span style="font-size: 1rem; color: #64748b; font-weight: normal;">
            ({{selectedYear ? selectedYear : 'All Time'}})
          </span>
        </h3>
        <div style="background: linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%); padding: 2rem; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
            <div>
              <h4 style="color: #dc2626; margin-bottom: 0.5rem;">📊 Participation Metrics</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 0.25rem;">• Total Registrations: <strong>{{stats?.total || 0}}</strong></li>
                <li style="margin-bottom: 0.25rem;">• Successful Donations: <strong>{{stats?.donated || 0}}</strong></li>
                <li style="margin-bottom: 0.25rem;">• Success Rate: <strong>{{stats?.donationRate || 0}}%</strong></li>
              </ul>
            </div>
            
            <div>
              <h4 style="color: #dc2626; margin-bottom: 0.5rem;">🩸 Blood Collection</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 0.25rem;">• Total Volume: <strong>{{getTotalBloodVolume()}}ml</strong></li>
                <li style="margin-bottom: 0.25rem;">• Average per Donor: <strong>450ml</strong></li>
                <li style="margin-bottom: 0.25rem;">• Lives Potentially Saved: <strong>{{(stats?.donated || 0) * 3}}</strong></li>
              </ul>
            </div>

            <div>
              <h4 style="color: #dc2626; margin-bottom: 0.5rem;">🏥 Health Screening</h4>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 0.25rem;">• Health Issues Found: <strong>{{healthIssuesCount}}</strong></li>
                <li style="margin-bottom: 0.25rem;">• Healthy Donors: <strong>{{getHealthyDonorsCount()}}</strong></li>
                <li style="margin-bottom: 0.25rem;">• Rejection Rate: <strong>{{getRejectionRate()}}%</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  stats: Statistics | null = null;
  donations: Donation[] = [];
  users: User[] = [];
  availableYears: number[] = [];
  selectedYear: string = '';
  
  bloodGroupStats: any[] = [];
  ageGroupStats: any[] = [];
  healthIssuesCount = 0;
  
  loadingDonations = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAvailableYears();
    this.loadReportData();
  }

  async loadAvailableYears() {
    try {
      this.availableYears = await this.apiService.getAvailableYears().toPromise() || [];
    } catch (error) {
      console.error('Error loading available years:', error);
    }
  }

  async onYearChange() {
    await this.loadReportData();
  }

  async loadReportData() {
    this.loadingDonations = true;

    try {
      const year = this.selectedYear ? parseInt(this.selectedYear) : undefined;
      
      // Load all data
      const [stats, donations, users] = await Promise.all([
        this.apiService.getStatistics(year).toPromise(),
        this.apiService.getAllDonations(year).toPromise(),
        this.apiService.getAllUsers().toPromise()
      ]);

      this.stats = stats || null;
      this.donations = donations || [];
      this.users = users || [];

      this.calculateBloodGroupStats();
      this.calculateAgeGroupStats();
      this.calculateHealthStats();
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      this.loadingDonations = false;
    }
  }

  calculateBloodGroupStats() {
    const bloodGroupCounts: { [key: string]: number } = {};
    
    // Get unique users from donations for the selected period
    const uniqueUsers = new Map();
    this.donations.forEach(donation => {
      if (donation.user && donation.user.id) {
        uniqueUsers.set(donation.user.id, donation.user);
      }
    });

    const usersInPeriod = Array.from(uniqueUsers.values());
    
    usersInPeriod.forEach((user: User) => {
      if (user.bloodGroup) {
        bloodGroupCounts[user.bloodGroup] = (bloodGroupCounts[user.bloodGroup] || 0) + 1;
      }
    });

    this.bloodGroupStats = Object.entries(bloodGroupCounts).map(([bloodGroup, count]) => ({
      bloodGroup,
      count,
      percentage: usersInPeriod.length > 0 ? Math.round((count / usersInPeriod.length) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  }

  calculateAgeGroupStats() {
    const ageGroups = [
      { range: '18-25', min: 18, max: 25 },
      { range: '26-35', min: 26, max: 35 },
      { range: '36-45', min: 36, max: 45 },
      { range: '46-55', min: 46, max: 55 },
      { range: '56-65', min: 56, max: 65 }
    ];

    // Get unique users from donations for the selected period
    const uniqueUsers = new Map();
    this.donations.forEach(donation => {
      if (donation.user && donation.user.id) {
        uniqueUsers.set(donation.user.id, donation.user);
      }
    });

    const usersInPeriod = Array.from(uniqueUsers.values());

    this.ageGroupStats = ageGroups.map(group => {
      const count = usersInPeriod.filter((user: User) => 
        user.age >= group.min && user.age <= group.max
      ).length;
      
      return {
        range: group.range,
        count,
        percentage: usersInPeriod.length > 0 ? Math.round((count / usersInPeriod.length) * 100) : 0
      };
    }).filter(group => group.count > 0);
  }

  calculateHealthStats() {
    // Get unique users from donations for the selected period
    const uniqueUsers = new Map();
    this.donations.forEach(donation => {
      if (donation.user && donation.user.id) {
        uniqueUsers.set(donation.user.id, donation.user);
      }
    });

    const usersInPeriod = Array.from(uniqueUsers.values());
    this.healthIssuesCount = usersInPeriod.filter((user: User) => user.hasHealthIssues).length;
  }

  getHealthyDonorsCount(): number {
    const uniqueUsers = new Map();
    this.donations.forEach(donation => {
      if (donation.user && donation.user.id) {
        uniqueUsers.set(donation.user.id, donation.user);
      }
    });

    const usersInPeriod = Array.from(uniqueUsers.values());
    return usersInPeriod.length - this.healthIssuesCount;
  }

  getTotalBloodVolume(): number {
    return (this.stats?.donated || 0) * 450; // Average blood donation is 450ml
  }

  getRejectionRate(): number {
    if (!this.stats || this.stats.total === 0) return 0;
    return Math.round((this.stats.rejected / this.stats.total) * 100);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DONATED': return 'donated';
      case 'BETTER LUCK NEXT TIME': return 'rejected';
      case 'PENDING': return 'pending';
      default: return 'pending';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  }

  exportReport() {
    // Create a comprehensive CSV report
    const csvData = this.donations.map(donation => ({
      'Donor Name': donation.user?.name || '',
      'Mobile': donation.user?.mobile || '',
      'Blood Group': donation.user?.bloodGroup || '',
      'Age': donation.user?.age || '',
      'Registration Date': this.formatDate(donation.createdAt),
      'Status': donation.status,
      'Health Issues': donation.user?.hasHealthIssues ? 'Yes' : 'No',
      'Health Details': donation.user?.healthIssueDetails || '',
      'Notes': donation.notes || ''
    }));

    const csv = this.convertToCSV(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = this.selectedYear 
      ? `blood-donation-report-${this.selectedYear}.csv`
      : `blood-donation-report-all-time-${new Date().toISOString().split('T')[0]}.csv`;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    return csvContent;
  }
}