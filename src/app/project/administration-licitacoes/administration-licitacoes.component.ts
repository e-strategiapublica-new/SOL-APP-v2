import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AuthService } from 'src/services/auth.service';
import { AdministrationSetTimeComponent } from './administration-set-time/administration-set-time.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Fuse from 'fuse.js';
import { LicitacoesGetResponseDto } from 'src/dtos/licitacoes/licitacoes-get-response.dto';

@Component({
  selector: 'app-administration-licitacoes',
  templateUrl: './administration-licitacoes.component.html',
  styleUrls: ['./administration-licitacoes.component.scss']
})
export class AdministrationLicitacoesComponent {
  licitacoesList: LicitacoesGetResponseDto[] = []
  licitacoesListFilter: LicitacoesGetResponseDto[] = []
  currentPage: number = 1;
  itensPerPage: number = 5;
  selectedFilterOption: string = "listAll"

  searchTool = false;
  search: string = ''
  form: FormGroup;
  user: any
  userId: string = '';

  constructor(
    private authbase: AuthService,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    let user: any = localStorage.getItem('user');
    user = JSON.parse(user);
    this.user = user;
    if (this.authbase.getAuthenticatedUser().type === 'project_manager') {
      this.router.navigate(['/pages/licitacoes/gestor-revisor-licitacao']);
      this.listAllAndFilterById();
      return
    }

    if (this.authbase.getAuthenticatedUser().type !== 'administrador') this.router.navigate(['/pages/dashboard']);

      const id = localStorage.getItem('id_licitaciones');
      if(id && id == '0'){      
        localStorage.removeItem('id_licitaciones')
        this.licitacoesListFilter = this._associationBidService.getLicitacoesFilterList();
        this.licitacoesList = this._associationBidService.getLicitacoesList();
      }else{
        this.spinnerService.show();
        this.list()  
      } 

      this.form.controls['search'].valueChanges.subscribe((text: string) => {
        if (text){
          // this.convenioFilter = this.convenioList.filter((item: any) =>
          //   item.register_object.toLowerCase().includes(text) ||
          //   item.register_number.toLowerCase().includes(text) ||
          //   item.association.name.toLowerCase().includes(text)
          // );
        
          const name = this.licitacoesList.filter(obj => ((obj.association.name).toLowerCase()).includes(text.toLowerCase()));
          const bid_count = this.licitacoesList.filter(obj => ((obj.bid_count).toLowerCase()).includes(text.toLowerCase()));
          
          const array = [...name, ...bid_count]        
          const dataArr = new Set(array)
          const result = [...dataArr];         

          this.licitacoesListFilter = result
          /*
          if(this.selectedFilterOption !== 'listAll') {
            this.filter({ target: { value: this.selectedFilterOption} })
          }
          */
        }
        else {
          this.licitacoesListFilter = this.licitacoesList
          /*
          if(this.selectedFilterOption !== 'listAll') {
            this.filter({ target: { value: this.selectedFilterOption} })
          }
          */
        }
    });

  }
  list(){
 
 
      this._associationBidService.list().subscribe({
        next: data => {
          this.licitacoesList = data.filter((item : any) => {
            return item.deleted !== true && item.status !== 'draft';
          });
  
          this.licitacoesList.sort((a: any, b: any) => {
            if (+a.bid_count > +b.bid_count) return -1;
            if (+a.bid_count < +b.bid_count) return 1;
            return 0;
          })
  
          this.licitacoesListFilter = this.licitacoesList
          this._associationBidService.setLicitacoesFilterList(this.licitacoesList);
          this._associationBidService.setLicitacoesList(this.licitacoesList);
  
          this.spinnerService.hide();
        },
        error: error => {          
          this.spinnerService.hide();
        }
      })
    
   
  }

  async listAllAndFilterById() {
    this.userId = this.authbase.getAuthenticatedUser().id;
    this._associationBidService.getByManagerOrReviewerId(this.userId).subscribe({
      next: (data: any) => {
        this.licitacoesList = data
        this.licitacoesListFilter = this.licitacoesList;

        this._associationBidService.setLicitacoesFilterList(this.licitacoesList);
        this._associationBidService.setLicitacoesList(data);

        this.licitacoesList.sort((a: any, b: any) => {
          if (+a.bid_count > +b.bid_count) return -1;
          if (+a.bid_count < +b.bid_count) return 1;
          return 0;
        })

        this.licitacoesListFilter.sort((a: any, b: any) => {
          if (+a.bid_count > +b.bid_count) return -1;
          if (+a.bid_count < +b.bid_count) return 1;
          return 0;
        })
      },
      error: (error) => {

      }
    })
    // this._associationBidService.list().subscribe({
    //   next: (data: any) => {
    //     this.spinnerService.hide();
    //     console.log(data)
    //     const list = Object.values(data);
    //     this.licitacoesList = list.filter((item: any) =>
    //       item.agreement?.manager === this.userId && item.agreement.manager !== null
    //     );

    //     this.licitacoesListFilter = this.licitacoesList;

    //     this.licitacoesList.sort((a: any, b: any) => {
    //       if (+a.bid_count > +b.bid_count) return -1;
    //       if (+a.bid_count < +b.bid_count) return 1;
    //       return 0;
    //     })

    //     this.licitacoesListFilter.sort((a: any, b: any) => {
    //       if (+a.bid_count > +b.bid_count) return -1;
    //       if (+a.bid_count < +b.bid_count) return 1;
    //       return 0;
    //     })
    //   },
    //   error: (error) => {
    //     console.error(error)
    //     this.spinnerService.hide();
    //   }
    // });
  }
  
  openRegisterTime() {
    this.modalService.open(AdministrationSetTimeComponent, { centered: true });
  }

  detailBids(i: any) {
    this.router.navigate([`/pages/licitacoes/detalhes-licitacoes/${i._id}`]);
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
    const text = this.form.controls['search'].value
    this.selectedFilterOption = event.target.value;

    if(text.length >= 1) {
      const options: any = {
        keys: ['association.name', 'bid_count']
      }
      const fuse = new Fuse(this.licitacoesList, options)
      const fuseResult = fuse.search(text).map(ele => ele.item)

      this.licitacoesListFilter = fuseResult
    }

    if(this.selectedFilterOption === 'listAll') this.licitacoesListFilter = this.licitacoesList
    else this.filter(event)
  }
}
