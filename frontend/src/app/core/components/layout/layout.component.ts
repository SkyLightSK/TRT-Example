import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  userMenuOpen = false;
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Add event listener to close menu when clicking outside
    document.addEventListener('click', this.closeMenuOnClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up event listener
    document.removeEventListener('click', this.closeMenuOnClickOutside.bind(this));
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeMenuOnClickOutside(event: Event): void {
    const userProfileElement = document.querySelector('.user-profile');
    if (this.userMenuOpen && userProfileElement && !userProfileElement.contains(event.target as Node)) {
      this.userMenuOpen = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.userMenuOpen = false;
  }

  getFirstInitial(username?: string): string {
    if (username && username.length > 0) {
      return username.charAt(0).toUpperCase();
    }
    return 'G'; // Default for Guest
  }
} 