import {Component, Input, ViewChild, OnInit} from "@angular/core";
import {Scheme} from "./scheme";
import {SchemeMenu} from "./scheme-menu";
import {Figure} from "./figures/figure";
import {enumFigure} from "./enum/enumFigure";
import "./html2canvas.js";
import {Utils} from "./utils";
import {SchemeAsJson} from "./interfaces/scheme-as-json";

@Component({
    selector:'ang-scheme',
    template:`    
                <div id="enclosedAlgorithmReturn" class="select-none" style="cursor: pointer" hidden></div>
                <div id="scheme" #scheme class="scheme-box grid-gradient"></div>`,
    styleUrls:['scheme.css']
})
export class AngularScheme implements OnInit{

    @Input("height") private _height:number = 0;
    @Input("autoHeight") private autoHeight:boolean = false;
    @Input("bottomHeight") private bottomHeight:number = 0;
    @Input("readOnly") private _readOnly:boolean = false;
    @Input("container") private container:HTMLElement = null;

    @ViewChild("scheme") private _schemeAngScheme: HTMLDivElement;

    private scheme:Scheme = null;

    private _schemeHTML:HTMLDivElement = null;
    private _enclosedAlgorithmReturn:HTMLElement = null;
    private _classAttribute:string = '';

    get height(): number {
        return this._height;
    }

    get readOnly(): boolean {
      return this._readOnly;
    }

    get schemeHTML(): HTMLDivElement {
        return this._schemeHTML;
    }

    get enclosedAlgorithmReturn(): HTMLElement {
        return this._enclosedAlgorithmReturn;
    }

    get classAttribute(): string {
        return this._classAttribute;
    }

    set readOnly(value: boolean) {
      this._readOnly = value;
    }

    ngOnInit(){

        this._schemeHTML = (this._schemeAngScheme as any).nativeElement;
        this.schemeHTML.tabIndex = 1;

        for (let i:number=0; i<this.schemeHTML.attributes.length; i++){
            if (this.schemeHTML.attributes.item(i).name.substr(0,10)==='_ngcontent'){
                this._classAttribute = this.schemeHTML.attributes.item(i).name;
                break;
            }
        }

        this._enclosedAlgorithmReturn = document.getElementById("enclosedAlgorithmReturn");

        this.scheme = new Scheme(
            this.schemeHTML
            ,this.enclosedAlgorithmReturn
            ,this.classAttribute
        );

        this.scheme.readOnly = this.readOnly;

        let currentThis:Scheme = this.scheme;
        let container:HTMLElement = this.container;

        if (!this.readOnly){

          this.schemeHTML.addEventListener('contextmenu',function(event){
              event.preventDefault();

              if (currentThis.schemeMenu!==null){
                  currentThis.schemeMenu.hide();
                  currentThis.schemeMenu = null;
              }else {
                  if (currentThis.propertiesForm===null){

                      let x:number = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                      let y:number = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                      if (container!==null){
                          let containerBox = container.getBoundingClientRect();
                          x = x - containerBox.left + currentThis.leftScheme;
                          y = y - containerBox.top + currentThis.topScheme;
                      }
                      currentThis.schemeMenu = new SchemeMenu(currentThis,x,y);
                      currentThis.schemeMenu.show();
                  }
              }

          });

          this.schemeHTML.addEventListener('click',function(event){

              event.preventDefault();

              if (currentThis.schemeMenu!==null){
                  currentThis.schemeMenu.hide();
                  currentThis.schemeMenu = null;
              }

              if (currentThis.lastCurrentElement!==currentThis.currentElement && currentThis.currentElement!==null){
                  (currentThis.currentElement as Figure).currentDraw();
                  currentThis.currentElement = null;
              }

              currentThis.lastCurrentElement = null;

              if (currentThis.beginAddingElementClassName!==null && currentThis.beginAddingElement){
                  Utils.addingElementClassName(currentThis.beginAddingElementClassName,currentThis);
                  currentThis.beginAddingElementClassName = null;
              }
              currentThis.beginAddingElement = false;
          });

          this.schemeHTML.addEventListener('keydown',function (event) {

            if (event.key === 'Delete' && currentThis.currentElement!==null){

                if (currentThis.currentElement.className!==undefined && currentThis.currentElement.className!==enumFigure.Arrow){
                  event.preventDefault();
                  Utils.deleteElement(currentThis, currentThis.currentElement);
                }
            }

            if (
                event.key === 'ArrowLeft' &&
                currentThis.currentElement!==null &&
                currentThis.currentElement.className!==undefined &&
                currentThis.currentElement.className!==enumFigure.Arrow
            ){
              event.preventDefault();
              Utils.moveArrowElement(currentThis,-currentThis.greedStep,0);
            }
            if (
                event.key === 'ArrowRight' &&
                currentThis.currentElement!==null &&
                currentThis.currentElement.className!==undefined &&
                currentThis.currentElement.className!==enumFigure.Arrow
            ){
              event.preventDefault();
              Utils.moveArrowElement(currentThis,currentThis.greedStep,0);
            }
            if (
                event.key === 'ArrowUp' &&
                currentThis.currentElement!==null &&
                currentThis.currentElement.className!==undefined &&
                currentThis.currentElement.className!==enumFigure.Arrow
            ){
              event.preventDefault();
              Utils.moveArrowElement(currentThis,0,-currentThis.greedStep);
            }
            if (
                event.key === 'ArrowDown' &&
                currentThis.currentElement!==null &&
                currentThis.currentElement.className!==undefined &&
                currentThis.currentElement.className!==enumFigure.Arrow
            ){
              event.preventDefault();
              Utils.moveArrowElement(currentThis,0,currentThis.greedStep);
            }
        });

        }else{
          this.schemeHTML.addEventListener('contextmenu',function(event){
            event.preventDefault();
          });
        }

        let height:number = this.height;
        let autoHeight:boolean = this.autoHeight;
        let bottomHeight:number = this.bottomHeight;

        window.addEventListener('resize',function(event){

            let schemeBox =  currentThis.schemeHTML.getBoundingClientRect();

            currentThis.widthScheme = schemeBox.width;
            currentThis.heightScheme = schemeBox.height;

            if (container===null){
                currentThis.leftScheme = schemeBox.left;
                currentThis.topScheme = schemeBox.top;

                if (autoHeight){
                    currentThis.heightScheme = window.innerHeight - bottomHeight - currentThis.topScheme;
                }else{
                    currentThis.heightScheme = schemeBox.height;
                }
            }else{
                let containerBox = container.getBoundingClientRect();

                currentThis.leftContainer = containerBox.left;
                currentThis.topContainer = containerBox.top;

                currentThis.leftScheme = schemeBox.left - containerBox.left;
                currentThis.topScheme = schemeBox.top - containerBox.top;

                if (autoHeight){
                    currentThis.heightScheme = window.innerHeight - bottomHeight - currentThis.topScheme - containerBox.top;
                }else{
                    currentThis.heightScheme = height;
                }
            }

            currentThis.schemeHTML.style.height = currentThis.heightScheme+'px';
        });
        window.dispatchEvent(new Event('resize'));
    }

    newScheme(schemeAsJSON?:SchemeAsJson):void{

        if (schemeAsJSON!==undefined){
            this.restoreFromJson(schemeAsJSON);
        }else{
            this.restoreFromJson(Utils.getSchemeDefaultProperties(this.scheme));
        }
    }

    getAsJson():SchemeAsJson{
        return this.scheme.getAsJson();
    }

    restoreFromJson(res:SchemeAsJson):void{
        window.dispatchEvent(new Event('resize'));
        this.scheme.restoreFromJson(res);
        window.dispatchEvent(new Event('resize'));
    }

    getSchemeId():string{
        return this.scheme.id;
    }

    getSchemeTitle():string{
        return this.scheme.title;
    }

    getSchemeTitleModified(modifiedSign?:string):string{
        let answer:string = '';
        if (this.scheme){
            answer = this.scheme.title;

            if (this.getModified()){
                if (modifiedSign==undefined){
                    answer = answer+"*";
                }else{
                    answer = answer+modifiedSign;
                }
            }
        }
        return answer;
    }

    setSchemeTitle(title:string):void{
        this.scheme.title = title;
        window.dispatchEvent(new Event('resize'));
    }

    setSchemeId(id:string){
        this.scheme.id = id;
    }

    getModified():boolean{
        return this.scheme.modified;
    }

    setModified(modified:boolean):void{
        this.scheme.modified = modified;
    }

    clearScheme():void{
      if (this.scheme){
        this.scheme.clearScheme();
        window.dispatchEvent(new Event('resize'));
      }
    }

}
