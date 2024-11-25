import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  showDropdown = true;
  userName: string = ''; 

  ngOnInit(): void {
    this.userName = 'John Doe'; 
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  viewProfile() {
    console.log('View Profile clicked');
  }

  logout() {
    console.log('Log Out clicked');
  }
}