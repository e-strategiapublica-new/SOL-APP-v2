import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, forkJoin } from "rxjs";
import { BidStatusEnum } from "src/enums/bid-status.enum";
import { AssociationBidService } from "src/services/association-bid.service";
import { AssociationService } from "src/services/association.service";
import { AuthService } from "src/services/auth.service";
import { UserService } from "src/services/user.service";
import Fuse from 'fuse.js';


@Component({
  selector: "app-fornecedor-licitacoes",
  templateUrl: "./fornecedor-licitacoes.component.html",
  styleUrls: ["./fornecedor-licitacoes.component.scss"],
})
export class FornecedorLicitacoesComponent {
  @ViewChild("de") de: ElementRef;
  @ViewChild("ate") ate: ElementRef;

  currentPage: number = 1;
  itensPerPage: number = 6;
  searchTool = false;
  ATEaLERT = "Valor até";
  DEaLERT = "Valor de";
  VALUEaLERT = false;
  licitacoesList: any = [];
  licitacoesListFilter: any = [];
  licitacoesId: any;
  associationName: any;
  listAssociationInfo: any;
  selectedFilterOption : string = "listAll"
  search : string = ''
  form: FormGroup;

  idArray: string[] = [];
  listIdAssociation: any;
  constructor(
    private authbase: AuthService,
    private spinnerService: NgxSpinnerService,
    private _associationBidService: AssociationBidService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.authbase.getAuthenticatedUser().type !== "fornecedor") this.router.navigate(["/pages/dashboard"]);
    this.spinnerService.show();

    this.list()

    this.form.controls['search'].valueChanges.subscribe((text: string) => {
      if (text.length > 1){

        const options: any = {
          keys: ['association.name', 'bid_count']
         }
          const fuse = new Fuse(this.licitacoesList, options)
          const fuseResult = fuse.search(text).map(ele => ele.item)

          this.licitacoesListFilter = fuseResult

          if(this.selectedFilterOption !== 'listAll') {
            this.filter({ target: { value: this.selectedFilterOption} })
          }
      }
      else {
        this.licitacoesListFilter = this.licitacoesList
  
        if(this.selectedFilterOption !== 'listAll') {
          this.filter({ target: { value: this.selectedFilterOption} })
        }
      }
    })
  }

  list() {
    this._associationBidService.listForProposalSupplier().subscribe({
      next: (data: any[]) => {
        this.licitacoesList = data.filter((item : any) => {
          return item.deleted !== true;
        });

        this.licitacoesList.sort((a: any, b: any) => {
          if (+a.bid_count > +b.bid_count) return -1;
          if (+a.bid_count < +b.bid_count) return 1;
          return 0;
        })

        this.licitacoesListFilter = this.licitacoesList

        this.spinnerService.hide();
      },
      error: (error: any) => {
        console.error(error);
        this.spinnerService.hide();
      }
    })
  }

  toolSearch() {
    this.searchTool = !this.searchTool;
  }

  detailBids(i: any) {
    this.router.navigate(["/pages/fornecedor/licitacoes/detalhes-licitacoes/" + i._id]);
  }

  searchValue(de: string, ate: string) {
    if (de > ate) {
      this.VALUEaLERT = true;
      setTimeout(() => {
        this.VALUEaLERT = false;
      }, 2500);
    } else {
      if (de === "" || de === undefined || de === null) {
        this.de.nativeElement.classList.add("border-danger", "border", "text-danger");
        this.DEaLERT = "Valor necessário";
        setInterval(() => {
          this.de.nativeElement.classList.remove("border-danger", "border", "text-danger");
          this.DEaLERT = "Valor de";
        }, 3000);
      }
      if (ate === "" || ate === undefined || ate === null) {
        this.ate.nativeElement.classList.add("border-danger", "border", "text-danger");
        this.ATEaLERT = "Valor necessário";
        setInterval(() => {
          this.ate.nativeElement.classList.remove("border-danger", "border", "text-danger");
          this.ATEaLERT = "Valor até";
        }, 3000);
      }
    }
  }

  filter(event: any) {
    const search = event.target.value;

    if(search !== 'listAll') {
      this.licitacoesListFilter = this.licitacoesListFilter.filter((item: any) => {
          return (item.status === search) ? true : false
        }
      )
    }

  }

  changeSelectedFilter(event: any) {
    this.selectedFilterOption = event.target.value;

    if(this.selectedFilterOption === 'listAll') this.licitacoesListFilter = this.licitacoesList
    else this.filter(event)
  }
}
