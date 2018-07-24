import {Figure} from "./figure";
import {enumFigure} from "../enum/enumFigure";
import {SchemeInterface} from "../scheme-interface";
import {SceneryElementInterface} from "./scenery-element-interface";

export class SceneryElement extends Figure implements SceneryElementInterface{

    constructor(
        scheme:SchemeInterface
        ,title:string
        ,objectAsJSON?:any
    ){
        super(
            scheme
            ,title
            ,enumFigure.SceneryElement
            ,objectAsJSON
        );

        this.mainBlockDiv.classList.add("scheme-scenery-element");

        if (objectAsJSON===undefined){
            this.width = 60;
            this.height = 40;
            this.moveWidth = this.width;
            this.moveHeight = this.height;

            this.backgroundColor = "#f6fbb6";
            this.borderColor = "#bbbbbb";
            this.borderWidth = 1;
            this.borderStyle = "solid";

            this.setProperties(this.getProperties());
        }else{
            this.setProperties(this.getProperties());
            this.draw();
        }
    }
}
