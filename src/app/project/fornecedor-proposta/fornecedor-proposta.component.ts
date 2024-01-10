import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DatamockService } from 'src/services/datamock.service';

@Component({
  selector: 'app-fornecedor-proposta',
  templateUrl: './fornecedor-proposta.component.html',
  styleUrls: ['./fornecedor-proposta.component.scss']
})
export class FornecedorPropostaComponent {

  oneStep: number | null = null;
  twoStap = false;
  proposalList: any;
  constructor(
    public datamock: DatamockService,
    private toastrService: ToastrService


  ) { }
  ngOnInit(): void {
    this.proposalList = this.datamock.lotes;
  }


  openDetail(value: number) {
    if (this.oneStep === value) this.oneStep = null;
    else this.oneStep = value;
  }

  openProposal() {
    this.twoStap = !this.twoStap;
  }

}
