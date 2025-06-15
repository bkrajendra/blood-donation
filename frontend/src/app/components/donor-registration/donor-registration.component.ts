import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, User } from '../../services/api.service';

@Component({
  selector: 'app-donor-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fade-in">
      <div class="card">
        <h2 style="margin-bottom: 2rem; color: #dc2626;">Donor Registration</h2>
        
        <!-- Mobile Number Search -->
        <div class="form-group" *ngIf="!showForm">
          <label class="form-label">Enter Mobile Number</label>
          <div style="display: flex; gap: 1rem;">
            <input 
              type="tel" 
              class="form-input" 
              [(ngModel)]="mobileNumber" 
              placeholder="Enter 10-digit mobile number"
              maxlength="10"
              pattern="[0-9]{10}"
              style="flex: 1;"
              (keydown.enter)="searchUser()"
              >
            <button 
              class="btn btn-primary" 
              (click)="searchUser()"
              [disabled]="!isValidMobile(mobileNumber) || loading">
              {{loading ? 'Searching...' : 'Search'}}
            </button>
          </div>
        </div>

        <!-- User Registration/Update Form -->
        <form *ngIf="showForm" (ngSubmit)="submitForm()" class="slide-up">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
            
            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <input 
                type="text" 
                class="form-input" 
                [(ngModel)]="user.name" 
                name="name"
                required>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input 
                type="email" 
                class="form-input" 
                [(ngModel)]="user.email" 
                name="email"
                required>
            </div>

            <div class="form-group">
              <label class="form-label">Age *</label>
              <input 
                type="number" 
                class="form-input" 
                [(ngModel)]="user.age" 
                name="age"
                min="18" 
                max="65"
                required>
            </div>

            <div class="form-group">
              <label class="form-label">Blood Group *</label>
              <select 
                class="form-input" 
                [(ngModel)]="user.bloodGroup" 
                name="bloodGroup"
                required>
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

          </div>

          <div class="form-group">
            <label class="form-label">Company Name *</label>
            <input 
              class="form-input" 
              [(ngModel)]="user.company" 
              name="company"
              rows="3"
              required>
          </div>

          <div class="form-group">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
              <input 
                type="checkbox" 
                [(ngModel)]="user.hasHealthIssues" 
                name="hasHealthIssues">
              <span class="form-label" style="margin: 0;">Do you have any health issues?</span>
            </label>
          </div>

          <div class="form-group" *ngIf="user.hasHealthIssues">
            <label class="form-label">Health Issue Details</label>
            <textarea 
              class="form-input" 
              [(ngModel)]="user.healthIssueDetails" 
              name="healthIssueDetails"
              rows="3"
              placeholder="Please describe your health issues"></textarea>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 2rem;">
            <button 
              type="submit" 
              class="btn btn-success"
              [disabled]="submitting">
              {{submitting ? 'Processing...' : 'HEALTH CHECKUP'}}
            </button>
            <button 
              type="button" 
              class="btn btn-outline" 
              (click)="resetForm()">
              Reset
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div *ngIf="showSuccess" class="alert alert-success slide-up">
          <h3>Registration Successful! 🎉</h3>
          <p>Thank you for registering for the blood donation drive. Your information has been recorded successfully.</p>
          <button class="btn btn-primary" (click)="startNew()" style="margin-top: 1rem;">
            Register Another Donor
          </button>
        </div>
      </div>
    </div>
  `
})
export class DonorRegistrationComponent implements OnInit {
  mobileNumber = '';
  showForm = false;
  showSuccess = false;
  loading = false;
  submitting = false;
  isExistingUser = false;

  user: User = {
    mobile: '',
    name: '',
    email: '',
    age: 18,
    bloodGroup: '',
    company: '',
    hasHealthIssues: false,
    healthIssueDetails: ''
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  isValidMobile(mobile: string): boolean {
    return /^[0-9]{10}$/.test(mobile);
  }

  async searchUser() {
    if (!this.isValidMobile(this.mobileNumber)) return;

    this.loading = true;
    
    try {
      const existingUser = await this.apiService.findUserByMobile(this.mobileNumber).toPromise();
      
      if (existingUser) {
        this.user = { ...existingUser };
        this.isExistingUser = true;
      } else {
        this.user = {
          mobile: this.mobileNumber,
          name: '',
          email: '',
          age: 18,
          bloodGroup: '',
          company: '',
          hasHealthIssues: false,
          healthIssueDetails: ''
        };
        this.isExistingUser = false;
      }
      
      this.showForm = true;
    } catch (error) {
      console.error('Error searching user:', error);
    } finally {
      this.loading = false;
    }
  }

  async submitForm() {
    this.submitting = true;
    
    try {
      let savedUser: User;
      
      if (this.isExistingUser && this.user.id) {
        savedUser = await this.apiService.updateUser(this.user.id, this.user).toPromise() as User;
      } else {
        savedUser = await this.apiService.createUser(this.user).toPromise() as User;
      }

      // Create donation record
      await this.apiService.createDonation({
        userId: savedUser.id!,
        notes: 'Health checkup completed'
      }).toPromise();

      this.showForm = false;
      this.showSuccess = true;
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      this.submitting = false;
    }
  }

  resetForm() {
    this.user = {
      mobile: this.mobileNumber,
      name: '',
      email: '',
      age: 18,
      bloodGroup: '',
      company: '',
      hasHealthIssues: false,
      healthIssueDetails: ''
    };
  }

  startNew() {
    this.mobileNumber = '';
    this.showForm = false;
    this.showSuccess = false;
    this.isExistingUser = false;
    this.user = {
      mobile: '',
      name: '',
      email: '',
      age: 18,
      bloodGroup: '',
      company: '',
      hasHealthIssues: false,
      healthIssueDetails: ''
    };
  }
}