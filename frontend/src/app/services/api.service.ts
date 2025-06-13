import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  mobile: string;
  name: string;
  email: string;
  age: number;
  bloodGroup: string;
  address: string;
  hasHealthIssues?: boolean;
  healthIssueDetails?: string;
  isEligible?: boolean;
  createdAt?: string;
  updatedAt?: string;
  donations?: Donation[];
}

export interface Donation {
  id?: number;
  userId: number;
  status: 'PENDING' | 'DONATED' | 'BETTER LUCK NEXT TIME';
  notes?: string;
  createdAt?: string;
  user?: User;
}

export interface Statistics {
  total: number;
  donated: number;
  rejected: number;
  pending: number;
  donationRate: number;
  year?: string | number;
}

export interface UserDonationHistory {
  user: User;
  summary: {
    totalDonations: number;
    successfulDonations: number;
    rejectedDonations: number;
    pendingDonations: number;
    successRate: number;
  };
  donationsByYear: Array<{
    year: number;
    total: number;
    donated: number;
    rejected: number;
    pending: number;
    donations: Donation[];
  }>;
  allDonations: Donation[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://blood-donation-backend:3000';

  constructor(private http: HttpClient) {}

  // User endpoints
  findUserByMobile(mobile: string): Observable<User | null> {
    return this.http.get<User | null>(`${this.baseUrl}/users/search?mobile=${mobile}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  // Donation endpoints
  createDonation(donation: Partial<Donation>): Observable<Donation> {
    return this.http.post<Donation>(`${this.baseUrl}/donations`, donation);
  }

  updateDonationStatus(id: number, status: string, notes?: string): Observable<Donation> {
    return this.http.patch<Donation>(`${this.baseUrl}/donations/${id}/status`, { status, notes });
  }

  getAllDonations(year?: number): Observable<Donation[]> {
    const params = year ? `?year=${year}` : '';
    return this.http.get<Donation[]>(`${this.baseUrl}/donations${params}`);
  }

  getStatistics(year?: number): Observable<Statistics> {
    const params = year ? `?year=${year}` : '';
    return this.http.get<Statistics>(`${this.baseUrl}/donations/statistics${params}`);
  }

  getAvailableYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.baseUrl}/donations/years`);
  }

  getDonationsByUserId(userId: number): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.baseUrl}/donations/user/${userId}`);
  }

  getUserDonationHistory(userId: number): Observable<UserDonationHistory> {
    return this.http.get<UserDonationHistory>(`${this.baseUrl}/donations/user/${userId}/history`);
  }
}