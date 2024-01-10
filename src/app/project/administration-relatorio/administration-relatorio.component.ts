import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { isArray } from 'chart.js/dist/helpers/helpers.core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AuthService } from 'src/services/auth.service';
import { Chart, registerables } from 'chart.js';
import { BidStatusEnum } from 'src/enums/bid-status.enum';

@Component({
  selector: 'app-administration-relatorio',
  templateUrl: './administration-relatorio.component.html',
  styleUrls: ['./administration-relatorio.component.scss']
})
export class AdministrationRelatorioComponent {
  BarChar: any = []
  currentPage: number = 1;
  itensPerPage: number = 5;
  totalBidValue: any = 0
  map: Map<string, {quantity:string, status:string, value:number}> = new Map()
  objKeys: any
  
  storedLanguage : string | null

  constructor(
    private authbase: AuthService,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private spinnerService: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    Chart.register(...registerables)
    // if (this.authbase.getAuthenticatedUser().type !== 'administrador') this.router.navigate(['/pages/dashboard']);
    
    this._associationBidService.report().subscribe({
      next: data => {
        this.spinnerService.hide(); 
        this.setMapByStatus(data)
        this.graphic()
        
      },
      error: error => {
        this.spinnerService.hide();
      }
    })
    
    this.storedLanguage = localStorage.getItem('selectedLanguage');
  }

  setMapByStatus(data: any) {
    for(let iterator of data) {
      this.map.set(iterator.status, iterator)
    }
    this.objKeys = [...this.map.keys()]

  }



  graphic() {
    let data = [
      'Aguardando liberação',
      'Liberada',
      'Aberta',
      'Aguardando desempate',
      'Em análise',
      'Concluída',
      'Cancelada',
      'Fracassada',
      'Reaberta',
      'Deserta',
      'Em rascunho'
    ]
    let label = 'Gráfico Licitações'

    switch(this.storedLanguage) {
      case 'pt': 
        data = [
          'Aguardando liberação',
          'Liberada',
          'Aberta',
          'Aguardando desempate',
          'Em análise',
          'Concluída',
          'Cancelada',
          'Fracassada',
          'Reaberta',
          'Deserta',
          'Em rascunho',
          'Devolvida'
        ]
        break;
      case 'en':
        data = [
          'Waiting for release',
          'Released',
          'Open',
          'Waiting for tiebreaker',
          'Under analysis',
          'Completed',
          'Cancelled',
          'Failed',
          'Reopened',
          'Deserted',
          'Draft',
          'Returned'
          ]
        break;
      case 'fr':
        data = [
          'En attente de libération',
          'Libérée',
          'Ouverte',
          "En attente d'un dénouement",
          "En cours d'analyse",
          'Terminée',
          'Annulée',
          'Échouée',
          'Réouverte',
          'Abandonnée',
          'Brouillon',
          'Revenu'
          ]
        break;
      case 'es':
        data = [
          'Esperando liberación',
          'Liberada',
          'Abierta',
          'Esperando desempate',
          'En análisis',
          'Completada',
          'Cancelada',
          'Fracasada',
          'Reabierta',
          'Desierta',
          'En borrador',
          'Devuelto'
        ]
        break;
    }

    switch(this.storedLanguage) {
      case 'pt': 
        label = 'Gráfico Licitações'
        break;
      case 'en':
        label = 'Bidding Chart'
        break;
      case 'fr':
        label = "Graphique des appels d'offres"
        break;
      case 'es':
        label = 'Gráfico de licitaciones'
        break;
    }
  
    new Chart(
      'acquisitions',
      {
        type: 'bar',
        data: {
          labels: data.map(ele => ele),
          
          datasets: [{
            
            label: label,
            data: [
             
              this.map.get(BidStatusEnum.awaiting)?.quantity,
              this.map.get(BidStatusEnum.released)?.quantity,
              this.map.get(BidStatusEnum.open)?.quantity,
              this.map.get(BidStatusEnum.tiebreaker)?.quantity,
              this.map.get(BidStatusEnum.analysis)?.quantity,
              this.map.get(BidStatusEnum.completed)?.quantity,
              this.map.get(BidStatusEnum.canceled)?.quantity,
              this.map.get(BidStatusEnum.failed)?.quantity,
              this.map.get(BidStatusEnum.reopened)?.quantity,
              this.map.get(BidStatusEnum.deserted)?.quantity,
              this.map.get(BidStatusEnum.draft)?.quantity],
            indexAxis: 'y',
            
            backgroundColor: [
              'rgba(242, 227, 7)',
              'rgba(4, 138, 33)',
              'rgba(45, 237, 87)',
              'rgba(242, 227, 7)',
              'rgba(251, 255, 13)',
              'rgba(45, 237, 87)',
              'rgba(242, 0, 0)',
              'rgba(242, 0, 0)',
              'rgba(5, 125, 2)',
              'rgba(173, 173, 168)',
              'rgba(130, 127, 127)'
            ],
            borderColor: [
              'rgb(255, 205, 86)',
              'rgb(4, 138, 33)',
              'rgb(45, 237, 87)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgb(75, 192, 192)',
              'rgb(242, 0, 0)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(255, 205, 86, 0.2)'
            ],
            borderWidth: 1
          }]
        }
      }
    )
  }

  // detailBids(i: any) {
  //   this.router.navigate([`/pages/licitacoes/detalhes-licitacoes/${i._id}`]);
  // }

}
