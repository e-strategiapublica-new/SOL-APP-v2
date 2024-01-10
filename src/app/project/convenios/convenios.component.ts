import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConvenioResponseDto } from "src/dtos/convenio/convenio-response.dto";
import { AuthService } from "src/services/auth.service";
import { ConvenioService } from "src/services/convenio.service";
import { DeleteConvenioComponent } from "./delete-convenio/delete-convenio.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import FilterFuzzy from "src/utils/filterFuzzy.util";
import Fuse from 'fuse.js';
import { UserAuthenticatedDto } from "src/dtos/auth/user-authenticated.dto";


@Component({
  selector: "app-convenios",
  templateUrl: "./convenios.component.html",
  styleUrls: ["./convenios.component.scss"],
})
export class ConveniosComponent {
  currentPage: number = 1;
  itensPerPage: number = 8;
  filterTerm: string;
  convenioList: ConvenioResponseDto[];
  convenioFilter: ConvenioResponseDto[];
  isManager: boolean = false
  form: FormGroup;
  user: any;

  constructor(
    public authbase: AuthService,
    private convenioService: ConvenioService,
    public router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('user');
    user = JSON.parse(user);
    this.user = user;

    if (this.authbase.getAuthenticatedUser().type === "administrador" && this.authbase.getAuthenticatedUser().type === "project_manager") this.router.navigate(["/pages/dashboard"]);
    this.getConvenio();
    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text){
        // this.convenioFilter = this.convenioList.filter((item: any) =>
        //   item.register_object.toLowerCase().includes(text) ||
        //   item.register_number.toLowerCase().includes(text) ||
        //   item.association.name.toLowerCase().includes(text)
        // );       
         
        const register_object = this.convenioList.filter(obj => ((obj.register_object).toLowerCase()).includes(text.toLowerCase()));
        const association_name = this.convenioList.filter(obj => ((obj.association.name).toLowerCase()).includes(text.toLowerCase()));
      
        const array = [...register_object, ...association_name]
        const dataArr = new Set(array)
        const result = [...dataArr];  
               
        this.convenioFilter = result
      }
      else
      this.convenioFilter = this.convenioList
    });
  }

  getConvenio() {
     
    let dto = {
      roles: this.user.roles
    }
    if (this.authbase.getAuthenticatedUser().type === "project_manager") {
        
      this.convenioService.getConvenioByUserId(this.user.id, dto).subscribe((response: any) => {
              
        this.convenioList = response;
        this.convenioFilter = response;
        this.isManager = response.some((item: ConvenioResponseDto) => item.project?.project_manager === this.user.id )
    
      });
    } else {
      this.convenioService.getConvenio().subscribe((response: any) => {           
        this.convenioList = response;
        this.convenioFilter = response;        
    });
    }
 
  }
  
  editConvenio(id: string) {
    this.router.navigate(["pages/convenios/edit-convenio/" + id]);
  }

  addGroup(id: string) {
    this.router.navigate(["/pages/item-group/new-group"]);
    localStorage.setItem("convenioId", id);
  }

  delete(item: ConvenioResponseDto) {
    const modal = this.modalService.open(DeleteConvenioComponent, {
      centered: true,
      backdrop: true,
      size: "md",
      keyboard: false,
    });
    modal.componentInstance.convenio = item;
    modal.result.then(
      result => { },
      err => {
        this.getConvenio();
      }
    );
  }

  detalheConvenios(item: ConvenioResponseDto) {
    this.router.navigate(["pages/convenios/detalhes-convenio/" + item._id]);
  }
}
