import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import {AppConfig} from "../../config/app.config";
import {ServerMessagesService} from "../../server-messages.service";
import {mergeMap} from "rxjs/operators";

@Injectable()
export class SchemeService{

  constructor(
    private httpClient:HttpClient
    ,private config: AppConfig
    ,private serverMessages:ServerMessagesService
  ){}

  getScheme(id:string):Observable<any>{
    return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+'/api/scheme/get?id='+id)
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  newScheme(title:string,schemeAsJSON:{}):Observable<void>{

    let body = JSON.stringify({
      id:"",
      title:title,
      schemeAsJSON:JSON.stringify({})
    });

    return this.httpClient.put(this.config.BACKEND_API_ROOT_URL+'/api/scheme/new', body)
      .map((schemeId:string)=>{
        console.log("Scheme was saved successfully");
        return schemeId;
      })
      .pipe(
        mergeMap(id=>{

          let body = JSON.stringify({
            id:id,
            title:title,
            schemeAsJSON:JSON.stringify(schemeAsJSON)
          });

          return this.httpClient.post<void>(this.config.BACKEND_API_ROOT_URL+'/api/scheme/update', body)
            .catch((error: HttpErrorResponse | any) => {
              return this.serverMessages.getError(error);
            });
        })
      );
  }

  updateScheme(id:string,title:string,schemeAsJSON:{}):Observable<string>{

    let body = JSON.stringify({
      id:id,
      title:title,
      schemeAsJSON:JSON.stringify(schemeAsJSON)
    });

    return this.httpClient.post(this.config.BACKEND_API_ROOT_URL+'/api/scheme/update', body)
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

}
