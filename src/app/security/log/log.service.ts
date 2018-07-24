import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import {FilterMetadata} from "primeng/primeng";

import {AppConfig} from "../../config/app.config";
import {ServerMessagesService} from "../../server-messages.service";
import {Log} from "./log";
import {FilterInterface} from "../../utils/filter.interface";

@Injectable()
export class LogService{

  constructor(
    private httpClient:HttpClient
    ,private config:AppConfig
    ,private serverMessages:ServerMessagesService
  ) {}

  getColumnOptions():Observable<{messageType:string[],username:string[],event:string[],structure:string[]}>{
    return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+"/api/log/columnOptions")
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  getAllLog(first:number, rows:number, sortField:string, sortOrder:number, filters: FilterInterface[]):Observable<{data:Log[],totalRecords:number}>{

    let filtersString = encodeURI(JSON.stringify(filters));

    if(sortField===undefined || sortField===null){
      sortField = "";
    }

    return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+"/api/log/records?first="+first+"&rows="+rows+"&sortField="+sortField+"&sortOrder="+sortOrder+"&filters="+filtersString)
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }
}
