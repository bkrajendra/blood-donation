import { APP_INITIALIZER, Component, inject, provideAppInitializer } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { config, firstValueFrom, tap } from 'rxjs';
import { ConfigService } from './app/services/config.service';

export function loadAppConfig(config: ConfigService) {
  return () => config.loadConfig();
}
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAppInitializer(() => {
      const config = inject(ConfigService);
      return config.loadConfig();
    }),
    provideHttpClient()
  ]
}).catch(err => console.error(err));