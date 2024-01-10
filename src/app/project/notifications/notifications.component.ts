import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserListResponseDto } from 'src/dtos/user/user-list-response.dto';
import { UserService } from 'src/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {

  user : any
  userNotification: any = []
  lang: string = localStorage.getItem('selectedLanguage');
  notificationList: any = []


  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService,
  ) {
  
  }

  ngOnInit(): void {
    
    const user: any = localStorage.getItem('user');
    const newUser = JSON.parse(user)
    this.getUserById(newUser.id)    

  }



  async ngDoCheck() {
    if (this.lang !== localStorage.getItem('selectedLanguage')) {         
      this.lang = localStorage.getItem('selectedLanguage'); 
      await this.trasnlateUserNotification()     
    }
  } 

  redirectToBid(element: any) {
    if(element.bid_id) {
      this.router.navigate(['/pages/licitacoes/licitacao-data', element.bid_id]);
    }
  
  }
 
  getUserById(_id: string) {
    this.userService.getById(_id).subscribe({
      next: async (success) => {
        this.userNotification = await success.notification_list.reverse()          
        this.trasnlateUserNotification()      
      }, 
      error: (error) => {        
      }
    });
  }

  trasnlateUserNotification(){    
    
    let part, bid_count, name;

    this.notificationList = []   
    this.notificationList = JSON.parse(JSON.stringify(this.userNotification));   

    for(let i=0;i<this.userNotification.length;i++){          

      if( this.userNotification[i].title.includes("Convite para licitação de número") ){          
          part = this.notificationList[i].title.split(" ")
          bid_count = part[5];              
          this.notificationList[i].title = `${this.translate.instant('NOTIFICATION.INVITATION')} ${bid_count}`;
      }
          
      if( this.userNotification[i].description.includes("está aguardando liberação") ){
          part = this.notificationList[i].description.split(" ")
          name = part[2];              
          this.notificationList[i].title = this.translate.instant('NOTIFICATION.RELEASE_TITLE')
          this.notificationList[i].description = `${this.translate.instant('NOTIFICATION.RELEASE_PART1')} ${name} ${this.translate.instant('NOTIFICATION.RELEASE_PART2')}`;
      }          

    }     

  }

}
