import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/services/sidebar.service';

@Component({
  selector: 'pages-app-root',
  templateUrl: './pages.app.component.html',
  styleUrls: ['./pages.app.component.scss']
})
export class PagesAppComponent implements OnInit {


  isToogled: boolean | undefined;

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.sidebarService.currentState.subscribe(a => this.isToogled = a);
  }

  ngOndestroy(): void { 
    console.log("page")   
    localStorage.clear();
  }
}