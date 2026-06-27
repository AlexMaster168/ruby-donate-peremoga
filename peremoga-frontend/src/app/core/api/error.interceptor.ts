import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

const PUBLIC_PATHS = ['/api/v1/tickets', '/api/v1/fundraisers', '/api/v1/news', '/api/v1/categories', '/api/v1/search'];
const AUTH_PATHS = ['/api/v1/login', '/api/v1/logout', '/api/v1/users'];

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An error occurred';
      const isLoginRequest = AUTH_PATHS.some(p => req.url.startsWith(p)) && req.method === 'POST';
      const isPublicGet = PUBLIC_PATHS.some(p => req.url.startsWith(p)) && req.method === 'GET';

      if (error.status === 401) {
        const errorBody = error.error;
        const backendMessage = errorBody?.error || errorBody?.message;

        if (isLoginRequest) {
          message = backendMessage || 'Invalid email or password';
        } else if (auth.isAuthenticated()) {
          auth.clearSession();
          message = 'Session expired. Please log in again.';
        } else {
          message = backendMessage || 'You need to be logged in to perform this action.';
        }
      } else if (error.status === 403) {
        message = error.error?.message || error.error?.error || 'You do not have permission.';
      } else if (error.status === 404) {
        message = error.error?.error || 'Resource not found.';
      } else if (error.status === 422) {
        if (Array.isArray(error.error?.errors)) {
          message = error.error.errors.map((e: any) => {
            const field = e.attribute ? `${e.attribute}: ` : '';
            return `${field}${e.message}`;
          }).join('\n');
        } else if (error.error?.message) {
          message = error.error.message;
        } else {
          message = 'Validation failed. Please check your input.';
        }
      } else if (error.error?.message) {
        message = error.error.message;
      } else if (error.error?.error) {
        message = error.error.error;
      } else if (error.message) {
        message = error.message;
      }

      return throwError(() => ({ status: error.status, message }));
    })
  );
};
