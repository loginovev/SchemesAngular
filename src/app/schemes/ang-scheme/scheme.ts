import {PropertiesInterface} from "./interfaces/properties-interface";
import {SchemeInterface} from "./scheme-interface";
import {EnclosedSchemeInterface} from "./interfaces/enclosed-scheme-interface";

import {AllElementListTypes} from "./types/all-elementList-types";
import {AllFiguresTypes} from "./types/all-figures-types";

import {SchemeMenu} from "./scheme-menu";

import {enumFigure} from "./enum/enumFigure";

import {Figure} from "./figures/figure";

import {Utils} from "./utils";
import {ArrowInterface} from "./arrows/arrow-interface";
import {EnclosedAlgorithmElementInterface} from "./figures/enclosed-algorithm-element-interface";
import {Factory} from "./factory";
import {SchemeAsJson} from "./interfaces/scheme-as-json";

export class Scheme implements SchemeInterface{

    private _id:string = '';
    private _title:string = 'The scheme is empty';
    private _schemeHTML:HTMLDivElement = null;

    private _elementList:AllElementListTypes[] =[];
    private _indent:number = 2;
    private _greedStep:number = 5;

    private _backgroundColor:string = "#ffffff";
    private _greedColor:string = "#bbbbbb";

    private _leftScheme:number = 0;
    private _topScheme:number = 0;
    private _widthScheme:number = 0;
    private _heightScheme:number = 0;

    private _readOnly:boolean = false;

    leftContainer:number = 0;
    topContainer:number = 0;

    beginAddingElementClassName:enumFigure;

    currentElement:AllFiguresTypes | ArrowInterface = null;
    lastCurrentElement:AllFiguresTypes | ArrowInterface = null;

    enclosedAlgorithmReturn:HTMLElement = null;

    //Context menu listeners
    schemeMenu:SchemeMenu = null;
    currentThis:Scheme = this;
    originalSchemeCursor:string = '';
    beginAddingElement:boolean = false;

    private hostScheme:EnclosedSchemeInterface = null;
    private childNodes:Array<any> = [];

    propertiesForm:HTMLDivElement = null;
    moduleForm:HTMLDivElement = null;

    private _classAttribute:string = "";

    modified:boolean = false;

    private _version:string = '1.0.0.1';

    //>Getter' section
    get id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get schemeHTML(): HTMLDivElement {
        return this._schemeHTML;
    }

    get elementList(): Array<any> {
        return this._elementList;
    }

    get indent(): number {
        return this._indent;
    }

    get greedStep(): number {
        return this._greedStep;
    }

    get leftScheme(): number {
        return this._leftScheme;
    }

    get topScheme(): number {
        return this._topScheme;
    }

    get widthScheme(): number {
        return this._widthScheme;
    }

    get heightScheme(): number {
        return this._heightScheme;
    }

    get readOnly(): boolean {
      return this._readOnly;
    }

    get classAttribute(): string {
        return this._classAttribute;
    }

    get backgroundColor(): string {
        return this._backgroundColor;
    }

    get greedColor(): string {
        return this._greedColor;
    }

    get version(): string {
        return this._version;
    }
    //<Getter' section

    //>Setters' section
    set title(value: string) {
      this._title = value;
    }

    set id(value: string) {
      this._id = value;
    }

    set leftScheme(value: number) {
        this._leftScheme = value;
    }

    set topScheme(value: number) {
        this._topScheme = value;
    }

    set widthScheme(value: number) {
        this._widthScheme = value;
    }

    set heightScheme(value: number) {
        this._heightScheme = value;
    }

    set readOnly(value: boolean) {
      this._readOnly = value;
    }
    //<Setters' section

    constructor(
        schemeHTML:HTMLDivElement
        ,enclosedAlgorithmReturn:HTMLElement
        ,classAttribute:string
    ) {

        this._id = Utils.getGUID().create().value;
        this._schemeHTML = schemeHTML;
        this.enclosedAlgorithmReturn = enclosedAlgorithmReturn;

        this._classAttribute = classAttribute;

        this.setProperties(this.getProperties());
        this.modified = false;
    }

    initEnclosed(classAttribute:string):void{
        this._schemeHTML = document.createElement("div");
        this._classAttribute = classAttribute;
    }

    getProperties():Array<PropertiesInterface>{

        let propertiesArray:Array<PropertiesInterface> = [];
        propertiesArray.push({name:'_greedColor',reference:'Greed color', value:this._greedColor,type:"color"});
        propertiesArray.push({name:'_greedStep',reference:'Greed step', value:this._greedStep, type:"number"});
        propertiesArray.push({name:'_backgroundColor',reference:'Background color', value:this._backgroundColor, type:"color"});

        return propertiesArray;
    }

    setProperties(propertiesArray:Array<PropertiesInterface>):void{

        propertiesArray.forEach((item:PropertiesInterface)=>{

            this[item.name]=item.value;

            switch (item.name){
                case '_greedStep':{
                    this.schemeHTML.style.backgroundSize = ""+item.value+"px "+item.value+"px";
                    break;
                }
                case '_backgroundColor':{
                    this.schemeHTML.style.backgroundColor = item.value;
                    break;
                }
                case '_greedColor':{
                    this.schemeHTML.style.background = "linear-gradient("+item.value+", transparent 1px), linear-gradient(90deg,"+item.value+", transparent 1px)";
                    break;
                }
            }

        });
        this.modified = true;
    }

    enterEnclosedAlgorithm(schemeEnclosed:EnclosedSchemeInterface,childNodes:Array<any>,id:string):void{

        this.hostScheme = {
            idElement:          id,
            elementList:        this.elementList.slice(),
            indent:             this.indent,
            greedStep:          this.greedStep,
            backgroundColor:    this.backgroundColor,
            greedColor:         this.greedColor
        };

        this._elementList = [];

        while(this.schemeHTML.childNodes.length>0){
            this.childNodes.push(this.schemeHTML.childNodes[0]);
            this.schemeHTML.removeChild(this.schemeHTML.childNodes[0]);
        }

        if (schemeEnclosed!==null){
            this._elementList       = schemeEnclosed.elementList.slice();
            this._indent            = schemeEnclosed.indent;
            this._greedStep         = schemeEnclosed.greedStep;
            this._backgroundColor   = schemeEnclosed.backgroundColor;
            this._greedColor        = schemeEnclosed.greedColor;

            this.setProperties(this.getProperties());
        }

        childNodes.forEach((item)=>{
            this.schemeHTML.appendChild(item);
        });

        this.elementList.forEach((item)=>{
            if (item.draw!==undefined){
                item.draw();
            }
        });
    }

    returnEnclosedAlgorithm(id:string):void{
        //console.log(id);

        this.enclosedAlgorithmReturn.hidden = true;

        let eventResize = new Event('resize');
        window.dispatchEvent(eventResize);

        this.hostScheme.elementList.filter((item:EnclosedAlgorithmElementInterface)=>{
            return item.className === enumFigure.EnclosedAlgorithmElement && item.id ===id
        }).forEach((item:EnclosedAlgorithmElementInterface)=>{
            item.schemeEnclosed = {
                idElement:          id,
                elementList:        this.elementList.slice(),
                indent:             this.indent,
                greedStep:          this.greedStep,
                backgroundColor:    this.backgroundColor,
                greedColor:         this.greedColor
            };

            item.childNodes = [];
            let childNodes = this.schemeHTML.childNodes;
            for (let i=0;i<childNodes.length;i++){
                item.childNodes.push(childNodes[i]);
            }
        });

        this._elementList = [];

        while(this.schemeHTML.childNodes.length>0){
            this.schemeHTML.removeChild(this.schemeHTML.childNodes[0]);
        }

        if (this.hostScheme!==null){
            this._elementList       = this.hostScheme.elementList.slice();
            this._indent            = this.hostScheme.indent;
            this._greedStep         = this.hostScheme.greedStep;
            this._backgroundColor   = this.hostScheme.backgroundColor;
            this._greedColor        = this.hostScheme.greedColor;

            this.setProperties(this.getProperties());
        }

        this.childNodes.forEach((item)=>{
            this.schemeHTML.appendChild(item);
        });
        this.childNodes = [];

        this.elementList.forEach((item)=>{
            if (item.draw!==undefined){
                item.draw();
            }
        });
    }

    savePicture(filename?:string):void{

        if ((window as any).html2canvas!==undefined){
            let schemeDiv:HTMLElement = document.getElementById("scheme");

            let left:number = 999999;
            let top:number = 999999;
            let right:number = 0;
            let bottom:number = 0;

            this.elementList.forEach((item:AllFiguresTypes)=>{
                if (item.className!==enumFigure.Arrow){
                    left = Math.min(left,item.left);
                    top = Math.min(top,item.top);
                    right = Math.max(right,item.left+item.width);
                    bottom = Math.max(bottom,item.top+item.height);
                }
            });

            (window as any).html2canvas(schemeDiv,{
                onrendered: function(canvas) {
                    let a = document.createElement("a");
                    a.href = canvas.toDataURL("image/png");

                    if (filename===undefined){
                        a.download = "scheme.png";
                    }else{
                        a.download = filename+".png";
                    }
                    a.click();
                },
                width       :right+this.leftScheme,
                height      :bottom+this.topScheme,
                background  :"transparent"
            });
        }
    }

    getPicture():any{

        let answer:any = '';

        if ((window as any).html2canvas!==undefined){
            let schemeDiv:HTMLElement = document.getElementById("scheme");

            let left:number = 999999;
            let top:number = 999999;
            let right:number = 0;
            let bottom:number = 0;

            this.elementList.forEach((item:AllFiguresTypes)=>{
                if (item.className!==enumFigure.Arrow){
                    left = Math.min(left,item.left);
                    top = Math.min(top,item.top);
                    right = Math.max(right,item.left+item.width);
                    bottom = Math.max(bottom,item.top+item.height);
                }
            });

            (window as any).html2canvas(schemeDiv,{
                onrendered: function(canvas:HTMLCanvasElement) {
                     canvas.toBlob(
                         (blob)=>{
                             answer = blob;
                         }
                         ,"image/png"
                     );
                },
                width       :right+this.leftScheme,
                height      :bottom+this.topScheme,
                background  :"transparent"
            });
        }
        return answer;
    }

    getAsJson():SchemeAsJson{

        if (this.currentElement!==null){
            let prev = this.currentElement;
            this.currentElement = null;
          Utils.ruleMoveElement(prev);
        }

        let elementList:Array<any> = [];
        this.elementList.forEach((item)=>{
            if (item.className!==enumFigure.Arrow){
                elementList.push(item.getAsJSON());
            }
        });

        return {
             version:this._version
            ,id:this.id
            ,title:this.title
            ,elementList:elementList
            ,indent:this.indent

            ,greedStep:this.greedStep
            ,backgroundColor:this.backgroundColor
            ,greedColor:this.greedColor
        }
    }

    restoreFromJson(storeAsJSON:SchemeAsJson):void{

        if (this.currentElement!==null){
            let currentElement = this.currentElement;
            this.currentElement = null;
          Utils.ruleMoveElement(currentElement);
        }
        while (this.elementList.length>0){
          Utils.deleteElement(this,this.elementList[0]);
        }

        this._version = storeAsJSON.version;

        if (this._version==='1.0.0.1'){
          this._id = storeAsJSON.id;
          this._indent = storeAsJSON.indent;
          this.title = storeAsJSON.title;

          let propertiesArray:Array<PropertiesInterface> = [];
          propertiesArray.push({name:'_greedColor',reference:'Greed color', value:storeAsJSON.greedColor,type:"color"});
          propertiesArray.push({name:'_greedStep',reference:'Greed step', value:storeAsJSON.greedStep, type:"number"});
          propertiesArray.push({name:'_backgroundColor',reference:'Background color', value:storeAsJSON.backgroundColor, type:"color"});

          this.setProperties(propertiesArray);

          if (storeAsJSON.elementList!==null){

            let listOfFigures:{element:AllFiguresTypes,obj:any}[] = [];

            storeAsJSON.elementList.forEach((item)=>{
              listOfFigures.push({element:this.restoreFigureFromJson(item),obj:item});
            });

            listOfFigures.forEach((item)=>{
              item.element.restoreArrowFromJSON(item.obj);
            });
          }
        }

        this.modified = false;
    }

    restoreFigureFromJson(objectAsJSON:any):AllFiguresTypes{

        let res:AllFiguresTypes = null;

        switch (objectAsJSON.className){

            case enumFigure.ConditionElement:{
                res = Factory.createConditionElement(this,objectAsJSON.title,objectAsJSON);
                break;
            }
            case enumFigure.DataProcessorPointElement:{
                res = Factory.createDataProcessorPointElement(this,objectAsJSON.title,objectAsJSON);
                break;
            }
            case enumFigure.EnclosedAlgorithmElement:{
                res = Factory.createEnclosedAlgorithmElement(this,objectAsJSON.title,objectAsJSON);
                break;
            }
            case enumFigure.EndElement:{
                res = Factory.createEndElement(this,objectAsJSON.title,objectAsJSON);
                break;
            }
            case enumFigure.SceneryElement:{
                res = Factory.createSceneryElement(this,objectAsJSON.title,objectAsJSON);
                break;
            }
            case enumFigure.StartElement:{
                res = Factory.createStartElement(this,objectAsJSON.title,objectAsJSON);
                break;
            }
            case enumFigure.SwitchElement:{
                res = Factory.createSwitchElement(this,objectAsJSON.title,objectAsJSON);
                break;
            }
        }
        return res;
    }

    getElementById(id:string):AllElementListTypes{
        let res:AllElementListTypes = null;

        for (let i=0;i<this._elementList.length;i++){
            if ((this._elementList[i] as Figure).id === id){
                res = this._elementList[i];
                break;
            }
        }

        return res;
    }

    clearScheme():void{
        this.restoreFromJson(Utils.getSchemeDefaultProperties(this));
    }
}
