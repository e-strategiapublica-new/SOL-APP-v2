import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BidUpdateDateDto } from 'src/dtos/bid/bid-update-date.dto';
import { AuthService } from 'src/services/auth.service';
import { PlataformService } from 'src/services/plataform.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  isSubmit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private ngxSpinnerService: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private plataformService: PlataformService,
    private translate: TranslateService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      keep_conn: [false],
    });
  }

  ngOnInit(): void {
  }

  clearSpace(event: any) {
    if(event.charCode === 32) {
      event.preventDefault()
    }
  }

  onSubmit() {
    const password = this.form.value.password        

    let isValid = true;
        
    if(!password && !this.form.controls['email'].value){
      this.toastrService.error(this.translate.instant(this.translate.instant("MESSAGES_FROM_API.INVALID_CREDENTIALS")), undefined, { progressBar: true, });                  
      return      
    }

    if(!this.form.controls['email'].value){
      this.toastrService.error(this.translate.instant(this.translate.instant("ERROR_MESSAGES.INVALID_EMAIL")), undefined, { progressBar: true, });                        
      isValid = false;
    }

    if(!password || password.length < 8){
      this.toastrService.error(this.translate.instant(this.translate.instant("MESSAGES_FROM_API.MIN_PASSWORD_CHARACTERS")), undefined, { progressBar: true, });      
      isValid = false;
    }

    if(password.length > 20){
      this.toastrService.error(this.translate.instant(this.translate.instant("MESSAGES_FROM_API.MAX_PASSWORD_CHARACTERS")), undefined, { progressBar: true, });                  
      isValid = false;
    }

    if(!isValid){
      return;
    }    

    this.isSubmit = true;
    if (this.form.status == 'INVALID') {
      return;
    }

    this.ngxSpinnerService.show();

    this.authService.authenticate(this.form.value).subscribe({
      next: async (data) => {
        this.authService.setAuthenticatedUser(data);
        this.plataformService.list().subscribe({
          next: async (res: BidUpdateDateDto) => {
            const config: BidUpdateDateDto = {
              start_at: res.start_at,
              end_at: res.end_at
            }
            localStorage.setItem("plataform-config", JSON.stringify(config));
          },
          error: (error) => {
            console.error(error);

            this.toastrService.error(error.error.errors[0], undefined, { progressBar: true, });
            this.ngxSpinnerService.hide();
          }
        })
        
        this.router.navigate(['/pages/dashboard']);
        this.ngxSpinnerService.hide();
      },
      error: (error) => {
        let msg;
        switch(error.error.errors[0]){
          case "Email ou senha inválido(s)!": {
            msg = "MESSAGES_FROM_API.INVALID_CREDENTIALS";
            break;
          }
          case "Senha deve ter no mínimo 8 caracteres!": {            
            msg = "MESSAGES_FROM_API.MIN_PASSWORD_CHARACTERS";
            break;
          }
          case "Senha deve ter no máximo 20 caracteres!": {
            msg = "MESSAGES_FROM_API.MAX_PASSWORD_CHARACTERS"
          }
        }
        this.toastrService.error(this.translate.instant(msg), undefined, { progressBar: true, });
        this.ngxSpinnerService.hide();
      }
    });

  }

}
