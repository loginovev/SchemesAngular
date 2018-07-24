import {SchemeInterface} from "./scheme-interface";
import {Scheme} from "./scheme";
import {ArrowEndInterface} from "./arrows/arrow-end-interface";
import {ArrowInterface} from "./arrows/arrow-interface";
import {SelectedArrowBoxInterface} from "./figures/selected-arrow-box-interface";
import {SelectedArrowBox} from "./figures/selected-arrow-box";
import {SwitchElementInterface, VariantInterface} from "./figures/switch-element-interface";
import {Arrow} from "./arrows/arrow";
import {enumDirection} from "./enum/enumDirection";
import {ArrowEnd} from "./arrows/arrow-end";
import {ArrowLineInterface} from "./arrows/arrow-line-interface";
import {ArrowLine} from "./arrows/arrow-line";
import {enumArrowCurveType} from "./enum/enumArrowCurveType";
import {ArrowCurveInterface} from "./arrows/arrow-curve-interface";
import {ArrowCurve} from "./arrows/arrow-curve";
import {ConditionElementInterface} from "./figures/condition-element-interface";
import {ConditionElement} from "./figures/condition-element";
import {DataProcessorPointElementInterface} from "./figures/data-processor-point-element-interface";
import {DataProcessorPointElement} from "./figures/data-processor-point-element";
import {EnclosedAlgorithmElementInterface} from "./figures/enclosed-algorithm-element-interface";
import {EnclosedAlgorithmElement} from "./figures/enclosed-algorithm-element";
import {EndElementInterface} from "./figures/end-element-interface";
import {EndElement} from "./figures/end-element";
import {SceneryElementInterface} from "./figures/scenery-element-interface";
import {SceneryElement} from "./figures/scenery-element";
import {StartElementInterface} from "./figures/start-element-interface";
import {StartElement} from "./figures/start-element";
import {SwitchElement} from "./figures/switch-element";
import {AllBeginElementTypes} from "./types/all-beginElement-types";
import {AllEndElementTypes} from "./types/all-endElement-types";
import {SelectedBeginArrowBoxInterface} from "./figures/selected-begin-arrow-box-interface";
import {SelectedBeginArrowBox} from "./figures/selected-begin-arrow-box";
import {CoordinateXY} from "./interfaces/coordinate-xy";

export abstract class Factory{

  static createScheme(
    schemeHTML:HTMLDivElement
    ,enclosedAlgorithmReturn:HTMLElement
    ,classAttribute:string
  ):SchemeInterface{
    return new Scheme(schemeHTML,enclosedAlgorithmReturn,classAttribute);
  }

  static createArrow(
    scheme:SchemeInterface
    ,beginElement:AllBeginElementTypes
    ,beginPoint:number
    ,endElement:AllEndElementTypes
    ,endPoint:number
  ):ArrowInterface{
    return new Arrow(scheme,beginElement,beginPoint,endElement,endPoint);
  }

  static createArrowEnd(arrow:ArrowInterface, type:enumDirection):ArrowEndInterface{
    return new ArrowEnd(arrow,type);
  }

  static createArrowLine(arrow:ArrowInterface, type:enumDirection, position?:number):ArrowLineInterface{
    return new ArrowLine(arrow,type,position);
  }

  static createArrowCurve(arrow:ArrowInterface, type:enumArrowCurveType, position?:number):ArrowCurveInterface{
    return new ArrowCurve(arrow,type,position);
  }

  static createConditionElement(
    scheme:SchemeInterface
    ,title:string
    ,objectAsJSON?:any
  ):ConditionElementInterface{
    return new ConditionElement(scheme,title,objectAsJSON);
  }

  static createDataProcessorPointElement(
    scheme: SchemeInterface
    ,title: string
    ,objectAsJSON?:any
  ):DataProcessorPointElementInterface{
    return new DataProcessorPointElement(scheme,title,objectAsJSON);
  }

  static createEnclosedAlgorithmElement(
    scheme:SchemeInterface
    ,title:string
    ,objectAsJSON?:any
  ):EnclosedAlgorithmElementInterface{
    return new EnclosedAlgorithmElement(scheme,title,objectAsJSON);
  }

  static createEndElement(
    scheme:SchemeInterface
    ,title:string
    ,objectAsJSON?:any
  ):EndElementInterface{
    return new EndElement(scheme,title,objectAsJSON);
  }

  static createSceneryElement(
    scheme:SchemeInterface
    ,title:string
    ,objectAsJSON?:any
  ):SceneryElementInterface{
    return new SceneryElement(scheme,title,objectAsJSON);
  }

  static createStartElement(
    scheme:SchemeInterface
    ,title:string
    ,objectAsJSON?:any
  ):StartElementInterface{
    return new StartElement(scheme,title,objectAsJSON);
  }

  static createSwitchElement(
    scheme:SchemeInterface
    ,title:string
    ,objectAsJSON?:any
  ):SwitchElementInterface{
    return new SwitchElement(scheme,title,objectAsJSON);
  }

  static createSelectedArrowBox(arrowEnd:ArrowEndInterface, arrow:ArrowInterface):SelectedArrowBoxInterface{
    return new SelectedArrowBox(arrowEnd,arrow);
  }

  static createSelectedBeginArrowBox(arrow:ArrowInterface,coordinateBeginPoint:CoordinateXY):SelectedBeginArrowBoxInterface{
    return new SelectedBeginArrowBox(arrow,coordinateBeginPoint);
  }
}
