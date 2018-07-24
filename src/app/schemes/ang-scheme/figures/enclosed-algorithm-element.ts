import {Figure} from "./figure";
import {enumFigure} from "../enum/enumFigure";
import {EnclosedAlgorithmElementInterface} from "./enclosed-algorithm-element-interface";
import {ArrowInterface} from "../arrows/arrow-interface";
import {EnclosedSchemeInterface} from "../interfaces/enclosed-scheme-interface";
import {SchemeInterface} from "../scheme-interface";
import {Factory} from "../factory";

export class EnclosedAlgorithmElement extends Figure implements EnclosedAlgorithmElementInterface{

    private _arrow:ArrowInterface = null;
    beginPoint:number = 4;

    private enclosedAlgorithmDiv:HTMLDivElement = null;

    schemeEnclosed:EnclosedSchemeInterface = null;
    childNodes:Array<any> = [];

    get arrow(): ArrowInterface {
        return this._arrow;
    }

    constructor(
        scheme:SchemeInterface
        ,title:string
        ,objectAsJSON?:any
    ){
        super(
            scheme
            ,title
            ,enumFigure.EnclosedAlgorithmElement
            ,objectAsJSON
        );

        this.mainBlockDiv.classList.add("scheme-enclosedAlgorithm-element");

        this.enclosedAlgorithmDiv = document.createElement("div");
        this.enclosedAlgorithmDiv.setAttribute(this.scheme.classAttribute,'');
        this.enclosedAlgorithmDiv.classList.add("scheme-enclosedAlgorithm-enter");
        this.enclosedAlgorithmDiv.classList.add("select-none");
        this.enclosedAlgorithmDiv.innerText = "Enclosed algorithm";

        let currentThis:EnclosedAlgorithmElement = this;
        this.enclosedAlgorithmDiv.ondblclick = function (event) {
            currentThis.enterEnclosedAlgorithm();
        };

        this.mainBlockDiv.insertBefore(this.enclosedAlgorithmDiv,this.mainBlockDiv.firstChild);

        if (objectAsJSON===undefined){
            this.width = 60;
            this.height = 40;
            this.moveWidth = this.width;
            this.moveHeight = this.height;

            this.backgroundColor = "#ff625b";
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

            if (
                objectAsJSON.elementList.length>0
                || objectAsJSON.indent!==0
                || objectAsJSON.greedStep!==0
                || objectAsJSON.schemeBackgroundColor!==''
                || objectAsJSON.greedColor!==''
            ){
                let scheme:SchemeInterface = Factory.createScheme(
                    this.scheme.schemeHTML
                    ,this.scheme.enclosedAlgorithmReturn
                    ,this.scheme.classAttribute
                );
                scheme.initEnclosed(this.scheme.classAttribute);

                scheme.restoreFromJson(
                    {
                        version:this.scheme.version
                        ,title:this.title
                        ,elementList:objectAsJSON.elementList.slice()
                        ,indent:objectAsJSON.indent
                        ,greedStep:objectAsJSON.greedStep
                        ,backgroundColor:objectAsJSON.schemeBackgroundColor
                        ,greedColor:objectAsJSON.greedColor
                    }
                );

                scheme.elementList.forEach((item)=>{
                    item.scheme = this.scheme;
                });

                this.childNodes = [];
                let childNodes = scheme.schemeHTML.childNodes;
                for (let i=0;i<childNodes.length;i++){
                    this.childNodes.push(childNodes[i]);
                }

                this.schemeEnclosed = {
                    idElement:this.id
                    ,elementList:scheme.elementList.slice()
                    ,indent:scheme.indent
                    ,greedStep:scheme.greedStep
                    ,backgroundColor:scheme.backgroundColor
                    ,greedColor:scheme.greedColor
                };
            }
        }
    }

    draw():void {

        if (this.mainBlockDiv!==null){
            let mainBlock = this.mainBlockDiv;

            mainBlock.style.left = this.left+this.scheme.leftScheme+'px';
            mainBlock.style.top = this.top+this.scheme.topScheme+'px';
            mainBlock.style.width = this.width+'px';
            mainBlock.style.height = this.height+'px';

            this.editableTitleDiv.style.width = mainBlock.style.width;

            this.editableTitleDiv.style.paddingTop = "0px";
            let boxBoundingClientRect = this.editableTitleDiv.getBoundingClientRect();
            this.editableTitleDiv.style.paddingTop = this.height/2-(boxBoundingClientRect.height)/2+'px';

            if (this._arrow!==null){
                this._arrow.moveRoot();
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

    enterEnclosedAlgorithm():void{

      this.scheme.currentElement = null;
      this.ruleMoveElement();

      let currentScheme:SchemeInterface = this.scheme;
      let currentId:string = this.id;

      let enclosedAlgorithmReturn:HTMLElement = this.scheme.enclosedAlgorithmReturn;
      enclosedAlgorithmReturn.setAttribute(this.scheme.classAttribute,'');
      enclosedAlgorithmReturn.hidden = false;
      enclosedAlgorithmReturn.innerText = this.title+", return";
      enclosedAlgorithmReturn.onclick = function (event) {
        currentScheme.returnEnclosedAlgorithm(currentId);
      };

      window.dispatchEvent(new Event('resize'));

      currentScheme.enterEnclosedAlgorithm(this.schemeEnclosed,this.childNodes,this.id);
    }
}
