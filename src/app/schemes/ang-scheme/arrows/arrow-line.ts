import {enumDirection} from "../enum/enumDirection";
import {enumArrow} from "../enum/enumArrow";
import {CoordinateXY} from "../interfaces/coordinate-xy";
import {CoordinateDirection} from "../interfaces/coordinate-direction";
import {ArrowLineInterface} from "./arrow-line-interface";
import {ArrowInterface} from "./arrow-interface";

export class ArrowLine implements ArrowLineInterface{

    private arrow:ArrowInterface = null;

    type:enumDirection;
    readonly className = enumArrow.Line;

    private _arrowDiv:HTMLDivElement = null;

    top:number = 0;
    left:number = 0;
    width:number = 0;
    height:number = 0;

    selectDiv:HTMLDivElement = null;

    get arrowDiv(): HTMLDivElement {
        return this._arrowDiv;
    }

    constructor(arrow:ArrowInterface, type:enumDirection, position?:number){

        this.arrow = arrow;

        if (position!==undefined){
            arrow.lineList.splice(position,0,this);
        }else{
            arrow.lineList.push(this);
        }

        this.type = type;

        this.setCoordinate(this.arrow.getPreviousArrowLineCoordinate(this));

        let line:HTMLDivElement = document.createElement("div");
        line.setAttribute(this.arrow.scheme.classAttribute,'');

        if (type===enumDirection.RIGHT || type===enumDirection.LEFT){
            line.classList.add("scheme-line-horizontal");
        }else{
            line.classList.add("scheme-line-vertical");
        }

        if (!this.arrow.scheme.readOnly){
          let currentThis = this;
          line.onclick = function(){
            currentThis.selected();
          };
        }

        this.arrow.scheme.schemeHTML.appendChild(line);

        this._arrowDiv = line;

        this.setBorderColor(this.arrow.borderColor);
        this.setBorderWidth(this.arrow.borderWidth);
        this.setBorderStyle(this.arrow.borderStyle);

        this.draw();
    }

    setCoordinate(coordinate:CoordinateDirection):void{

        switch (this.type){
            case enumDirection.RIGHT:
            case enumDirection.DOWN:
            {
                this.top    = coordinate.top;
                this.left   = coordinate.left;
                break;
            }
            case enumDirection.LEFT:{
                this.top    = coordinate.top;
                this.left   = coordinate.left-this.width;
                break;
            }
            case enumDirection.UP:{
                this.top    = coordinate.top-this.height;
                this.left   = coordinate.left;
                break;
            }
        }
    }

    selected():void{
        this.arrow.currentDraw();
    }

    draw():void{
        let arrowDiv:HTMLDivElement = this._arrowDiv;

        arrowDiv.style.top = this.top+this.arrow.scheme.topScheme+'px';
        arrowDiv.style.left = this.left+this.arrow.scheme.leftScheme+'px';
        arrowDiv.style.width = this.width+'px';
        arrowDiv.style.height = this.height+'px';
    }

    getPointInCoordinate():CoordinateXY {

        let coordinate:CoordinateXY = {x:0,y:0};

        switch (this.type){
            case enumDirection.RIGHT:{
                coordinate = {x:this.left,y:this.top};
                break;
            }
            case enumDirection.LEFT:{
                coordinate = {x:this.left,y:this.top};
                break;
            }
            case enumDirection.UP:{
                coordinate = {x:this.left,y:this.top+this.height};
                break;
            }
            case enumDirection.DOWN:{
                coordinate = {x:this.left,y:this.top};
                break;
            }
        }

        return coordinate;
    }

    getPointOutCoordinate():CoordinateXY {

        let coordinate:CoordinateXY = {x:0,y:0};

        switch (this.type){
            case enumDirection.RIGHT:{
                coordinate = {x:this.left+this.width,y:this.top};
                break;
            }
            case enumDirection.LEFT:{
                coordinate = {x:this.left,y:this.top};
                break;
            }
            case enumDirection.UP:{
                coordinate = {x:this.left,y:this.top};
                break;
            }
            case enumDirection.DOWN:{
                coordinate = {x:this.left,y:this.top+this.height};
                break;
            }
        }

        return coordinate;
    }

    delete():void {

        if (this.selectDiv!==null){
            this.arrow.scheme.schemeHTML.removeChild(this.selectDiv);
        }

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
            this._arrowDiv.style.borderTopColor = borderColor;
        }else{
            this._arrowDiv.style.borderLeftColor = borderColor;
        }
    }

    setBorderWidth(borderWidth:number):void{

        if (this.type===enumDirection.RIGHT || this.type===enumDirection.LEFT){
            this._arrowDiv.style.borderTopWidth = borderWidth+"px";
        }else{
            this._arrowDiv.style.borderLeftWidth = borderWidth+"px";
        }
    }

    setBorderStyle(borderStyle:string):void{

        if (this.type===enumDirection.RIGHT || this.type===enumDirection.LEFT){
            this._arrowDiv.style.borderTopStyle = borderStyle;
        }else{
            this._arrowDiv.style.borderLeftStyle = borderStyle;
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
