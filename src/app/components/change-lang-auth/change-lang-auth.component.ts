import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/services/auth.service';
import { LocalStorageService } from 'src/services/local-storage.service';

@Component({
  selector: 'app-change-lang-auth',
  templateUrl: './change-lang-auth.component.html',
  styleUrls: ['./change-lang-auth.component.scss']
})
export class ChangeLangAuthComponent {
  selectLang: string = 'PT-BR';
  @Input() backgroundColor: string = '';
  @Input() fontColor: string = '';

  constructor(
    public translate: TranslateService,
    public localStorage: LocalStorageService,
    public authService: AuthService,
  ) {
    translate.addLangs(['en', 'pt', 'es', 'fr']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang?.match(/en|pt|es|fr/) ? browserLang || '' : 'en');
    this.handlerSelectedLanguage(
      browserLang?.match(/en|pt|es|fr/) ? browserLang || '' : 'en'
    );
  }

  ngOnInit(): void {
    const storedLanguage = localStorage.getItem('selectedLanguage');

    if (storedLanguage) {
      this.translate.use(storedLanguage);
      this.handlerSelectedLanguage(storedLanguage);
    }
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.handlerSelectedLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  }

  handlerSelectedLanguage(lang: string) {    
    if (lang === 'en') {
      this.selectLang = 'EN-US';
      return;
    }
    if (lang === 'es') {
      this.selectLang = 'ES-ES';
      return;
    }
    if (lang === 'fr') {
      this.selectLang = 'FR-FR';
      return;
    }
    this.selectLang = 'PT-BR';
  }
}