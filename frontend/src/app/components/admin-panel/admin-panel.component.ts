import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, User, Donation, UserDonationHistory } from '../../services/api.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in">
      <div class="card">
        <h2 style="margin-bottom: 2rem; color: #dc2626;">Admin Panel</h2>
        
        <!-- Search Section -->
        <div style="margin-bottom: 2rem;">
          <h3 style="margin-bottom: 1rem;">Search Donor</h3>
          <div style="display: flex; gap: 1rem; align-items: end;">
            <div class="form-group" style="flex: 1; margin: 0;">
              <label class="form-label">Mobile Number</label>
              <input 
                type="tel" 
                class="form-input" 
                [(ngModel)]="searchMobile" 
                placeholder="Enter mobile number"
                maxlength="10">
            </div>
            <button 
              class="btn btn-secondary" 
              (click)="searchDonor()"
              [disabled]="!searchMobile || searching">
              {{searching ? 'Searching...' : 'Search'}}
            </button>
          </div>
        </div>

        <!-- Search Results -->
        <div *ngIf="searchedUser" class="card" style="background-color: #f8fafc;">
          <h4 style="margin-bottom: 1rem; color: #374151;">Donor Information</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div><strong>Name:</strong> {{searchedUser.name}}</div>
            <div><strong>Mobile:</strong> {{searchedUser.mobile}}</div>
            <div><strong>Email:</strong> {{searchedUser.email}}</div>
            <div><strong>Age:</strong> {{searchedUser.age}}</div>
            <div><strong>Blood Group:</strong> {{searchedUser.bloodGroup}}</div>
            <div><strong>Health Issues:</strong> {{searchedUser.hasHealthIssues ? 'Yes' : 'No'}}</div>
          </div>
          
          <div *ngIf="searchedUser.hasHealthIssues && searchedUser.healthIssueDetails" style="margin-bottom: 1.5rem;">
            <strong>Health Details:</strong> {{searchedUser.healthIssueDetails}}
          </div>

          <!-- Donation History Summary -->
          <div *ngIf="userHistory" class="card" style="background-color: #ffffff; margin-bottom: 1.5rem;">
            <h5 style="margin-bottom: 1rem; color: #374151;">📊 Donation History</h5>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
              <div style="text-align: center; padding: 0.75rem; background: #fef3f2; border-radius: 8px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: #dc2626;">{{userHistory.summary.totalDonations}}</div>
                <div style="font-size: 0.75rem; color: #64748b;">Total Attempts</div>
              </div>
              <div style="text-align: center; padding: 0.75rem; background: #dcfce7; border-radius: 8px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: #16a34a;">{{userHistory.summary.successfulDonations}}</div>
                <div style="font-size: 0.75rem; color: #64748b;">Successful</div>
              </div>
              <div style="text-align: center; padding: 0.75rem; background: #fee2e2; border-radius: 8px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: #ef4444;">{{userHistory.summary.rejectedDonations}}</div>
                <div style="font-size: 0.75rem; color: #64748b;">Rejected</div>
              </div>
              <div style="text-align: center; padding: 0.75rem; background: #fef3c7; border-radius: 8px;">
                <div style="font-size: 1.5rem; font-weight: 700; color: #f59e0b;">{{userHistory.summary.pendingDonations}}</div>
                <div style="font-size: 0.75rem; color: #64748b;">Pending</div>
              </div>
            </div>
            <div style="text-align: center; padding: 0.5rem; background: #f1f5f9; border-radius: 6px;">
              <strong>Success Rate: {{userHistory.summary.successRate}}%</strong>
            </div>
          </div>

          <!-- Year-wise Donation History -->
          <div *ngIf="userHistory && userHistory.donationsByYear.length > 0" class="card" style="background-color: #ffffff; margin-bottom: 1.5rem;">
            <h5 style="margin-bottom: 1rem; color: #374151;">📅 Year-wise History</h5>
            <div *ngFor="let yearData of userHistory.donationsByYear" style="margin-bottom: 1rem; padding: 1rem; background: #f8fafc; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong style="color: #374151;">{{yearData.year}}</strong>
                <span style="font-size: 0.875rem; color: #64748b;">{{yearData.total}} attempts</span>
              </div>
              <div style="display: flex; gap: 0.5rem; font-size: 0.75rem;">
                <span style="color: #16a34a;">✓ {{yearData.donated}} donated</span>
                <span style="color: #ef4444;">✗ {{yearData.rejected}} rejected</span>
                <span style="color: #f59e0b;">⏳ {{yearData.pending}} pending</span>
              </div>
            </div>
          </div>

          <!-- Current Action Buttons -->
          <div *ngIf="pendingDonation" style="display: flex; gap: 1rem; align-items: center;">
            <button 
              class="btn btn-success" 
              (click)="updateDonationStatus('DONATED')"
              [disabled]="updating">
              {{updating ? 'Updating...' : 'DONATED'}}
            </button>
            <button 
              class="btn btn-warning" 
              (click)="updateDonationStatus('BETTER LUCK NEXT TIME')"
              [disabled]="updating">
              {{updating ? 'Updating...' : 'BETTER LUCK NEXT TIME'}}
            </button>
          </div>

          <div *ngIf="!pendingDonation && searchedUser.donations && searchedUser.donations.length > 0">
            <h5 style="margin-bottom: 0.5rem;">Latest Status:</h5>
            <span [class]="'status-badge status-' + getStatusClass(searchedUser.donations[0].status)">
              {{searchedUser.donations[0].status}}
            </span>
          </div>
        </div>

        <div *ngIf="searchError" class="alert alert-error">
          {{searchError}}
        </div>

        <!-- All Donors List -->
        <div style="margin-top: 3rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3>All Donors</h3>
            <button class="btn btn-secondary" (click)="loadAllDonors()">
              Refresh List
            </button>
          </div>

          <div *ngIf="loadingDonors" class="loading">
            <div class="spinner"></div>
          </div>

          <div *ngIf="!loadingDonors && allDonors.length > 0" class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Blood Group</th>
                  <th>Age</th>
                  <th>Total Donations</th>
                  <th>Success Rate</th>
                  <th>Latest Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let donor of allDonors">
                  <td>{{donor.name}}</td>
                  <td>{{donor.mobile}}</td>
                  <td>{{donor.bloodGroup}}</td>
                  <td>{{donor.age}}</td>
                  <td>
                    <span style="font-weight: 600; color: #dc2626;">
                      {{getDonationCount(donor)}}
                    </span>
                  </td>
                  <td>
                    <span style="font-weight: 600; color: #16a34a;">
                      {{getSuccessRate(donor)}}%
                    </span>
                  </td>
                  <td>
                    <span 
                      *ngIf="getLatestDonation(donor)" 
                      [class]="'status-badge status-' + getStatusClass(getLatestDonation(donor)?.status || '')">
                      {{getLatestDonation(donor)?.status || 'PENDING'}}
                    </span>
                    <span *ngIf="!getLatestDonation(donor)" class="status-badge status-pending">
                      NO DONATION
                    </span>
                  </td>
                  <td>
                    <div style="display: flex; gap: 0.5rem;">
                      <button 
                        *ngIf="canUpdateStatus(donor)"
                        class="btn btn-success" 
                        style="padding: 0.25rem 0.75rem; font-size: 0.75rem;"
                        (click)="markAsDonated(donor)">
                        DONATED
                      </button>
                      <button 
                        *ngIf="canUpdateStatus(donor)"
                        class="btn btn-warning" 
                        style="padding: 0.25rem 0.75rem; font-size: 0.75rem;"
                        (click)="markAsRejected(donor)">
                        REJECTED
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div *ngIf="!loadingDonors && allDonors.length === 0" style="text-align: center; padding: 2rem; color: #64748b;">
            No donors found. Start by registering donors.
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminPanelComponent implements OnInit {
  searchMobile = '';
  searchedUser: User | null = null;
  userHistory: UserDonationHistory | null = null;
  pendingDonation: Donation | null = null;
  allDonors: User[] = [];
  
  searching = false;
  updating = false;
  loadingDonors = false;
  searchError = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAllDonors();
  }

  async searchDonor() {
    if (!this.searchMobile) return;

    this.searching = true;
    this.searchError = '';
    this.searchedUser = null;
    this.userHistory = null;
    this.pendingDonation = null;

    try {
      const user = await this.apiService.findUserByMobile(this.searchMobile).toPromise();
      
      if (user) {
        this.searchedUser = user;
        
        // Load user donation history
        if (user.id) {
          this.userHistory = await this.apiService.getUserDonationHistory(user.id).toPromise() || null;
        }
        
        // Find pending donation
        if (user.donations && user.donations.length > 0) {
          this.pendingDonation = user.donations.find(d => d.status === 'PENDING') || null;
        }
      } else {
        this.searchError = 'No donor found with this mobile number.';
      }
    } catch (error) {
      console.error('Error searching donor:', error);
      this.searchError = 'Error searching for donor. Please try again.';
    } finally {
      this.searching = false;
    }
  }

  async updateDonationStatus(status: string) {
    if (!this.pendingDonation) return;

    this.updating = true;

    try {
      await this.apiService.updateDonationStatus(
        this.pendingDonation.id!,
        status,
        `Status updated by admin`
      ).toPromise();

      // Refresh the searched user data
      this.searchDonor();
      this.loadAllDonors();
    } catch (error) {
      console.error('Error updating donation status:', error);
    } finally {
      this.updating = false;
    }
  }

  async loadAllDonors() {
    this.loadingDonors = true;

    try {
      this.allDonors = await this.apiService.getAllUsers().toPromise() || [];
    } catch (error) {
      console.error('Error loading donors:', error);
    } finally {
      this.loadingDonors = false;
    }
  }

  async markAsDonated(donor: User) {
    const latestDonation = this.getLatestDonation(donor);
    if (latestDonation && latestDonation.status === 'PENDING') {
      await this.apiService.updateDonationStatus(
        latestDonation.id!,
        'DONATED',
        'Marked as donated by admin'
      ).toPromise();
      this.loadAllDonors();
    }
  }

  async markAsRejected(donor: User) {
    const latestDonation = this.getLatestDonation(donor);
    if (latestDonation && latestDonation.status === 'PENDING') {
      await this.apiService.updateDonationStatus(
        latestDonation.id!,
        'BETTER LUCK NEXT TIME',
        'Marked as rejected by admin'
      ).toPromise();
      this.loadAllDonors();
    }
  }

  getLatestDonation(donor: User): Donation | undefined {
    if (!donor.donations || donor.donations.length === 0) return undefined;
    return donor.donations.sort((a, b) => 
      new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
    )[0];
  }

  getDonationCount(donor: User): number {
    return donor.donations?.length || 0;
  }

  getSuccessRate(donor: User): number {
    if (!donor.donations || donor.donations.length === 0) return 0;
    const successful = donor.donations.filter(d => d.status === 'DONATED').length;
    return Math.round((successful / donor.donations.length) * 100);
  }

  canUpdateStatus(donor: User): boolean {
    const latestDonation = this.getLatestDonation(donor);
    return latestDonation?.status === 'PENDING';
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
}