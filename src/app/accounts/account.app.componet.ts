import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'account-app-root',
    templateUrl: './account.app.component.html',
    styleUrls:['./account.app.component.scss']
})
export class AccountAppComponent {

    constructor(
        private router: Router,
    ) {
     }

     handler():string{
        if(this.router.url.includes('login')){
            return 'none'
        }
        return ''
     }

    
}