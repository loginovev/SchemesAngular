import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

import {TranslateService} from "@ngx-translate/core";

import {MenuItem, SelectItem} from "primeng/primeng";

import {AppConfig} from "../config/app.config";
import {LoginService} from "../security/login/login.service";

@Component({
    selector: 'main-menu',
    templateUrl: './main.menu.html',
    providers:[AppConfig,LoginService]
})
export class MainMenu implements OnInit{

  items: MenuItem[];

  themes:SelectItem[];
  selectedTheme:string;

  languages:SelectItem[];
  selectedLanguage:string;

  authenticated:boolean = false;

  constructor(
    private config:AppConfig
    ,private loginService:LoginService
    ,private translate: TranslateService
    ,private router: Router
  ){

    this.languages = MainMenu.getLanguages();
    this.themes = MainMenu.getThemes();
  }

  updateItems():void{

      this.translate.get("MAIN-MENU.MENU").subscribe((data)=>{

        this.items = [
          {
            label: data.FILE.File,
            items: [
              {label: data.FILE.Quit}
            ]
          },
          {
            label:data.SCHEMES.Schemes,routerLink:'/schemes'
          },
          {
            label:data.SECURITY.Security,
            items:[
              {label:data.SECURITY.Users,routerLink:'/users'},
              {label:data.SECURITY.Sessions,routerLink:'/sessions'},
              {label:data.SECURITY.Log,routerLink:'/log'}
            ]
          },
          {
            label:data.HELP.Help,
            items:[
              {label:data.HELP.About}
            ]
          }
        ];

      });
  }

  ngOnInit() {
    this.selectedTheme = "omega";
    this.selectedLanguage = MainMenu.getLanguages()[0].value;

    this.authenticated = false;

    this.languageChange();
    this.updateItems();
    this.themeChange();
  }

  isAuthenticated():string{

      if(this.authenticated){
        return 'block';
      }else {
        if (this.config.IS_AUTHENTICATED) {
          this.authenticated = true;

          setTimeout(()=>{
            if (this.config.CURRENT_OPTIONS.hasOwnProperty("theme")) {
              if (this.config.CURRENT_OPTIONS.theme !== this.selectedTheme) {
                this.selectedTheme = this.config.CURRENT_OPTIONS.theme;
                this.themeChange();
              }
            }
            if (this.config.CURRENT_OPTIONS.hasOwnProperty("language")) {
              if (this.config.CURRENT_OPTIONS.language !== this.selectedLanguage) {
                this.selectedLanguage = this.config.CURRENT_OPTIONS.language;
                this.languageChange();
              }
            }
          },200);

          return 'block';
        }else{
          return 'none';
        }
      }
  }

  themeChange(event?:Event):void{
    let el:HTMLElement = document.getElementById("theme-css");
    (el as HTMLLinkElement).href = 'assets/components/themes/'+this.selectedTheme+'/theme.css';

    setTimeout(()=>{
      window.dispatchEvent(new Event('resize'));
    },500)
  }

  languageChange():void{
      this.translate.use(this.selectedLanguage);
      this.updateItems();
  }

  logout(event):void{
    event.preventDefault();

    this.loginService.logout().subscribe(
      ()=>{
        this.ngOnInit();
        this.router.navigate(['']);
      },
      (error:Observable<string> | string)=>{

        if (typeof error === "string"){
          console.log(error);
        }else{
          error.subscribe((message:string)=>{
            console.log(message);
          },errorTranslate=>{
            console.log(errorTranslate);
          });
        }
      }
    );
  }

  updateOptions():void{

      this.config.CURRENT_OPTIONS.theme = this.selectedTheme;
      this.config.CURRENT_OPTIONS.language = this.selectedLanguage;

      this.loginService.updateOptions().subscribe(
        ()=>{
        },
        (error:Observable<string> | string)=>{

          if (typeof error === "string"){
            console.log(error);
          }else{
            error.subscribe((message:string)=>{
              console.log(message);
            },errorTranslate=>{
              console.log(errorTranslate);
            });
          }
        }
      );
  }

  public static getThemes():SelectItem[]{
      return [
        {label:'Omega',value:"omega"}
        ,{label:'Bootstrap',value:"bootstrap"}
        ,{label:'Cruze',value:"cruze"}
        ,{label:'Cupertino',value:"cupertino"}
        ,{label:'Darkness',value:"darkness"}
        ,{label:'Flick',value:"flick"}
        ,{label:'Home',value:"home"}
        ,{label:'Kasper',value:"kasper"}
        ,{label:'Lightness',value:"lightness"}
        ,{label:'Ludvig',value:"ludvig"}
        ,{label:'Pepper-grinder',value:"pepper-grinder"}
        ,{label:'Redmond',value:"redmond"}
        ,{label:'Rocket',value:"rocket"}
        ,{label:'South-street',value:"south-street"}
        ,{label:'Start',value:"start"}
        ,{label:'Trontastic',value:"trontastic"}
        ,{label:'Voclain',value:"voclain"}
      ];
  }

  public static getLanguages():SelectItem[]{
      return [
        {label: 'English', value: 'en'}
        ,{label: 'Русский', value: 'ru'}
        ];
  }
}
