import {AfterViewInit, Component, OnDestroy} from "@angular/core";

import {Observable} from "rxjs/Observable";

import {FilterMetadata, LazyLoadEvent, Message} from 'primeng/primeng';

import {SessionsService} from "./sessions.service";
import {Session} from "./session";

@Component({
  selector:'monitor',
  templateUrl:'sessions.form.html',
  providers:[SessionsService]
})
export class SessionsForm implements AfterViewInit, OnDestroy{

  sessions:Array<Session> = [];
  totalRecords:number = 0;
  selectedSession:Session = null;

  first:number = 0;
  rows:number;
  sortField:string;
  sortOrder:number;
  filters:{[p:string]:FilterMetadata} = null;

  msgs: Message[] = [];

  constructor(private sessionsService:SessionsService) {}

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

  updateSessions(){
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
      this.filters = event.filters;
    }

    this.sessionsService.getAllSessions(this.first,this.rows,this.sortField, this.sortOrder,this.filters).subscribe(
      (response:{data:Session[],totalRecords:number})=>{
        this.sessions = response.data;
        this.totalRecords = response.totalRecords;
      },(error:Observable<string> | string)=>{

        this.sessions = [];
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

  deleteSession(event:Event):void{
    if (this.selectedSession){
      this.sessionsService.deleteSession(this.selectedSession.username).subscribe(
        (data)=>{
          this.ngOnLazyLoad();
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
  }
}
