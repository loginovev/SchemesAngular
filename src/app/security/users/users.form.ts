import {AfterViewInit, Component, OnDestroy} from "@angular/core";
import { Router} from "@angular/router";

import {Observable} from "rxjs/Observable";

import {FilterMetadata, LazyLoadEvent, Message} from 'primeng/primeng';

import {User} from "./user";
import {UsersService} from "./users.service";

@Component({
    selector:'users',
    templateUrl:'./users.form.html',
    providers:[UsersService]
})
export class UsersForm implements AfterViewInit, OnDestroy{

  msgs: Message[] = [];

  public users:Array<User> = [];

  selectedUser:User = null;

  totalRecords:number = 0;
  first:number = 0;
  rows:number;
  sortField:string;
  sortOrder:number;
  filters:{[p:string]:FilterMetadata} = null;

  constructor(private router:Router, private userService:UsersService){};

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

  updateUsers(){
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

    this.userService.getAll(this.first,this.rows,this.sortField, this.sortOrder,this.filters).subscribe(
      (response:{data:User[],totalRecords:number})=>{
        this.users = response.data;
        this.totalRecords = response.totalRecords;
      },(error:Observable<string> | string)=>{

        this.users = [];
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

  addUser(event:Event):void{
    this.router.navigate(['user','']);
  }

  editUser(event:Event):void{
    if (this.selectedUser){
      this.router.navigate(['user',this.selectedUser.username]);
    }
  }

  deleteUser(event:Event):void{
    if (this.selectedUser){
      this.userService.deleteUser(this.selectedUser.username).subscribe(
        ()=>{this.ngOnLazyLoad();},
        (error:Observable<string> | string)=>{

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
