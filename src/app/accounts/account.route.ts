import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { AccountAppComponent } from "./account.app.componet";
import { CodePassComponent } from "./code-pass/code-pass.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { NewPasswordComponent } from "./new-password/new-password.component";
import { LoginComponent } from "./login/login.component";
import { FirstAccessComponent } from "./first-access/first-access.component";
import { RegisterSupplierComponent } from "./register-supplier/register-supplier.component";
import { RegisterSupplierUserComponent } from "./register-supplier-user/register-supplier-user.component";
import { ConfirmCodeFirstAcessComponent } from "./confirm-code-first-access/confirm-code-first-access.component";
import { RegisterPasswordFirstAccessComponent } from "./register-password-first-access/register-password-first-access.component";

const routerConfig: Routes = [
    {
        path: '', component: AccountAppComponent,
        children: [
            { path: 'accounts/login', component: LoginComponent },
            { path: 'accounts/esqueceu-senha', component: ForgotPasswordComponent },
            { path: 'accounts/code-pass', component: CodePassComponent },
            { path: 'accounts/new-pass', component: NewPasswordComponent },
            { path: 'accounts/primeiro-acesso', component: FirstAccessComponent },
            { path: 'accounts/register-supplier', component: RegisterSupplierComponent },
            { path: 'accounts/register-supplier-user', component: RegisterSupplierUserComponent },
            { path: 'accounts/code-first-access', component: ConfirmCodeFirstAcessComponent },
            { path: 'accounts/register-pass-first-access', component: RegisterPasswordFirstAccessComponent },
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routerConfig)
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule { }
