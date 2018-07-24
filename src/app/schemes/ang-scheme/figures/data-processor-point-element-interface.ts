import {ArrowInterface} from "../arrows/arrow-interface";
import {FigureInterface} from "./figure-interface";

export interface DataProcessorPointElementInterface extends FigureInterface{

  arrow: ArrowInterface;
  beginPoint: number;

  draw(): void;
  restoreArrowFromJSON(objectAsJSON:any):void;
}
