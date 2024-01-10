import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { ProposalService } from 'src/services/proposal.service';
import * as XLSX from 'xlsx';
import { RecusarPropostaModalComponent } from '../../associacao-licitacao-view-proposal/components/recusar-proposta-modal/recusar-proposta-modal.component';

@Component({
  selector: 'app-proposal-accepted',
  templateUrl: './proposal-accepted.component.html',
  styleUrls: ['./proposal-accepted.component.scss']
})
export class ProposalAcceptedComponent {

  responseBid: any;
  haveAccept: Boolean = false;
  responseProposal: any;
  user: any
  constructor(
    private proposalService: ProposalService,
    public authService: AuthService,
    private modalService: NgbModal,
    private translate: TranslateService,
    private location: Location,
    private toastrService: ToastrService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getResponse()
  }

  getResponse() {
    let response: any = localStorage.getItem('bidResponse');
    this.responseBid = JSON.parse(response);
    let userType: any = localStorage.getItem('user');
    this.user = JSON.parse(userType);
    this.proposalService.listProposalByBid(this.responseBid._id).subscribe({
      next: data => {
        this.responseProposal = data;
        this.responseProposal.proposals.sort((a: any, b: any) => {
          if (a.status === 'aceitoAssociacao') {
            return -1;
          }
          if (b.status === 'aceitoAssociacao') {
            return 1;
          }
          return 0;
        });
      },
      error: error => {
        console.error(error)
      }
    })
  }

  accept(event: any) {
    const dto = {
      acceptedRevisorAt:  new Date().toDateString(),
      reviewer_accept:  true
    }
    this.proposalService.acceptProposalReviewer(event._id,dto).subscribe({
      next: data => {
      //   this.getResponse()
      //   this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_ACCEPT_PROPOSAL'), '', { progressBar: true });
      //  // this.location.back();
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_ACCEPT_PROPOSAL'), '', { progressBar: true });

this.router.navigate([this.location.path()]);
});
      },
      error: error => {
        console.error(error);
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_ACCEPT_PROPOSAL'), '', { progressBar: true });
      }
    })
  }
   

  
  refuse(event:any) {
    const dto = {
      acceptedRevisorAt:  new Date().toDateString(),
      reviewer_accept:  false
    }
    this.proposalService.acceptProposalReviewer(event._id,dto).subscribe({
      next: data => {
        // this.getResponse()

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                  this.toastrService.success('Proposta recusada com sucesso!', '', { progressBar: true });

          this.router.navigate([this.location.path()]);
        });
      //  this.location.back();
      },
      error: error => {
        console.error(error);
        this.toastrService.error('Erro ao recusar proposta!', '', { progressBar: true });
      }
    })

  }

  open() {
    const base64String = this.responseProposal.file;
    const nomeArquivo = 'planilha.xlsx';

    const arquivoDecodificado = atob(base64String);

    const bytes = new Uint8Array(arquivoDecodificado.length);
    for (let i = 0; i < arquivoDecodificado.length; i++) {
      bytes[i] = arquivoDecodificado.charCodeAt(i);
    }

    const workbook = XLSX.read(bytes, { type: 'array' });

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const excelUrl = URL.createObjectURL(excelBlob);

    const link = document.createElement('a');
    link.href = excelUrl;
    link.download = nomeArquivo;

    link.click();

    URL.revokeObjectURL(excelUrl);
  }

  refused(pro: any) {
    localStorage.setItem('proposalAction', JSON.stringify(pro))
    const modalRef = this.modalService.open(RecusarPropostaModalComponent, { centered: true });
    modalRef.result.then(data => {
    }, error => {
      this.location.back();
    });
  }

  approve(_id: string) {
    this.proposalService.acceptProposal(_id).subscribe({
      next: data => {
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_ACCEPT_PROPOSAL'), '', { progressBar: true });
        this.location.back();
      },
      error: error => {
        console.error(error);
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_ACCEPT_PROPOSAL'), '', { progressBar: true });
      }
    })
  }

}

// so exibe  botoes se for na melhor proposta
// depois que a associacao aceitou, pode habilitar o botao ou exibir para a adm aceitar tbm
// depois do aceito ou recusa da adm retirar os botoes
// se associacao recusar e a adm aceitou a recusa a associacao pode selecionar outra proposta