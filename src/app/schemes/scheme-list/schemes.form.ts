import {AfterViewInit, Component, OnDestroy, ViewChild} from "@angular/core";
import {Router} from "@angular/router";

import {FilterMetadata, LazyLoadEvent, Message} from 'primeng/primeng';

import {Observable} from "rxjs/Observable";

import {SchemesService} from "./schemes.service";
import {SchemeRow} from "./scheme.row";
import {AngularScheme} from "../ang-scheme/ang-scheme";

@Component({
  selector:'schemes',
  templateUrl:'./schemes.form.html',
  providers:[SchemesService]
})
export class SchemesForm implements AfterViewInit, OnDestroy{

  @ViewChild(AngularScheme) schemeComponent: AngularScheme;

  msgs: Message[] = [];

  schemeRows:SchemeRow[] = [];
  selectedRow:SchemeRow = null;

  totalRecords:number = 0;
  first:number = 0;
  rows:number;
  sortField:string;
  sortOrder:number;
  filters:{[p:string]:FilterMetadata} = null;

  constructor(private router:Router, private schemeService:SchemesService){};

  windowResize = function(event){

    let elements = document.getElementsByTagName("p-paginator");

    let paginatorHeight:number = 0;
    if (elements.length>0 && elements[0].firstChild){
      paginatorHeight = elements[0].firstChild.parentElement.getBoundingClientRect().height;
    }

    elements = document.getElementsByClassName("ui-datatable-scrollable-body");
    if (elements.length>0 && elements[0].firstChild){

      let bottomPadding:number = 40;
      let height = window.innerHeight-elements[0].firstChild.parentElement.getBoundingClientRect().top-paginatorHeight-bottomPadding+"px";
      elements[0].firstChild.parentElement.style.maxHeight = height;
      elements[0].firstChild.parentElement.style.minHeight = height;
    }
  };

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

  ngOnRowSelect(event:Event){
    if (this.selectedRow){
      this.schemeService.getSchemeById(this.selectedRow.id).subscribe(
        (response:any)=>{

          this.schemeComponent.clearScheme();
          this.schemeComponent.restoreFromJson(response);


        },
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

  ngOnLazyLoad(event?: LazyLoadEvent) {

    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: array of FilterInterface

    if (this.schemeComponent){
      this.schemeComponent.clearScheme();
    }

    if (event){
      this.first = event.first;
      this.rows = event.rows;
      this.sortField = event.sortField;
      this.sortOrder = event.sortOrder;
      this.filters = event.filters;
    }

    this.schemeService.getAll(this.first,this.rows,this.sortField, this.sortOrder,this.filters).subscribe(
      (response:{data:SchemeRow[],totalRecords:number})=>{
        this.schemeRows = response.data;
        this.totalRecords = response.totalRecords;
      },(error:Observable<string> | string)=>{

        this.schemeRows = [];
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

  addScheme(event:Event):void{
    this.router.navigate(['scheme','']);
  }

  editScheme(event:Event):void{
    if (this.selectedRow){
      this.router.navigate(['scheme',this.selectedRow.id]);
    }
  }

  deleteScheme(event:Event):void{
    if (this.selectedRow){
      this.schemeService.deleteScheme(this.selectedRow.id).subscribe(
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
