import {enumFigure} from "../enum/enumFigure";
import {AllArrowsTypes} from "../types/all-arrows-types";
import {CoordinateDirection} from "../interfaces/coordinate-direction";
import {ArrowLineInterface} from "./arrow-line-interface";
import {enumDirection} from "../enum/enumDirection";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {CoordinateXY} from "../interfaces/coordinate-xy";
import {AllFiguresTypes} from "../types/all-figures-types";
import {SchemeInterface} from "../scheme-interface";
import {SelectedArrowBoxInterface} from "../figures/selected-arrow-box-interface";
import {AllBeginElementTypes} from "../types/all-beginElement-types";
import {AllEndElementTypes} from "../types/all-endElement-types";

export interface ArrowInterface{

  id:string;
  name:string;
  number:number;

  readonly className:enumFigure;

  scheme:SchemeInterface;

  beginElement:AllBeginElementTypes;
  beginPoint:number;
  endElement:AllEndElementTypes;
  endPoint:number;

  beginDiv:HTMLDivElement;

  lineList:Array<any>;

  borderColor:string;
  borderWidth:number;
  borderStyle:string;

  selected:boolean;

  getElementLastNumber():number;
  getPreviousArrowLineCoordinate(arrowLine:AllArrowsTypes):CoordinateDirection;
  moveArrow():void;
  moveRoot():void;
  currentDraw():void;
  ruleMoveElement():void;
  normalizeLine(line:ArrowLineInterface, left:number, top:number, movingDistance:number):void;
  isMovingLineCorrect(movingLine:{type:enumDirection,left:number,top:number,width:number,height:number}):boolean;
  delete():void;
  getProperties():Array<PropertiesInterface>;
  setProperties(propertiesArray:Array<PropertiesInterface>):void;
  getPath(
    beforeDirection:enumDirection
    ,finishDirection:enumDirection
    ,startX:number
    ,startY:number
    ,finishX:number
    ,finishY):Array<CoordinateXY>;
  getAsJSON():any;
  restoreFromJSON(arrowAsJSON:any):void;
}
