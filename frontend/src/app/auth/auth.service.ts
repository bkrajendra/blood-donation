import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
// import jwtDecode from 'jwt-decode';
import { environment } from "../../environments/environment";
import { ConfigService } from "../services/config.service";
import { jwtDecode } from "jwt-decode";

@Injectable({ providedIn: "root" })
export class AuthService {
  //   private baseUrl = 'http://localhost:3000/api'; // your NestJS base URL
  private baseUrl = environment.backendUrl;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private router: Router
  ) {
    this.baseUrl = this.config.backendUrl;
  }

  login(credentials: { mobile: string; password: string }) {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.role;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
  register(user: { username: string; password: string; role?: string }) {
    return this.http.post(`${this.baseUrl}/auth/register`, user);
  }
}
