import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private config: any = {};
  constructor(private http: HttpClient) {}

  loadConfig() {
    return fetch('assets/config.json')
      .then(response => response.json())
      .then(config => {
        this.config = config;
      });
    //return firstValueFrom(this.http.get("/assets/config.json"));
    // return this.http.get<User | null>(`${this.baseUrl}/users/search?mobile=${mobile}`);
  }

  get backendUrl(): string {
    return this.config?.backendUrl;
  }
}
