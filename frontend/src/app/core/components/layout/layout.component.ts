import { Component, OnInit, HostListener } from '@angular/core';
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
  mobileMenuOpen = false;
  mobileSidebarOpen = false;
  isMobileView = false;
  currentUser$: Observable<User | null>;

  constructor(public authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
    this.checkScreenSize();
  }

  ngOnInit(): void {
    // Add event listener to close menu when clicking outside
    document.addEventListener('click', this.closeMenuOnClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    // Clean up event listener
    document.removeEventListener('click', this.closeMenuOnClickOutside.bind(this));
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobileView = window.innerWidth < 768;
    if (!this.isMobileView) {
      this.mobileMenuOpen = false;
      this.mobileSidebarOpen = false;
    }
  }

  toggleMobileMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    // Close sidebar if menu is toggled
    if (this.mobileMenuOpen) {
      this.mobileSidebarOpen = false;
    }
  }

  toggleMobileSidebar(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
    
    // Close menu if sidebar is toggled
    if (this.mobileSidebarOpen) {
      this.mobileMenuOpen = false;
    }
  }

  toggleUserMenu(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeMenuOnClickOutside(event: Event): void {
    const userProfileElement = document.querySelector('.user-profile');
    const mobileMenuButtonElement = document.querySelector('.mobile-menu-button');
    const mobileSidebarButtonElement = document.querySelector('.mobile-sidebar-button');
    
    if (this.userMenuOpen && userProfileElement && !userProfileElement.contains(event.target as Node)) {
      this.userMenuOpen = false;
    }
    
    if (this.mobileMenuOpen && mobileMenuButtonElement && !mobileMenuButtonElement.contains(event.target as Node) && 
        !(event.target as HTMLElement).closest('.navbar-menu')) {
      this.mobileMenuOpen = false;
    }
    
    if (this.mobileSidebarOpen && mobileSidebarButtonElement && !mobileSidebarButtonElement.contains(event.target as Node) && 
        !(event.target as HTMLElement).closest('.sidebar')) {
      this.mobileSidebarOpen = false;
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