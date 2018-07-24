import {enumFigure} from "../enum/enumFigure";
import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";

export interface SelectedBeginArrowBoxInterface{

  id:string;
  readonly className:enumFigure;

  unselected():void;
  move(coordinateX:number,coordinateY:number):void;
  selectNextElement():void;
  getPointCoordinate(point:number):CoordinateXYArrowDirection;
  getBeginPointCoordinate(point:number):CoordinateXYArrowDirection;
  draw():void;
  delete():void;
}
