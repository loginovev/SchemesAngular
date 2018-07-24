import {Figure} from "./figure";
import {enumFigure} from "../enum/enumFigure";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {EndElementInterface} from "./end-element-interface";
import {SchemeInterface} from "../scheme-interface";
import {ArrowInterface} from "../arrows/arrow-interface";

export class EndElement extends Figure implements EndElementInterface{

    private mainCanvas:HTMLCanvasElement = null;

    constructor(
        scheme:SchemeInterface
        ,title:string
        ,objectAsJSON?:any
    ){
        super(
            scheme
            ,title
            ,enumFigure.EndElement
            ,objectAsJSON
        );

        this.mainBlockDiv.classList.add("scheme-end-element");

        this.mainCanvas = document.createElement('canvas');
        this.mainCanvas.setAttribute(this.scheme.classAttribute,'');
        this.mainCanvas.classList.add('main-canvas');
        this.mainCanvas.width = this.width;
        this.mainCanvas.height = this.height;
        this.mainBlockDiv.appendChild(this.mainCanvas);

        if (objectAsJSON===undefined){
            this.left = 0;
            this.top = 0;
            this.width = 40;
            this.height = 40;

            this.backgroundColor = "#BAEFEB";
            this.borderColor = "#696969";
            this.borderWidth = 1;
            this.borderStyle = "solid";

            this.setProperties(this.getProperties());
        }else{
            this.setProperties(this.getProperties());
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
        this.editableTitleDiv.style.paddingTop = this.height/2+'px';

        let shadowOffsetX:number = 5;
        let shadowOffsetY:number = 5;
        let shadowBlur:number = 10;

        let mainCanvas = this.mainCanvas;
        mainCanvas.width = this.width+shadowOffsetX+shadowBlur/4;
        mainCanvas.height = this.height+shadowOffsetY+shadowBlur/4;

        if (mainCanvas.getContext){
            let ctx = mainCanvas.getContext('2d');

            let width = this.width-this.borderWidth/2;
            let height = this.height-this.borderWidth/2;
            let top = this.borderWidth/2;
            let left = this.borderWidth/2;

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
            ctx.moveTo((left+width)/2,top);
            ctx.lineTo(width,width/3);
            ctx.lineTo(width,height);
            ctx.lineTo(left,height);
            ctx.lineTo(left,width/3);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }

        this.setPictureAlign();
        this.setPictureSize();

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
}
