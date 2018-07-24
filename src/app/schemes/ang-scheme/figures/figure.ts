import {enumFigure} from "../enum/enumFigure";
import {enumDirection} from "../enum/enumDirection";
import {enumPictureAlign} from "../enum/enumPictureAlign";
import {enumPictureSize} from "../enum/enumPictureSize";

import {AllFiguresTypes} from "../types/all-figures-types";

import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {FigureInterface} from "./figure-interface";

import {SchemeInterface} from "../scheme-interface";

import {EnclosedAlgorithmElement} from "./enclosed-algorithm-element";

import {Utils} from "../utils";
import {SwitchElementInterface} from "./switch-element-interface";

export abstract class Figure implements FigureInterface{

    private _id:string = '';
    private _name:string = '';
    title:string = '';

    private _className:enumFigure;
    private _number:number = 0;

    private _scheme:SchemeInterface;

    left:number = 0;
    top:number = 0;
    width:number = 0;
    height:number = 0;

    private _mainBlockDiv:HTMLDivElement = null;
    editableTitleDiv:HTMLDivElement = null;

    picture:string = '';
    pictureName:string = '';
    pictureAlign:enumPictureAlign = enumPictureAlign.left_top;
    pictureSize:enumPictureSize = enumPictureSize.automatic;
    pictureHTML:HTMLPictureElement = null;
    pictureOriginalSize:{width:number,height:number} = {width:0,height:0};

    fontFamily:string = 'times new roman,monospace';
    fontSize:number = 15;
    fontStyle:string = "normal";//normal | italic | oblique
    fontWeight:string = "normal"; //bold|bolder|lighter|normal|100|200|300|400|500|600|700|800|900
    textAlign:string = "center";//center | justify | left | right | start | end
    textColor:string = "#000000";

    moveElement:HTMLDivElement = null;
    moveBoxPoint:Array<HTMLDivElement> = [];
    moveLeft:number = 0;
    moveTop:number = 0;
    moveWidth:number = 0;
    moveHeight:number = 0;

    backgroundColor:string = "";
    borderColor:string = "";
    borderWidth:number = 0;
    borderStyle:string = "";
    hasShadow:boolean = false;

    module:string = "";

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get className(): enumFigure {
        return this._className;
    }

    get number(): number {
        return this._number;
    }

    get scheme(): SchemeInterface {
        return this._scheme;
    }

    get mainBlockDiv(): HTMLDivElement {
        return this._mainBlockDiv;
    }

    set scheme(value: SchemeInterface) {
        this._scheme = value;
    }

    constructor(
        scheme:SchemeInterface
        ,title:string
        ,className:enumFigure
        ,objectAsJSON?:any
    ){
        this._scheme = scheme;
        this._className = className;

        if (objectAsJSON===undefined){

            this._number = this.getElementLastNumber()+1;

            let tempEnumFigure = Utils.enumFigureAsString(className);
            this._name = tempEnumFigure.value+"-"+this._number;

            this._id = Utils.getGUID().create().value;

            if (title!==""){
                this.title = title;
            }else{
                this.title = tempEnumFigure.reference+" "+this._number;
            }

        }else{

            this._number = objectAsJSON.number;
            this._id = objectAsJSON.id;
            this._name = objectAsJSON.name;
            this.title = title;

            this.left = objectAsJSON.left;
            this.top = objectAsJSON.top;
            this.width = objectAsJSON.width;
            this.height = objectAsJSON.height;

            this.picture = objectAsJSON.picture;
            this.pictureName = objectAsJSON.pictureName;
            this.pictureAlign = objectAsJSON.pictureAlign;
            this.pictureSize = objectAsJSON.pictureSize;
            this.pictureOriginalSize = objectAsJSON.pictureOriginalSize;

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
            this.hasShadow = objectAsJSON.hasShadow;

            this.module = objectAsJSON.module;
        }

        this._mainBlockDiv = document.createElement("div");
        this._mainBlockDiv.setAttribute(this.scheme.classAttribute,'');

        Utils.stateEditableTitle(this._mainBlockDiv,this,this.scheme.classAttribute,this.scheme.readOnly);

        if (!this.scheme.readOnly){
          let currentThis:AllFiguresTypes = this;
          this._mainBlockDiv.onclick = function (event) {
            currentThis.currentDraw();
          };
        }

        this.pictureHTML = document.createElement("img");
        this.pictureHTML.setAttribute(this.scheme.classAttribute,'');
        this.pictureHTML.classList.add('main-picture');
        this.mainBlockDiv.appendChild(this.pictureHTML);

        this.scheme.schemeHTML.appendChild(this._mainBlockDiv);

        this.scheme.elementList.push(this);
    }

    getElementLastNumber():number {
        let lastNumber = 0;
        this.scheme.elementList.forEach((item)=>{
            if (item.className===this.className && item.className!==enumFigure.SelectedArrowBox){
                lastNumber = Math.max((item as FigureInterface).number,lastNumber);
            }
        });
        return lastNumber;
    }

    moveToBox():void {

        if (this.left!==this.moveLeft || this.top!==this.moveTop || this.width!==this.moveWidth || this.height!==this.moveHeight){
            this.left = this.moveLeft;
            this.top = this.moveTop;
            this.width = this.moveWidth;
            this.height = this.moveHeight;
            this.draw();
        }
    }

    currentDraw():void {

        if (this.scheme.currentElement===this){
            this.scheme.currentElement=null;
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

    ruleMoveElement():void {
        Utils.ruleMoveElement(this);
    }

    getPointCoordinate(point:number):CoordinateXYArrowDirection {

        let coordinate:CoordinateXYArrowDirection = {x:0,y:0,direction:enumDirection.DEFAULT,arrowDirection:enumDirection.DEFAULT};

        switch (point){
            case 1:{
                coordinate.x = this.left;
                coordinate.y = this.top+Math.floor(this.height/2);
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
                coordinate.y = this.top+Math.floor(this.height/2);
                coordinate.direction = enumDirection.RIGHT;
                coordinate.arrowDirection = enumDirection.LEFT;
                break;
            }
            case 4:{
                coordinate.x = this.left+Math.floor(this.width/2);
                coordinate.y = this.top+this.height;
                coordinate.direction = enumDirection.DOWN;
                coordinate.arrowDirection = enumDirection.UP;
                break;
            }
        }
        return coordinate;
    }

    getBeginPointCoordinate(beginPoint:number):CoordinateXYArrowDirection{

        let coordinate:CoordinateXYArrowDirection = {x:0,y:0,direction:enumDirection.DEFAULT};

        switch (beginPoint){
            case 1:{
                coordinate.x = this.left;
                coordinate.y = this.top+Math.floor(this.height/2);
                coordinate.direction = enumDirection.LEFT;
                break;
            }
            case 2:{
                coordinate.x = this.left+Math.floor(this.width/2);
                coordinate.y = this.top;
                coordinate.direction = enumDirection.UP;
                break;
            }
            case 3:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top+Math.floor(this.height/2);
                coordinate.direction = enumDirection.RIGHT;
                break;
            }
            case 4:{
                coordinate.x = this.left+Math.floor(this.width/2);
                coordinate.y = this.top+this.height;
                coordinate.direction = enumDirection.DOWN;
                break;
            }
        }
        return coordinate;
    }

    draw():void{
        if (this.mainBlockDiv!==null){
            let mainBlock:HTMLDivElement = this.mainBlockDiv;

            mainBlock.style.left = this.left+this.scheme.leftScheme+'px';
            mainBlock.style.top = this.top+this.scheme.topScheme+'px';
            mainBlock.style.width = this.width+'px';
            mainBlock.style.height = this.height+'px';

            this.editableTitleDiv.style.width = mainBlock.style.width;



            this.setPictureAlign();
            this.setPictureSize();
        }
    }

    getProperties():Array<PropertiesInterface>{

        let propertiesArray:Array<PropertiesInterface> = [];

        propertiesArray.push({name:'id',reference:'Id', value:this.id,type:"text",valueSecondary:"",readOnly:true});
        propertiesArray.push({name:'name',reference:'Name', value:this.name,type:"text",valueSecondary:"",readOnly:true});
        propertiesArray.push({name:'title',reference:'Title', value:this.title,type:"text"});

        propertiesArray.push({name:'backgroundColor',reference:'Background color', value:this.backgroundColor,type:"color"});

        propertiesArray.push({name:'borderColor',reference:'Border color', value:this.borderColor,type:"color"});
        propertiesArray.push({name:'borderWidth',reference:'Border width', value:this.borderWidth,type:"number"});
        propertiesArray.push({name:'borderStyle',reference:'Border style', value:this.borderStyle,type:"select"});

        propertiesArray.push({name:'picture',reference:'Picture', value:this.picture,type:"file", valueReference:this.pictureName, valueSecondary:this.pictureOriginalSize});
        propertiesArray.push({name:'pictureAlign',reference:'Picture align', value:this.pictureAlign,type:"select"});
        propertiesArray.push({name:'pictureSize',reference:'Picture size', value:this.pictureSize,type:"select"});

        propertiesArray.push({name:'fontFamily',reference:'Font family', value:this.fontFamily,type:"select"});
        propertiesArray.push({name:'fontSize',reference:'Font size', value:this.fontSize,type:"number"});
        propertiesArray.push({name:'fontStyle',reference:'Font style', value:this.fontStyle,type:"select"});
        propertiesArray.push({name:'fontWeight',reference:'Font weight', value:this.fontWeight,type:"select"});
        propertiesArray.push({name:'textAlign',reference:'Text align', value:this.textAlign,type:"select"});
        propertiesArray.push({name:'textColor',reference:'Text color', value:this.textColor,type:"color"});

        propertiesArray.push({name:'hasShadow',reference:'Shadow', value:this.hasShadow,type:"boolean"});

        return propertiesArray;
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
                case "title":{
                    this.editableTitleDiv.innerText = item.value;
                    break;
                }
                case "backgroundColor":{
                    this.mainBlockDiv.style.backgroundColor = item.value;
                    break;
                }
                case "borderColor":{
                    this.mainBlockDiv.style.borderColor = item.value;
                    break;
                }
                case "borderWidth":{
                    this.mainBlockDiv.style.borderWidth = item.value+"px";
                    break;
                }
                case "borderStyle":{
                    this.mainBlockDiv.style.borderStyle = item.value;
                    break;
                }
                case "hasShadow":{
                    if (item.value==="true" || item.value===true){
                        this.mainBlockDiv.style.boxShadow = "5px 5px 10px rgba(0,0,0,0.5)";
                    }else{
                        this.mainBlockDiv.style.boxShadow = "none";
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

    setPictureAlign():void{

        if (this.picture!==''){
            switch (this.pictureAlign){
                case enumPictureAlign.center:{
                    this.pictureHTML.style.cssFloat = "center";
                    break;
                }
                case enumPictureAlign.left_bottom:{
                    this.pictureHTML.style.cssFloat = "left";
                    break;
                }
                case enumPictureAlign.left_top:{
                    this.pictureHTML.style.cssFloat = "left";
                    break;
                }
                case enumPictureAlign.right_bottom:{
                    this.pictureHTML.style.cssFloat = "right";
                    break;
                }
                case enumPictureAlign.right_top:{
                    this.pictureHTML.style.cssFloat = "right";
                    break;
                }
            }
        }
    }

    setPictureSize():void{

        this.pictureHTML.hidden = this.picture==='';

        if (this.picture!==''){
            switch (this.pictureSize){
                case enumPictureSize.automatic:{

                    this.pictureHTML.setAttribute("width",Math.min(this.width/2,this.pictureOriginalSize.width)+"");
                    this.pictureHTML.setAttribute("height",Math.min(this.height/2,this.pictureOriginalSize.height)+"");

                    break;
                }
                case enumPictureSize.extending:{

                    this.pictureHTML.setAttribute("width",this.width/2+"");
                    this.pictureHTML.setAttribute("height",this.height/2+"");

                    break;
                }
                case enumPictureSize.proportional:{

                    let widthPicture:number = this.width/2;
                    let heightPicture:number = widthPicture*this.pictureOriginalSize.height/this.pictureOriginalSize.width;

                    this.pictureHTML.setAttribute("width",widthPicture+"");
                    this.pictureHTML.setAttribute("height",heightPicture+"");

                    break;
                }
                case enumPictureSize.real:{
                    this.pictureHTML.setAttribute("width",this.pictureOriginalSize.width+"");
                    this.pictureHTML.setAttribute("height",this.pictureOriginalSize.height+"");

                    break;
                }
            }
        }
    }

    getAsJSON():any{

        let res:any = {

            id:this._id
            ,name:this._name
            ,title:this.title
            ,className:this._className
            ,number:this._number

            ,left:this.left
            ,top:this.top
            ,width:this.width
            ,height:this.height

            ,picture:this.picture
            ,pictureName:this.pictureName
            ,pictureAlign:this.pictureAlign
            ,pictureSize:this.pictureSize
            ,pictureOriginalSize:this.pictureOriginalSize

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
            ,hasShadow:this.hasShadow

            ,module:this.module
        };

        function setValue(currentThis:AllFiguresTypes,valueName:string,defaultValue:any):void{

            if (
                currentThis.className === enumFigure.EnclosedAlgorithmElement
                && (valueName==="indent"
                || valueName==="greedStep"
                || valueName==="schemeBackgroundColor"
                || valueName==="greedColor"
                || valueName==="elementList")
            ){
                if ((currentThis as EnclosedAlgorithmElement).schemeEnclosed!==null){
                    switch (valueName){
                        case "schemeBackgroundColor":{
                            res[valueName]=(currentThis as EnclosedAlgorithmElement).schemeEnclosed["backgroundColor"];
                            break;
                        }
                        case "elementList":{
                            let elementList:Array<any> = [];
                            (currentThis as EnclosedAlgorithmElement).schemeEnclosed.elementList.forEach((item)=>{
                                if (item.className!==enumFigure.Arrow){
                                    elementList.push((item as AllFiguresTypes).getAsJSON());
                                }
                            });
                            res["elementList"] = elementList;
                            break;
                        }
                        default:{
                            res[valueName]=(currentThis as EnclosedAlgorithmElement).schemeEnclosed[valueName];
                            break;
                        }
                    }
                }else{
                    res[valueName]=defaultValue;
                }
            }else{
                if (currentThis[valueName]!==undefined){

                    switch (valueName){
                        case "arrow":
                        case "arrowYes":
                        case "arrowNo":{
                            res[valueName] = currentThis[valueName].getAsJSON();
                            break;
                        }
                        case "variantList":{
                          res["variantList"] = (currentThis as SwitchElementInterface).getVariantListAsJSON();
                            break;
                        }
                        default:{
                            res[valueName]=currentThis[valueName];
                            break;
                        }
                    }
                }else{
                    res[valueName]=defaultValue;
                }
            }
        }

        setValue(this,"beginPoint",0);
        setValue(this,"arrow",null);
        setValue(this,"beginPointYes",0);
        setValue(this,"arrowYes",null);
        setValue(this,"beginPointNo",0);
        setValue(this,"arrowNo",null);

        setValue(this,"indent",0);
        setValue(this,"greedStep",0);
        setValue(this,"schemeBackgroundColor","");
        setValue(this,"greedColor","");
        setValue(this,"elementList",[]);

        setValue(this,"mainBlockHeight",0);
        setValue(this,"variantList",[]);

        return res;
    }

    restoreArrowFromJSON(objectAsJSON:any):void{}
}
