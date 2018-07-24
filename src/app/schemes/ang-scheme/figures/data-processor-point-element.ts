import {Figure} from "./figure";
import {enumFigure} from "../enum/enumFigure";
import {DataProcessorPointElementInterface} from "./data-processor-point-element-interface";
import {ArrowInterface} from "../arrows/arrow-interface";
import {SchemeInterface} from "../scheme-interface";
import {Factory} from "../factory";

export class DataProcessorPointElement extends Figure implements DataProcessorPointElementInterface{

    private _arrow: ArrowInterface = null;
    beginPoint: number = 4;

    get arrow(): ArrowInterface {
        return this._arrow;
    }

    constructor(
        scheme: SchemeInterface
        ,title: string
        ,objectAsJSON?:any
    ) {
        super(
            scheme
            , title
            , enumFigure.DataProcessorPointElement
            ,objectAsJSON
        );

        this.mainBlockDiv.classList.add("scheme-dataProcessorPoint-element");

        if (objectAsJSON===undefined){
            this.width = 60;
            this.height = 40;
            this.moveWidth = this.width;
            this.moveHeight = this.height;

            this.backgroundColor = "#099bff";
            this.borderColor = "#bbbbbb";
            this.borderWidth = 1;
            this.borderStyle = "solid";

            this.setProperties(this.getProperties());
            this._arrow = Factory.createArrow(this.scheme, this, this.beginPoint, null, 0);
        }else{

            this.beginPoint = objectAsJSON.beginPoint;

            this.moveWidth = this.width;
            this.moveHeight = this.height;
            this.setProperties(this.getProperties());

            this._arrow = Factory.createArrow(this.scheme, this, this.beginPoint, null, 0);

            this.draw();
        }
    }

    draw(): void {

        if (this.mainBlockDiv !== null) {
            let mainBlock = this.mainBlockDiv;

            mainBlock.style.left = this.left + this.scheme.leftScheme + 'px';
            mainBlock.style.top = this.top + this.scheme.topScheme + 'px';
            mainBlock.style.width = this.width + 'px';
            mainBlock.style.height = this.height + 'px';

            this.editableTitleDiv.style.width = mainBlock.style.width;

            this.editableTitleDiv.style.paddingTop = "0px";
            let boxBoundingClientRect = this.editableTitleDiv.getBoundingClientRect();
            this.editableTitleDiv.style.paddingTop = this.height / 2 - (boxBoundingClientRect.height) / 2 + 'px';

            this.setPictureAlign();
            this.setPictureSize();

            if (this.arrow !== null) {
                this.arrow.moveRoot();
            }

            //We need find all arrows, joined with this element and move these
            this.scheme.elementList.forEach((item)=>{
              if (
                item.className===enumFigure.Arrow && (item as ArrowInterface).endElement!==null && (item as ArrowInterface).endElement.id === this.id){
                (item as ArrowInterface).moveArrow();
              }
            });
        }
    }

    restoreArrowFromJSON(objectAsJSON:any):void{
        this._arrow.restoreFromJSON(objectAsJSON.arrow);
    }
}
