import {enumFigure} from "../enum/enumFigure";
import {enumDirection} from "../enum/enumDirection";
import {enumArrow} from "../enum/enumArrow";
import {enumArrowCurveType} from "../enum/enumArrowCurveType";

import {CoordinateDirection} from "../interfaces/coordinate-direction";
import {CoordinateXY} from "../interfaces/coordinate-xy";
import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";
import {PropertiesInterface} from "../interfaces/properties-interface";

import {AllFiguresTypes} from "../types/all-figures-types";
import {AllArrowsTypes} from "../types/all-arrows-types";

import {ArrowEndInterface} from "./arrow-end-interface";
import {ArrowCurveInterface} from "./arrow-curve-interface";
import {ArrowLineInterface} from "./arrow-line-interface";
import {ArrowInterface} from "./arrow-interface";
import {SchemeInterface} from "../scheme-interface";

import {Factory} from "../factory";
import {Utils} from "../utils";
import {AllBeginElementTypes} from "../types/all-beginElement-types";
import {AllEndElementTypes} from "../types/all-endElement-types";

export class Arrow implements ArrowInterface{

    private _id:string = '';
    private _name:string = '';
    private _number:number = 0;

    readonly className:enumFigure = enumFigure.Arrow;
    private _scheme:SchemeInterface;

    private _beginElement:AllBeginElementTypes;
    private _beginPoint:number;
    private _endElement:AllEndElementTypes;
    private _endPoint:number;

    private _beginDiv:HTMLDivElement = null;

    private _lineList:Array<any> = [];
    private path:Array<CoordinateXY> = [];

    borderColor:string = "dimgray";
    borderWidth:number = 1;
    borderStyle:string = "solid";

    selected:boolean = false;

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get number(): number {
        return this._number;
    }

    get scheme(): SchemeInterface {
        return this._scheme;
    }

    get lineList(): Array<any> {
        return this._lineList;
    }

    get beginElement(): AllBeginElementTypes {
        return this._beginElement;
    }

    get beginPoint(): any {
        return this._beginPoint;
    }

    get endElement(): AllEndElementTypes {
        return this._endElement;
    }

    get endPoint(): any {
        return this._endPoint;
    }

    get beginDiv(): HTMLDivElement {
      return this._beginDiv;
    }

    set scheme(value: SchemeInterface) {
        this._scheme = value;
    }

    set beginElement(value: AllBeginElementTypes) {
        this._beginElement = value;
    }

    set beginPoint(value: any) {
        this._beginPoint = value;
    }

    set endElement(value: AllEndElementTypes) {
        this._endElement = value;
    }

    set endPoint(value: any) {
        this._endPoint = value;
    }

    set beginDiv(value: HTMLDivElement) {
      this._beginDiv = value;
    }

  constructor(
         scheme:SchemeInterface
        ,beginElement:AllBeginElementTypes
        ,beginPoint:number
        ,endElement:AllEndElementTypes
        ,endPoint:number
    ){

        this._id = Utils.getGUID().create().value;
        this._scheme = scheme;
        this._number = this.getElementLastNumber()+1;
        this._name = "Line"+"-"+this._number;
        this.scheme.elementList.push(this);
        this.beginElement = beginElement;
        this.beginPoint = beginPoint;
        this.endElement = endElement;
        this.endPoint = endPoint;

        let type = enumDirection.RIGHT;
        if (this.beginElement!==null && this.beginPoint!==0){
            type = this.beginElement.getBeginPointCoordinate(this.beginPoint).direction;
        }

        Factory.createArrowEnd(this,type);
    }

    getElementLastNumber():number {
        let lastNumber = 0;
        this.scheme.elementList.forEach((item)=>{
            if (item.className===this.className){
                lastNumber = Math.max((item as AllFiguresTypes).number,lastNumber);
            }
        });
        return lastNumber;
    }

    getPreviousArrowLineCoordinate(arrowLine:AllArrowsTypes):CoordinateDirection{

        let coordinate:CoordinateDirection = {
            top:    0,
            height: 0,
            left:   0,
            width:  0,
            direction: enumDirection.DEFAULT
        };

        let previousArrowLine = null;
        for (let i=0;i<this.lineList.length;i++){
            if (this.lineList[i]===arrowLine){
                break;
            }
            previousArrowLine = this.lineList[i];
        }

        if(previousArrowLine===null){

            let coor = this.beginElement.getBeginPointCoordinate(this.beginPoint);
            coordinate.left = coor.x;
            coordinate.top = coor.y;
            coordinate.direction = coor.direction;
        }else{
            let coor = previousArrowLine.getPointOutCoordinate();

            coordinate.left = coor.x;
            coordinate.top = coor.y;
        }

        return coordinate;
    }

    moveArrow():void{

        let curveWidth = 5;
        let curveHeight = 5;
        const greedStep:number = 5;

        let currentPosition=0;

        while (this.lineList.length>1){
            if (this.lineList[0].className!==enumArrow.End){
                this.lineList[0].delete();
            }
        }

        if (this.endElement!==null) {

            let arrowEnd:ArrowEndInterface = this.lineList[currentPosition];
            let coordinate:CoordinateXYArrowDirection = (this.endElement as AllEndElementTypes).getPointCoordinate(this.endPoint);
            arrowEnd.left = coordinate.x;
            arrowEnd.top = coordinate.y;
            arrowEnd.turn(coordinate.arrowDirection);

            let coordinateInArrowEnd:CoordinateXYArrowDirection = arrowEnd.getPointInCoordinate();
            let coordinateIn = coordinateInArrowEnd;

            let coordinateOut:CoordinateXYArrowDirection = this.beginElement.getBeginPointCoordinate(this.beginPoint);
            switch (coordinateOut.direction){
                case enumDirection.RIGHT:{
                    coordinateOut.x = coordinateOut.x+curveWidth+greedStep;
                    break;
                }
                case enumDirection.LEFT:{
                    coordinateOut.x = coordinateOut.x-curveWidth-greedStep;
                    break;
                }
                case enumDirection.UP:{
                    coordinateOut.y = coordinateOut.y-curveHeight-greedStep;
                    break;
                }
                case enumDirection.DOWN:{
                    coordinateOut.y = coordinateOut.y+curveHeight+greedStep;
                    break;
                }
            }

            this.path = this.getPath(coordinateOut.direction,coordinate.direction,coordinateOut.x,coordinateOut.y,coordinateIn.x,coordinateIn.y);
            let path:Array<CoordinateXY> = this.path.slice();

            if (path.length>0) {

                let beforeArrowEndDirection:enumDirection;
                let arrowCurve:ArrowCurveInterface = null;
                let arrowLine:ArrowLineInterface = null;

                let beforeXCurve:number = 0;
                let beforeYCurve:number = 0;

                let direction:enumDirection;
                let beforeX:number = 0;
                let beforeY:number = 0;
                let x:number = 0;
                let y:number = 0;

                if (path.length > 1) {

                    if (path.length===2 && (Math.abs(path[0].x-path[1].x)===1 || Math.abs(path[0].y-path[1].y)===1)){

                        let coordinateForOne:CoordinateXYArrowDirection = this.beginElement.getBeginPointCoordinate(this.beginPoint);

                        beforeX = Math.floor(coordinateForOne.x/greedStep);
                        beforeY = Math.floor(coordinateForOne.y/greedStep);

                        if (Math.abs(path[0].x-path[1].x)===1){

                            if (beforeY!==path[1].y){
                                direction = Utils.getDirection(0,beforeY,0,path[1].y);

                                arrowLine = Factory.createArrowLine(this, direction, currentPosition);
                                //arrowLine = new ArrowLine(this, direction, currentPosition);
                                currentPosition = currentPosition + 1;

                                arrowLine.height = Math.max((Math.abs(path[1].y - beforeY)-1) * greedStep,0);

                                switch (arrowLine.type) {
                                    case enumDirection.LEFT:
                                    {
                                        arrowLine.left = arrowLine.left - arrowLine.width;
                                        break;
                                    }
                                    case enumDirection.UP:{
                                        arrowLine.top = arrowLine.top - arrowLine.height;
                                        break;
                                    }
                                }
                                arrowLine.draw();

                                if (direction===enumDirection.DOWN){
                                    if (path[0].x<path[1].x){
                                        arrowCurve = Factory.createArrowCurve(this,enumArrowCurveType.RIGHT_DOWN, currentPosition);
                                        //arrowCurve = new ArrowCurve(this,enumArrowCurveType.RIGHT_DOWN, currentPosition);
                                    }else{
                                        arrowCurve = Factory.createArrowCurve(this,enumArrowCurveType.LEFT_DOWN, currentPosition);
                                    }
                                }else{
                                    if (path[0].x<path[1].x){
                                        arrowCurve = Factory.createArrowCurve(this,enumArrowCurveType.RIGHT_UP, currentPosition);
                                    }else{
                                        arrowCurve = Factory.createArrowCurve(this,enumArrowCurveType.LEFT_UP, currentPosition);
                                    }
                                }
                            }else{
                                if (this.beginPoint===1 && this.endPoint===3){
                                    arrowLine = Factory.createArrowLine(this, enumDirection.LEFT, currentPosition);
                                    currentPosition = currentPosition + 1;

                                    arrowLine.width = 3*greedStep;
                                    arrowLine.left = arrowLine.left - arrowLine.width;
                                    arrowLine.draw();
                                }
                                if (this.beginPoint===3 && this.endPoint===1){
                                    arrowLine = Factory.createArrowLine(this, enumDirection.RIGHT, currentPosition);
                                    currentPosition = currentPosition + 1;

                                    arrowLine.width = 3*greedStep;
                                    arrowLine.draw();
                                }
                            }
                        }

                        if (Math.abs(path[0].y-path[1].y)===1){

                            if (beforeX!==path[1].x){
                                direction = Utils.getDirection(beforeX,0,path[1].x,0);

                                arrowLine = Factory.createArrowLine(this, direction, currentPosition);
                                currentPosition = currentPosition + 1;

                                arrowLine.width = Math.max((Math.abs(path[1].x - beforeX)-1) * greedStep,0);

                                switch (arrowLine.type) {
                                    case enumDirection.LEFT:
                                    {
                                        arrowLine.left = arrowLine.left - arrowLine.width;
                                        break;
                                    }
                                    case enumDirection.UP:{
                                        arrowLine.top = arrowLine.top - arrowLine.height;
                                        break;
                                    }
                                }
                                arrowLine.draw();

                                if (direction===enumDirection.RIGHT){
                                    if (path[0].y<path[1].y){
                                        arrowCurve = Factory.createArrowCurve(this,enumArrowCurveType.DOWN_RIGHT, currentPosition);
                                    }else{
                                        arrowCurve = Factory.createArrowCurve(this,enumArrowCurveType.UP_RIGHT, currentPosition);
                                    }
                                }    else{
                                    if (path[0].y<path[1].y){
                                        arrowCurve = Factory.createArrowCurve(this,enumArrowCurveType.DOWN_LEFT, currentPosition);
                                    }else{
                                        arrowCurve = Factory.createArrowCurve(this,enumArrowCurveType.UP_LEFT, currentPosition);
                                    }
                                }
                            }else{
                                if (this.beginPoint===2 && this.endPoint===4){
                                    arrowLine = Factory.createArrowLine(this, enumDirection.UP, currentPosition);
                                    currentPosition = currentPosition + 1;

                                    arrowLine.height = 3*greedStep;
                                    arrowLine.top = arrowLine.top - arrowLine.height;
                                    arrowLine.draw();
                                }
                                if (this.beginPoint===4 && this.endPoint===2){
                                    arrowLine = Factory.createArrowLine(this, enumDirection.DOWN, currentPosition);
                                    currentPosition = currentPosition + 1;

                                    arrowLine.height = 3*greedStep;
                                    arrowLine.draw();
                                }
                            }
                        }

                    }else{

                        let xCurve = path[path.length - 2].x;
                        let yCurve = path[path.length - 2].y;

                        beforeArrowEndDirection = Utils.getDirection(xCurve * greedStep,yCurve * greedStep,coordinateInArrowEnd.x,coordinateInArrowEnd.y);

                        if (arrowEnd.type !== beforeArrowEndDirection && !Utils.oppositeDirection(arrowEnd.type,beforeArrowEndDirection)) {

                            arrowCurve = Factory.createArrowCurve(this,Utils.getArrowCurveTypeFromDirections(beforeArrowEndDirection, arrowEnd.type), currentPosition);
                            switch (arrowEnd.type){
                                case enumDirection.RIGHT:{
                                    if (beforeArrowEndDirection===enumDirection.UP){
                                        arrowCurve.left = coordinateInArrowEnd.x - arrowCurve.width;
                                        arrowCurve.top = coordinateInArrowEnd.y;
                                    }else{
                                        arrowCurve.left = coordinateInArrowEnd.x - arrowCurve.width;
                                        arrowCurve.top = coordinateInArrowEnd.y - arrowCurve.height;
                                    }
                                    break;
                                }
                                case enumDirection.LEFT:{
                                    if (beforeArrowEndDirection===enumDirection.UP){
                                        arrowCurve.left = coordinateInArrowEnd.x;
                                        arrowCurve.top = coordinateInArrowEnd.y;
                                    }else{
                                        arrowCurve.left = coordinateInArrowEnd.x;
                                        arrowCurve.top = coordinateInArrowEnd.y - arrowCurve.height;
                                    }
                                    break;
                                }
                                case enumDirection.DOWN:{
                                    if (beforeArrowEndDirection===enumDirection.RIGHT){
                                        arrowCurve.left = coordinateInArrowEnd.x-arrowCurve.width;
                                        arrowCurve.top = coordinateInArrowEnd.y-arrowCurve.height;
                                    }else{
                                        arrowCurve.left = coordinateInArrowEnd.x;
                                        arrowCurve.top = coordinateInArrowEnd.y - arrowCurve.height;
                                    }
                                    break;
                                }
                                case enumDirection.UP:{
                                    if (beforeArrowEndDirection===enumDirection.RIGHT){
                                        arrowCurve.left = coordinateInArrowEnd.x-arrowCurve.width;
                                        arrowCurve.top = coordinateInArrowEnd.y;
                                    }else{
                                        arrowCurve.left = coordinateInArrowEnd.x;
                                        arrowCurve.top = coordinateInArrowEnd.y;
                                    }
                                    break;
                                }
                            }
                            arrowCurve.draw();

                            if (arrowCurve!=null){
                                curveWidth = arrowCurve.width;
                                curveHeight = arrowCurve.height;

                                coordinateIn = arrowCurve.getPointInCoordinate();

                                beforeXCurve = path[path.length - 1].x;
                                beforeYCurve = path[path.length - 1].y;

                                path[path.length - 1].x = Math.floor(coordinateIn.x / greedStep);
                                path[path.length - 1].y = Math.floor(coordinateIn.y / greedStep);

                                if (path[path.length - 2].x===beforeXCurve){
                                    path[path.length - 2].x = path[path.length - 1].x;
                                }
                                if (path[path.length - 2].y===beforeYCurve){
                                    path[path.length - 2].y = path[path.length - 1].y;
                                }

                                path = Utils.removeDuplicationFromPath(path);
                            }
                        }

                        let beforeDirection:enumDirection = coordinateOut.direction;
                        let beginDirection:enumDirection = beforeDirection;

                        let beforeCurveWidth:number = 0;
                        let beforeCurveHeight:number = 0;
                        let itIsEndLine:boolean;
                        let previousCurveCoordinate:CoordinateXY;

                        if (path.length>1){
                            for (let i = 1; i < path.length; i++) {

                                beforeX = path[i-1].x;
                                beforeY = path[i-1].y;

                                x = path[i].x;
                                y = path[i].y;

                                direction = Utils.getDirection(beforeX,beforeY,x,y);

                                if (i === 1) {

                                    beginDirection = beforeDirection;

                                    arrowLine = Factory.createArrowLine(this,beginDirection, currentPosition);
                                    currentPosition = currentPosition + 1;

                                    if (beginDirection === enumDirection.RIGHT) {
                                        arrowLine.width = beforeX*greedStep - arrowLine.left;
                                    }
                                    if (beginDirection === enumDirection.LEFT){
                                        arrowLine.width = arrowLine.left - beforeX*greedStep;
                                    }
                                    if (beginDirection === enumDirection.UP) {
                                        arrowLine.height = arrowLine.top - beforeY*greedStep;
                                    }
                                    if (beginDirection === enumDirection.DOWN){
                                        arrowLine.height = beforeY*greedStep - arrowLine.top;
                                    }


                                    if (beginDirection!=direction && !Utils.oppositeDirection(beginDirection,direction)){
                                        arrowLine.width = arrowLine.width - curveWidth;
                                        arrowLine.height = arrowLine.height - curveHeight;
                                    }

                                    if (beginDirection === enumDirection.LEFT){
                                        arrowLine.left = arrowLine.left - arrowLine.width;
                                    }
                                    if (beginDirection === enumDirection.UP){
                                        arrowLine.top = arrowLine.top - arrowLine.height;
                                    }

                                    arrowLine.draw();
                                }

                                beforeCurveWidth = 0;
                                beforeCurveHeight = 0;
                                if (beforeDirection !== direction && !Utils.oppositeDirection(beforeDirection,direction)) {
                                    arrowCurve = Factory.createArrowCurve(this, Utils.getArrowCurveTypeFromDirections(beforeDirection, direction), currentPosition);
                                    currentPosition = currentPosition + 1;

                                    beforeCurveWidth = arrowCurve.width;
                                    beforeCurveHeight = arrowCurve.height;
                                }

                                arrowLine = Factory.createArrowLine(this, direction, currentPosition);
                                currentPosition = currentPosition + 1;

                                itIsEndLine = i===path.length-1;

                                if (itIsEndLine){
                                    previousCurveCoordinate = this.lineList[currentPosition].getPointInCoordinate();
                                    arrowLine.width = Math.abs(arrowLine.left - previousCurveCoordinate.x);
                                    arrowLine.height = Math.abs(arrowLine.top - previousCurveCoordinate.y);
                                }else{
                                    arrowLine.width = Math.abs(x - beforeX) * greedStep - curveWidth - beforeCurveWidth;
                                    arrowLine.height = Math.abs(y - beforeY) * greedStep - curveHeight - beforeCurveHeight;
                                }

                                switch (arrowLine.type) {
                                    case enumDirection.LEFT:
                                    {
                                        arrowLine.left = arrowLine.left - arrowLine.width;
                                        break;
                                    }
                                    case enumDirection.UP:{
                                        arrowLine.top = arrowLine.top - arrowLine.height;
                                        break;
                                    }
                                }

                                arrowLine.draw();

                                beforeDirection = direction;
                            }
                        }else{
                            if (this.beginPoint===1 && this.endPoint==3){
                                arrowLine = Factory.createArrowLine(this, enumDirection.LEFT, currentPosition);
                                currentPosition = currentPosition + 1;

                                arrowLine.width = 2*greedStep;
                                arrowLine.left = arrowLine.left - arrowLine.width;
                                arrowLine.draw();
                            }
                            if (this.beginPoint===2 && this.endPoint==4){
                                arrowLine = Factory.createArrowLine(this, enumDirection.UP, currentPosition);
                                currentPosition = currentPosition + 1;

                                arrowLine.height = 2*greedStep;
                                arrowLine.top = arrowLine.top - arrowLine.height;
                                arrowLine.draw();
                            }
                            if (this.beginPoint===3 && this.endPoint==1){
                                arrowLine = Factory.createArrowLine(this, enumDirection.LEFT, currentPosition);
                                currentPosition = currentPosition + 1;

                                arrowLine.width = 2*greedStep;
                                arrowLine.draw();
                            }
                            if (this.beginPoint===4 && this.endPoint==2){
                                arrowLine = Factory.createArrowLine(this, enumDirection.UP, currentPosition);
                                currentPosition = currentPosition + 1;

                                arrowLine.height = 2*greedStep;
                                arrowLine.draw();
                            }
                        }
                    }
                }else{
                    if (path.length===1){

                        let coordinateForOne:CoordinateXYArrowDirection = this.beginElement.getBeginPointCoordinate(this.beginPoint);

                        beforeX = Math.floor(coordinateForOne.x/greedStep);
                        beforeY = Math.floor(coordinateForOne.y/greedStep);

                        x = path[0].x;
                        y = path[0].y;

                        direction = Utils.getDirection(beforeX,beforeY,x,y);

                        arrowLine = Factory.createArrowLine(this, direction, currentPosition);
                        currentPosition = currentPosition + 1;

                        arrowLine.width = Math.max(Math.abs(x - beforeX) * greedStep,0);
                        arrowLine.height = Math.max(Math.abs(y - beforeY) * greedStep,0);


                        switch (arrowLine.type) {
                            case enumDirection.LEFT:
                            {
                                arrowLine.left = arrowLine.left - arrowLine.width;
                                break;
                            }
                            case enumDirection.UP:{
                                arrowLine.top = arrowLine.top - arrowLine.height;
                                break;
                            }
                        }

                        arrowLine.draw();
                    }
                }
            }
        }

      Utils.beginDiv(this);
    }

    moveRoot():void {

        let lineRoot = this.lineList[0];
        let coordinate = this.getPreviousArrowLineCoordinate(lineRoot);

        let previousLineType = lineRoot.type;

        if (coordinate.direction!==undefined && coordinate.direction!==enumDirection.DEFAULT){
            lineRoot.type = coordinate.direction;
        }

        if (lineRoot.className===enumArrow.End && previousLineType!==lineRoot.type){
            switch (lineRoot.type){
                case enumDirection.RIGHT:{
                    lineRoot.left = coordinate.left+lineRoot.width;
                    lineRoot.top = coordinate.top;
                    break;
                }
                default:{
                    lineRoot.left = coordinate.left;
                    lineRoot.top = coordinate.top;
                    break;
                }
            }

            lineRoot.turn(lineRoot.type);
        }else{

            switch (lineRoot.type){
                case enumDirection.RIGHT:{
                    lineRoot.left = coordinate.left;
                    lineRoot.top = coordinate.top-lineRoot.height/2;
                    break;
                }
                case enumDirection.LEFT:{
                    lineRoot.left = coordinate.left-lineRoot.width;
                    lineRoot.top = coordinate.top-lineRoot.height/2;
                    break;
                }
                case enumDirection.UP:{
                    lineRoot.left = coordinate.left-lineRoot.width/2;
                    lineRoot.top = coordinate.top-lineRoot.height;
                    break;
                }
                case enumDirection.DOWN:{
                    lineRoot.left = coordinate.left-lineRoot.width/2;
                    lineRoot.top = coordinate.top;
                    break;
                }
                default: {
                    lineRoot.left = coordinate.left;
                    lineRoot.top = coordinate.top-lineRoot.height/2;
                }
            }

            lineRoot.draw();
        }

        this.moveArrow();
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

    normalizeLine(line:ArrowLineInterface, left:number, top:number, movingDistance:number):void{

        let line1:ArrowLineInterface = null;
        let curve1:ArrowCurveInterface = null;
        let line2:ArrowLineInterface = null;
        let curve2:ArrowCurveInterface = null;
        let position:number = 0;

        for (let i=0;i<this.lineList.length;i++){
            if (this.lineList[i]===line){

                if (this.lineList[i-1].className===enumArrow.Curve){
                    curve1 = this.lineList[i-1];
                }

                if (this.lineList[i-2].className===enumArrow.Line){
                    line1 = this.lineList[i-2];
                }

                if (this.lineList[i+1].className===enumArrow.Curve){
                    curve2 = this.lineList[i+1];
                }
                if (this.lineList[i+2].className===enumArrow.Line){
                    line2 = this.lineList[i+2];
                }

                position = i;

                break;
            }
        }

        let lineOutXY:CoordinateXY = line.getPointOutCoordinate();

        let line2Done:boolean = false;
        if (line2===null){
            line2 = Factory.createArrowLine(this,enumDirection.DOWN,position+2);
            line2Done = true;
        }

        let hasError:boolean = false;
        switch (line.type){
            case enumDirection.RIGHT:
            case enumDirection.LEFT:{

                if (line1.type===enumDirection.DOWN){
                    if (line1.height + movingDistance<=0){
                        hasError = true;
                    }
                }else{
                    if (line1.height - movingDistance<=0){
                        hasError = true;
                    }
                }
                if (line2.type===enumDirection.DOWN){
                    if (line2.height - movingDistance<=0){
                        hasError = true;;
                    }
                }else{
                    if (line2.height + movingDistance<=0){
                        hasError = true;;
                    }
                }

                break;
            }
            case enumDirection.UP:
            case enumDirection.DOWN:{

                if (line1.type===enumDirection.RIGHT){
                    if (line1.width + movingDistance<=0){
                        hasError = true;
                    }
                }else{
                    if (line1.width - movingDistance<=0){
                        hasError = true;
                    }
                }

                if (line2.type===enumDirection.RIGHT){
                    if (line2.width - movingDistance<=0){
                        hasError = true;
                    }
                }else{
                    if (line2.width + movingDistance<=0){
                        hasError = true;
                    }
                }

                break;
            }
        }

        if (hasError){
            if (line2Done){
                line2.delete();
            }
            return;
        }

        let movingLine:{type:enumDirection,left:number,top:number,width:number,height:number} = {
            type:line.type
            ,left:left
            ,top:top
            ,width:Math.max(line.width,0)
            ,height:Math.max(line.height,0)
        };
        if (!this.isMovingLineCorrect(movingLine)){
            return;
        }

        line.left = left;
        line.top = top;
        line.draw();

        lineOutXY = line.getPointOutCoordinate();
        curve2.setCoordinate({left:lineOutXY.x,top:lineOutXY.y, height:0,width:0,direction:enumDirection.DEFAULT});
        curve2.draw();

        switch (line.type){
            case enumDirection.RIGHT:
            case enumDirection.LEFT:{

                if (line1.type===enumDirection.DOWN){
                    line1.height = line1.height + movingDistance;
                }else{

                    line1.top = line1.top + movingDistance;
                    line1.height = line1.height - movingDistance;
                }
                if (line2.type===enumDirection.DOWN){

                    lineOutXY = curve2.getPointOutCoordinate();
                    line2.setCoordinate({left:lineOutXY.x,top:lineOutXY.y, height:0,width:0,direction:enumDirection.DEFAULT});

                    line2.height = line2.height - movingDistance;
                }else{
                    line2.height = line2.height + movingDistance;
                }

                break;
            }
            case enumDirection.UP:
            case enumDirection.DOWN:{

                if (line1.type===enumDirection.RIGHT){
                    line1.width = line1.width + movingDistance;
                }else{
                    line1.left = line1.left + movingDistance;
                    line1.width = line1.width - movingDistance;
                }

                if (line2.type===enumDirection.RIGHT){

                    lineOutXY = curve2.getPointOutCoordinate();
                    line2.setCoordinate({left:lineOutXY.x,top:lineOutXY.y, height:0,width:0,direction:enumDirection.DEFAULT});

                    line2.width = line2.width - movingDistance;
                }else{
                    line2.width = line2.width + movingDistance;
                }

                break;
            }
        }

        line2.draw();
        line1.draw();

        lineOutXY = line1.getPointOutCoordinate();
        curve1.setCoordinate({left:lineOutXY.x,top:lineOutXY.y, height:0,width:0,direction:enumDirection.DEFAULT});
        curve1.draw();

        this.scheme.modified = true;
    }

    isMovingLineCorrect(movingLine:{type:enumDirection,left:number,top:number,width:number,height:number}):boolean{

        let listElementsWithoutArrows:Array<{name:string,left:number,right:number,top:number,bottom:number}> = Utils.getListElementsWithoutArrows(this.scheme.elementList,this.scheme.indent);

        let greedStep:number = this.scheme.greedStep;

        let path:Array<CoordinateXY> = [];
        path.push({x:movingLine.left/greedStep,y:movingLine.top/greedStep});
        path.push({x:(movingLine.left+movingLine.width)/greedStep,y:(movingLine.top+movingLine.height)/greedStep});

        let check:Array<CoordinateXY> = [];
        let element:{name:string,left:number,right:number,top:number,bottom:number} = null;

        for (let i=0;i<listElementsWithoutArrows.length;i++){
            element = listElementsWithoutArrows[i];
            check = Utils.getCrossingPiecesList(path,element.left,element.right,element.top,element.bottom);
            if (check.length>0){
                return false;
            }
        }

        return true;
    }

    delete():void {

        while (this.lineList.length>0){
            this.lineList[0].delete();
        }
        this._lineList = [];

        if (this._beginDiv!==null){
            this.scheme.schemeHTML.removeChild(this._beginDiv);
            this._beginDiv = null;
        }

        for(let i=0;i<this.scheme.elementList.length;i++){
            if (this.scheme.elementList[i]===this){
                this.scheme.elementList.splice(i,1);
                break;
            }
        }
    }

    getProperties():Array<PropertiesInterface>{

        let propertiesArray:Array<PropertiesInterface> = [];

        propertiesArray.push({name:'id',reference:'Id', value:this.id,type:"text",valueSecondary:"",readOnly:true});
        propertiesArray.push({name:'name',reference:'Name', value:this.name,type:"text",valueSecondary:"",readOnly:true});

        propertiesArray.push({name:'borderColor',reference:'Border color', value:this.borderColor,type:"color"});
        propertiesArray.push({name:'borderWidth',reference:'Border width', value:this.borderWidth,type:"number"});
        propertiesArray.push({name:'borderStyle',reference:'Border style', value:this.borderStyle,type:"select"});

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

            this.lineList.forEach((line)=>{

                switch (item.name){

                    case "borderColor":{
                        line.setBorderColor(item.value);
                        break;
                    }
                    case "borderWidth":{
                        line.setBorderWidth(item.value);
                        break;
                    }
                    case "borderStyle":{
                        line.setBorderStyle(item.value);
                        break;
                    }
                }
            });
        });
    }

    getPath(
         beforeDirection:enumDirection
        ,finishDirection:enumDirection
        ,startX:number
        ,startY:number
        ,finishX:number
        ,finishY):Array<CoordinateXY>{

        if (this.endElement===null){
            return [];
        }

        let left = 0;
        let right = 0;
        let top = 0;
        let bottom = 0;
        const greedStep:number = 5;
        const indent:number = this.scheme.indent;

        let listElementsWithoutArrows:Array<{name:string,left:number,right:number,top:number,bottom:number}> = Utils.getListElementsWithoutArrows(this.scheme.elementList,this.scheme.indent);

        let startCoordinateX = Math.floor(startX/greedStep);
        let startCoordinateY = Math.floor(startY/greedStep);

        let finishCoordinateX = Math.floor(finishX/greedStep);
        let finishCoordinateY = Math.floor(finishY/greedStep);

        let arrayPaths:Array<Array<CoordinateXY>> = Utils.getArrayPoint(listElementsWithoutArrows,startCoordinateX,startCoordinateY,finishCoordinateX,finishCoordinateY,this.beginPoint,this.endPoint);

        let maxLength = 9999999999;
        let optimalPath:Array<CoordinateXY> = [];

        arrayPaths.forEach((item)=>{
            if (item.length<maxLength){
                optimalPath = item;
                maxLength = item.length;
            }
        });

        return optimalPath;
    }

    getAsJSON():any{

        let lineList = [];

        this.lineList.forEach((item)=>{
            lineList.push(item.getAsJSON());
        });

        let endElementId:string = "";
        if (this.endElement!==null){
            endElementId = this.endElement.id;
        }

        return {
            id:this.id
            ,name:this.name
            ,number:this.number
            ,className:this.className

            ,beginElement:this.beginElement.id
            ,beginPoint:this.beginPoint
            ,endElement:endElementId
            ,endPoint:this.endPoint

            ,borderColor:this.borderColor
            ,borderWidth:this.borderWidth
            ,borderStyle:this.borderStyle

            ,lineList:lineList
        }
    }

    restoreFromJSON(arrowAsJSON:any):void{

        this._id = arrowAsJSON.id;
        this._name = arrowAsJSON.name;
        this._number = arrowAsJSON.number;

        this.borderColor = arrowAsJSON.borderColor;
        this.borderWidth = arrowAsJSON.borderWidth;
        this.borderStyle = arrowAsJSON.borderStyle;

        while (this._lineList.length>0){
            this._lineList[0].delete();
        }
        this._lineList = [];

        if (arrowAsJSON.endElement!==''){
            this.endElement = (this.scheme.getElementById(arrowAsJSON.endElement) as AllEndElementTypes);
            this.endPoint = arrowAsJSON.endPoint;
        }

        let arrowLine = null;

        arrowAsJSON.lineList.forEach((item)=>{
            switch (item.className){
                case enumArrow.End:{
                    arrowLine = Factory.createArrowEnd(this,item.type);
                    break;
                }
                case enumArrow.Curve:{
                    arrowLine = Factory.createArrowCurve(this,item.type);
                    break;
                }
                case enumArrow.Line:{
                    arrowLine = Factory.createArrowLine(this,item.type);
                    break;
                }

            }
            arrowLine.left = item.left;
            arrowLine.top = item.top;
            arrowLine.width = item.width;
            arrowLine.height = item.height;

            arrowLine.setBorderColor(arrowAsJSON.borderColor);
            arrowLine.setBorderWidth(arrowAsJSON.borderWidth);
            arrowLine.setBorderStyle(arrowAsJSON.borderStyle);

            arrowLine.draw();
        });
    }
}
