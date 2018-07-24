import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {Observable} from "rxjs/Observable";

import {Message} from 'primeng/primeng';

import {SchemeService} from "./scheme.service";
import {AngularScheme} from "../ang-scheme/ang-scheme";
import {SchemeAsJson} from "../ang-scheme/interfaces/scheme-as-json";


@Component({
  selector:'scheme',
  templateUrl:'./scheme.form.html',
  providers:[SchemeService]
})
export class SchemeForm implements OnInit, AfterViewInit{

  msgs: Message[] = [];

  @ViewChild(AngularScheme) schemeComponent: AngularScheme;
  private _schemeContainer:HTMLElement = null;

  id:string = null;
  title:string;

  get schemeContainer(): HTMLElement {
    return this._schemeContainer;
  }

  constructor(
    private router:Router
    ,private activateRoute:ActivatedRoute
    ,private schemeService:SchemeService
  ){
    this.id = activateRoute.snapshot.params['id'];
  }

  ngOnInit():void{
    this._schemeContainer = document.getElementById("schemeContainer");

    if (this.id){
      this.schemeService.getScheme(this.id).subscribe(
        (data:any)=>{
          this.schemeComponent.clearScheme();

          let schemeAsJSON:any = JSON.parse(data.schemeAsJSON);
          this.schemeComponent.newScheme(schemeAsJSON);
          this.title = this.schemeComponent.getSchemeTitle();
        },
        (error:Observable<string> | string)=>{

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

  ngAfterViewInit(){
    window.dispatchEvent(new Event('resize'));
  }

  OK(event){

    if (this.id){

      this.schemeComponent.setSchemeTitle(this.title);
      let schemeAsJson:SchemeAsJson = this.schemeComponent.getAsJson();

      this.schemeService.updateScheme(this.id,schemeAsJson.title,schemeAsJson).subscribe(
        ()=>{
          this.router.navigate(['schemes']);
        },
        (error:Observable<string> | string)=>{

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

    }else{//new scheme

      this.schemeComponent.setSchemeTitle(this.title);
      let schemeAsJson:SchemeAsJson = this.schemeComponent.getAsJson();

      this.schemeService.newScheme(schemeAsJson.title,schemeAsJson).subscribe(
        ()=>{
          this.router.navigate(['schemes']);
        },
        (error:Observable<string> | string)=>{

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

  Cancel(event){
    this.router.navigate(['schemes']);
  }

}
