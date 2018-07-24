import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import {FilterMetadata} from "primeng/primeng";

import {AppConfig} from "../../config/app.config";
import {User} from "./user";
import {ServerMessagesService} from "../../server-messages.service";
import {FilterInterface} from "../../utils/filter.interface";

@Injectable()
export class UsersService{

    constructor(
      private httpClient:HttpClient
      ,private config: AppConfig
      ,private serverMessages:ServerMessagesService
    ){}

    getAll(first:number, rows:number, sortField:string, sortOrder:number, filters: {[p:string]:FilterMetadata}):Observable<{data:User[],totalRecords:number}> {

      let filtersString = encodeURI(JSON.stringify(this.getConvertedFilters(filters,["username"])));

      if(sortField===undefined || sortField===null){
        sortField = "";
      }

      return this.httpClient.get(this.config.BACKEND_API_ROOT_URL+"/api/user/list?first="+first+"&rows="+rows+"&sortField="+sortField+"&sortOrder="+sortOrder+"&filters="+filtersString)
        .map((response:{data:User[],totalRecords:number})=>{
          let users:User[] = [];
          response.data.forEach((item)=>{
            users.push(new User(item.username,item.firstName,item.surname));
          });
          return {data:users,totalRecords:response.totalRecords};
        })
        .catch((error: HttpErrorResponse | any) => {
          return this.serverMessages.getError(error);
        });
    }



    deleteUser(username:string):Observable<void>{
      return this.httpClient.delete(this.config.BACKEND_API_ROOT_URL+'/api/user/delete?username='+username)
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
