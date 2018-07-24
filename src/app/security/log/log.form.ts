import {Component, AfterViewInit, OnInit, OnDestroy} from "@angular/core";

import {Observable} from "rxjs/Observable";

import {LazyLoadEvent, Message, SelectItem, MenuItem} from "primeng/primeng";

import {LogService} from "./log.service";
import {Log} from "./log";
import {FilterInterface} from "../../utils/filter.interface";

@Component({
  selector:'log',
  templateUrl:'log.form.html',
  providers:[LogService]
})
export class LogForm implements OnInit, AfterViewInit, OnDestroy{

  logs:Log[] = [];
  totalRecords:number = 0;

  messageType:SelectItem[] = [];
  username:SelectItem[] = [];
  event:SelectItem[] = [];
  structure:SelectItem[] = [];

  first:number = 0;
  rows:number;
  sortField:string;
  sortOrder:number;
  filters:FilterInterface[] = null;

  msgs: Message[] = [];

  constructor(private logService:LogService){}

  ngOnInit(){
    this.columnOptions();
  }

  windowResize = function(event){

    let elements = document.getElementsByTagName("p-paginator");

    let paginatorHeight:number = 0;
    if (elements.length>0 && elements[0].firstChild){
      paginatorHeight = elements[0].firstChild.parentElement.getBoundingClientRect().height;
    }

    elements = document.getElementsByClassName("ui-datatable-scrollable-body");
    if (elements.length>0 && elements[0].firstChild){

      let bottomPadding:number = 30;
      let height = window.innerHeight-elements[0].firstChild.parentElement.getBoundingClientRect().top-paginatorHeight-bottomPadding+"px";
      elements[0].firstChild.parentElement.style.maxHeight = height;
      elements[0].firstChild.parentElement.style.minHeight = height;
    }
  }

  ngAfterViewInit(){

    let elements = document.getElementsByClassName("ui-datatable-scrollable-header");
    if (elements.length>0 && elements[0].firstChild){
      elements[0].firstChild.parentElement.style.overflow = "visible";
    }

    elements = document.getElementsByClassName("ui-resizable-column");
    for(let i=0;i<elements.length;i++){
      if (elements[i].firstChild){
        elements[i].firstChild.parentElement.style.overflow = "visible";
      }
    }

    window.addEventListener('resize',this.windowResize);
    window.dispatchEvent(new Event('resize'));
  }

  ngOnDestroy(){
    window.removeEventListener('resize',this.windowResize);
  }

  columnOptions(){
    this.logService.getColumnOptions().subscribe(
      (response:{messageType:string[],username:string[],event:string[],structure:string[]})=>{

        this.messageType = [];
        this.messageType.push({label:"",value:""});
        response.messageType.forEach((value => {
          this.messageType.push({label:value,value:value});
        }));

        this.username = [];
        this.username.push({label:"",value:""});
        response.username.forEach((value => {
          this.username.push({label:value,value:value});
        }));

        this.event = [];
        this.event.push({label:"",value:""});
        response.event.forEach((value => {
          this.event.push({label:value,value:value});
        }));

        this.structure = [];
        this.structure.push({label:"",value:""});
        response.structure.forEach((value => {
          this.structure.push({label:value,value:value});
        }));

      },(error:Observable<string> | string)=>{

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

  dateFilterSelect(value:Date){
    let month = "0"+(value.getMonth()+1);
    month = month.slice(month.length-2,month.length);
    let day = "0"+value.getDate();
    day = day.slice(day.length-2,day.length);
    this.setFilter("date","startWith",""+value.getFullYear()+"-"+month+"-"+day);
  }

  dateClearClick(){
    this.setFilter("date","","");
  }

  messageTypeOnChange(event:{value:string}){
    this.setFilter("messageType","equals",event.value);
  }

  usernameOnChange(event:{value:string}){
    this.setFilter("username","equals",event.value);
  }

  eventOnChange(event:{value:string}){
    this.setFilter("event","equals",event.value);
  }

  structureOnChange(event:{value:string}){
    this.setFilter("structure","equals",event.value);
  }

  setFilter(fieldName:string,matchMode:string,value:string){

    if(this.filters){

      let foundFilter = this.filters.filter((item, index) => {
        return item.fieldName===fieldName;
      });
      if (foundFilter.length===0){
        this.filters.push({fieldName:fieldName,matchMode:matchMode,value:value});
      }else{
        if (value){
          foundFilter.forEach((item)=>{
            item.matchMode = matchMode;
            item.value = value;
          });
        }else{
          this.filters.filter((item, index) => {
            return item.fieldName===fieldName;
          }).forEach((item,index)=>{
            this.filters.splice(index,1);
          });
        }

      }
    }else{
      this.filters = [{fieldName:fieldName,matchMode:matchMode,value:value}];
    }
    this.first = 0;
    this.ngOnLazyLoad();
  }

  ngOnLazyLoad(event?: LazyLoadEvent) {

    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: array of FilterInterface

    if (event){
      this.first = event.first;
      this.rows = event.rows;
      this.sortField = event.sortField;
      this.sortOrder = event.sortOrder;
    }

    this.logService.getAllLog(this.first,this.rows,this.sortField, this.sortOrder,this.filters).subscribe(
      (response:{data:Log[],totalRecords:number})=>{
        this.logs = response.data;
        this.totalRecords = response.totalRecords;
      },(error:Observable<string> | string)=>{

        this.logs = [];
        this.totalRecords = 0;

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
