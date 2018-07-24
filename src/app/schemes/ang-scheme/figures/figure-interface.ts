import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {SchemeInterface} from "../scheme-interface";
import {enumFigure} from "../enum/enumFigure";

export interface FigureInterface{

  id:string;
  name:string;
  title:string;
  className:enumFigure;
  number:number;
  scheme:SchemeInterface;

  left:number;
  top:number;
  width:number;
  height:number;

  mainBlockDiv:HTMLDivElement;
  editableTitleDiv:HTMLDivElement;

  moveElement:HTMLDivElement;
  moveBoxPoint:Array<HTMLDivElement>;
  moveLeft:number;
  moveTop:number;
  moveWidth:number;
  moveHeight:number;

  module:string;

  getElementLastNumber():number;
  moveToBox():void;
  currentDraw():void;
  ruleMoveElement():void;
  getPointCoordinate(point:number):CoordinateXYArrowDirection;
  getBeginPointCoordinate(beginPoint:number):CoordinateXYArrowDirection;
  draw():void;
  getProperties():Array<PropertiesInterface>;
  setProperties(propertiesArray:Array<PropertiesInterface>):void;
  setPictureAlign():void;
  setPictureSize():void;
  getAsJSON():any;
  restoreArrowFromJSON(objectAsJSON:any):void;
}
