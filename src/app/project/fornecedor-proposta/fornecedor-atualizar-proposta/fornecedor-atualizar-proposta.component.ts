import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { ProposalService } from "src/services/proposal.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-fornecedor-atualizar-proposta",
  templateUrl: "./fornecedor-atualizar-proposta.component.html",
  styleUrls: ["./fornecedor-atualizar-proposta.component.scss"],
})
export class FornecedorAtualizarPropostaComponent {
  form: FormGroup;
  response: any = {};
  quantity: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private location: Location,
    private translate: TranslateService,

    private route: ActivatedRoute,
    private proposalService: ProposalService
  ) {
    this.form = this.formBuilder.group({
      frete: ["", [Validators.required]],
      valueUnity: ["", [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.response = data["proposal"];
        console.log(this.response)
        this.quantity = this.response?.allotment?.reduce(
          (acc: number, curr: any) =>
            acc + curr.add_item.reduce((accc: number, item: any) => accc + Number(item.quantity), 0),
          0
        );
        this.form.patchValue({
         
          valueUnity: (+this.response?.total_value)/this.quantity,
          frete: this.response?.freight,
        })
      },
    });
  }

  backProposal() {
    let request = {
      freight:+this.form.value.frete,
      total_value:(+(this.form.value.valueUnity) * this.quantity).toFixed(2)
    }
    this.proposalService.updateValues(this.response._id, request).subscribe({
      next: data => {
        this.toastrService.success(this.translate.instant('TOASTRS.UPDATE_PROPOSAL'), '', { progressBar: true });
        this.location.back();
      },
      error: error => {
        console.error(error);
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_UPDATE_PROPOSAL'), '', { progressBar: true });
      }
    })
  }
}
