import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkAuth(state.url, route);
};

export const authGuardChild: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return authGuard(route, state);
};

function checkAuth(url: string, route: ActivatedRouteSnapshot): boolean {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    // Check for required roles if specified
    const requiredRole = route.data['requiredRole'];
    
    if (requiredRole && !authService.hasRole(requiredRole)) {
      // User doesn't have the required role
      router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }

  // Not logged in, redirect to login page with return URL
  router.navigate(['/login'], { queryParams: { returnUrl: url } });
  return false;
} 