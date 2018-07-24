import {Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";

import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/throw';

import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class ServerMessagesService{

  constructor(private translateService:TranslateService){}

  public getError(error:any):Observable<any>{

    if (error instanceof HttpErrorResponse) {

      let serverMessage:string = "";
      let needTranslation:boolean = false;
      if (typeof error.error !== "string" ){
        serverMessage = "SERVER-UNAVAILABLE";
        needTranslation = true;
      }else{
        let serverError:{description:string,status:number,message:string} = JSON.parse(error.error);
        if (serverError.description){
          serverMessage = serverError.description;
          needTranslation = true;
        }else{
          serverMessage = serverError.message;
        }
        if (serverMessage==='Access Denied'){
          serverMessage = "ACCESS-DENIED";
          needTranslation = true;
        }
      }

      if (needTranslation){
        return Observable.throw(this.translateService.get(serverMessage));
      }else{
        return Observable.throw(serverMessage);
      }

    }else{
      return Observable.throw(this.translateService.get("UNKNOWN-ERROR"));
    }
  }
}
