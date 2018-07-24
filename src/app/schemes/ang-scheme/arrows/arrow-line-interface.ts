import {enumArrow} from "../enum/enumArrow";
import {CoordinateXY} from "../interfaces/coordinate-xy";
import {CoordinateDirection} from "../interfaces/coordinate-direction";
import {enumDirection} from "../enum/enumDirection";

export interface ArrowLineInterface{

  type:enumDirection;
  readonly className:enumArrow;

  arrowDiv:HTMLDivElement;

  top:number;
  left:number;
  width:number;
  height:number;

  selectDiv:HTMLDivElement;

  setCoordinate(coordinate:CoordinateDirection):void;
  selected():void;
  draw():void;
  getPointInCoordinate():CoordinateXY;
  getPointOutCoordinate():CoordinateXY;
  delete():void;
  setBorderColor(borderColor:string):void;
  setBorderWidth(borderWidth:number):void;
  setBorderStyle(borderStyle:string):void;
  getAsJSON():any;
}
