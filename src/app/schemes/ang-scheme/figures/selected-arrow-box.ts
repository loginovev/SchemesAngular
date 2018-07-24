import {enumFigure} from "../enum/enumFigure";
import {enumDirection} from "../enum/enumDirection";
import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";
import {Utils} from "../utils";
import {ArrowEndInterface} from "../arrows/arrow-end-interface";
import {ArrowInterface} from "../arrows/arrow-interface";
import {SelectedArrowBoxInterface} from "./selected-arrow-box-interface";
import {VariantInterface} from "./switch-element-interface";
import {AllFiguresTypes} from "../types/all-figures-types";
import {AllBeginElementTypesHavingBeginPoint} from "../types/all-beginElement-types";

export class SelectedArrowBox implements SelectedArrowBoxInterface{

    id:string = '';
    readonly className:enumFigure = enumFigure.SelectedArrowBox;
    private arrow:ArrowInterface = null;

    mainBlockDiv:HTMLDivElement = null;

    previousEndElement:any = null;
    previousEndPoint:any = null;

    left:number = 0;
    top:number = 0;
    width:number = 20;
    height:number = 20;

    private direction:enumDirection = enumDirection.DEFAULT;

    private arraySelectElementForArrowLinking:Array<HTMLDivElement> = [];
    private elementListForSelecting:Array<{
        link:AllFiguresTypes,
        left:number,
        top:number,
        right:number,
        bottom:number}> = [];
    private oldSelectedBox:any = null;

    private leftScheme:number = 0;
    private topScheme:number = 0;
    private leftContainer:number = 0;
    private topContainer:number = 0;

    private coorX:number = 0;
    private coorY:number = 0;
    private lastX:number = 0;
    private lastY:number = 0;
    private removalX:number = 0;
    private removalY:number = 0;

    constructor(arrowEnd:ArrowEndInterface, arrow:ArrowInterface){

        this.arrow = arrow;

        this.left = arrowEnd.left-this.width/4;
        this.top = arrowEnd.top-this.height/4;

        this.arrow.endElement = this;
        this.arrow.endPoint = 1;

        this.leftScheme = this.arrow.scheme.leftScheme;
        this.topScheme = this.arrow.scheme.topScheme;
        this.leftContainer = this.arrow.scheme.leftContainer;
        this.topContainer = this.arrow.scheme.topContainer;

        //let beginElement:AllBeginElementTypesHavingBeginPoint = (arrow.beginElement as AllBeginElementTypesHavingBeginPoint);
        //if (beginElement.className===enumFigure.Variant){
        //    beginElement = (beginElement as VariantInterface).switchElement;
        //}

        this.arrow.scheme.elementList.forEach((element:AllFiguresTypes)=>{
            if (
                element.className!==enumFigure.Arrow
                && element.className!==enumFigure.SceneryElement
                && element!==this.arrow.beginElement
            ){
                this.elementListForSelecting.push({
                    link:element,
                    left:element.left,
                    top:element.top,
                    right:element.left+element.width,
                    bottom:element.top+element.height
                })
            }
        });

        this.mainBlockDiv = document.createElement('div');
        this.mainBlockDiv.setAttribute(this.arrow.scheme.classAttribute,'');
        this.mainBlockDiv.classList.add("scheme-arrow-selected");

        this.arrow.scheme.schemeHTML.appendChild(this.mainBlockDiv);

        let schemeMouseDown:boolean = false;
        let schemeOffsetLeft:number = 0;
        let schemeOffsetTop:number = 0;

        let currentThis:SelectedArrowBox = this;
        let greedStep:number = this.arrow.scheme.greedStep;

        let schemeBox = {
            left:this.leftScheme
            ,right:this.leftScheme+arrow.scheme.widthScheme
            ,top:this.topScheme
            ,bottom:this.topScheme+arrow.scheme.heightScheme
        };

        this.mainBlockDiv.onmousedown = function(event){

            schemeMouseDown=true;

            currentThis.oldSelectedBox = currentThis.mainBlockDiv.getBoundingClientRect();
            schemeOffsetLeft = event.clientX - currentThis.oldSelectedBox.left + currentThis.leftContainer;
            schemeOffsetTop = event.clientY - currentThis.oldSelectedBox.top + currentThis.topContainer;

            return false;
        };

        this.mainBlockDiv.onmousemove = function(event) {

            if (schemeMouseDown && event.which == 1 && schemeBox !== null) {

                if (Math.floor((event.clientX - schemeOffsetLeft)/greedStep)*greedStep!==currentThis.coorX
                    || Math.floor((event.clientY - schemeOffsetTop)/greedStep)*greedStep!==currentThis.coorY
                ){

                    currentThis.coorX = Math.floor((event.clientX - schemeOffsetLeft)/greedStep)*greedStep;
                    currentThis.coorY = Math.floor((event.clientY - schemeOffsetTop)/greedStep)*greedStep;

                    if ((currentThis.coorX > schemeBox.left && currentThis.coorX + currentThis.oldSelectedBox.width < schemeBox.right) &&
                        (currentThis.coorY > schemeBox.top && currentThis.coorY + currentThis.oldSelectedBox.height < schemeBox.bottom)) {

                        currentThis.mainBlockDiv.style.left = currentThis.coorX+'px';
                        currentThis.mainBlockDiv.style.top = currentThis.coorY+'px';

                        if (currentThis.lastX!==0 || currentThis.lastY!==0){
                            currentThis.removalX = Math.abs(currentThis.coorX - currentThis.lastX);
                            currentThis.removalY = Math.abs(currentThis.coorY - currentThis.lastY);

                            if (currentThis.removalX > greedStep || currentThis.removalY > greedStep){
                                currentThis.move(currentThis.coorX, currentThis.coorY);

                                currentThis.lastX = currentThis.coorX;
                                currentThis.lastY = currentThis.coorY;
                            }
                        }else{
                            currentThis.lastX = currentThis.coorX;
                            currentThis.lastY = currentThis.coorY;
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

    selectElementForArrowLinkingOrLink(element:any):void {

        let coordinate;
        if (element.getPointCoordinate!==undefined){

            for (let i=1;i<=4;i++){
                coordinate = element.getPointCoordinate(i);
                if (coordinate.direction!==enumDirection.DEFAULT){

                    if (
                        coordinate.x>=this.left+this.width/4 && coordinate.x<=this.left+this.width*3/4 &&
                        coordinate.y>=this.top+this.height/4 && coordinate.y<=this.top+this.height*3/4
                    ){
                        this.arrow.endElement = element;
                        this.arrow.endPoint = i;
                        this.arrow.moveArrow();
                        this.unselected();
                        break;
                    }else{
                        let selectBlockDiv:HTMLDivElement = document.createElement('div');
                        selectBlockDiv.setAttribute(this.arrow.scheme.classAttribute,'');
                        selectBlockDiv.classList.add("scheme-element-selected-link");
                        selectBlockDiv.style.left = coordinate.x+this.leftScheme-2+'px';
                        selectBlockDiv.style.top = coordinate.y+this.topScheme-2+'px';
                        this.arrow.scheme.schemeHTML.appendChild(selectBlockDiv);

                        this.arraySelectElementForArrowLinking.push(selectBlockDiv);
                    }

                }
            }
        }
    }

    unselected():void {

        this.arraySelectElementForArrowLinking.forEach((item)=>{
            this.arrow.scheme.schemeHTML.removeChild(item);
        });
        this.arraySelectElementForArrowLinking = [];

        Utils.deleteElement(this.arrow.scheme,this);
    }

    move(coordinateX:number,coordinateY:number):void{

        this.left   = coordinateX-this.leftScheme;
        this.top    = coordinateY-this.topScheme;

        let direction:enumDirection = enumDirection.DEFAULT;
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

    selectNextElement():void{

        this.arraySelectElementForArrowLinking.forEach((item)=>{
            this.arrow.scheme.schemeHTML.removeChild(item);
        });
        this.arraySelectElementForArrowLinking = [];

        let left:number = this.left;
        let top:number = this.top;
        let right:number = left+this.width;
        let bottom:number = top+this.height;

        let element;
        if (this.previousEndElement!==null){
            element = this.previousEndElement;
            if (
                !(
                    (left>=element.left && left<=element.left+element.width || right>=element.left && right<=element.left+element.width) &&
                    (top>=element.top && top<=element.top+element.height || bottom>=element.top && bottom<=element.top+element.height)
                )
            ){
                this.previousEndElement=null;
                this.previousEndPoint = 0;
            }
        }else{
            this.elementListForSelecting.forEach((element)=>{
                if (
                    (left>=element.left && left<=element.right || right>=element.left && right<=element.right) &&
                    (top>=element.top && top<=element.bottom || bottom>=element.top && bottom<=element.bottom)
                ){
                    this.selectElementForArrowLinkingOrLink(element.link);
                }
            })
        }
    }

    getPointCoordinate(point:number):CoordinateXYArrowDirection {

        let coordinate:CoordinateXYArrowDirection = {x:0,y:0,direction:enumDirection.DEFAULT,arrowDirection:enumDirection.DEFAULT};

        coordinate.x = this.left+this.width/2;
        coordinate.y = this.top+this.height/2;
        coordinate.direction = this.direction;
        coordinate.arrowDirection = this.direction;

        return coordinate;
    }

    draw():void{
        this.mainBlockDiv.style.left = this.left+this.leftScheme+'px';
        this.mainBlockDiv.style.top = this.top+this.topScheme+'px';
        this.mainBlockDiv.style.width = this.width+'px';
        this.mainBlockDiv.style.height = this.height+'px';
    }
}
