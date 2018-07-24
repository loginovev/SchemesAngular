import {enumFigure} from "../enum/enumFigure";
import {enumDirection} from "../enum/enumDirection";

import {CoordinateXY} from "../interfaces/coordinate-xy";
import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";
import {ArrowInterface} from "../arrows/arrow-interface";
import {SelectedBeginArrowBoxInterface} from "./selected-begin-arrow-box-interface";
import {ConditionElementInterface} from "./condition-element-interface";
import {AllBeginElementTypesHavingBeginPoint} from "../types/all-beginElement-types";

export class SelectedBeginArrowBox implements SelectedBeginArrowBoxInterface{

    id:string = '';
    readonly className:enumFigure = enumFigure.SelectedBeginArrowBox;

    private arrow:ArrowInterface;
    private previousBeginElement:any = null;
    private previousBeginPoint:number = 0;

    private width:number = 0;
    private height:number = 0;
    private left:number = 0;
    private top:number = 0;

    private leftScheme:number = 0;
    private topScheme:number = 0;
    private leftContainer:number = 0;
    private topContainer:number = 0;

    private coorX:number = 0;
    private coorY:number = 0;

    private removalX:number = 0;
    private removalY:number = 0;

    private mainBlockDiv:HTMLDivElement = null;

    private direction:enumDirection = enumDirection.DEFAULT;

    private arraySelectElementForArrowLinking:Array<{
        blockDiv:HTMLDivElement,
        x:number,
        y:number}> = [];

    private oldSelectedBox:any;


    constructor(arrow:ArrowInterface,coordinateBeginPoint:CoordinateXY){

        this.arrow = arrow;

        this.previousBeginElement = arrow.beginElement;
        this.previousBeginPoint = arrow.beginPoint;
        arrow.beginElement = this;
        arrow.beginPoint = 1;

        this.width = 20;
        this.height = 20;
        this.left = coordinateBeginPoint.x-this.width/2;
        this.top = coordinateBeginPoint.y-this.height/2;

        this.leftScheme = this.arrow.scheme.leftScheme;
        this.topScheme = this.arrow.scheme.topScheme;
        this.leftContainer = this.arrow.scheme.leftContainer;
        this.topContainer = this.arrow.scheme.topContainer;

        this.mainBlockDiv = document.createElement("div");
        this.mainBlockDiv.setAttribute(arrow.scheme.classAttribute,'');
        this.mainBlockDiv.classList.add("scheme-arrow-selected");

        this.arrow.scheme.schemeHTML.appendChild(this.mainBlockDiv);

        let coordinate;
        for (let beginPoint=1;beginPoint<=4;beginPoint++){
            coordinate = this.previousBeginElement.getBeginPointCoordinate(beginPoint);
            if (coordinate.direction!==enumDirection.DEFAULT){

                let selectBlockDiv:HTMLDivElement = document.createElement("div");
                selectBlockDiv.setAttribute(arrow.scheme.classAttribute,'');
                selectBlockDiv.classList.add("scheme-element-selected-link");
                selectBlockDiv.style.left = coordinate.x+this.leftScheme-2+'px';
                selectBlockDiv.style.top = coordinate.y+this.topScheme-2+'px';
                this.arrow.scheme.schemeHTML.appendChild(selectBlockDiv);

                this.arraySelectElementForArrowLinking.push({
                    blockDiv:selectBlockDiv,
                    x:coordinate.x,
                    y:coordinate.y
                });
            }
        }

        let schemeMouseDown = false;
        let schemeOffsetLeft = 0;
        let schemeOffsetTop = 0;

        let currentThis = this;
        let greedStep:number = this.arrow.scheme.greedStep;
        let schemeBox = {
            left    : this.leftScheme,
            right   : this.leftScheme+this.arrow.scheme.widthScheme,
            top     : this.topScheme,
            bottom  : this.topScheme+this.arrow.scheme.heightScheme
        };

        let lastX = 0;
        let lastY = 0;

        this.mainBlockDiv.onmousedown = function(event){

            schemeMouseDown=true;

            currentThis.oldSelectedBox = currentThis.mainBlockDiv.getBoundingClientRect();
            schemeOffsetLeft = event.clientX - currentThis.oldSelectedBox.left + currentThis.leftContainer;
            schemeOffsetTop = event.clientY - currentThis.oldSelectedBox.top + currentThis.topContainer;

            return false;
        };

        this.mainBlockDiv.onmousemove = function(event) {

            if (schemeMouseDown && event.which == 1 && schemeBox != null) {

                if (Math.floor((event.clientX - schemeOffsetLeft)/greedStep)*greedStep!==currentThis.coorX
                    || Math.floor((event.clientY - schemeOffsetTop)/greedStep)*greedStep!==currentThis.coorY
                ) {

                    currentThis.coorX = Math.floor((event.clientX - schemeOffsetLeft) / greedStep) * greedStep;
                    currentThis.coorY = Math.floor((event.clientY - schemeOffsetTop) / greedStep) * greedStep;


                    let coorX = currentThis.coorX;
                    let coorY = currentThis.coorY;

                    if ((coorX > schemeBox.left && coorX + currentThis.oldSelectedBox.width < schemeBox.right) &&
                        (coorY > schemeBox.top && coorY + currentThis.oldSelectedBox.height < schemeBox.bottom)) {

                        currentThis.mainBlockDiv.style.left = coorX + 'px';
                        currentThis.mainBlockDiv.style.top = coorY + 'px';

                        if (lastX != 0 || lastY != 0) {
                            currentThis.removalX = Math.abs(coorX - lastX);
                            currentThis.removalY = Math.abs(coorY - lastY);

                            if (currentThis.removalX > 0 || currentThis.removalY > 0) {

                                currentThis.move(coorX, coorY);

                                lastX = coorX;
                                lastY = coorY;
                            }
                        } else {
                            lastX = coorX;
                            lastY = coorY;
                        }
                    }
                }
            }
        };

        this.mainBlockDiv.onmouseup = function(){
            schemeMouseDown = false;
            currentThis.unselected();
        };
        this.mainBlockDiv.onmouseout = function(){
            schemeMouseDown=false;
            currentThis.unselected();
        };

        this.draw();
    }

    unselected():void {
        this.delete();
    }

    move(coordinateX:number,coordinateY:number):void{

        this.left   = coordinateX-this.leftScheme;
        this.top    = coordinateY-this.topScheme;

        let direction = enumDirection.DEFAULT;
        if (this.removalX>=this.removalY){
            if (this.coorX < this.oldSelectedBox.left) {
                direction = enumDirection.LEFT;
            }else{
                direction = enumDirection.RIGHT;
            }
        }else{
            if (this.coorY < this.oldSelectedBox.top) {
                direction = enumDirection.UP;
            }else{
                direction = enumDirection.DOWN;
            }
        }

        this.direction = direction;
        this.arrow.moveArrow();
        this.selectNextElement();
    }

    selectNextElement():void {

        let left:number = this.left+this.width/4;
        let top:number = this.top+this.height/4;
        let right:number = this.left+this.width*3/4;
        let bottom:number = this.top+this.height*3/4;

        let element;

        element = this.arraySelectElementForArrowLinking[this.previousBeginPoint-1];
        if (!(left<=element.x && right>=element.x && top<=element.y && bottom>=element.y)){

            for (let i=0;i<this.arraySelectElementForArrowLinking.length;i++){
                element = this.arraySelectElementForArrowLinking[i];

                if (left<=element.x && right>=element.x && top<=element.y && bottom>=element.y){
                    this.previousBeginPoint = i+1;
                    this.delete();
                    break;
                }
            }
        }
    }

    getPointCoordinate(point:number):CoordinateXYArrowDirection {

        return {
            x:this.left+this.width/2,
            y:this.top+this.height/2,
            direction:this.direction,
            arrowDirection:this.direction
        };
    }

    getBeginPointCoordinate(point:number):CoordinateXYArrowDirection {

        return {
            x:this.left+this.width/2,
            y:this.top+this.height/2,
            direction:this.direction,
            arrowDirection:this.direction
        };
    }

    draw():void {
        let mainBlockDiv = this.mainBlockDiv;
        mainBlockDiv.style.left = this.left+this.leftScheme+'px';
        mainBlockDiv.style.top = this.top+this.topScheme+'px';
        mainBlockDiv.style.width = this.width+'px';
        mainBlockDiv.style.height = this.height+'px';
    }

    delete():void {

        if (this.mainBlockDiv!==null){
            this.arrow.scheme.schemeHTML.removeChild(this.mainBlockDiv);
        }

        this.arraySelectElementForArrowLinking.forEach((item)=>{
            this.arrow.scheme.schemeHTML.removeChild(item.blockDiv);
        });
        this.arraySelectElementForArrowLinking = [];

        this.arrow.beginElement = this.previousBeginElement;
        this.arrow.beginPoint = this.previousBeginPoint;


        if (this.arrow.beginElement.className===enumFigure.ConditionElement){

            if ((this.arrow.beginElement as ConditionElementInterface).arrowYes===this.arrow){
              (this.arrow.beginElement as ConditionElementInterface).beginPointYes = this.arrow.beginPoint;
            }
            if ((this.arrow.beginElement as ConditionElementInterface).arrowNo===this.arrow){
              (this.arrow.beginElement as ConditionElementInterface).beginPointNo = this.arrow.beginPoint;
            }

            (this.arrow.beginElement as ConditionElementInterface).draw();
        }else{
          (this.arrow.beginElement as AllBeginElementTypesHavingBeginPoint).beginPoint = this.arrow.beginPoint;
        }

        this.arrow.moveRoot();
    }
}
