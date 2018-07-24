import {Component} from '@angular/core';
import { Router} from '@angular/router';

import {Observable} from "rxjs/Observable";

import {TranslateService} from "@ngx-translate/core";

import {Message, SelectItem} from 'primeng/primeng';

import {LoginService} from "./login.service";
import {MainMenu} from "../../main-menu/main.menu";

@Component({
    selector: 'login',
    templateUrl: 'login.form.html',
    providers:[LoginService]
})
export class LoginForm {

    username: string = '';
    password: string = '';

    languages:SelectItem[];
    selectedLanguage:string;

    msgs: Message[] = [];

    constructor(
        private loginService:LoginService
        ,private translate:TranslateService
        ,private router: Router
    ){
      this.languages = MainMenu.getLanguages();
      this.languages.forEach((item)=>{
        item.label = item.value;
      });
      this.selectedLanguage = this.languages[0].value;
    };

    languageChange():void{
      this.translate.use(this.selectedLanguage);
    }

    authenticate(event) {
        event.preventDefault();

        this.loginService.authenticate(this.username,this.password).subscribe(
          ()=>{
            this.router.navigate(['desktop']);
            },
            (error:Observable<string> | string)=>{

              this.password = '';
              this.msgs = [];

              if (typeof error === "string"){
                this.msgs.push({severity:'error', summary:'Error Message', detail:error});
              }else{
                error.subscribe((message:string)=>{
                  this.msgs.push({severity:'error', summary:'Error Message', detail:message});
                },errorTranslate=>{
                  console.log(errorTranslate);
                  this.msgs.push({severity:'error', summary:'Error Message', detail:errorTranslate});
                });
              }
            }
          );
    }
}
