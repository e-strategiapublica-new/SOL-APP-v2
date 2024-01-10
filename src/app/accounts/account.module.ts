import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountAppComponent } from "./account.app.componet";
import { AccountRoutingModule } from "./account.route";
import { CodePassComponent } from "./code-pass/code-pass.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LoginComponent } from "./login/login.component";
import { NewPasswordComponent } from "./new-password/new-password.component";
import { AuthService } from "src/services/auth.service";
import { UserService } from "src/services/user.service";
import { FirstAccessComponent } from './first-access/first-access.component';
import { RegisterSupplierComponent } from './register-supplier/register-supplier.component';
import { RegisterSupplierUserComponent } from './register-supplier-user/register-supplier-user.component';
import { ConfirmCodeFirstAcessComponent } from './confirm-code-first-access/confirm-code-first-access.component';
import { RegisterPasswordFirstAccessComponent } from './register-password-first-access/register-password-first-access.component';
import { CommonModule } from "@angular/common";
import { AssociationService } from "src/services/association.service";
import { CostItemsService } from "src/services/cost-items.service";
import { SupplierService } from "src/services/supplier.service";
import { ChangeLangComponent } from "../components/change-lang/change-lang.component";
import { TranslateModule } from "@ngx-translate/core";
import { ChangeLangAuthComponent } from "../components/change-lang-auth/change-lang-auth.component";
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        AccountAppComponent,
        LoginComponent,
        ForgotPasswordComponent,
        CodePassComponent,
        NewPasswordComponent,
        FirstAccessComponent, 
        RegisterSupplierComponent, 
        RegisterSupplierUserComponent,      
        ConfirmCodeFirstAcessComponent,
        RegisterPasswordFirstAccessComponent,
        ChangeLangComponent,
        ChangeLangAuthComponent
    ],
    imports: [
        AccountRoutingModule,
        ReactiveFormsModule,
        CommonModule,
        TranslateModule,
        NgSelectModule
    ],
    exports: [
        ChangeLangComponent
    ],
    providers: [
        AuthService,
        UserService,
        AssociationService,
        CostItemsService,
        SupplierService,
    ]
})
export class AccountModule { }