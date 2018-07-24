import {ArrowInterface} from "../arrows/arrow-interface";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {FigureInterface} from "./figure-interface";

export interface ConditionElementInterface extends FigureInterface{

  arrowYes:ArrowInterface;
  beginPointYes:number;

  arrowNo:ArrowInterface;
  beginPointNo:number;

  draw():void;
  setProperties(propertiesArray:Array<PropertiesInterface>):void;
  restoreArrowFromJSON(objectAsJSON:any):void;
}
