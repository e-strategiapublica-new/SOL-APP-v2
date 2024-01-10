import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AssociationBidService } from 'src/services/association-bid.service';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-administration-licitacoes-revisor',
  templateUrl: './administration-licitacoes-revisor.component.html',
  styleUrls: ['./administration-licitacoes-revisor.component.scss']
})
export class AdministrationLicitacoesRevisorComponent {
  licitacoesList: any = [];
  licitacoesListFilter: any = [];
  currentPage: number = 1;
  itensPerPage: number = 5;
  selectedFilterOption: string = "listAll";
  userId: string = '';

  searchTool = false;
  search: string = '';

  constructor(
    private authbase: AuthService,
    private router: Router,
    private _associationBidService: AssociationBidService,
    private spinnerService: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.userId = this.authbase.getAuthenticatedUser().id;
    if (this.authbase.getAuthenticatedUser().type !== 'administrador') this.router.navigate(['/pages/dashboard']);

    this.spinnerService.show();
    this._associationBidService.list().subscribe({
      next: data => {
        this.licitacoesListFilter = data.filter((item: any) => item.agreement.reviewer === this.userId);
        this.spinnerService.hide();
      },
      error: error => {
        console.error(error);
        this.spinnerService.hide();
      }
    })

  }

  detailBids(i: any) {
    this.router.navigate([`/pages/licitacoes/detalhes-licitacoes/${i._id}`]);
  }

  filter(event: any) {
    this.search = event.target.value;
    this.licitacoesListFilter = this.licitacoesList.filter(
      (item: any) => {
        if (this.selectedFilterOption === 'listAll' || this.selectedFilterOption === 'descending') {
          return item.association?.email?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.document?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.name?.toLowerCase().includes(this.search.toLowerCase())
        }

        if (!this.search.length) return item.status === this.selectedFilterOption

        if (this.search.length && item.status === this.selectedFilterOption) {
          return item.association?.email?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.document?.toLowerCase().includes(this.search.toLowerCase()) ||
            item.association?.name?.toLowerCase().includes(this.search.toLowerCase())
        }
      }
    );
  }

  changeSelectedFilter(event: any) {
    this.selectedFilterOption = event.target.value;

    const object = {
      target: {
        value: this.search
      }
    }
    this.filter(object)
  }

}
