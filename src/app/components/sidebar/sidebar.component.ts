import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AdministrationSetTimeComponent } from "src/app/project/administration-licitacoes/administration-set-time/administration-set-time.component";
import { AuthService } from "src/services/auth.service";
import { SidebarService } from "src/services/sidebar.service";
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  show = false;
  items = false;
  showReport: boolean = false;
  admSystem: boolean = false;
  user: any;
  showBids: boolean = false

  constructor(
    public authService: AuthService, 
    private modalService: NgbModal,
    private sidebarService: SidebarService,
    private ngxSpinnerService: NgxSpinnerService,
    ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.ngxSpinnerService.hide();
  }

  Usertoggle(value: string) {
    if (value === "user") {
      this.show = !this.show;
    } else if(value === "bid") {
      this.showBids = !this.showBids
    }
     else {
      this.items = !this.items;
    }
    
  }

  reportToggle() {
    this.showReport = !this.showReport;
  }

  admSystemToggle() {
    this.admSystem = !this.admSystem;
  }

  openRegisterTime() {
    this.modalService.open(AdministrationSetTimeComponent, { centered: true });
  }

  checkUser(){
    const equal = this.user.type === this.authService.getAuthenticatedUser().type;
    if(!equal){
      window.location.reload();
    }
    return equal;
  }

  hideSiderbar() {
   
    this.sidebarService.changeVisibility(false);
  }
}
