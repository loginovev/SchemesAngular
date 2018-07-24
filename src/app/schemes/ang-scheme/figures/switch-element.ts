import {enumFigure} from "../enum/enumFigure";
import {enumDirection} from "../enum/enumDirection";

import {Figure} from "./figure";

import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {SwitchElementInterface, VariantInterface} from "./switch-element-interface";
import {ArrowInterface} from "../arrows/arrow-interface";
import {SchemeInterface} from "../scheme-interface";

import {Utils} from "../utils";
import {Factory} from "../factory";

export class SwitchElement extends Figure implements SwitchElementInterface{

    private _ChangeDiv:HTMLDivElement = null;
    private _mainBlockHeight:number = 20;

    private _variantList:Array<VariantInterface> = [];

    currentVariant:VariantInterface = null;

    get variantList(): Array<VariantInterface> {
        return this._variantList;
    }

    get ChangeDiv(): HTMLDivElement {
        return this._ChangeDiv;
    }

    get mainBlockHeight(): number {
        return this._mainBlockHeight;
    }

    constructor(
        scheme:SchemeInterface
        ,title:string
        ,objectAsJSON?:any
    ){
        super(
            scheme
            ,title
            ,enumFigure.SwitchElement
            ,objectAsJSON
        );

        this.mainBlockDiv.classList.add("scheme-change-element-block");
        this.mainBlockDiv.style.height = this._mainBlockHeight+'px';

        this._ChangeDiv = document.createElement("div");
        this._ChangeDiv.setAttribute(this.scheme.classAttribute,'');
        this._ChangeDiv.classList.add("scheme-change-element");
        this._ChangeDiv.id = this.id;
        this._ChangeDiv.style.width = this.width+'px';

        this._ChangeDiv.appendChild(this.mainBlockDiv);
        this.scheme.schemeHTML.appendChild(this._ChangeDiv);

        if (objectAsJSON===undefined){
            this.width = 100;
            this.height = this._mainBlockHeight;

            this.moveWidth = this.width;
            this.moveHeight = this.height;

            this.backgroundColor = "#2aff71";
            this.borderColor = "#bbbbbb";
            this.borderWidth = 1;
            this.borderStyle = "solid";

            this.addVariant();
            this.setProperties(this.getProperties());
        }else{
            this._mainBlockHeight = objectAsJSON.mainBlockHeight;
            this.setProperties(this.getProperties());
        }
    }

    addVariant():void{

        new Variant(this);

        this.height = this._mainBlockHeight;
        this.variantList.forEach((item:VariantInterface)=>{
            this.height = this.height + item.heightVariant;
        });

        this.moveHeight = this.height;
        this.draw();
    }

    getPointCoordinate(point:number):CoordinateXYArrowDirection {

        let coordinate:CoordinateXYArrowDirection = {x:0,y:0,direction:enumDirection.DEFAULT,arrowDirection:enumDirection.DEFAULT};

        switch (point){
            case 1:{
                coordinate.x = this.left;
                coordinate.y = this.top+Math.floor(this._mainBlockHeight/2);
                coordinate.direction = enumDirection.LEFT;
                coordinate.arrowDirection = enumDirection.RIGHT;
                break;
            }
            case 2:{
                coordinate.x = this.left+Math.floor(this.width/2);
                coordinate.y = this.top;
                coordinate.direction = enumDirection.UP;
                coordinate.arrowDirection = enumDirection.DOWN;
                break;
            }
            case 3:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top+Math.floor(this._mainBlockHeight/2);
                coordinate.direction = enumDirection.RIGHT;
                coordinate.arrowDirection = enumDirection.LEFT;
                break;
            }
        }

        return coordinate;
    };

    draw(restoreFromJSON?:boolean):void{

        this.ChangeDiv.style.left = this.left+this.scheme.leftScheme+'px';
        this.ChangeDiv.style.top = this.top+this.scheme.topScheme+'px';

        this.ChangeDiv.style.width = this.width+'px';
        this.ChangeDiv.style.height = this.height+'px';

        let height = this.height;
        this.variantList.forEach((item:VariantInterface)=>{
            height = height - item.heightVariant;
        });

        this.mainBlockDiv.style.height = height-this.borderWidth*2+'px';
        this._mainBlockHeight = height;

        this.editableTitleDiv.style.width = this.mainBlockDiv.style.width;

        this.editableTitleDiv.style.paddingTop = "0px";
        let boxBoundingClientRect = this.editableTitleDiv.getBoundingClientRect();
        this.editableTitleDiv.style.paddingTop = this._mainBlockHeight/2-(boxBoundingClientRect.height)/2+'px';

        this.setPictureAlign();
        this.setPictureSize();

        this.moveLeft = this.left;
        this.moveTop = this.top;

        if (restoreFromJSON===undefined || restoreFromJSON===false){
            //We need find all variants, take arrows and move
            this.variantList.forEach((item:VariantInterface)=>{
                item.editableTitleDiv.style.width = this.mainBlockDiv.style.width;
                if (item.arrow!==null){
                    item.arrow.moveRoot();
                }
            });

            this.scheme.elementList.forEach((item)=>{
                if (item.className===enumFigure.Arrow && (item as ArrowInterface).endElement!==null && (item as ArrowInterface).endElement.id === this.id){
                  (item as ArrowInterface).moveArrow();
                }
            });
        }
    }

    delete():void {
        this.scheme.schemeHTML.removeChild(this.ChangeDiv);
    }

    setProperties(propertiesArray:Array<PropertiesInterface>):void{

        this.scheme.modified = true;

        propertiesArray.forEach((item)=>{

            if (item.readOnly===undefined || !item.readOnly){
                if (typeof(this[item.name]) === "boolean"){
                    this[item.name]=item.value==="true";
                }else{
                    if (typeof(this[item.name]) === "number"){
                        this[item.name]=Number(item.value);
                    }else{
                        this[item.name]=item.value;
                    }
                }
            }


            switch (item.name){
                case "backgroundColor":{
                    this.mainBlockDiv.style.backgroundColor = item.value;
                    break;
                }
                case "borderColor":{
                    this.ChangeDiv.style.borderColor = item.value;
                    break;
                }
                case "borderWidth":{
                    this.ChangeDiv.style.borderWidth = item.value+"px";
                    break;
                }
                case "borderStyle":{
                    this.ChangeDiv.style.borderStyle = item.value;
                    break;
                }
                case "hasShadow":{
                    if (item.value==="true" || item.value===true){
                        this.ChangeDiv.style.boxShadow = "5px 5px 10px rgba(0,0,0,0.5)";
                    }else{
                        this.ChangeDiv.style.boxShadow = "none";
                    }
                    break;
                }
                case "pictureAlign":{
                    this.setPictureAlign();
                    break;
                }
                case "pictureSize":{
                    this.setPictureSize();
                    break;
                }
                case "picture":{
                    this.pictureHTML.setAttribute("src",item.value);
                    this.pictureName = item.valueReference;
                    this.pictureOriginalSize = item.valueSecondary;
                    break;
                }
                case "fontFamily":{
                    this.editableTitleDiv.style.fontFamily = item.value;
                    break;
                }
                case "fontSize":{
                    this.editableTitleDiv.style.fontSize = item.value+'px';
                    break;
                }
                case "fontStyle":{
                    this.editableTitleDiv.style.fontStyle = item.value;
                    break;
                }
                case "fontWeight":{
                    this.editableTitleDiv.style.fontWeight = item.value;
                    break;
                }
                case "textAlign":{
                    this.editableTitleDiv.style.textAlign = item.value;
                    break;
                }
                case "textColor":{
                    this.editableTitleDiv.style.color = item.value;
                    break;
                }
            }
        });
    }

    currentDraw():void {

        if (this.scheme.currentElement===this){
            this.scheme.currentElement=null;

            if (this.currentVariant!==null){
                this.currentVariant.unSelectVariant();
            }

            this.ruleMoveElement();
        }else{
            if (this.scheme.currentElement!==null){
                this.scheme.currentElement.currentDraw();
            }

            this.scheme.currentElement=this;
            this.ruleMoveElement();
        }

        this.scheme.lastCurrentElement = this;
    }

    restoreVariantFromJSON(variantFromJSON:any):void{
        let variant:Variant = new Variant(this,variantFromJSON);
        variant.arrow.restoreFromJSON(variantFromJSON.arrow);
    }

    restoreArrowFromJSON(objectAsJSON:any):void{

        objectAsJSON.variantList.forEach((item)=>{
            this.restoreVariantFromJSON(item);
        });

        this.height = this._mainBlockHeight;
        this.variantList.forEach((item:VariantInterface)=>{
            this.height = this.height + item.heightVariant;
        });

        this.moveHeight = this.height;

        this.draw(true);
    }

  getVariantListAsJSON():any{
      let variantList = [];
      this.variantList.forEach((item)=>{
          variantList.push(item.getAsJSON());
      });
      return variantList;
  }

}

export class Variant implements VariantInterface{

    readonly className:enumFigure = enumFigure.Variant;
    private _switchElement:SwitchElementInterface = null;

    private _id:string = '';
    private _name:string = '';
    private _number:number = 0;
    title:string = '';
    private _variantDiv:HTMLDivElement = null;
    editableTitleDiv:HTMLDivElement = null;
    private _arrow:ArrowInterface = null;
    private _beginPoint:number = 3;
    private _heightVariant:number = 20;

    backgroundColor:string = "#ffffff";
    borderColor:string = "#bbbbbb";
    borderWidth:number = 1;
    borderStyle:string = "solid";

    fontFamily:string = 'times new roman,monospace';
    fontSize:number = 15;
    fontStyle:string = "normal";//normal | italic | oblique
    fontWeight:string = "normal"; //bold|bolder|lighter|normal|100|200|300|400|500|600|700|800|900
    textAlign:string = "left";//center | justify | left | right | start | end
    textColor:string = "#000000";

    caseValue:string = "";

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get heightVariant(): number {
        return this._heightVariant;
    }

    get variantDiv(): HTMLDivElement {
        return this._variantDiv;
    }

    get arrow(): ArrowInterface {
        return this._arrow;
    }

    get beginPoint(): number {
      return this._beginPoint;
    }

  get switchElement(): SwitchElementInterface {
        return this._switchElement;
    }

    get number(): number {
      return this._number;
    }

  constructor(
        switchElement:SwitchElement
        ,objectAsJSON?:any
    ){

        this._switchElement = switchElement;
        this._switchElement.variantList.push(this);

        if (objectAsJSON===undefined){

            this._id = Utils.getGUID().create().value;

            this._number = this.getVariantLastNumber()+1;
            this._name = 'variant-'+this._number;
            this.title = 'variant '+this._number;

        }else{


            this._id = objectAsJSON.id;
            this._name = objectAsJSON.name;
            this._number = objectAsJSON.number;
            this.title = objectAsJSON.title;

            this._beginPoint = objectAsJSON.beginPoint;
            this._heightVariant = objectAsJSON.heightVariant;

            this.fontFamily = objectAsJSON.fontFamily;
            this.fontSize = objectAsJSON.fontSize;
            this.fontStyle = objectAsJSON.fontStyle;//normal | italic | oblique
            this.fontWeight = objectAsJSON.fontWeight; //bold|bolder|lighter|normal|100|200|300|400|500|600|700|800|900
            this.textAlign = objectAsJSON.textAlign;//center | justify | left | right | start | end
            this.textColor = objectAsJSON.textColor;

            this.backgroundColor = objectAsJSON.backgroundColor;
            this.borderColor = objectAsJSON.borderColor;
            this.borderWidth = objectAsJSON.borderWidth;
            this.borderStyle = objectAsJSON.borderStyle;

            this.caseValue = objectAsJSON.caseValue;
        }

        this._variantDiv = document.createElement("div");
        this._variantDiv.setAttribute(this._switchElement.scheme.classAttribute,'');
        this._variantDiv.classList.add("scheme-variant");

        this._variantDiv.style.height = this._heightVariant+"px";

        Utils.stateEditableTitle(this._variantDiv,this,this._switchElement.scheme.classAttribute,this._switchElement.scheme.readOnly);

        let currentThis = this;
        this._variantDiv.onclick = function (event) {
            currentThis.selectVariant();
        };

        this._switchElement.ChangeDiv.appendChild(this._variantDiv);

        this._arrow = Factory.createArrow(this._switchElement.scheme,this,this._beginPoint,null,0);

        this._beginPoint = this._arrow.beginPoint;

        this.setProperties(this.getProperties());
    }

    getVariantLastNumber():number {
        let lastNumber = 0;
        this.switchElement.variantList.forEach((item)=>{
            lastNumber = Math.max(item.number,lastNumber);
        });
        return lastNumber;
    }

    delete():void{

        if (this.switchElement.variantList.length>1){
            this.switchElement.ChangeDiv.removeChild(this.variantDiv);

            this.arrow.delete();

            for(let i=0;i<this.switchElement.variantList.length;i++){
                if (this.switchElement.variantList[i]===this){
                    this.switchElement.variantList.splice(i,1);
                    break;
                }
            }

            this.switchElement.height = this.switchElement.mainBlockHeight;
            this.switchElement.variantList.forEach((item:Variant)=>{
                this.switchElement.height = this.switchElement.height + item.heightVariant;
            });

            this.switchElement.moveHeight = this.switchElement.height;
            this.switchElement.draw();
        }
    }

    selectVariant():void{

        if (this.switchElement.scheme.currentElement===this.switchElement){
            if (this.switchElement.currentVariant==this){
                this.switchElement.currentVariant.unSelectVariant();
            }else{
                if (this.switchElement.currentVariant!==null){
                    this.switchElement.currentVariant.unSelectVariant();
                }
                this.switchElement.currentVariant = this;

                this.editableTitleDiv.style.textDecoration = "underline";
            }
            this.switchElement.scheme.lastCurrentElement = this.switchElement;
        }
    }

    unSelectVariant():void{
        this.editableTitleDiv.style.textDecoration = "none";
        this.switchElement.currentVariant = null;
    }

    getBeginPointCoordinate(beginPoint:number):CoordinateXYArrowDirection{

        let coorX:number = 0;
        let coorY:number = this._switchElement.top+this._switchElement.mainBlockHeight;

        let variantList = this._switchElement.variantList;
        for (let i=0;i<variantList.length;i++){
            if (variantList[i]===this){
                coorY = coorY + Math.floor(variantList[i].heightVariant/2);
                break;
            }
            coorY = coorY + variantList[i].heightVariant;
        }

        let direction:enumDirection = enumDirection.DEFAULT;
        let arrowDirection:enumDirection = enumDirection.DEFAULT;

        switch (beginPoint){
            case 1:{
                coorX = this._switchElement.left;
                direction = enumDirection.LEFT;
                arrowDirection = enumDirection.LEFT;
                break;
            }
            case 3:{
                coorX = this._switchElement.left+this._switchElement.width;
                direction = enumDirection.RIGHT;
                arrowDirection = enumDirection.RIGHT;
                break;
            }
        }

        return {
            x:coorX,
            y:coorY,
            direction:direction,
            arrowDirection: arrowDirection
        };
    }

    getProperties():Array<PropertiesInterface>{

        let propertiesArray:Array<PropertiesInterface> = [];

        propertiesArray.push({name:'_id',reference:'Id', value:this._id,type:"text",valueSecondary:"",readOnly:true});
        propertiesArray.push({name:'title',reference:'Title', value:this.title,type:"text"});

        propertiesArray.push({name:'backgroundColor',reference:'Background color', value:this.backgroundColor,type:"color"});

        propertiesArray.push({name:'borderColor',reference:'Border color', value:this.borderColor,type:"color"});
        propertiesArray.push({name:'borderWidth',reference:'Border width', value:this.borderWidth,type:"number"});
        propertiesArray.push({name:'borderStyle',reference:'Border style', value:this.borderStyle,type:"select"});


        propertiesArray.push({name:'fontFamily',reference:'Font family', value:this.fontFamily,type:"select"});
        propertiesArray.push({name:'fontSize',reference:'Font size', value:this.fontSize,type:"number"});
        propertiesArray.push({name:'fontStyle',reference:'Font style', value:this.fontStyle,type:"select"});
        propertiesArray.push({name:'fontWeight',reference:'Font weight', value:this.fontWeight,type:"select"});
        propertiesArray.push({name:'textAlign',reference:'Text align', value:this.textAlign,type:"select"});
        propertiesArray.push({name:'textColor',reference:'Text color', value:this.textColor,type:"color"});

        return propertiesArray;
    }

    setProperties(propertiesArray:Array<PropertiesInterface>):void{

        this.switchElement.scheme.modified = true;

        propertiesArray.forEach((item)=>{

            if (item.readOnly===undefined || !item.readOnly){
                if (typeof(this[item.name]) === "boolean"){
                    this[item.name]=item.value==="true";
                }else{
                    if (typeof(this[item.name]) === "number"){
                        this[item.name]=Number(item.value);
                    }else{
                        this[item.name]=item.value;
                    }
                }
            }

            switch (item.name){
                case "title":{
                    this.editableTitleDiv.innerText = item.value;
                    break;
                }
                case "backgroundColor":{
                    this.variantDiv.style.backgroundColor = item.value;
                    break;
                }
                case "borderColor":{
                    this.variantDiv.style.borderTopColor = item.value;
                    break;
                }
                case "borderWidth":{
                    this.variantDiv.style.borderTopWidth = item.value+"px";
                    break;
                }
                case "borderStyle":{
                    this.variantDiv.style.borderTopStyle = item.value;
                    break;
                }
                case "fontFamily":{
                    this.editableTitleDiv.style.fontFamily = item.value;
                    break;
                }
                case "fontSize":{
                    this.editableTitleDiv.style.fontSize = item.value+'px';
                    break;
                }
                case "fontStyle":{
                    this.editableTitleDiv.style.fontStyle = item.value;
                    break;
                }
                case "fontWeight":{
                    this.editableTitleDiv.style.fontWeight = item.value;
                    break;
                }
                case "textAlign":{
                    this.editableTitleDiv.style.textAlign = item.value;
                    break;
                }
                case "textColor":{
                    this.editableTitleDiv.style.color = item.value;
                    break;
                }
            }
        });
    }

    getAsJSON():any{

        return {

            id:this.id
            ,name:this.name
            ,title:this.title
            ,className:this.className
            ,number:this._number
            ,arrow:this.arrow.getAsJSON()

            ,beginPoint:this._beginPoint
            ,heightVariant:this.heightVariant

            ,fontFamily:this.fontFamily
            ,fontSize:this.fontSize
            ,fontStyle:this.fontStyle
            ,fontWeight:this.fontWeight
            ,textAlign:this.textAlign
            ,textColor:this.textColor

            ,backgroundColor:this.backgroundColor
            ,borderColor:this.borderColor
            ,borderWidth:this.borderWidth
            ,borderStyle:this.borderStyle

            ,caseValue:this.caseValue
        }
    }
}
