import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { SidebarService } from 'src/services/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  hoje: number = Date.now();

  isCollapsed: boolean;
  isToggled: boolean | undefined;

  constructor(
    private sidebarService: SidebarService,
    public authService: AuthService,
    private router: Router

  ) {
    this.isCollapsed = true;
  }

  ngOnInit(): void {

  }
 
  toggleSidebar() {
  
    this.isToggled = !this.isToggled;
    this.sidebarService.changeVisibility(this.isToggled);
  }

  sair() {
    this.authService.removeAuthenticatedUser();
    this.router.navigate(['']);
  }

  navigateProfile() {
    this.router.navigate(['/pages/profile']);
  }

  notification(){    
    this.router.navigate(['/pages/notifications']); 
  }

}
