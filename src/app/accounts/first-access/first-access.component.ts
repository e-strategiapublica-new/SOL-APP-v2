import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-first-access',
  templateUrl: './first-access.component.html',
  styleUrls: ['./first-access.component.scss']
})
export class FirstAccessComponent implements OnInit {

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
    this.userService.firstAccess(this.form.value).subscribe({
      next: (data) => {

        localStorage.setItem(LocalStorageKeysEnum.email, data.email);
        this.router.navigate(['/accounts/code-first-access']);
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