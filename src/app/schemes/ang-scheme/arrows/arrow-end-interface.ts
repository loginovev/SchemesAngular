import {enumDirection} from "../enum/enumDirection";
import {enumArrow} from "../enum/enumArrow";
import {CoordinateXY} from "../interfaces/coordinate-xy";

export interface ArrowEndInterface{
  type:enumDirection;
  className:enumArrow;

  arrowDiv:HTMLDivElement;

  top:number;
  left:number;
  width:number;
  height:number;
  selected():void;
  draw():void;
  turn(type:enumDirection):void;
  getPointInCoordinate():CoordinateXY;
  getPointOutCoordinate():CoordinateXY;
  delete():void;
  setBorderColor(borderColor:string):void;
  setBorderWidth(borderWidth:number):void;
  setBorderStyle(borderStyle:string):void;
  getAsJSON():any;
}
