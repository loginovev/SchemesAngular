import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import {FilterMetadata} from "primeng/primeng";

import {AppConfig} from "../../config/app.config";
import {ServerMessagesService} from "../../server-messages.service";
import {FilterInterface} from "../../utils/filter.interface";
import {SchemeRow} from "./scheme.row";

@Injectable()
export class SchemesService{

  constructor(
    private httpClient:HttpClient
    ,private config: AppConfig
    ,private serverMessages:ServerMessagesService
  ){}

  getAll(first:number, rows:number, sortField:string, sortOrder:number, filters: {[p:string]:FilterMetadata}):Observable<{data:SchemeRow[],totalRecords:number}> {

    let filtersString = encodeURI(JSON.stringify(this.getConvertedFilters(filters,["title"])));

    if(sortField===undefined || sortField===null){
      sortField = "";
    }

    return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+"/api/scheme/list?first="+first+"&rows="+rows+"&sortField="+sortField+"&sortOrder="+sortOrder+"&filters="+filtersString)
      .map((response:{data:SchemeRow[],totalRecords:number})=>{
        let schemeRows:SchemeRow[] = [];
        response.data.forEach((item)=>{
          schemeRows.push(new SchemeRow(item.id,item.title));
        });
        return {data:schemeRows,totalRecords:response.totalRecords};
      })
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  getSchemeById(id:string):Observable<any>{

    return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+"/api/scheme/get?id="+id)
      .map((response:any)=>{
        return JSON.parse(response.schemeAsJSON);
      })
      .catch((error: HttpErrorResponse | any) => {
        return this.serverMessages.getError(error);
      });
  }

  deleteScheme(id:string):Observable<void>{
    return this.httpClient.delete(this.config.BACKEND_API_ROOT_URL+'/api/scheme/delete?id='+id)
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
