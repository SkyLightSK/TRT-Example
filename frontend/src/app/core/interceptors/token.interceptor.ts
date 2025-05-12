import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

// Function-based interceptor for Angular standalone applications
export const tokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Skip token for auth endpoints like login
  if (request.url.includes('/auth/login')) {
    return next(request);
  }

  // Add auth token to the request
  const token = authService.getToken();
  if (token) {
    request = addToken(request, token);
  } else {
    console.log('No token available for request:', request.url);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // If unauthorized, redirect to login
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
}

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  // Make sure token doesn't have extra quotes
  let cleanToken = token;
  if (token.startsWith('"') && token.endsWith('"')) {
    cleanToken = token.substring(1, token.length - 1);
  }
  
  const clonedRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${cleanToken}`
    }
  });
  
  
  return clonedRequest;
} 