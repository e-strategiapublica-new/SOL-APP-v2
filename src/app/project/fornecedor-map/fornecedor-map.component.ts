import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { AssociationResponseDto } from '../../../dtos/association/association-response.dto';
import { AuthService } from '../../../services/auth.service';
import { AssociationService } from '../../../services/association.service';
import { SupplierService } from '../../../services/supplier.service';
import { UserService } from '../../../services/user.service';
import DocuemntUtil from '../../../utils/document.util';

@Component({
  selector: 'app-fornecedor-map',
  templateUrl: './fornecedor-map.component.html',
  styleUrls: ['./fornecedor-map.component.scss']
})
export class FornecedorMapComponent implements OnInit, AfterViewInit {


  map: L.DrawMap; 

  loggesdUser: any; 
  loggedtSupplier: any; 

  associationList: AssociationResponseDto[]; 

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
    this._listAssociation(); 
  }
   
  private _initMap() { 
    this.map = L.map('map').setView([-23.6820635, -46.924961], 8); 

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' 
    }).addTo(this.map); 
  }
 
  private _loadLoggedInfo() {
    this.loggesdUser = this._authService.getAuthenticatedUser(); 
    this._userService.getById(this.loggesdUser.id).subscribe({  
      next: response => {
        this.loggedtSupplier = response; 
        
        this.map.panTo( 
          new L.LatLng(  
            +this.loggedtSupplier.supplier.address.latitude, 
            +this.loggedtSupplier.supplier.address.longitude, 
          )
        );

        this.addMarker(
          this.loggedtSupplier.name,
          DocuemntUtil.formatDocument(this.loggedtSupplier.document),
          this.loggedtSupplier.supplier.address.latitude, 
          this.loggedtSupplier.supplier.address.longitude, 
          'fornecedor',
        ) 
      } 
    }); 
  } 
 
  private _listAssociation() {  
    this._associationService.list().subscribe({ 
      next: response => { 
        this.associationList = response; 
        this.associationList.map(item => { 
          this.addMarker( 
            item.name, 
            DocuemntUtil.formatDocument(item.cnpj), 
            item.address.latitude, 
            item.address.longitude, 
            'association', 
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
