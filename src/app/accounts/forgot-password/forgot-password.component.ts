import { UserService } from 'src/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/services/auth.service';
import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  isSubmit: boolean = false;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService,
    private translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {

    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }

    this.ngxSpinnerService.show();
    this.userService.resetPassword(this.form.value).subscribe({
      next: (data) => {

        localStorage.setItem(LocalStorageKeysEnum.email, data.email);
        this.router.navigate(['/accounts/code-pass']);
        this.ngxSpinnerService.hide();

      },
      error: (error) => { 
        if(error.error.errors[0] == "Email não encontrado!"){
          this.toastrService.error(this.translate.instant('ERROR_MESSAGES.EMAIL_NOT_FOUND'), '', { progressBar: true, });
          this.ngxSpinnerService.hide();
        }               
      }
    });

  }

}
