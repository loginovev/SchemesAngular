import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import {FilterMetadata} from "primeng/primeng";

import {AppConfig} from "../../config/app.config";
import {Session} from "./session";
import {ServerMessagesService} from "../../server-messages.service";
import {FilterInterface} from "../../utils/filter.interface";

@Injectable()
export class SessionsService{

  constructor(
    private httpClient:HttpClient
    ,private config:AppConfig
    ,private serverMessages:ServerMessagesService
  ) {}

  getAllSessions(first:number, rows:number, sortField:string, sortOrder:number, filters: {[p:string]:FilterMetadata}):Observable<{data:Session[],totalRecords:number}>{

    let filtersString:string = encodeURI(JSON.stringify(this.getConvertedFilters(filters,["username"])));

    if(sortField===undefined || sortField===null){
      sortField = "";
    }

    return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+"/api/session/list?first="+first+"&rows="+rows+"&sortField="+sortField+"&sortOrder="+sortOrder+"&filters="+filtersString)
      .map((response:{data:Session[],totalRecords:number}) => {
        let sessions:Session[] = [];

        response.data.forEach(item => {
          sessions.push(new Session(item.username,item.firstName,item.surname,new Date(item.sessionBegin), new Date(item.lastActivity)));
        });

        return {data:sessions,totalRecords:response.totalRecords};
      })
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  deleteSession(username:string):Observable<void>{
    return this.httpClient.delete(this.config.BACKEND_API_ROOT_URL+'/api/session/delete?username='+username)
      .map((data, index) => {
        console.log("Session of '"+username+"' was deleted");
      })
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  getConvertedFilters(filters:{[p:string]:FilterMetadata},fields:string[]):FilterInterface[]{
    let response:FilterInterface[] = [];

    fields.forEach((field)=>{
      if (filters.hasOwnProperty(field)){
        response.push({fieldName:field,matchMode:filters[field].matchMode,value:filters[field].value});
      }
    });

    if (response.length===0){
      response = null;
    }
    return response;
  }

}
