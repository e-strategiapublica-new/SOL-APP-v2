
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import * as L from "leaflet";
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AssociationService } from 'src/services/association.service';
import { AuthService } from 'src/services/auth.service';
import Fuse from 'fuse.js';
import { DashboardResponseDto } from 'src/dtos/dashboard/dashboard-response.dto';
import { ConvenioService } from 'src/services/convenio.service';
import { DashbordService } from 'src/services/dashboard.service';
import { SupplierRequestDto } from '../../../dtos/supplier/supplier-request.dto';
import { SupplierService } from '../../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModelContractService } from 'src/services/model-contract.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  form: FormGroup;

  licitacoes: any = [];
  licitacoesSearchFormore: any = [];
  licitacoesListFirst10: any = [];
  loadMore = false;
  associationList!: AssociationResponseDto[];
  fornecedorList!: SupplierRequestDto[];

  selectedFilterOption : string = "listAll";
  licitacoesListFilter: any = [];
  search : string = '';

  novoArray: any = []

  map: L.DrawMap;

  licitacoesId: any;
  licitacoesList: any[];
  currentPage: number = 1;
  itensPerPage: number = 6;
  itensPerPageFornecedor: number = 10;

  responseDashboard: DashboardResponseDto = {
    associationRegister: 0,
    bidInProgress: 0,
    supplierRegister: 0
  }

  convenios: number = 0;
  licitacoesPendentes: any;
  licitacoesEmAnalise: any;
  userId: string = '';

  licitacoesPendentesSize: number = 0;
  licitacoesEmAnaliseSize: number = 0;

  constructor(
    public authService: AuthService,
    private router: Router,
    private associationService: AssociationService,
    private _supplierService: SupplierService,
    private ngxSpinnerService: NgxSpinnerService,
    private _associationBidService: AssociationBidService,
    private dashboardService: DashbordService,
    private conveniosService: ConvenioService,
    private formBuilder: FormBuilder,
    private authbase: AuthService,
    private _modelContractService: ModelContractService,
    private translate: TranslateService,    
    private toastrService: ToastrService
  ) {
    this.form = this.formBuilder.group({
      search: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngAfterViewInit(): void {    

    if (this.authService.getAuthenticatedUser().type == 'fornecedor') {
      this.ngxSpinnerService.show();
      this._associationBidService.listForSupplier().subscribe({
        next: (data: any[]) => {
          this.licitacoesList = data.filter((bid: any) => bid.status === 'returned' ||  bid.status === 'awaiting')
          this.licitacoesList = data.sort((a: any, b: any) => b.bid_count - a.bid_count)
          this.licitacoesListFilter = this.licitacoesList
          this.licitacoesListFirst10 = this.licitacoesList.slice(0, 10)
          this.licitacoesId = data;
          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error)
          this.ngxSpinnerService.hide();
        }
      });
    }

    if (this.authService.getAuthenticatedUser().type == 'administrador' && this.authService.getAuthenticatedUser().roles == 'geral') {
      this.ngxSpinnerService.show();

      this.map = L.map('map').setView([-23.6820635, -46.924961], 8);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      this._associationBidService.list().subscribe({
        next: (data: any[]) => {
          this.licitacoesSearchFormore = data.filter((item) =>
            item.modality === 'openClosed' && item.status === 'open').sort((a: any, b: any) =>
              b.bid_count - a.bid_count);
          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error)
          this.ngxSpinnerService.hide();
        }
      });
      this.ngxSpinnerService.hide();

    }

    if (this.authService.getAuthenticatedUser().type == 'administrador' && this.authService.getAuthenticatedUser().roles == 'revisor') {
      this.ngxSpinnerService.show();
      this.userId = this.authbase.getAuthenticatedUser().id;
      this.conveniosService.getConvenio().subscribe({
        next: data => {
          this.convenios = data.filter((item: any) => item.reviewer?._id === this.userId).length;
          this.ngxSpinnerService.hide();
        },
        error: error => {
          console.error(error)
          this.ngxSpinnerService.hide();
        }
      })

      this._associationBidService.list().subscribe({
        next: data => {


          this.licitacoesPendentes = data.filter((item: any) => {
            return item.agreement.reviewer === this.userId && item.status === "awaiting";
          });
          this.licitacoesPendentesSize = this.licitacoesPendentes.length;


          this.licitacoesEmAnalise = data.filter((item: any) => {
            return item.agreement.reviewer === this.userId && item.status === "analysis";
          });
          this.licitacoesEmAnaliseSize = this.licitacoesEmAnalise.length;

          this.ngxSpinnerService.hide();
        },
        error: error => {
          console.error(error);
          this.ngxSpinnerService.hide();
        }
      })

      this.map = L.map('map').setView([-23.6820635, -46.924961], 8);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      this._associationBidService.list().subscribe({
        next: (data: any[]) => {
          this.licitacoesSearchFormore = data.filter((item) =>
            item.modality === 'openClosed' && item.status === 'open').sort((a: any, b: any) =>
              b.bid_count - a.bid_count);
          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error)
          this.ngxSpinnerService.hide();
        }
      });

      this.associationService.list().subscribe({
        next: response => {
          this.associationList = response;
          this.associationList.map(item => {

            if(item.address.latitude && item.address.longitude){
              this.addMarker(
                item.name,
                `/pages/associacao/dados-associacao/${item._id}`,
                item.address.latitude,
                item.address.longitude,
                'association',
              );
            }            
            
          })
        }
      });

      this._supplierService.supplierList().subscribe({
        next: response => {
          this.fornecedorList = response;
          this.fornecedorList.map(item => {
            if(item.address.latitude && item.address.longitude){
              this.addMarker(
                item.name,
                `/pages/fornecedor/dados-fornecedor/${item._id}`,
                item.address.latitude,
                item.address.longitude,
                'fornecedor',
              )
            }
          })
        }
      });
    }

    if (this.authService.getAuthenticatedUser().type == 'associacao') {
      this.ngxSpinnerService.show();
      this._associationBidService.listByAssociation().subscribe({
        next: data => {

          const List = Object.values(data);
          this.licitacoesList = List.filter((item: any) => item.deleted === false);
          this.licitacoesList.sort((a: any, b: any) => b.bid_count - a.bid_count)
          this.licitacoesListFilter = this.licitacoesList
          
          this.ngxSpinnerService.hide();
        },
        error: (error) => {
          console.error(error)
          this.ngxSpinnerService.hide();
        }
      })

      this.form.controls['search'].valueChanges.subscribe((text: string) => {
        if (text.length >= 1){
  
          const options: any = {
            keys: ['association.name', 'bid_count']
           }
            const fuse = new Fuse(this.licitacoesList, options)
            const fuseResult = fuse.search(text).map(ele => ele.item)
  
            this.licitacoesListFilter = fuseResult
        }
        else {
          this.licitacoesListFilter = this.licitacoesList
        }
      })

    this.ngxSpinnerService.hide();

    }
  }

  ngOnInit(): void {

    if (this.authService.getAuthenticatedUser().type == 'administrador' && this.authService.getAuthenticatedUser().roles == 'geral') {

      this.dashboardService.getData().subscribe({
        next: data => {
          this.responseDashboard = data
        }
      });

      this.associationService.list().subscribe({
        next: response => {
          this.associationList = response;
          this.associationList.map(item => { 
            if(item.address.latitude && item.address.longitude){          
              this.addMarker(
                item.name,
                `/pages/associacao/dados-associacao/${item._id}`,
                item.address.latitude,
                item.address.longitude,
                'association',
              );
            }
          })
        }
      });

      this._supplierService.supplierList().subscribe({
        next: response => {
          this.fornecedorList = response;
          this.fornecedorList.map(item => {            
            if(item.address.latitude && item.address.longitude){
              this.addMarker(
                item.name,
                `/pages/fornecedor/dados-fornecedor/${item._id}`,
                item.address.latitude,
                item.address.longitude,
                'fornecedor',
              )
            }
          })
        }
      });


    }
    this.ngxSpinnerService.hide();

  }

  goLicitacoes() {
    this.loadMore = true
  }

  detailBidsAsAssociation(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-data', i._id]);
  }

  detailBids(i: any) {
    this.router.navigate(["/pages/fornecedor/licitacoes/detalhes-licitacoes/" + i._id]);
  }

  associationDetailBids(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-data', i._id]);
    localStorage.setItem('licitacao', JSON.stringify(i));
  }

  filter(event: any) {
    this.search = event.target.value;
    this.licitacoesListFilter = this.licitacoesList.filter(
      (item: any) => {
        if(this.selectedFilterOption === 'listAll' || this.selectedFilterOption === 'descending') {
          return item.bid_count?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.description?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.association?.name.toLowerCase().includes(this.search.toLowerCase())
        }

        if(!this.search.length) return item.status === this.selectedFilterOption

        if(this.search.length && item.status === this.selectedFilterOption) {
          return item.bid_count?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.description?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.association?.name.toLowerCase().includes(this.search.toLowerCase())
        }
      }
    );
  }

  changeSelectedFilter(event : any) {
    this.selectedFilterOption = event.target.value;

    const object = { 
      target : {
        value : this.search
      } 
    }
    this.filter(object)
  }

  editBids(i: any) {
    this.router.navigate(['/pages/licitacoes/licitacao-edit', i._id]);
  }

  addMarker(name: string, link: string, lat: string, lng: string, type: string) {

    let icon: L.Icon<L.IconOptions>;

    switch (type) {
      case 'association':
        icon = L.icon({
          iconUrl: '../../../assets/markers/blue.png',
          iconSize: [36, 59],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
        });
        break;
      default:
        icon = L.icon({
          iconUrl: '../../../assets/markers/green.png',
          iconSize: [36, 59],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
          shadowSize: [68, 95],
          shadowAnchor: [22, 94]
        })
        break;
    }

    L.marker(
      [+lat, +lng],
      { icon: icon })
      .bindPopup(
        `<a href='${link}'>${name}</a>`)
      .addTo(this.map);
  }

  getText() {
    this.dashboardService.getText().subscribe(res =>{
      console.log(res)
    })
  }

  setText() {
    this.dashboardService.setText().subscribe(res =>{
      console.log(res)
    })
  }

  onLicitacaoRegister(){

    this._modelContractService.list().subscribe({
      next: data => {
          


        let count_es = 0;
        let count_pt = 0;
        let count_fr = 0;
        let count_en = 0;

        for(let i=0;i<data.length;i++){
          if(data[i].language == "spanish"){
            count_es++;
          }
          if(data[i].language == "portuguese"){
            count_pt++;
          }
          if(data[i].language == "french"){
            count_fr++;
          }
          if(data[i].language == "english"){
            count_en++;
          }
        }                

        if(count_es == 4 && count_pt == 4 && count_fr == 4 && count_en == 4){
          this.router.navigate(['/pages/licitacoes/licitacao-register']);          
        }else{
          this.toastrService.success(this.translate.instant('TOASTRS.ERROR_DOCUMENTS_MISSING'), '', { progressBar: true });
        }        

      },
      error: err =>{
        this.toastrService.success(this.translate.instant('TOASTRS.ERROR_DOCUMENTS_MISSING'), '', { progressBar: true });
      }
    });
    
  }

}