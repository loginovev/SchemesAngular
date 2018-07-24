import {enumArrowCurveType} from "../enum/enumArrowCurveType";
import {enumArrow} from "../enum/enumArrow";
import {CoordinateDirection} from "../interfaces/coordinate-direction";
import {CoordinateXY} from "../interfaces/coordinate-xy";

export interface ArrowCurveInterface{

  type:enumArrowCurveType;
  readonly className:enumArrow;

  arrowDiv:HTMLDivElement;

  top:number;
  left:number;
  width:number;
  height:number;

  setCoordinate(coordinate:CoordinateDirection):void;
  draw():void;
  getPointInCoordinate():CoordinateXY;
  getPointOutCoordinate():CoordinateXY;
  delete():void;
  setBorderColor(borderColor:string):void;
  setBorderWidth(borderWidth:number):void;
  setBorderStyle(borderStyle:string):void;
  getAsJSON():any;
}
