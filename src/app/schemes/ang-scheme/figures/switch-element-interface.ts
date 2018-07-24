import {CoordinateXYArrowDirection} from "../interfaces/coordinate-xy-arrow-direction";
import {PropertiesInterface} from "../interfaces/properties-interface";
import {enumFigure} from "../enum/enumFigure";
import {ArrowInterface} from "../arrows/arrow-interface";
import {FigureInterface} from "./figure-interface";

export interface SwitchElementInterface extends FigureInterface{

  ChangeDiv:HTMLDivElement;
  mainBlockHeight:number;
  variantList:Array<VariantInterface>;
  currentVariant:VariantInterface;

  addVariant():void;
  restoreVariantFromJSON(variantFromJSON:any):void;
  getVariantListAsJSON():any;
  delete():void;
}

export interface VariantInterface{

  readonly className:enumFigure;
  switchElement:SwitchElementInterface;

  id:string;
  name:string;
  number:number;

  title:string;
  variantDiv:HTMLDivElement;
  editableTitleDiv:HTMLDivElement;
  arrow:ArrowInterface;
  beginPoint:number;
  heightVariant:number;

  backgroundColor:string;
  borderColor:string;
  borderWidth:number;
  borderStyle:string;

  fontFamily:string;
  fontSize:number;
  fontStyle:string;//normal | italic | oblique
  fontWeight:string; //bold|bolder|lighter|normal|100|200|300|400|500|600|700|800|900
  textAlign:string;//center | justify | left | right | start | end
  textColor:string;

  caseValue:string;

  getVariantLastNumber():number;
  delete():void;
  selectVariant():void;
  unSelectVariant():void;
  getBeginPointCoordinate(beginPoint:number):CoordinateXYArrowDirection;
  getProperties():Array<PropertiesInterface>;
  setProperties(propertiesArray:Array<PropertiesInterface>):void;
  getAsJSON():any;
}
