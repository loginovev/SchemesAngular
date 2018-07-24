import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MainMenu} from "./main-menu/main.menu";
import {AppConfig} from "./config/app.config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    public translate: TranslateService
    ,private config:AppConfig
  ) {

    let stringLanguages:string[] = [];
    let languages = MainMenu.getLanguages();
    languages.forEach((item)=>{
      stringLanguages.push(item.value);
    });

    this.translate.addLangs(stringLanguages);
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang(languages[0].value);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(languages[0].value);

    if (window.location.origin!==this.config.BACKEND_WEBPACK_URL){
      this.config.BACKEND_API_ROOT_URL = window.location.origin;
    }
  }

}
