import {enumFigure} from "../enum/enumFigure";
import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";

export interface SelectedArrowBoxInterface{

  id:string;
  readonly className:enumFigure;

  mainBlockDiv:HTMLDivElement;

  previousEndElement:any;
  previousEndPoint:any;

  left:number;
  top:number;
  width:number;
  height:number;

  selectElementForArrowLinkingOrLink(element:any):void;
  unselected():void;
  move(coordinateX:number,coordinateY:number):void;
  selectNextElement():void;
  getPointCoordinate(point:number):CoordinateXYArrowDirection;
  draw():void;
}
