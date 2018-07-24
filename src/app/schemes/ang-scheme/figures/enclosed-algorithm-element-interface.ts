import {ArrowInterface} from "../arrows/arrow-interface";
import {EnclosedSchemeInterface} from "../interfaces/enclosed-scheme-interface";
import {FigureInterface} from "./figure-interface";

export interface EnclosedAlgorithmElementInterface extends FigureInterface{

  arrow:ArrowInterface;
  beginPoint:number;

  schemeEnclosed:EnclosedSchemeInterface;
  childNodes:Array<any>;

  draw():void;
  enterEnclosedAlgorithm():void;
  restoreArrowFromJSON(objectAsJSON:any):void;
}
