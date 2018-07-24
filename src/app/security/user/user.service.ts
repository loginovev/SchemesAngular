import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import {AppConfig} from "../../config/app.config";
import {User} from "../users/user";
import {ServerMessagesService} from "../../server-messages.service";


@Injectable()
export class UserService{

  constructor(
    private httpClient:HttpClient
    ,private config:AppConfig
    ,private serverMessages:ServerMessagesService
  ){}

  newUser(user:User):Observable<void>{

    let body = JSON.stringify({
      username:user.username
      ,firstName:user.firstName
      ,surname:user.surname
      ,password:user.password
      ,authorities:user.authorities
      ,options:user.options
      ,banned:user.banned
    });

    return this.httpClient.put(this.config.BACKEND_API_ROOT_URL+'/api/user/new', body)
      .map((data)=>{
        console.log("User '"+user.username+"' was saved successfully");
      })
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  getUser(username:string):Observable<User>{
    return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+'/api/user/user?username='+username)
      .map((data:{username:string,firstName:string,surname:string,authorities:string[],options:Object,banned:boolean})=>{
        return new User(data.username,data.firstName,data.surname,"",data.authorities,data.options,data.banned);
      })
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  editUser(user:User):Observable<void>{

    let body = JSON.stringify({
      username:user.username
      ,firstName:user.firstName
      ,surname:user.surname
      ,password:user.password
      ,authorities:user.authorities
      ,options:user.options
      ,banned:user.banned
    });

    return this.httpClient.post(this.config.BACKEND_API_ROOT_URL+'/api/user/update', body)
      .map((data)=>{
        console.log("User '"+user.username+"' was saved successfully");
      })
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  getRoles():Observable<string[]>{
      return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+"/api/user/roles")
        .catch((error: HttpErrorResponse | any) => {
          return this.serverMessages.getError(error);
        });
  }
}
