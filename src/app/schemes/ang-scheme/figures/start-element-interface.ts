import {ArrowInterface} from "../arrows/arrow-interface";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {FigureInterface} from "./figure-interface";

export interface StartElementInterface extends FigureInterface{

  arrow:ArrowInterface;
  beginPoint:number;

  draw():void;
  setProperties(propertiesArray:Array<PropertiesInterface>):void;
  restoreArrowFromJSON(objectAsJSON:any):void;
}
