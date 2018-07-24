import {enumArrow} from "../enum/enumArrow";
import {enumArrowCurveType} from "../enum/enumArrowCurveType";
import {CoordinateDirection} from "../interfaces/coordinate-direction";
import {CoordinateXY} from "../interfaces/coordinate-xy";
import {ArrowCurveInterface} from "./arrow-curve-interface";
import {ArrowInterface} from "./arrow-interface";

export class ArrowCurve implements ArrowCurveInterface{

    private arrow:ArrowInterface = null;

    type:enumArrowCurveType;
    readonly className:enumArrow = enumArrow.Curve;

    private _arrowDiv:HTMLDivElement = null;

    top:number = 0;
    left:number = 0;
    width:number = 5;
    height:number = 5;

    get arrowDiv(): HTMLDivElement {
        return this._arrowDiv;
    }

    constructor(arrow:ArrowInterface, type:enumArrowCurveType, position?:number){

        this.arrow = arrow;
        this.type = type;

        if (position!==undefined){
            this.arrow.lineList.splice(position,0,this);
        }else{
            this.arrow.lineList.push(this);
        }

        this.setCoordinate(this.arrow.getPreviousArrowLineCoordinate(this));

        let line:HTMLDivElement = document.createElement("div");
        line.setAttribute(this.arrow.scheme.classAttribute,'');
        line.classList.add("scheme-curve-"+ArrowCurve.getStringType(type));
        this.arrow.scheme.schemeHTML.appendChild(line);
        this._arrowDiv = line;

        this.setBorderColor(this.arrow.borderColor);
        this.setBorderWidth(this.arrow.borderWidth);
        this.setBorderStyle(this.arrow.borderStyle);

        this.draw();
    }

    setCoordinate(coordinate:CoordinateDirection):void{

        switch (this.type){
            case enumArrowCurveType.DOWN_RIGHT:{
                this.left   = coordinate.left;
                this.top    = coordinate.top;
                break;
            }
            case enumArrowCurveType.UP_RIGHT:{
                this.left   = coordinate.left;
                this.top    = coordinate.top-this.height;
                break;
            }
            case enumArrowCurveType.RIGHT_DOWN:{
                this.left   = coordinate.left;
                this.top    = coordinate.top;
                break;
            }
            case enumArrowCurveType.RIGHT_UP:{
                this.left   = coordinate.left;
                this.top    = coordinate.top-this.height;
                break;
            }
            case enumArrowCurveType.UP_LEFT:{
                this.left   = coordinate.left-this.width;
                this.top    = coordinate.top-this.height;
                break;
            }
            case enumArrowCurveType.DOWN_LEFT:{
                this.left   = coordinate.left-this.width;
                this.top    = coordinate.top;
                break;
            }
            case enumArrowCurveType.LEFT_UP:{
                this.left   = coordinate.left-this.width;
                this.top    = coordinate.top-this.height;
                break;
            }
            case enumArrowCurveType.LEFT_DOWN:{
                this.left   = coordinate.left-this.width;
                this.top    = coordinate.top;
                break;
            }
        }
    }

    draw():void{
        let arrowDiv = this._arrowDiv;

        arrowDiv.style.top = this.top+this.arrow.scheme.topScheme+'px';
        arrowDiv.style.left = this.left+this.arrow.scheme.leftScheme+'px';
        arrowDiv.style.width = this.width+"px";
        arrowDiv.style.height = this.height+"px";
    };

    getPointInCoordinate():CoordinateXY {

        let coordinate = {x:0,y:0};

        switch (this.type){
            case enumArrowCurveType.RIGHT_DOWN:{
                coordinate.x = this.left;
                coordinate.y = this.top;
                break;
            }
            case enumArrowCurveType.RIGHT_UP:{
                coordinate.x = this.left;
                coordinate.y = this.top+this.height;
                break;
            }
            case enumArrowCurveType.LEFT_DOWN:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top;
                break;
            }
            case enumArrowCurveType.LEFT_UP:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top+this.width;
                break;
            }
            case enumArrowCurveType.UP_LEFT:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top+this.height;
                break;
            }
            case enumArrowCurveType.DOWN_LEFT:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top;
                break;
            }
            case enumArrowCurveType.UP_RIGHT:{
                coordinate.x = this.left;
                coordinate.y = this.top+this.height;
                break;
            }
            case enumArrowCurveType.DOWN_RIGHT:{
                coordinate.x = this.left;
                coordinate.y = this.top;
                break;
            }
        }
        return coordinate;
    };

    getPointOutCoordinate():CoordinateXY {

        let coordinate:CoordinateXY = {x:0,y:0};

        switch (this.type){
            case enumArrowCurveType.RIGHT_DOWN:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top+this.height;
                break;
            }
            case enumArrowCurveType.RIGHT_UP:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top;
                break;
            }
            case enumArrowCurveType.LEFT_DOWN:{
                coordinate.x = this.left;
                coordinate.y = this.top+this.height;
                break;
            }
            case enumArrowCurveType.LEFT_UP:{
                coordinate.x = this.left;
                coordinate.y = this.top;
                break;
            }
            case enumArrowCurveType.UP_LEFT:{
                coordinate.x = this.left;
                coordinate.y = this.top;
                break;
            }
            case enumArrowCurveType.DOWN_LEFT:{
                coordinate.x = this.left;
                coordinate.y = this.top+this.height;
                break;
            }
            case enumArrowCurveType.UP_RIGHT:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top;
                break;
            }
            case enumArrowCurveType.DOWN_RIGHT:{
                coordinate.x = this.left+this.width;
                coordinate.y = this.top+this.height;
                break;
            }
        }

        return coordinate;
    };

    delete():void{

        this.arrow.scheme.schemeHTML.removeChild(this._arrowDiv);

        let currentPosition=0;
        for(let i=0;i<this.arrow.lineList.length;i++){
            if (this.arrow.lineList[i]===this){
                currentPosition=i;
                break;
            }
        }
        this.arrow.lineList.splice(currentPosition,1);
    };

    setBorderColor(borderColor:string):void{

        switch (this.type){
            case enumArrowCurveType.DOWN_RIGHT:{
                this._arrowDiv.style.borderBottomColor = borderColor;
                this._arrowDiv.style.borderLeftColor = borderColor;
                break;
            }
            case enumArrowCurveType.UP_RIGHT:{
                this._arrowDiv.style.borderTopColor = borderColor;
                this._arrowDiv.style.borderLeftColor = borderColor;
                break;
            }
            case enumArrowCurveType.RIGHT_DOWN:{
                this._arrowDiv.style.borderTopColor = borderColor;
                this._arrowDiv.style.borderRightColor = borderColor;
                break;
            }
            case enumArrowCurveType.RIGHT_UP:{
                this._arrowDiv.style.borderBottomColor = borderColor;
                this._arrowDiv.style.borderRightColor = borderColor;
                break;
            }
            case enumArrowCurveType.UP_LEFT:{
                this._arrowDiv.style.borderTopColor = borderColor;
                this._arrowDiv.style.borderRightColor = borderColor;
                break;
            }
            case enumArrowCurveType.DOWN_LEFT:{
                this._arrowDiv.style.borderBottomColor = borderColor;
                this._arrowDiv.style.borderRightColor = borderColor;
                break;
            }
            case enumArrowCurveType.LEFT_UP:{
                this._arrowDiv.style.borderBottomColor = borderColor;
                this._arrowDiv.style.borderLeftColor = borderColor;
                break;
            }
            case enumArrowCurveType.LEFT_DOWN:{
                this._arrowDiv.style.borderTopColor = borderColor;
                this._arrowDiv.style.borderLeftColor = borderColor;
                break;
            }
        }
    }

    setBorderWidth(borderWidth:number):void{

        switch (this.type){
            case enumArrowCurveType.DOWN_RIGHT:{
                this._arrowDiv.style.borderBottomWidth = borderWidth+"px";
                this._arrowDiv.style.borderLeftWidth = borderWidth+"px";
                break;
            }
            case enumArrowCurveType.UP_RIGHT:{
                this._arrowDiv.style.borderTopWidth = borderWidth+"px";
                this._arrowDiv.style.borderLeftWidth = borderWidth+"px";
                break;
            }
            case enumArrowCurveType.RIGHT_DOWN:{
                this._arrowDiv.style.borderTopWidth = borderWidth+"px";
                this._arrowDiv.style.borderRightWidth = borderWidth+"px";
                break;
            }
            case enumArrowCurveType.RIGHT_UP:{
                this._arrowDiv.style.borderBottomWidth = borderWidth+"px";
                this._arrowDiv.style.borderRightWidth = borderWidth+"px";
                break;
            }
            case enumArrowCurveType.UP_LEFT:{
                this._arrowDiv.style.borderTopWidth = borderWidth+"px";
                this._arrowDiv.style.borderRightWidth = borderWidth+"px";
                break;
            }
            case enumArrowCurveType.DOWN_LEFT:{
                this._arrowDiv.style.borderBottomWidth = borderWidth+"px";
                this._arrowDiv.style.borderRightWidth = borderWidth+"px";
                break;
            }
            case enumArrowCurveType.LEFT_UP:{
                this._arrowDiv.style.borderBottomWidth = borderWidth+"px";
                this._arrowDiv.style.borderLeftWidth = borderWidth+"px";
                break;
            }
            case enumArrowCurveType.LEFT_DOWN:{
                this._arrowDiv.style.borderTopWidth = borderWidth+"px";
                this._arrowDiv.style.borderLeftWidth = borderWidth+"px";
                break;
            }
        }
    }

    setBorderStyle(borderStyle:string):void{

        switch (this.type){
            case enumArrowCurveType.DOWN_RIGHT:{
                this._arrowDiv.style.borderBottomStyle = borderStyle;
                this._arrowDiv.style.borderLeftStyle = borderStyle;
                break;
            }
            case enumArrowCurveType.UP_RIGHT:{
                this._arrowDiv.style.borderTopStyle = borderStyle;
                this._arrowDiv.style.borderLeftStyle = borderStyle;
                break;
            }
            case enumArrowCurveType.RIGHT_DOWN:{
                this._arrowDiv.style.borderTopStyle = borderStyle;
                this._arrowDiv.style.borderRightStyle = borderStyle;
                break;
            }
            case enumArrowCurveType.RIGHT_UP:{
                this._arrowDiv.style.borderBottomStyle = borderStyle;
                this._arrowDiv.style.borderRightStyle = borderStyle;
                break;
            }
            case enumArrowCurveType.UP_LEFT:{
                this._arrowDiv.style.borderTopStyle = borderStyle;
                this._arrowDiv.style.borderRightStyle = borderStyle;
                break;
            }
            case enumArrowCurveType.DOWN_LEFT:{
                this._arrowDiv.style.borderBottomStyle = borderStyle;
                this._arrowDiv.style.borderRightStyle = borderStyle;
                break;
            }
            case enumArrowCurveType.LEFT_UP:{
                this._arrowDiv.style.borderBottomStyle = borderStyle;
                this._arrowDiv.style.borderLeftStyle = borderStyle;
                break;
            }
            case enumArrowCurveType.LEFT_DOWN:{
                this._arrowDiv.style.borderTopStyle = borderStyle;
                this._arrowDiv.style.borderLeftStyle = borderStyle;
                break;
            }
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

    static getStringType(type:enumArrowCurveType):string{

        switch (type){
            case enumArrowCurveType.DOWN_LEFT:{
                return "down-left";
            }
            case enumArrowCurveType.DOWN_RIGHT:{
                return "down-right";
            }
            case enumArrowCurveType.LEFT_DOWN:{
                return "left-down";
            }
            case enumArrowCurveType.LEFT_UP:{
                return "left-up";
            }
            case enumArrowCurveType.RIGHT_DOWN:{
                return "right-down";
            }
            case enumArrowCurveType.RIGHT_UP:{
                return "right-up";
            }
            case enumArrowCurveType.UP_LEFT:{
                return "up-left";
            }
            case enumArrowCurveType.UP_RIGHT:{
                return "up-right";
            }
        }
    }
}
