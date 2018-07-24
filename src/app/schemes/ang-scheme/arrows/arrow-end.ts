import {enumDirection} from "../enum/enumDirection";
import {enumArrow} from "../enum/enumArrow";
import {enumFigure} from "../enum/enumFigure";
import {CoordinateXY} from "../interfaces/coordinate-xy";
import {ArrowEndInterface} from "./arrow-end-interface";
import {ArrowInterface} from "./arrow-interface";
import {Factory} from "../factory";

export class ArrowEnd implements ArrowEndInterface{

    private arrow:ArrowInterface = null;

    type:enumDirection;
    readonly className:enumArrow = enumArrow.End;

    private _arrowDiv:HTMLDivElement = null;
    private lineDiv:HTMLDivElement = null;

    top:number = 0;
    left:number = 0;
    width:number = 10;
    height:number = 10;

    get arrowDiv(): HTMLDivElement {
        return this._arrowDiv;
    }

    constructor(arrow:ArrowInterface, type:enumDirection){

        this.arrow = arrow;
        this.arrow.lineList.push(this);
        this.type = type;

        let coordinate = this.arrow.getPreviousArrowLineCoordinate(this);

        this.top    = coordinate.top;
        this.left   = coordinate.left;

        this.turn(type);
    }

    selected():void {
        Factory.createSelectedArrowBox(this,this.arrow);
    }

    draw():void{
        let arrowDiv:HTMLDivElement = this._arrowDiv;
        arrowDiv.style.top = this.top+this.arrow.scheme.topScheme+'px';
        arrowDiv.style.left = this.left+this.arrow.scheme.leftScheme+'px';
    }

    turn(type:enumDirection):void{

        if(this._arrowDiv!==null){
            this.arrow.scheme.schemeHTML.removeChild(this._arrowDiv);
        }

        this.type = type;

        switch (type) {
            case enumDirection.RIGHT:{
                this.top = this.top-Math.floor(this.height/2);
                this.left = this.left-this.width;
                break;
            }
            case enumDirection.LEFT:{
                this.top = this.top-Math.floor(this.height/2);
                break;
            }
            case enumDirection.UP:{
                this.left = this.left-Math.floor(this.width/2);
                break;
            }
            case enumDirection.DOWN:{
                this.left = this.left-Math.floor(this.width/2);
                this.top = this.top-this.height;
                break;
            }
        }

        let allLineDiv:HTMLDivElement = document.createElement("div");
        allLineDiv.setAttribute(this.arrow.scheme.classAttribute,'');
        allLineDiv.classList.add('scheme-arrow');

        allLineDiv.style.top = this.top+this.arrow.scheme.topScheme+"px";
        allLineDiv.style.left = this.left+this.arrow.scheme.leftScheme+"px";
        allLineDiv.style.width = this.width+'px';
        allLineDiv.style.height = this.height+'px';


        let lineList = this.arrow.lineList;
        if (!this.arrow.scheme.readOnly){
          allLineDiv.onclick = function(){
            if (lineList.length>0){
              lineList[lineList.length-1].selected();
            }
          };
        }

        let lineDiv:HTMLDivElement = document.createElement("div");
        lineDiv.setAttribute(this.arrow.scheme.classAttribute,'');
        let arrowDiv:HTMLDivElement = document.createElement("div");
        arrowDiv.setAttribute(this.arrow.scheme.classAttribute,'');

        let borderColor;
        if (this.arrow.endElement!==null && this.arrow.endElement.className!==enumFigure.SelectedArrowBox){
            borderColor = 'black';
        }else{
            borderColor = 'dimgray';
        }

        switch (type){
            case enumDirection.RIGHT:{

                lineDiv.classList.add("scheme-arrow-line-horizontal");
                lineDiv.style.top = '5px';
                lineDiv.style.width = '5px';

                arrowDiv.classList.add("scheme-arrow-right");
                arrowDiv.style.borderLeftColor = borderColor;

                allLineDiv.appendChild(lineDiv);
                allLineDiv.appendChild(arrowDiv);

                break;
            }

            case enumDirection.LEFT:{

                lineDiv.classList.add("scheme-arrow-line-horizontal");
                lineDiv.style.top = '5px';
                lineDiv.style.left = '5px';
                lineDiv.style.width = '5px';

                arrowDiv.classList.add("scheme-arrow-left");
                arrowDiv.style.borderRightColor = borderColor;

                allLineDiv.appendChild(lineDiv);
                allLineDiv.appendChild(arrowDiv);

                break;
            }

            case enumDirection.UP:{

                lineDiv.classList.add("scheme-arrow-line-vertical");
                lineDiv.style.top = '0px';
                lineDiv.style.left = '5px';
                lineDiv.style.height = '5px';

                arrowDiv.classList.add("scheme-arrow-top");
                arrowDiv.style.borderBottomColor = borderColor;

                allLineDiv.appendChild(arrowDiv);
                allLineDiv.appendChild(lineDiv);

                break;
            }

            case enumDirection.DOWN:{

                lineDiv.classList.add("scheme-arrow-line-vertical");
                lineDiv.style.top = '0px';
                lineDiv.style.left = '5px';
                lineDiv.style.height = '5px';

                arrowDiv.classList.add("scheme-arrow-down");
                arrowDiv.style.borderTopColor = borderColor;

                allLineDiv.appendChild(lineDiv);
                allLineDiv.appendChild(arrowDiv);

                break;
            }
        }

        this.arrow.scheme.schemeHTML.appendChild(allLineDiv);

        this._arrowDiv = allLineDiv;
        this.lineDiv = lineDiv;

        this.setBorderColor(this.arrow.borderColor);
        this.setBorderWidth(this.arrow.borderWidth);
        this.setBorderStyle(this.arrow.borderStyle);
    }

    getPointInCoordinate():CoordinateXY {

        let coordinate:CoordinateXY = {x:0,y:0};

        switch (this.type){
            case enumDirection.RIGHT:{
                coordinate = {x:this.left,y:this.top+Math.floor(this.height/2)};
                break;
            }
            case enumDirection.LEFT:{
                coordinate = {x:this.left+this.width,y:this.top+Math.floor(this.height/2)};
                break;
            }
            case enumDirection.UP:{
                coordinate = {x:this.left+Math.floor(this.width/2),y:this.top+this.height};
                break;
            }
            case enumDirection.DOWN:{
                coordinate = {x:this.left+Math.floor(this.width/2),y:this.top};
                break;
            }
        }

        return coordinate;
    }

    getPointOutCoordinate():CoordinateXY {

        let coordinate:CoordinateXY = {x:0,y:0};

        switch (this.type){
            case enumDirection.RIGHT:{
                coordinate = {x:this.left,y:this.top+Math.floor(this.height/2)};
                break;
            }
            case enumDirection.LEFT:{
                coordinate = {x:this.left+this.width,y:this.top+Math.floor(this.height/2)};
                break;
            }
            case enumDirection.UP:{
                coordinate = {x:this.left+Math.floor(this.width/2),y:this.top+this.height};
                break;
            }
            case enumDirection.DOWN:{
                coordinate = {x:this.left+Math.floor(this.width/2),y:this.top};
                break;
            }
        }

        return coordinate;
    }

    delete():void {

        this.arrow.scheme.schemeHTML.removeChild(this._arrowDiv);

        for(let i=0;i<this.arrow.lineList.length;i++){
            if (this.arrow.lineList[i]===this){
                this.arrow.lineList.splice(i,1);
                break;
            }
        }
    }

    setBorderColor(borderColor:string):void{

        if (this.type===enumDirection.RIGHT || this.type===enumDirection.LEFT){
            this.lineDiv.style.borderTopColor = borderColor;
        }else{
            this.lineDiv.style.borderLeftColor = borderColor;
        }
    }

    setBorderWidth(borderWidth:number):void{

        if (this.type===enumDirection.RIGHT || this.type===enumDirection.LEFT){
            this.lineDiv.style.borderTopWidth = borderWidth+"px";
        }else{
            this.lineDiv.style.borderLeftWidth = borderWidth+"px";
        }
    }

    setBorderStyle(borderStyle:string):void{

        if (this.type===enumDirection.RIGHT || this.type===enumDirection.LEFT){
            this.lineDiv.style.borderTopStyle = borderStyle;
        }else{
            this.lineDiv.style.borderLeftStyle = borderStyle;
        }
    }

    getAsJSON():any{

        return {

            type:this.type
            ,className:this.className

            ,top:this.top
            ,left:this.left
            ,width:this.width
            ,height:this.height
        }
    }
}
