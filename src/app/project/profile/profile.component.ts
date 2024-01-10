import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {
  changePassword!: FormGroup;

  constructor(
    public authService: AuthService,
    private modalService: NgbModal,
    private translate: TranslateService,

    private formBuilder: FormBuilder,
    private userService: UserService,
    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService
  ) {
    this.changePassword = this.formBuilder.group({
      password: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]],
      newPassword: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]
      ],
      confirmNewPassword: ['',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ]],
    });
  }

  ngOnInit(): void {
  }

  open(content: any) {
    this.modalService.open(content, { size: 'md' });
  }

  exit() {
    this.modalService.dismissAll();
    this.changePassword.reset();
  }

  savePassword() {
    this.ngxSpinnerService.show();
    let request = {
      password: this.changePassword.controls['password'].value,
      newPassword: this.changePassword.controls['newPassword'].value,
    };

    if (request.newPassword === this.changePassword.controls['confirmNewPassword'].value) {
      this.userService.updatePassword(request).subscribe({
        next: (data) => {
          this.modalService.dismissAll();
          this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_CHANGE_PASS'), '', { progressBar: true });
          this.ngxSpinnerService.hide();
          this.changePassword.reset();
        },
        error: (error) => {

          switch(error.error.errors[0]){
            case "wrong password!":
              this.toastrService.error(this.translate.instant('TOASTRS.INCORRECT_CURRENT_PASS'), '', { progressBar: true });
            break;  
            case "Nova senha deve ter no mínimo 8 caracteres!":
              this.toastrService.error(this.translate.instant('TOASTRS.INCORRECT_PASS_REQUIREMENT'), '', { progressBar: true });
            break;    
          }

          console.log(error.error.errors[0])

          
          this.ngxSpinnerService.hide();
        }
      })
    } else {
      this.ngxSpinnerService.hide();
      this.toastrService.error(this.translate.instant('TOASTRS.PASS_NOT_EQUALS'), '', { progressBar: true });
    }
  }

}
