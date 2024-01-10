import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AllotmentStatusEnum } from 'src/enums/allotment-status.enum';
import { BidStatusEnum } from 'src/enums/bid-status.enum';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-administration-lote-licitacao',
  templateUrl: './administration-lote-licitacao.component.html',
  styleUrls: ['./administration-lote-licitacao.component.scss']
})
export class AdministrationLoteLicitacaoComponent {
  response = JSON.parse(localStorage.getItem("lotes") || '{}');
  biddingID : string;

  bidStatusEnum = BidStatusEnum;

  constructor(
    public datamock: DatamockService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.biddingID = this.response._id
  }

  open(value: string) {
    localStorage.setItem('bidResponse', JSON.stringify(this.response))
    this.router.navigate(["/pages/proposal-screening/proposal-accepted"])
  }

  getStatusClass(status: string): string {
    switch (status) {
      case AllotmentStatusEnum.aberta:
        return 'text-primary';
      case AllotmentStatusEnum.cancelado:
      case AllotmentStatusEnum.deserto:
      case AllotmentStatusEnum.fracassado:
        return 'text-danger';
      case AllotmentStatusEnum.adjudicado:
        return 'text-success';
      case AllotmentStatusEnum.rascunho:
        return 'text-dark';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case AllotmentStatusEnum.aberta:
        return 'Aberta';
      case AllotmentStatusEnum.cancelado:
        return 'Cancelado';
      case AllotmentStatusEnum.deserto:
        return 'Deserto';
      case AllotmentStatusEnum.fracassado:
        return 'Fracassado';
      case AllotmentStatusEnum.adjudicado:
        return 'Adjudicado';
      case AllotmentStatusEnum.rascunho:
        return 'Rascunho';
      default:
        return '';
    }
  }

}

