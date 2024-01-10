import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { AssociationBidService } from 'src/services/association-bid.service';
import { PlataformService } from 'src/services/plataform.service';
import { BidUpdateDateDto } from 'src/dtos/bid/bid-update-date.dto';

@Component({
  selector: 'app-administration-set-time',
  templateUrl: './administration-set-time.component.html',
  styleUrls: ['./administration-set-time.component.scss']
})
export class AdministrationSetTimeComponent {

  form: FormGroup
  startHour: string;
  endHour: string;
  plataform_config: any

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private bidService: AssociationBidService,
    private plataformService: PlataformService
  ) {

    this.form = this.formBuilder.group({
      timeStart: [JSON.parse(localStorage.getItem('plataform-config')).start_at, [Validators.required]],
      timeEnd: [JSON.parse(localStorage.getItem('plataform-config')).end_at, [Validators.required]]
    })
  }


  exit() {
    this.modalService.dismissAll()
  }

  // onSubmit(event: any) {
    
  //   this.toastrService.success('Horario definido com sucesso', '', { progressBar: true })
  //   this.exit()
  // }

  setDate(event:any) {
    if (event.target.id === 'timeStart') {
      this.startHour = event.target.value
      this.form.controls['timeStart'].setValue(event.target.value)
    } else {
      this.endHour = event.target.value
      this.form.controls['timeEnd'].setValue(event.target.value)
    }

  }

  onSubmit(event: any) {
    const dto = {
      start_at: this.startHour,
      end_at: this.endHour
    }
    this.plataformService.plataformRegister(dto).subscribe({
      next: (data) => {
        const config: BidUpdateDateDto = {
          start_at: data.start_at,
          end_at: data.end_at
        }
        localStorage.setItem("plataform-config", JSON.stringify(config));
        this.toastrService.success('Horario definido com sucesso', '', { progressBar: true })
        this.exit()

      },
      error: (error) => {

        console.error(error);
        this.toastrService.error(error.error.errors[0], '', { progressBar: true, });
        this.exit()
    

      }})

      

  }

}
