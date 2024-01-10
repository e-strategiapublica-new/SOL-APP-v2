import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageKeysEnum } from 'src/enums/local-storage-keys.enum';

@Component({
  selector: 'app-confirm-code-first-access',
  templateUrl: './confirm-code-first-access.component.html',
  styleUrls: ['./confirm-code-first-access.component.scss']
})
export class ConfirmCodeFirstAcessComponent implements OnInit {

  isSubmit: boolean = false;
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {

  }

  resendCode() {

  }

  onSubmit() {

    this.isSubmit = true;

    if (this.form.status == 'INVALID') {
      return;
    }

    localStorage.setItem(LocalStorageKeysEnum.code, this.form.controls['code'].value);
    this.router.navigate(['/accounts/register-pass-first-access']);

  }

}