import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import {Observable} from "rxjs/Observable";

import {AppConfig} from "../../config/app.config";
import {ServerMessagesService} from "../../server-messages.service";

@Injectable()
export class LoginService {

    constructor(
      private httpClient:HttpClient
      ,private config:AppConfig
      ,private serverMessages:ServerMessagesService
    ){}

    authenticate(username:string,password:string):Observable<void>{

      let postBody:any = JSON.stringify({username:username,password:password});

      return this.httpClient.post<{username:string,securityToken:string,authorities:string[]}>(this.config.BACKEND_API_ROOT_URL+this.config.BACKEND_API_AUTHENTICATE_PATH,postBody)
      .map((data:{username:string,securityToken:string,authorities:string[],options:any}, index) => {

        this.config.CURRENT_SECURITY_LOGIN = data.username;
        this.config.CURRENT_SECURITY_TOKEN = data.securityToken;

        this.config.CURRENT_USERNAME = data.username;
        this.config.CURRENT_AUTHORITIES = data.authorities;
        this.config.IS_AUTHENTICATED = true;
        this.config.CURRENT_OPTIONS = data.options;

        console.log("Log in with username '"+data.username+"'");
      })
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
    }

    public logout():Observable<void>{

      let CURRENT_USERNAME:string = this.config.CURRENT_USERNAME;
      let params:string = '?username='+this.config.CURRENT_SECURITY_LOGIN+'&securityToken='+this.config.CURRENT_SECURITY_TOKEN;

      this.config.CURRENT_SECURITY_LOGIN = '';
      this.config.CURRENT_SECURITY_TOKEN = '';
      this.config.CURRENT_USERNAME = '';
      this.config.CURRENT_AUTHORITIES = [];
      this.config.IS_AUTHENTICATED = false;

      return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+this.config.BACKEND_API_LOGOUT_PATH+params)
        .map((data, index)=>{
          console.log("Logout with username '"+CURRENT_USERNAME+"'");
        })
        .catch((error: HttpErrorResponse | any) => {
          return this.serverMessages.getError(error);
        });
    }

    public updateOptions():Observable<void>{
      return this.httpClient.patch(this.config.BACKEND_API_ROOT_URL+this.config.BACKEND_API+"/user/patchOptions",JSON.stringify(this.config.CURRENT_OPTIONS))
        .catch((error: HttpErrorResponse | any) => {
          return this.serverMessages.getError(error);
        });

    }
}
