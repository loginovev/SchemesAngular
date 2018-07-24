import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {Observable} from "rxjs/Observable";

import {DataTable, SelectItem, Message} from 'primeng/primeng';

import {User} from "../users/user";
import {UserService} from "./user.service";
import {MainMenu} from "../../main-menu/main.menu";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector:'user',
  templateUrl:'./user.form.html',
  providers:[UserService]
})
export class UserForm implements OnInit{

  public username:string = '';
  public firstName:string = '';
  public surname:string = '';
  public password:string = '';
  public confirmPassword:string = '';
  public banned:boolean = false;

  public theme:string;
  public themes:SelectItem[] = [];
  public language;
  public languages:SelectItem[] = [];

  roles: SelectItem[];
  selectedRoles:string[] = [];

  private newUser:boolean = false;

  msgs: Message[] = [];

  constructor(
    private router:Router
    ,private activateRoute:ActivatedRoute
    ,private userService:UserService
    ,private translate:TranslateService
  ){
    this.username = activateRoute.snapshot.params['username'];
    this.newUser = this.username==='';
  }

  ngOnInit():void{

    this.roles = [];
    this.userService.getRoles().subscribe(
      (roles:string[])=>{
        roles.forEach((item)=>{
          this.roles.push({label:item,value:item});
        });

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

    this.themes = MainMenu.getThemes();
    this.languages = MainMenu.getLanguages();

    if (!this.newUser){
      this.userService.getUser(this.username).subscribe(
          (user:User)=>{
            this.username = user.username;
            this.firstName = user.firstName;
            this.surname = user.surname;

            user.authorities.forEach((item)=>{
              this.selectedRoles.push(item);
            });
            this.banned = user.banned;
            this.setOptions(user.options);
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

  OK(event:Event):void{

    if (this.password!==this.confirmPassword){
      this.translate.get("USER-FORM.PASSWORD-NOT-EQUALS").subscribe(
        (error)=>{
          this.msgs = [];
          this.msgs.push({severity:'error', summary:'Error Message', detail:error});
      }
      );
      return;
    }

    if (this.newUser){

      this.userService.newUser(new User(this.username,this.firstName,this.surname,this.password, this.selectedRoles,this.getOptions(),this.banned)).subscribe(
          ()=>{
            this.router.navigate(['users']);
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
    }else{

      this.userService.editUser(new User(this.username,this.firstName,this.surname,this.password,this.selectedRoles,this.getOptions(),this.banned)).subscribe(
          ()=>{
            this.router.navigate(['users']);
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

  getOptions():Object{
      return {
        theme:this.theme,
        language:this.language
      };
  }

  setOptions(options:any):void{

      if (options.hasOwnProperty("theme")){
        this.theme = options.theme;
      }

      if (options.hasOwnProperty("language")){
        this.language = options.language;
      }
  }

  Cancel(event:Event):void{
    this.router.navigate(['users']);
  }
}
