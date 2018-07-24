import {CoordinateXY} from "./interfaces/coordinate-xy";
import {Scheme} from "./scheme";
import {enumFigure} from "./enum/enumFigure";
import {EndElement} from "./figures/end-element";
import {DataProcessorPointElement} from "./figures/data-processor-point-element";
import {SwitchElement} from "./figures/switch-element";
import {PropertiesInterface} from "./interfaces/properties-interface";
import {AllFiguresTypes} from "./types/all-figures-types";
import {Utils} from "./utils";

export class SchemeMenu {

    private scheme:Scheme = null;
    private SchemeMenuDiv:HTMLDivElement = null;

    private x:number = 0;
    private y:number = 0;

    constructor(scheme:Scheme, x:number, y:number){

        this.scheme = scheme;

        //let coor:CoordinateXY = SchemeMenu.getPosition(event);

        this.x = x;
        this.y = y;

    }

    static getPosition(e:any):CoordinateXY {

        let posx:number = 0;
        let posy:number = 0;

        if (!e) e = window.event;

        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        } else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
        }

        return {
            x: posx,
            y: posy
        }
    }

    hide():void{

        if (this.SchemeMenuDiv!==null){
            this.scheme.schemeHTML.removeChild(this.SchemeMenuDiv);
            this.SchemeMenuDiv = null;
        }

    };

    show():void{

        let schemeContextMenu:HTMLDivElement = document.createElement('div');
        schemeContextMenu.id = "scheme-context-menu";
        schemeContextMenu.setAttribute(this.scheme.classAttribute,'');
        schemeContextMenu.classList.add('scheme-context-menu');


        let currentThis = this;

        let start:HTMLDivElement = document.createElement('div');
        start.setAttribute(this.scheme.classAttribute,'');
        start.innerHTML = "<p>Add 'start'</p>";
        start.addEventListener('click',function(){
            currentThis.addStartElement();
        });
        schemeContextMenu.appendChild(start);

        let end:HTMLDivElement = document.createElement('div');
        end.setAttribute(this.scheme.classAttribute,'');
        end.innerHTML = "<p>Add 'end'</p>";
        end.addEventListener('click',function(){
            currentThis.addEndElement();
        });
        schemeContextMenu.appendChild(end);

        let condition:HTMLDivElement = document.createElement('div');
        condition.setAttribute(this.scheme.classAttribute,'');
        condition.innerHTML = "<p>Add 'condition'</p>";
        condition.addEventListener('click',function(){
            currentThis.addConditionElement();
        });
        schemeContextMenu.appendChild(condition);

        let change:HTMLDivElement = document.createElement('div');
        change.setAttribute(this.scheme.classAttribute,'');
        change.innerHTML = "<p>Add 'switch'</p>";
        change.addEventListener('click',function(){
            currentThis.addSwitchElement();
        });
        schemeContextMenu.appendChild(change);

        let scenery:HTMLDivElement = document.createElement('div');
        scenery.setAttribute(this.scheme.classAttribute,'');
        scenery.innerHTML = "<p>Add 'scenery'</p>";
        scenery.addEventListener('click',function(){
            currentThis.addSceneryElement();
        });
        schemeContextMenu.appendChild(scenery);

        let dataProcessorPoint:HTMLDivElement = document.createElement('div');
        dataProcessorPoint.setAttribute(this.scheme.classAttribute,'');
        dataProcessorPoint.innerHTML = "<p>Add 'data processor point'</p>";
        dataProcessorPoint.addEventListener('click',function(){
            currentThis.addDataProcessorPointElement();
        });
        schemeContextMenu.appendChild(dataProcessorPoint);

        let enclosedAlgorithm:HTMLDivElement = document.createElement('div');
        enclosedAlgorithm.setAttribute(this.scheme.classAttribute,'');
        enclosedAlgorithm.innerHTML = "<p>Add 'enclosed algorithm'</p>";
        enclosedAlgorithm.addEventListener('click',function(){
            currentThis.addEnclosedAlgorithmElement();
        });
        schemeContextMenu.appendChild(enclosedAlgorithm);

        let properties:HTMLDivElement = null;

        if (this.scheme.currentElement!==null){

            if ((this.scheme.currentElement as AllFiguresTypes).module!==undefined){

                if (this.scheme.currentElement!==null){
                    let deleteElement:HTMLDivElement = document.createElement('div');
                    deleteElement.setAttribute(this.scheme.classAttribute,'');
                    deleteElement.innerHTML = "<p>Delete element</p>";
                    deleteElement.addEventListener('click',function(){
                        currentThis.deleteElement();
                    });
                    schemeContextMenu.appendChild(deleteElement);
                }

                properties = document.createElement('div');
                properties.setAttribute(this.scheme.classAttribute,'');
                properties.innerHTML = "<p>Element's properties</p>";
                properties.addEventListener('click',function(event){
                    currentThis.addElementProperties(currentThis.x,currentThis.y);
                });
                schemeContextMenu.appendChild(properties);

                let module = document.createElement('div');
                module.setAttribute(this.scheme.classAttribute,'');
                module.innerHTML = "<p>Element's module</p>";
                module.addEventListener('click',function(event){
                    currentThis.addElementModule(currentThis.x,currentThis.y);
                });
                schemeContextMenu.appendChild(module);
            }else{
                properties = document.createElement('div');
                properties.setAttribute(this.scheme.classAttribute,'');
                properties.innerHTML = "<p>Arrow's properties</p>";
                properties.addEventListener('click',function(event){
                    currentThis.addElementProperties(currentThis.x,currentThis.y);
                });
                schemeContextMenu.appendChild(properties);
            }
        }

        properties = document.createElement('div');
        properties.setAttribute(this.scheme.classAttribute,'');
        properties.innerHTML = "<p>Scheme's properties</p>";
        properties.addEventListener('click',function(event:MouseEvent){
            currentThis.addSchemeProperties(currentThis.x,currentThis.y);
        });
        schemeContextMenu.appendChild(properties);

        if (this.scheme.currentElement!==null && this.scheme.currentElement.className===enumFigure.SwitchElement){
            let variant:HTMLDivElement = document.createElement('div');
            variant.setAttribute(this.scheme.classAttribute,'');
            variant.innerHTML = "<p>Add 'variant'</p>";
            variant.addEventListener('click',function(){
                currentThis.addSwitchElementVariant();
            });
            schemeContextMenu.appendChild(variant);

            if ((this.scheme.currentElement as SwitchElement).currentVariant!==null){
                let deleteVariant:HTMLDivElement = document.createElement('div');
                deleteVariant.setAttribute(this.scheme.classAttribute,'');
                deleteVariant.innerHTML = "<p>Delete 'variant'</p>";
                deleteVariant.addEventListener('click',function(){
                    currentThis.deleteSwitchElementVariant();
                });
                schemeContextMenu.appendChild(deleteVariant);

                let propertiesVariant:HTMLDivElement = document.createElement('div');
                propertiesVariant.setAttribute(this.scheme.classAttribute,'');
                propertiesVariant.innerHTML = "<p>VariantDTO's properties</p>";
                propertiesVariant.addEventListener('click',function(){
                    currentThis.propertiesSwitchElementVariant(currentThis.x,currentThis.y);
                });
                schemeContextMenu.appendChild(propertiesVariant);
            }
        }

        let picture = document.createElement('div');
        picture.setAttribute(this.scheme.classAttribute,'');
        picture.innerHTML = "<p>Save picture</p>";
        picture.addEventListener('click',function(event:MouseEvent){
            currentThis.savePicture();
        });
        schemeContextMenu.appendChild(picture);

        let schemeBox =  this.scheme.schemeHTML.getBoundingClientRect();

        schemeContextMenu.style.left = this.x - this.scheme.leftScheme +"px";
        schemeContextMenu.style.top = this.y - this.scheme.topScheme +"px";

        schemeContextMenu.style.display = "block";

        this.scheme.schemeHTML.appendChild(schemeContextMenu);

        this.SchemeMenuDiv = schemeContextMenu;

    }

    addStartElement(){
        this.scheme.beginAddingElementClassName = enumFigure.StartElement;
        this.scheme.beginAddingElement = true;
    }

    addEndElement(){
        this.scheme.beginAddingElementClassName = enumFigure.EndElement;
        this.scheme.beginAddingElement = true;
    }

    addConditionElement(){
        this.scheme.beginAddingElementClassName = enumFigure.ConditionElement;
        this.scheme.beginAddingElement = true;
    }

    addSwitchElement():void{
        this.scheme.beginAddingElementClassName = enumFigure.SwitchElement;
        this.scheme.beginAddingElement = true;
    }

    addSwitchElementVariant():void {
        if (this.scheme.currentElement!==null && this.scheme.currentElement.className===enumFigure.SwitchElement){
            (this.scheme.currentElement as SwitchElement).addVariant();
        }
    }

    addDataProcessorPointElement(){
        this.scheme.beginAddingElementClassName = enumFigure.DataProcessorPointElement;
        this.scheme.beginAddingElement = true;
    }

    addSceneryElement(){
        this.scheme.beginAddingElementClassName = enumFigure.SceneryElement;
        this.scheme.beginAddingElement = true;
    }

    addEnclosedAlgorithmElement(){
        this.scheme.beginAddingElementClassName = enumFigure.EnclosedAlgorithmElement;
        this.scheme.beginAddingElement = true;
    }

    deleteElement(){
        if (this.scheme.currentElement!==null){
          Utils.deleteElement(this.scheme,this.scheme.currentElement);
        }
    }

    addElementProperties(left:number,top:number) {
        if (this.scheme.currentElement!==null){
          Utils.elementProperties((this.scheme.currentElement as AllFiguresTypes),left,top);
        }
    }

    addElementModule(left:number,top:number) {
        if (this.scheme.currentElement!==null){
          Utils.elementModule((this.scheme.currentElement as AllFiguresTypes),left,top);
        }
    }

    addSchemeProperties(left:number,top:number) {

        let propertiesArray:Array<PropertiesInterface> = this.scheme.getProperties();

        let schemeBox = {
            left:this.scheme.leftScheme
            ,right:this.scheme.leftScheme+this.scheme.widthScheme
            ,top:this.scheme.topScheme
            ,bottom:this.scheme.topScheme+this.scheme.heightScheme
        };



        Utils.properties(
            propertiesArray
            ,"Scheme's properties"
            ,left,top
            ,this.scheme
            ,this.scheme.schemeHTML
            ,schemeBox
            ,this.scheme.classAttribute
            ,this.scheme);
    }

    deleteSwitchElementVariant():void{
        (this.scheme.currentElement as SwitchElement).currentVariant.delete();
    }

    propertiesSwitchElementVariant(left:number,top:number):void{

        let propertiesArray:Array<PropertiesInterface> = (this.scheme.currentElement as SwitchElement).currentVariant.getProperties();

        let schemeBox = {
            left:this.scheme.leftScheme
            ,right:this.scheme.leftScheme+this.scheme.widthScheme
            ,top:this.scheme.topScheme
            ,bottom:this.scheme.topScheme+this.scheme.heightScheme
        };

        Utils.properties(
            propertiesArray
            ,"VariantDTO's properties: "+(this.scheme.currentElement as SwitchElement).currentVariant.title
            ,left,top
            ,(this.scheme.currentElement as SwitchElement).currentVariant
            ,this.scheme.schemeHTML
            ,schemeBox
            ,this.scheme.classAttribute
            ,this.scheme);
    }

    savePicture():void{
        this.scheme.savePicture();
    }
}
