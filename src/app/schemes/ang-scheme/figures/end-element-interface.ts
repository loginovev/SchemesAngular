import {PropertiesInterface} from "../interfaces/properties-interface";
import {FigureInterface} from "./figure-interface";

export interface EndElementInterface extends FigureInterface{

  draw():void;
  setProperties(propertiesArray:Array<PropertiesInterface>):void;
}
