import {Figure} from "./figure";
import {enumFigure} from "../enum/enumFigure";
import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";
import {enumDirection} from "../enum/enumDirection";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {ConditionElementInterface} from "./condition-element-interface";
import {ArrowInterface} from "../arrows/arrow-interface";
import {SchemeInterface} from "../scheme-interface";
import {Factory} from "../factory";

export class ConditionElement extends Figure implements ConditionElementInterface{

    private mainCanvas:HTMLCanvasElement = null;

    private _arrowYes:ArrowInterface = null;
    beginPointYes:number = 1;

    private _arrowNo:ArrowInterface = null;
    beginPointNo:number = 3;

    private yesDiv:HTMLDivElement = null;
    private noDiv:HTMLDivElement = null;

    get arrowYes(): ArrowInterface {
        return this._arrowYes;
    }

    get arrowNo(): ArrowInterface {
        return this._arrowNo;
    }

    constructor(
        scheme:SchemeInterface
        ,title:string
        ,objectAsJSON?:any
    ){
        super(
            scheme
            ,title
            ,enumFigure.ConditionElement
            ,objectAsJSON
        );

        this.mainBlockDiv.classList.add("scheme-condition-element");

        this.mainCanvas = document.createElement('canvas');
        this.mainCanvas.setAttribute(this.scheme.classAttribute,'');
        this.mainCanvas.classList.add('main-canvas');
        this.mainCanvas.width = this.width;
        this.mainCanvas.height = this.height;

        this.mainBlockDiv.appendChild(this.mainCanvas);

        this.yesDiv = document.createElement("div");
        this.yesDiv.setAttribute(this.scheme.classAttribute,'');
        this.yesDiv.classList.add('scheme-condition-yes-no-element');
        this.yesDiv.classList.add('select-none');
        this.yesDiv.innerText = "yes";
        this.mainBlockDiv.appendChild(this.yesDiv);

        this.noDiv = document.createElement("div");
        this.noDiv.setAttribute(this.scheme.classAttribute,'');
        this.noDiv.classList.add('scheme-condition-yes-no-element');
        this.noDiv.classList.add('select-none');
        this.noDiv.innerText = " no";
        this.mainBlockDiv.appendChild(this.noDiv);

        if (objectAsJSON===undefined){
            this.left = 0;
            this.top = 0;
            this.width = 40;
            this.height = 40;

            this.backgroundColor = "#77ff80";
            this.borderColor = "#696969";
            this.borderWidth = 1;
            this.borderStyle = "solid";

            this.setProperties(this.getProperties());

            this._arrowYes = Factory.createArrow(this.scheme,this,this.beginPointYes,null,0);
            this._arrowNo = Factory.createArrow(this.scheme,this,this.beginPointNo,null,0);

        }else{

            this.beginPointYes = objectAsJSON.beginPointYes;
            this.beginPointNo = objectAsJSON.beginPointNo;

            this.setProperties(this.getProperties());

            this._arrowYes = Factory.createArrow(this.scheme,this,this.beginPointYes,null,0);
            this._arrowNo = Factory.createArrow(this.scheme,this,this.beginPointNo,null,0);

            this.draw();
        }
    }

    draw():void {

        let mainBlock:HTMLDivElement = this.mainBlockDiv;

        mainBlock.style.left = this.left+this.scheme.leftScheme+'px';
        mainBlock.style.top = this.top+this.scheme.topScheme+'px';
        mainBlock.style.width = this.width+'px';
        mainBlock.style.height = this.height+'px';

        this.editableTitleDiv.style.width = mainBlock.style.width;

        this.editableTitleDiv.style.paddingTop = "0px";
        let boxBoundingClientRect = this.editableTitleDiv.getBoundingClientRect();
        this.editableTitleDiv.style.paddingTop = Math.abs(this.height/2-boxBoundingClientRect.height/2)+'px';

        let shadowOffsetX:number = 5;
        let shadowOffsetY:number = 5;
        let shadowBlur:number = 10;

        let mainCanvas = this.mainCanvas;
        mainCanvas.width = this.width+shadowOffsetX+shadowBlur/4;
        mainCanvas.height = this.height+shadowOffsetY+shadowBlur/4;

        let width = this.width-this.borderWidth/2;
        let height = this.height-this.borderWidth/2;
        let top = this.borderWidth/2;
        let left = this.borderWidth/2;

        if (mainCanvas.getContext){
            let ctx = mainCanvas.getContext('2d');

            ctx.clearRect(left, top, width, height);
            ctx.fillStyle = this.backgroundColor;
            ctx.strokeStyle = this.borderColor;
            ctx.lineWidth = this.borderWidth;

            if (this.hasShadow===true){
                ctx.shadowOffsetX = shadowOffsetX;
                ctx.shadowOffsetY = shadowOffsetY;
                ctx.shadowBlur = shadowBlur;
                ctx.shadowColor = 'black';
            }

            ctx.beginPath();
            ctx.moveTo(width/2,top);
            ctx.lineTo(width,height/2);
            ctx.lineTo(width/2,height);
            ctx.lineTo(left,height/2);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        let coorBeginYes:CoordinateXYArrowDirection = this.getBeginPointCoordinate(this.beginPointYes);

        switch (coorBeginYes.direction){
            case enumDirection.LEFT:{
                this.yesDiv.style.left = coorBeginYes.x-this.left+"px";
                this.yesDiv.style.top = coorBeginYes.y-this.top-6+"px";
                break;
            }
            case enumDirection.RIGHT:{
                this.yesDiv.style.left = coorBeginYes.x-this.left-15+"px";
                this.yesDiv.style.top = coorBeginYes.y-this.top-6+"px";
                break;
            }
            case enumDirection.UP:{
                this.yesDiv.style.left = coorBeginYes.x-this.left-8+"px";
                this.yesDiv.style.top = coorBeginYes.y-this.top+"px";
                break;
            }
            case enumDirection.DOWN:{
                this.yesDiv.style.left = coorBeginYes.x-this.left-8+"px";
                this.yesDiv.style.top = coorBeginYes.y-this.top-16+"px";
                break;
            }
        }

        let coorBeginNo:CoordinateXYArrowDirection = this.getBeginPointCoordinate(this.beginPointNo);

        switch (coorBeginNo.direction){
            case enumDirection.LEFT:{
                this.noDiv.style.left = coorBeginNo.x-this.left+"px";
                this.noDiv.style.top = coorBeginNo.y-this.top-6+"px";
                break;
            }
            case enumDirection.RIGHT:{
                this.noDiv.style.left = coorBeginNo.x-this.left-15+"px";
                this.noDiv.style.top = coorBeginNo.y-this.top-6+"px";
                break;
            }
            case enumDirection.UP:{
                this.noDiv.style.left = coorBeginNo.x-this.left-8+"px";
                this.noDiv.style.top = coorBeginNo.y-this.top+"px";
                break;
            }
            case enumDirection.DOWN:{
                this.noDiv.style.left = coorBeginNo.x-this.left-8+"px";
                this.noDiv.style.top = coorBeginNo.y-this.top-16+"px";
                break;
            }
        }

        this.setPictureAlign();
        this.setPictureSize();

        if (this.arrowYes!==null){
            this.arrowYes.moveRoot();
        }

        if (this.arrowNo!==null){
            this.arrowNo.moveRoot();
        }

        //We need find all arrows, joined with this element and move these
        this.scheme.elementList.forEach((item)=>{
            if (
              item.className===enumFigure.Arrow && (item as ArrowInterface).endElement!==null && (item as ArrowInterface).endElement.id === this.id){
              (item as ArrowInterface).moveArrow();
            }
        });
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

        this.draw();
    }

    restoreArrowFromJSON(objectAsJSON:any):void{
        this._arrowYes.restoreFromJSON(objectAsJSON.arrowYes);
        this._arrowNo.restoreFromJSON(objectAsJSON.arrowNo);
    }
}
