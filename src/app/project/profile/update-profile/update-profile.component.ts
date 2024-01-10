import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent {
  form!: FormGroup;
  userId: string;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private translate: TranslateService,

    private ngxSpinnerService: NgxSpinnerService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    this.userService.getAuthenticatedUser().subscribe({
      next: (success) => {
        this.userId = success._id;
      }
    },
    )
  }

  changeInfo() {
    this.ngxSpinnerService.show();
    this.userService.updateUserInfo(this.userId, this.form.value).subscribe({
      next: (success) => {
        const user = JSON.parse(localStorage.getItem(LocalStorageKeysEnum.user) || '')

        if (user) {
          this.userService.getAuthenticatedUser().subscribe({
            next: (data) => {
              user.name = data.name
              localStorage.setItem(LocalStorageKeysEnum.user, JSON.stringify({ ...user, data: data.name }));
            }
          })
        }
        this.toastrService.success(this.translate.instant('TOASTRS.SUCCESS_UPDATE_NAME'), '', { progressBar: true });
        this.ngxSpinnerService.hide();
        this.router.navigate(['/pages/profile'])
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(this.translate.instant('TOASTRS.ERROR_UPDATE_NAME'), '', { progressBar: true });
      }
    })
  }

}