import {AllElementListTypes} from "./types/all-elementList-types";
import {enumFigure} from "./enum/enumFigure";
import {AllFiguresTypes} from "./types/all-figures-types";
import {ArrowInterface} from "./arrows/arrow-interface";
import {SchemeMenu} from "./scheme-menu";
import {PropertiesInterface} from "./interfaces/properties-interface";
import {EnclosedSchemeInterface} from "./interfaces/enclosed-scheme-interface";

export interface SchemeInterface{

  id:string;
  title:string;
  schemeHTML:HTMLDivElement;

  elementList:AllElementListTypes[];
  indent:number;
  greedStep:number;

  backgroundColor:string;
  greedColor:string;

  leftScheme:number;
  topScheme:number;
  widthScheme:number;
  heightScheme:number;

  readOnly:boolean;

  leftContainer:number;
  topContainer:number;

  beginAddingElementClassName:enumFigure;

  currentElement:AllFiguresTypes | ArrowInterface;
  lastCurrentElement:AllFiguresTypes | ArrowInterface;

  enclosedAlgorithmReturn:HTMLElement;

  schemeMenu:SchemeMenu;
  originalSchemeCursor:string;
  beginAddingElement:boolean;

  propertiesForm:HTMLDivElement;
  moduleForm:HTMLDivElement;

  classAttribute:string;

  modified:boolean;

  version:string;

  initEnclosed(classAttribute:string):void;
  getProperties():Array<PropertiesInterface>;
  setProperties(propertiesArray:Array<PropertiesInterface>):void;
  enterEnclosedAlgorithm(schemeEnclosed:EnclosedSchemeInterface,childNodes:Array<any>,id:string):void;
  returnEnclosedAlgorithm(id:string):void;
  savePicture(filename?:string):void;
  getPicture():any;
  getAsJson():any;
  restoreFromJson(storeAsJSON:any):void;
  restoreFigureFromJson(objectAsJSON:any):AllFiguresTypes;
  getElementById(id:string):AllElementListTypes;
  clearScheme():void;
}
