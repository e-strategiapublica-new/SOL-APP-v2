import { AfterViewInit, Component, OnInit } from '@angular/core'; 
import * as L from 'leaflet'; 
import { AssociationService } from '../../../services/association.service'; 
import { AuthService } from '../../../services/auth.service'; 
import { SupplierService } from '../../../services/supplier.service'; 
import { SupplierRequestDto } from '../../../dtos/supplier/supplier-request.dto'; 
import { UserService } from '../../../services/user.service'; 
import DocuemntUtil from '../../../utils/document.util'; 

@Component({
  selector: 'app-associacao-map',
  templateUrl: './associacao-map.component.html',
  styleUrls: ['./associacao-map.component.scss']
})
export class AssociacaoMapComponent implements OnInit, AfterViewInit {

  loggesdUser: any;  
  loggedtAssociation: any;  
 
  map: L.DrawMap;  
 
  fornecedorList: SupplierRequestDto[]; 
 
  constructor(
    private readonly _authService: AuthService,
    private readonly _associationService: AssociationService,
    private _supplierService: SupplierService,
    private _userService: UserService,
  ) { }

  ngAfterViewInit(): void {
    this._initMap(); 
  }

  ngOnInit() {
    this._loadLoggedInfo(); 
    this._listSupplier(); 
  }

  private _initMap() {
    this.map = L.map('map').setView([-23.6820635, -46.924961], 8); 

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      maxZoom: 19, 
      attribution: '&copy;  <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map); 
  } 

  private _loadLoggedInfo() { 
    this.loggesdUser = this._authService.getAuthenticatedUser(); 
    this._userService.getById(this.loggesdUser.id).subscribe({ 
      next: response => { 
        this.loggedtAssociation = response; 
        
        this.map.panTo( 
          new L.LatLng( 
            +this.loggedtAssociation.association.address.latitude, 
            +this.loggedtAssociation.association.address.longitude, 
          ) 
        );

        this.addMarker( 
          this.loggedtAssociation.name, 
          DocuemntUtil.formatDocument(this.loggedtAssociation.document), 
          this.loggedtAssociation.association.address.latitude, 
          this.loggedtAssociation.association.address.longitude, 
          'association', 
        ) 
      } 
    }); 
  } 

  private _listSupplier() { 
    this._supplierService.supplierList().subscribe({ 
      next: response => { 
        this.fornecedorList = response; 
        this.fornecedorList.map(item => { 
          this.addMarker( 
            item.name, 
            DocuemntUtil.formatDocument(item.cpf), 
            item.address.latitude, 
            item.address.longitude, 
            'fornecedor', 
          ) 
        }) 
      } 
    }); 
  } 

  addMarker(name: string, cnpj: string, lat: string, lng: string, type: string) { 
 
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
        `<p>${name}</p>` +  
        `<p>${cnpj}</p>`,  
      ) 
      .addTo(this.map);  
  } 
} 
