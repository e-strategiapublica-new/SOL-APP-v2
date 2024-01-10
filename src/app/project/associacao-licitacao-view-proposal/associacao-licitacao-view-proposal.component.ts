import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbAccordionConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { BidStatusEnum } from "src/enums/bid-status.enum";
import { ProposalService } from "src/services/proposal.service";
import { WorkPlanService } from "src/services/work-plan.service";
import { AceitarPropostaModalComponent } from "./components/aceitar-proposta-modal/aceitar-proposta-modal.component";
import { RecusarPropostaModalComponent } from "./components/recusar-proposta-modal/recusar-proposta-modal.component";
import { Location } from "@angular/common";

@Component({
  selector: "app-associacao-licitacao-view-proposal",
  templateUrl: "./associacao-licitacao-view-proposal.component.html",
  styleUrls: ["./associacao-licitacao-view-proposal.component.scss"],
})
export class AssociacaoLicitacaoViewProposalComponent {
  isSectionOneOpen: boolean = false;
  isSectionTwoOpen: boolean = false;

  response: any;

  valueEsteemed: any;

  openAccordion: boolean[] = [];

  activeItemIndex: number = 0;

  estimatedprice: any = [];
  totalValue: any = [];

  constructor(
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private accordionConfig: NgbAccordionConfig,
    private ngxSpinnerService: NgxSpinnerService,
    private proposalService: ProposalService,
    private toastrService: ToastrService,
    private workPlanService: WorkPlanService,
    private location: Location,
  ) {
    this.accordionConfig.closeOthers = true;
  }

  ngOnInit(): void {
    this.listProposal();
  }

  listProposal() {
    this.ngxSpinnerService.show();
    this.route.data.subscribe({
      next: data => {
        console.log(data)
        this.response = data["proposals"];
        
        if (this.response.proposals.length > 0) {
          this.valueEsteemed = this.response.proposals.reduce((acc: number, item: any) => {
            if (item.total_value) {
              return acc + Number(item.total_value);
            } else {
              return acc;
            }
          }, 0) / this.response.proposals.length;

          for (let iterator of this.response.proposals) {
            Object.assign(iterator, { isOpen: false });
          }
          for (let id of data["proposals"].bid.agreement.workPlan) {
            this.workPlanService.getById(id).subscribe({
              next: data => {
                this.estimatedprice.push(
                  data.product.reduce((acc: number, sum: any) => {
                    return Number(acc) + Number(sum.unitValue) * Number(sum.quantity);
                  }, 0)
                );
                this.totalValue = this.estimatedprice.reduce((acc: number, sum: number) => {
                  return acc + sum;
                });
              },
            });
          }
        }
        this.ngxSpinnerService.hide();
      },
    });
  }

  toggleSectionOne() {
    this.isSectionOneOpen = !this.isSectionOneOpen;
  }

  toggleSectionTwo() {
    this.isSectionTwoOpen = !this.isSectionTwoOpen;
  }

  refuse(proposal: any) {
    localStorage.setItem("proposalAction", JSON.stringify(proposal));
    const modalRef = this.modalService.open(RecusarPropostaModalComponent, { centered: true });
    modalRef.result.then(
      data => {},
      error => {
        setTimeout(() => {
          this.proposalService.listProposalByBid(this.response.bid._id).subscribe({
            next: data => {
              this.response = data;
            },
          });
        }, 1000);
      }
    );
  }

  view(proposal: any) {}

  accept(proposal: any) {
    localStorage.setItem("proposalAction", JSON.stringify(proposal));
    const modalRef = this.modalService.open(AceitarPropostaModalComponent, { centered: true, size: "sm" });
    modalRef.result.then(
      data => {},
      error => {
        setTimeout(() => {
          this.proposalService.listProposalByBid(this.response.bid._id).subscribe({
            next: data => {
             
              this.response = data;
            },
          });
        }, 1000);
      }
    );
  }

  setActiveItem(index: number) {
    if (this.activeItemIndex === index) {
      this.activeItemIndex = -1;
    } else {
      this.activeItemIndex = index;
    }
  }

  isActiveItem(index: number) {
    return this.activeItemIndex === index;
  }

  isIconUp(index: number) {
    return this.response.bid.allotment.proposal[index].isOpen;
  }

  toggleItem(index: number) {
    this.response.bid.allotment.proposal[index].isOpen = !this.response.bid.allotment.proposal[index].isOpen;
  }

  download() {}

  handleTie(): boolean {
    const now = new Date();
    const bidDate = new Date(this.response.bid.end_at);
    if (!(this.response.bid.status === BidStatusEnum.analysis)) {
      return false;
    }
    if (now.getTime() < bidDate.getTime()) {
      return false;
    }
    bidDate.setDate(bidDate.getDate() + Number(this.response.bid.days_to_tiebreaker || "0"));
    if (now.getTime() > bidDate.getTime()) {
      return false;
    }

    return true;
  }

  sendTieBreaker() {
    this.ngxSpinnerService.show();
    this.proposalService.sendTieBreaker(this.response.bid._id).subscribe({
      next: data => {
        this.ngxSpinnerService.hide();
        this.toastrService.success("Empate enviado com sucesso!");
        this.listProposal();
      },
      error: error => {
        this.toastrService.error("Erro ao enviar empate!");
        console.error(error);
        this.ngxSpinnerService.hide();
      },
    });
  }

  getSupplierName(proposalId: string): string {
    if (!this.response.proposals) return "--";
    if (!proposalId) return "--";
    const proposal = this.response.proposals.find((proposal: any) => proposal._id === proposalId);
    if (!proposal) return "--";
    return proposal?.proposedBy?.supplier?.name || "--";
  }

  back() {
    this.location.back();
  }
}
