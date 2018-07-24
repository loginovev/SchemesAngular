import {AllFiguresTypes} from "./types/all-figures-types";
import {AllElementListTypes} from "./types/all-elementList-types";

import {PropertiesInterface} from "./interfaces/properties-interface";
import {CoordinateXY} from "./interfaces/coordinate-xy";
import {CoordinateRightBottom} from "./interfaces/coordinate-right-bottom";

import {enumArrowCurveType} from "./enum/enumArrowCurveType";
import {enumArrow} from "./enum/enumArrow";
import {enumDirection} from "./enum/enumDirection";
import {enumFigure} from "./enum/enumFigure";
import {SchemeInterface} from "./scheme-interface";
import {SwitchElementInterface, VariantInterface} from "./figures/switch-element-interface";
import {ArrowLineInterface} from "./arrows/arrow-line-interface";
import {ArrowInterface} from "./arrows/arrow-interface";
import {ArrowCurveInterface} from "./arrows/arrow-curve-interface";
import {FigureInterface} from "./figures/figure-interface";
import {Factory} from "./factory";
import {SelectedArrowBoxInterface} from "./figures/selected-arrow-box-interface";
import {forEach} from "@angular/router/src/utils/collection";

export class Utils{

  static moveArrowElement(currentThis:SchemeInterface,left:number,top:number):void{

    let currentElement:AllFiguresTypes = (currentThis.currentElement as AllFiguresTypes);

    if (
      currentElement.left+left>=0 &&
      currentElement.left+currentElement.width+left<=currentThis.widthScheme &&
      currentElement.top+top>=0 &&
      currentElement.top+currentElement.height+top<=currentThis.heightScheme
    ){
      currentElement.moveLeft = currentElement.left+left;
      currentElement.moveTop = currentElement.top+top;
      currentElement.moveWidth = currentElement.width;
      currentElement.moveHeight = currentElement.height;

      let movingElement:{left:number,top:number,width:number,height:number} = {
        left:currentElement.moveLeft
        ,top:currentElement.moveTop
        ,width:currentElement.moveWidth
        ,height:currentElement.moveHeight
      };

      if (Utils.isMovingElementCorrect(currentElement,movingElement,currentThis.elementList,currentThis.indent,currentThis.greedStep)){
        currentElement.moveToBox();

        currentElement.currentDraw();
        currentElement.currentDraw();

        currentThis.lastCurrentElement = null;
        currentThis.modified = true;
      }
    }
  }

  static properties(propertiesArray:Array<PropertiesInterface>,
                    title:string,
                    left:number,
                    top:number,
                    currentThis:AllFiguresTypes|SchemeInterface|VariantInterface,
                    schemeHTML:HTMLDivElement,
                    schemeBox,
                    classAttribute:string,
                    thisScheme:SchemeInterface
  ):void{

    let propertiesForm:HTMLDivElement = document.createElement('div');
    propertiesForm.setAttribute(classAttribute,'');
    propertiesForm.classList.add('properties-form');
    propertiesForm.style.left = left+"px";
    propertiesForm.style.top = top+"px";

    thisScheme.propertiesForm = propertiesForm;

    let titleForm:HTMLDivElement = document.createElement('div');
    titleForm.setAttribute(classAttribute,'');
    titleForm.classList.add('title-properties-form');
    titleForm.classList.add('select-none');
    titleForm.innerText = title;

    let oldSelectedBox;
    let schemeMouseDown:boolean = false;
    let schemeOffsetLeft:number = 0;
    let schemeOffsetTop:number = 0;

    let leftContainer:number = thisScheme.leftContainer;
    let topContainer:number = thisScheme.topContainer;

    let coorX:number = 0;
    let coorY:number = 0;

    titleForm.onmousedown = function(event){

      schemeMouseDown=true;

      oldSelectedBox = titleForm.getBoundingClientRect();
      schemeOffsetLeft = event.clientX - oldSelectedBox.left;
      schemeOffsetTop = event.clientY - oldSelectedBox.top;

      return false;
    };

    titleForm.onmousemove = function(event) {

      if (schemeMouseDown && event.which == 1 && schemeBox !== null) {

        coorX = event.clientX - schemeOffsetLeft - leftContainer;
        coorY = event.clientY - schemeOffsetTop - topContainer;

        if ((coorX > schemeBox.left && coorX + oldSelectedBox.width < schemeBox.right) &&
          (coorY > schemeBox.top && coorY + oldSelectedBox.height < schemeBox.bottom)) {

          propertiesForm.style.left = coorX+'px';
          propertiesForm.style.top = coorY+'px';
        }
      }
    };

    titleForm.onmouseup = function(){
      schemeMouseDown = false;
    };

    titleForm.onmouseout = function(){
      schemeMouseDown=false;
    };

    propertiesForm.appendChild(titleForm);

    let tableProperties:HTMLTableElement = document.createElement('table');

    let row;
    let NameCell;
    let body = tableProperties.createTBody();

    let inputColor:HTMLInputElement = null;
    let fieldValueColorChangeListener:HTMLSelectElement = null;

    propertiesArray.forEach((item)=>{
      row = body.insertRow();
      NameCell = row.insertCell();
      NameCell.appendChild(document.createTextNode(item.reference+":"));
      let ValueCell = row.insertCell();

      switch (item.name){
        case "borderStyle":{

          let listOptions:Array<{text:string,value:any}> = [
            {text:"none",value:"none"}
            ,{text:"hidden",value:"hidden"}
            ,{text:"dotted",value:"dotted"}
            ,{text:"dashed",value:"dashed"}
            ,{text:"solid",value:"solid"}
            ,{text:"double",value:"double"}
            ,{text:"groove",value:"groove"}
            ,{text:"ridge",value:"ridge"}
            ,{text:"inset",value:"inset"}
            ,{text:"outset",value:"outset"}
          ];
          Utils.fillSelectOptions(ValueCell,item,listOptions);
          break;
        }
        case "pictureAlign":{

          let listOptions:Array<{text:string,value:any}> = [
            {text:"left",value:"0"}
            ,{text:"top",value:"1"}
            ,{text:"right",value:"2"}
            ,{text:"bottom",value:"3"}
            ,{text:"center",value:"4"}
          ];

          Utils.fillSelectOptions(ValueCell,item,listOptions);
          break;
        }
        case "pictureSize":{

          let listOptions:Array<{text:string,value:any}> = [
            {text:"automatic",value:"0"}
            ,{text:"real",value:"1"}
            ,{text:"extending",value:"2"}
            ,{text:"proportional",value:"3"}
          ];

          Utils.fillSelectOptions(ValueCell,item,listOptions);
          break;
        }
        case "fontFamily":{

          let fieldValue:HTMLSelectElement = document.createElement("select");

          let option:HTMLOptionElement;

          let listFonts:Array<string> = Utils.getAllFonts();

          listFonts.forEach((font:string)=>{
            option = document.createElement("option");
            option.text = font;
            option.value = font;
            fieldValue.add(option);
          });

          fieldValue.value = item.value;

          fieldValue.onchange = function (event) {
            item.value = fieldValue.value;
          };

          ValueCell.appendChild(fieldValue);

          break;
        }
        case "fontStyle":{

          let listOptions:Array<{text:string,value:any}> = [
            {text:"normal",value:"normal"}
            ,{text:"italic",value:"italic"}
            ,{text:"oblique",value:"oblique"}
          ];

          Utils.fillSelectOptions(ValueCell,item,listOptions);
          break;
        }
        case "fontWeight":{

          let listOptions:Array<{text:string,value:any}> = [
            {text:"bold",value:"bold"}
            ,{text:"bolder",value:"bolder"}
            ,{text:"lighter",value:"lighter"}
            ,{text:"normal",value:"normal"}
            ,{text:"100",value:"100"}
            ,{text:"200",value:"200"}
            ,{text:"300",value:"300"}
            ,{text:"400",value:"400"}
            ,{text:"500",value:"500"}
            ,{text:"600",value:"600"}
            ,{text:"700",value:"700"}
            ,{text:"800",value:"800"}
            ,{text:"900",value:"900"}
          ];

          Utils.fillSelectOptions(ValueCell,item,listOptions);

          break;
        }
        case "textAlign":{

          let listOptions:Array<{text:string,value:any}> = [
            {text:"center",value:"center"}
            ,{text:"justify",value:"justify"}
            ,{text:"left",value:"left"}
            ,{text:"right",value:"right"}
            ,{text:"start",value:"start"}
            ,{text:"end",value:"end"}
          ];

          Utils.fillSelectOptions(ValueCell,item,listOptions);

          break;
        }
        default:{

          switch (item.type){
            case 'boolean':{

              let listOptions:Array<{text:string,value:any}> = [
                {text:"true",value:"true"}
                ,{text:"false",value:"false"}
              ];

              Utils.fillSelectOptions(ValueCell,item,listOptions);
              break;
            }
            case 'color':{

              let fieldValue:HTMLSelectElement = document.createElement("select");
              let option:HTMLOptionElement;

              option = document.createElement("option");
              option.text = "";
              option.value = "";
              fieldValue.add(option);

              option = document.createElement("option");
              option.text = "another color";
              option.value = "another color";
              fieldValue.add(option);

              option = document.createElement("option");
              option.text = "transparent";
              option.value = "transparent";
              fieldValue.add(option);

              fieldValue.value = item.value;
              fieldValue.style.backgroundColor = item.value;

              if (item.value!=="transparent"){
                fieldValue.style.color = Utils.getFarthestColor(fieldValue.style.backgroundColor,'#000000','#ffffff');
              }

              fieldValue.addEventListener("change",function (event) {

                switch (this.value){
                  case "another color":
                  case "":{

                    if (this.value === '' && this.style.backgroundColor === 'transparent' || this.value ==='another color'){

                      inputColor = (document.getElementById("colorInputScheme")) as HTMLInputElement;
                      if (!inputColor){
                        inputColor = document.createElement("input");
                        inputColor.id = "colorInputScheme";
                        inputColor.type = "color";
                      }

                      inputColor.value = item.value;
                      fieldValueColorChangeListener = this;
                      inputColor.oninput = function (event) {

                        fieldValueColorChangeListener.value = "";
                        fieldValueColorChangeListener.style.backgroundColor = inputColor.value;
                        fieldValueColorChangeListener.style.color = Utils.getFarthestColor(fieldValueColorChangeListener.style.backgroundColor,'#000000','#ffffff');
                        item.value = inputColor.value;

                      };

                      inputColor.click();
                      if (item.value==='another color'){
                        this.value = '';
                      }else{
                        this.value = item.value;
                      }
                    }

                    break;
                  }
                  case "transparent":{
                    item.value = this.value;
                    this.style.backgroundColor = item.value;
                    this.style.color = "#000000";
                    break;
                  }
                }
              });

              ValueCell.appendChild(fieldValue);
              break;
            }
            case 'file':{
              let fieldValue:HTMLInputElement = document.createElement("input");
              fieldValue.value = item.value;
              fieldValue.type = "text";

              if (item.readOnly===true){
                fieldValue.readOnly = true;
              }

              fieldValue.value = item.valueReference;
              fieldValue.style.cursor = "pointer";
              fieldValue.readOnly = true;

              let clearEvent:boolean = false;

              Utils.addClearButton(fieldValue,function (event,field:HTMLInputElement) {
                field.value = '';
                item.value = '';
                item.valueReference = '';
                item.valueSecondary = {width:0,height:0};

                clearEvent = true;
              });

              fieldValue.addEventListener("click",function (event) {

                if (!clearEvent){

                  let inputFile:HTMLInputElement = document.createElement("input");
                  inputFile.type = "file";
                  inputFile.accept = "image/*,image/jpeg";

                  inputFile.onchange = function (event) {
                    if (inputFile.files.length>0){
                      fieldValue.value = inputFile.files[0].name;

                      let changedFile:File = inputFile.files[0];

                      let reader = new FileReader();

                      reader.onload = (function (file) {
                        return function (e:any) {
                          item.value = e.target.result;
                          item.valueReference = file.name;

                          let img = new Image();
                          img.onload = function () {
                            item.valueSecondary = {width:(this as any).width,height:(this as any).height};
                          };
                          img.src = window.URL.createObjectURL(file);
                        }
                      })(changedFile);

                      reader.readAsDataURL(changedFile);
                    }
                  };

                  inputFile.click();
                }else{
                  clearEvent = false;
                }

                return false;
              });

              ValueCell.appendChild(fieldValue);
              break;
            }
            default:{
              let fieldValue:HTMLInputElement = document.createElement("input");
              fieldValue.value = item.value;
              fieldValue.type = item.type;

              if (item.readOnly===true){
                fieldValue.readOnly = true;
              }

              fieldValue.onchange = function (event) {
                item.value = fieldValue.value;
              };

              if (item.name==="_greedStep"){
                fieldValue.step = "5";
                fieldValue.min = "5";
                fieldValue.max = "25";

                fieldValue.onkeypress = function (event) {
                  return false;
                };
                fieldValue.onpaste = function (event) {
                  return false;
                };
                fieldValue.onemptied = function (event) {
                  return false;
                };
              }
              ValueCell.appendChild(fieldValue);
            }
          }
        }
      }
    });

    propertiesForm.appendChild(tableProperties);

    let buttonDiv = document.createElement('div');
    buttonDiv.style.cssFloat = "right";

    let buttonOK = document.createElement('button');
    buttonOK.type = "button";
    buttonOK.innerText = "OK";
    buttonOK.onclick = function () {
      currentThis.setProperties(propertiesArray);

      schemeHTML.removeChild(propertiesForm);
      thisScheme.propertiesForm = null;
    };
    buttonDiv.appendChild(buttonOK);

    let buttonCancel = document.createElement('button');
    buttonCancel.type = "button";
    buttonCancel.innerText = "Cancel";
    buttonCancel.onclick = function () {
      schemeHTML.removeChild(propertiesForm);
      thisScheme.propertiesForm = null;
    };
    buttonDiv.appendChild(buttonCancel);

    propertiesForm.appendChild(buttonDiv);

    schemeHTML.appendChild(propertiesForm);

  }

  static elementModule(element:AllFiguresTypes,left:number,top:number):void{

    let thisScheme = element.scheme;
    let schemeBox = {
      left:thisScheme.leftScheme
      ,right:thisScheme.leftScheme+thisScheme.widthScheme
      ,top:thisScheme.topScheme
      ,bottom:thisScheme.topScheme+thisScheme.heightScheme
    };

    let moduleForm:HTMLDivElement = document.createElement('div');
    moduleForm.setAttribute(thisScheme.classAttribute,'');
    moduleForm.classList.add('module-form');
    moduleForm.style.left = left+"px";
    moduleForm.style.top = top+"px";

    element.scheme.moduleForm = moduleForm;

    let titleForm:HTMLDivElement = document.createElement('div');
    titleForm.setAttribute(thisScheme.classAttribute,'');
    titleForm.classList.add('title-properties-form');
    titleForm.classList.add('select-none');
    titleForm.innerText = element.title;

    let oldSelectedBox;
    let schemeMouseDown:boolean = false;
    let schemeOffsetLeft:number = 0;
    let schemeOffsetTop:number = 0;

    let coorX:number = 0;
    let coorY:number = 0;

    titleForm.onmousedown = function(event){

      schemeMouseDown=true;

      oldSelectedBox = titleForm.getBoundingClientRect();
      schemeOffsetLeft = event.clientX - oldSelectedBox.left;
      schemeOffsetTop = event.clientY - oldSelectedBox.top;

      return false;
    };

    titleForm.onmousemove = function(event) {

      if (schemeMouseDown && event.which == 1 && schemeBox !== null) {

        coorX = event.clientX - schemeOffsetLeft;
        coorY = event.clientY - schemeOffsetTop;

        if ((coorX > schemeBox.left && coorX + oldSelectedBox.width < schemeBox.right) &&
          (coorY > schemeBox.top && coorY + oldSelectedBox.height < schemeBox.bottom)) {

          moduleForm.style.left = coorX+'px';
          moduleForm.style.top = coorY+'px';
        }
      }
    };

    titleForm.onmouseup = function(){
      schemeMouseDown = false;
    };

    titleForm.onmouseout = function(){
      schemeMouseDown=false;
    };

    moduleForm.appendChild(titleForm);

    let moduleTextDiv:HTMLDivElement = document.createElement('div');

    let moduleText:HTMLTextAreaElement = document.createElement('textarea');
    moduleText.value = element.module;
    moduleText.rows = 10;
    moduleText.cols = 30;

    moduleTextDiv.appendChild(moduleText);

    moduleForm.appendChild(moduleTextDiv);

    let buttonDiv = document.createElement('div');
    buttonDiv.style.cssFloat = "right";

    let schemeHTML:HTMLDivElement = thisScheme.schemeHTML;

    let buttonOK = document.createElement('button');
    buttonOK.type = "button";
    buttonOK.innerText = "OK";
    buttonOK.onclick = function () {
      element.module = moduleText.value;

      schemeHTML.removeChild(moduleForm);
      thisScheme.moduleForm = null;
      thisScheme.modified = true;
    };
    buttonDiv.appendChild(buttonOK);

    let buttonCancel = document.createElement('button');
    buttonCancel.type = "button";
    buttonCancel.innerText = "Cancel";
    buttonCancel.onclick = function () {
      schemeHTML.removeChild(moduleForm);
      thisScheme.moduleForm = null;
    };
    buttonDiv.appendChild(buttonCancel);

    moduleForm.appendChild(buttonDiv);

    schemeHTML.appendChild(moduleForm);

  }

  static elementProperties(element:AllFiguresTypes,left:number,top:number):void{

    let schemeBox = {
      left:element.scheme.leftScheme
      ,right:element.scheme.leftScheme+element.scheme.widthScheme
      ,top:element.scheme.topScheme
      ,bottom:element.scheme.topScheme+element.scheme.heightScheme
    };

    let propertiesArray:Array<{name:string,reference:string,value:any,type:string}> = element.getProperties();
    Utils.properties(
      propertiesArray
      ,element.title+"'s properties"
      ,left
      ,top
      ,element
      ,element.scheme.schemeHTML
      ,schemeBox
      ,element.scheme.classAttribute
      ,element.scheme);
  }

  static addBoxResizeElement(
    moveElement:HTMLDivElement
    ,currentThis:AllFiguresTypes
    ,parentElement:HTMLDivElement
    ,boxResizeElementSize:number
    ,left:number
    ,top:number) {

    let boxMoveElement:HTMLDivElement = document.createElement("div");
    boxMoveElement.setAttribute(currentThis.scheme.classAttribute,'');
    boxMoveElement.classList.add("resize-element-box");
    boxMoveElement.style.left = left+'px';
    boxMoveElement.style.top = top+'px';
    boxMoveElement.style.width = boxResizeElementSize+'px';
    boxMoveElement.style.height = boxResizeElementSize+'px';
    parentElement.appendChild(boxMoveElement);

    currentThis.moveBoxPoint.push(boxMoveElement);
    let pointNumber:number = currentThis.moveBoxPoint.length;

    switch (pointNumber){
      case 1:{
        boxMoveElement.style.cursor = 'nw-resize';
        break;
      }
      case 2:{
        boxMoveElement.style.cursor = 'n-resize';
        break;
      }
      case 3:{
        boxMoveElement.style.cursor = 'ne-resize';
        break;
      }
      case 4:{
        boxMoveElement.style.cursor = 'e-resize';
        break;
      }
      case 5:{
        boxMoveElement.style.cursor = 'se-resize';
        break;
      }
      case 6:{
        boxMoveElement.style.cursor = 's-resize';
        break;
      }
      case 7:{
        boxMoveElement.style.cursor = 'sw-resize';
        break;
      }
      case 8:{
        boxMoveElement.style.cursor = 'w-resize';
        break;
      }
    }

    let schemeMouseDown:boolean = false;
    const leftScheme:number = currentThis.scheme.leftScheme;
    const topScheme:number = currentThis.scheme.topScheme;
    const rightScheme:number = currentThis.scheme.leftScheme+currentThis.scheme.widthScheme;
    const bottomScheme:number = currentThis.scheme.topScheme+currentThis.scheme.heightScheme;

    let schemeOffsetLeft:number = 0;
    let schemeOffsetTop:number = 0;

    const leftMoveElement:number = currentThis.left+leftScheme;
    const topMoveElement:number = currentThis.top+topScheme;
    const widthMoveElement:number = currentThis.width;
    const heightMoveElement:number = currentThis.height;

    const greedStep = currentThis.scheme.greedStep;

    boxMoveElement.onmousedown = function (event) {
      schemeMouseDown = true;
      schemeOffsetLeft = event.clientX-left;
      schemeOffsetTop = event.clientY-top;

      moveElement.classList.toggle('move-element-visible');

      return false;
    };

    boxMoveElement.onmouseup = function (event) {
      schemeMouseDown = false;

      let moveLeft:number = Number(moveElement.style.left.replace('px',''))-leftScheme;
      let moveTop:number = Number(moveElement.style.top.replace('px',''))-topScheme;
      let moveWidth:number = Number(moveElement.style.width.replace('px',''));
      let moveHeight:number = Number(moveElement.style.height.replace('px',''));

      if (greedStep>1){
        moveLeft = Math.floor(moveLeft/greedStep)*greedStep;
        moveTop = Math.floor(moveTop/greedStep)*greedStep;
        moveWidth = Math.floor(moveWidth/greedStep/2)*greedStep*2;

        if (currentThis.className===enumFigure.SwitchElement){

          let heightVariants:number = currentThis.height - (currentThis as SwitchElementInterface).mainBlockHeight;
          moveHeight = Math.floor((moveHeight-heightVariants)/greedStep/2)*greedStep*2+heightVariants;

        }else{
          moveHeight = Math.floor(moveHeight/greedStep/2)*greedStep*2;
        }
      }

      currentThis.moveLeft = moveLeft;
      currentThis.moveTop = moveTop;
      currentThis.moveWidth = moveWidth;
      currentThis.moveHeight = moveHeight;
    };

    boxMoveElement.onmousemove = function (event) {

      if (schemeMouseDown && event.which == 1) {

        let coorX:number = event.clientX - schemeOffsetLeft;
        let coorY:number = event.clientY - schemeOffsetTop;

        if (coorY > topScheme && coorY < bottomScheme && coorX > leftScheme && coorX < rightScheme) {

          switch (pointNumber){
            case 1:{
              boxMoveElement.style.left = coorX+'px';
              boxMoveElement.style.top = coorY+'px';

              moveElement.style.width = widthMoveElement + leftMoveElement - coorX - boxResizeElementSize + 'px';
              moveElement.style.left = coorX + boxResizeElementSize + 'px';
              moveElement.style.height = heightMoveElement+topMoveElement-coorY-boxResizeElementSize + 'px';
              moveElement.style.top = coorY + boxResizeElementSize + 'px';

              break;
            }
            case 2:{
              boxMoveElement.style.top = coorY+'px';
              moveElement.style.height = heightMoveElement+topMoveElement-coorY-boxResizeElementSize + 'px';
              moveElement.style.top = coorY + boxResizeElementSize + 'px';
              break;
            }
            case 3:{
              boxMoveElement.style.left = coorX+'px';
              boxMoveElement.style.top = coorY+'px';

              moveElement.style.width = coorX - leftMoveElement + 'px';
              moveElement.style.height = heightMoveElement+topMoveElement-coorY-boxResizeElementSize + 'px';
              moveElement.style.top = coorY + boxResizeElementSize + 'px';

              break;
            }
            case 4:{
              boxMoveElement.style.left = coorX+'px';
              moveElement.style.width = coorX - leftMoveElement + 'px';
              break;
            }
            case 5:{
              boxMoveElement.style.left = coorX+'px';
              boxMoveElement.style.top = coorY+'px';

              moveElement.style.width = coorX - leftMoveElement + 'px';
              moveElement.style.height = coorY - topMoveElement + 'px';

              break;
            }
            case 6:
            {
              boxMoveElement.style.top = coorY+'px';
              moveElement.style.height = coorY - topMoveElement + 'px';
              break;
            }
            case 7:{
              boxMoveElement.style.left = coorX+'px';
              boxMoveElement.style.top = coorY+'px';

              moveElement.style.width = widthMoveElement + leftMoveElement - coorX - boxResizeElementSize + 'px';
              moveElement.style.left = coorX + boxResizeElementSize + 'px';
              moveElement.style.height = coorY - topMoveElement + 'px';

              break;
            }
            case 8:{
              boxMoveElement.style.left = coorX+'px';
              moveElement.style.width = widthMoveElement + leftMoveElement - coorX - boxResizeElementSize + 'px';
              moveElement.style.left = coorX + boxResizeElementSize + 'px';
              break;
            }
          }
        }
      }
    };
  }

  static ruleFigure(currentThis:AllFiguresTypes):void{

    let schemeHTML:HTMLDivElement = currentThis.scheme.schemeHTML;

    if (schemeHTML!==document.activeElement){
      schemeHTML.focus();
    }

    let schemeMouseDown:boolean = false;
    const leftScheme:number = currentThis.scheme.leftScheme;
    const topScheme:number = currentThis.scheme.topScheme;
    const rightScheme:number = currentThis.scheme.leftScheme+currentThis.scheme.widthScheme;
    const bottomScheme:number = currentThis.scheme.topScheme+currentThis.scheme.heightScheme;

    const leftMoveElement:number = currentThis.left;
    const topMoveElement:number = currentThis.top;
    const widthMoveElement:number = currentThis.width;
    const heightMoveElement:number = currentThis.height;

    const greedStep:number = currentThis.scheme.greedStep;

    let schemeOffsetLeft:number = 0;
    let schemeOffsetTop:number = 0;

    let moveWidth:number = 0;
    let moveHeight:number = 0;

    if (currentThis.scheme.currentElement!==null){

      let moveElement:HTMLDivElement = document.createElement("div");
      moveElement.setAttribute(currentThis.scheme.classAttribute,'');
      moveElement.classList.add("move-element");
      moveElement.style.left = leftMoveElement+leftScheme+'px';
      moveElement.style.top = topMoveElement+topScheme+'px';
      moveElement.style.width = currentThis.width+'px';

      if ((currentThis as SwitchElementInterface).mainBlockHeight!==undefined){
        moveElement.style.height = (currentThis as SwitchElementInterface).mainBlockHeight+'px';
      }else{
        moveElement.style.height = currentThis.height+'px';
      }

      currentThis.moveElement = moveElement;
      currentThis.scheme.schemeHTML.appendChild(moveElement);

      moveElement.onmousedown = function (event) {

        moveElement.style.height = currentThis.height+'px';

        schemeMouseDown = true;
        schemeOffsetLeft = Math.floor((event.clientX-leftMoveElement)/greedStep)*greedStep;
        schemeOffsetTop = Math.floor((event.clientY-topMoveElement)/greedStep)*greedStep;

        moveElement.classList.toggle('move-element-visible');

        moveWidth = Number(moveElement.style.width.replace('px',''));
        moveHeight = Number(moveElement.style.height.replace('px',''));

        return false;
      };

      moveElement.onmouseup = function (event) {
        schemeMouseDown = false;

        currentThis.moveLeft = Number(moveElement.style.left.replace('px',''))-leftScheme;
        currentThis.moveTop = Number(moveElement.style.top.replace('px',''))-topScheme;
        currentThis.moveWidth = Number(moveElement.style.width.replace('px',''));
        currentThis.moveHeight = Number(moveElement.style.height.replace('px',''));
      };

      moveElement.onmouseout = function (event) {
        schemeMouseDown = false;
      };

      moveElement.onmousemove = function (event) {

        if (schemeMouseDown && event.which === 1) {

          let coorX:number = leftScheme + Math.floor((event.clientX  - schemeOffsetLeft)/greedStep)*greedStep;
          let coorY:number = topScheme + Math.floor((event.clientY - schemeOffsetTop)/greedStep)*greedStep;

          if (coorY > topScheme && coorY + moveHeight < bottomScheme && coorX > leftScheme && coorX + moveWidth< rightScheme) {
            moveElement.style.left = coorX +'px';
            moveElement.style.top = coorY +'px';
          }
        }
      };

      moveElement.onfocus = function (event) {
        console.log("onfocus");
      }

      const boxResizeElementSize:number = 10;

      Utils.addBoxResizeElement(moveElement,currentThis,schemeHTML,boxResizeElementSize,leftScheme+leftMoveElement-boxResizeElementSize                        ,topScheme+topMoveElement-boxResizeElementSize);
      Utils.addBoxResizeElement(moveElement,currentThis,schemeHTML,boxResizeElementSize,leftScheme+leftMoveElement+widthMoveElement/2-boxResizeElementSize/2   ,topScheme+topMoveElement-boxResizeElementSize);
      Utils.addBoxResizeElement(moveElement,currentThis,schemeHTML,boxResizeElementSize,leftScheme+leftMoveElement+widthMoveElement                            ,topScheme+topMoveElement-boxResizeElementSize);
      Utils.addBoxResizeElement(moveElement,currentThis,schemeHTML,boxResizeElementSize,leftScheme+leftMoveElement+widthMoveElement                            ,topScheme+topMoveElement+heightMoveElement/2-boxResizeElementSize/2);
      Utils.addBoxResizeElement(moveElement,currentThis,schemeHTML,boxResizeElementSize,leftScheme+leftMoveElement+widthMoveElement                            ,topScheme+topMoveElement+heightMoveElement);
      Utils.addBoxResizeElement(moveElement,currentThis,schemeHTML,boxResizeElementSize,leftScheme+leftMoveElement+widthMoveElement/2-boxResizeElementSize/2   ,topScheme+topMoveElement+heightMoveElement);
      Utils.addBoxResizeElement(moveElement,currentThis,schemeHTML,boxResizeElementSize,leftScheme+leftMoveElement-boxResizeElementSize                        ,topScheme+topMoveElement+heightMoveElement);
      Utils.addBoxResizeElement(moveElement,currentThis,schemeHTML,boxResizeElementSize,leftScheme+leftMoveElement-boxResizeElementSize                        ,topScheme+topMoveElement+heightMoveElement/2-boxResizeElementSize/2);

    }else{
      if (currentThis.moveElement!=null){

        let moveBoxStyle = currentThis.moveElement.style;
        if (moveBoxStyle.left!=currentThis.left+leftScheme+'px' ||
          moveBoxStyle.top!=currentThis.top+topScheme+'px' ||
          moveBoxStyle.width!= currentThis.width+'px' ||
          moveBoxStyle.height!= currentThis.height+'px'
        ){
          let movingElement:{left:number,top:number,width:number,height:number} = {
            left:parseInt(moveBoxStyle.left)
            ,top:parseInt(moveBoxStyle.top)
            ,width:parseInt(moveBoxStyle.width)
            ,height:parseInt(moveBoxStyle.height)
          };
          if (Utils.isMovingElementCorrect(currentThis,movingElement,currentThis.scheme.elementList,currentThis.scheme.indent,currentThis.scheme.greedStep)){
            currentThis.moveToBox();
            currentThis.scheme.modified = true;
          }
        }

        for (let i=0;i<currentThis.moveBoxPoint.length;i++){
          currentThis.scheme.schemeHTML.removeChild(currentThis.moveBoxPoint[i]);
        }
        currentThis.moveBoxPoint = [];
        currentThis.scheme.schemeHTML.removeChild(currentThis.moveElement);
        currentThis.moveElement=null;
      }
    }
  }

  static addBoxRuleArrow(
    moveElement:ArrowLineInterface
    ,currentThis:ArrowInterface
    ,parentElement:HTMLDivElement
    ,boxResizeElementSize:number
    ,classAttribute:string
  ) {

    let schemeMouseDown:boolean = false;
    const leftScheme:number = currentThis.scheme.leftScheme;
    const topScheme:number = currentThis.scheme.topScheme;
    const rightScheme:number = currentThis.scheme.leftScheme+currentThis.scheme.widthScheme;
    const bottomScheme:number = currentThis.scheme.topScheme+currentThis.scheme.heightScheme;

    let left:number = 0;
    let top:number = 0;

    let boxMoveElement:HTMLDivElement = document.createElement("div");
    boxMoveElement.setAttribute(classAttribute,'');
    boxMoveElement.classList.add("resize-element-box");

    boxMoveElement.style.width = boxResizeElementSize+'px';
    boxMoveElement.style.height = boxResizeElementSize+'px';

    let type:enumDirection = moveElement.type;

    switch (type){
      case enumDirection.LEFT:
      case enumDirection.RIGHT:{
        boxMoveElement.style.cursor = 'row-resize';
        left = moveElement.left + leftScheme + Math.floor(moveElement.width/2) - boxResizeElementSize/2;
        top = moveElement.top + topScheme - boxResizeElementSize/2;
        break;
      }
      case enumDirection.UP:
      case enumDirection.DOWN:{
        boxMoveElement.style.cursor = 'col-resize';
        left = moveElement.left + leftScheme - boxResizeElementSize/2;
        top = moveElement.top + topScheme + Math.floor(moveElement.height/2) - boxResizeElementSize/2;
        break;
      }
    }

    boxMoveElement.style.left = left+'px';
    boxMoveElement.style.top = top+'px';
    parentElement.appendChild(boxMoveElement);

    moveElement.selectDiv = boxMoveElement;

    let schemeOffsetLeft:number = 0;
    let schemeOffsetTop:number = 0;

    const greedStep = currentThis.scheme.greedStep;

    boxMoveElement.onmousedown = function (event) {
      schemeMouseDown = true;
      schemeOffsetLeft = event.clientX-left;
      schemeOffsetTop = event.clientY-top;

      return false;
    };

    let coorX:number = 0;
    let coorY:number = 0;
    let offsetLeft:number = 0;
    let offsetTop:number = 0;

    boxMoveElement.onmousemove = function (event) {

      if (schemeMouseDown && event.which == 1) {

        coorX = event.clientX - schemeOffsetLeft;
        coorY = event.clientY - schemeOffsetTop;

        if (coorY > topScheme && coorY < bottomScheme && coorX > leftScheme && coorX < rightScheme) {

          switch (type){
            case enumDirection.LEFT:
            case enumDirection.RIGHT:{

              boxMoveElement.style.top = coorY+'px';

              if (Math.floor(Math.abs(coorY - top)/greedStep)*greedStep === greedStep){
                top = coorY;
                currentThis.normalizeLine(
                  moveElement
                  ,moveElement.left
                  ,top - topScheme + boxResizeElementSize/2
                  ,top - topScheme + boxResizeElementSize/2 - moveElement.top
                );
                Utils.moveBoxRuleArrow(currentThis,boxResizeElementSize);
              }

              break;
            }
            case enumDirection.UP:
            case enumDirection.DOWN:{

              boxMoveElement.style.left = coorX+'px';

              if (Math.floor(Math.abs(coorX - left)/greedStep)*greedStep === greedStep){
                left = coorX;
                currentThis.normalizeLine(
                  moveElement
                  ,left - leftScheme + boxResizeElementSize/2
                  ,moveElement.top
                  ,left - leftScheme + boxResizeElementSize/2 - moveElement.left
                );
                Utils.moveBoxRuleArrow(currentThis,boxResizeElementSize);
              }

              break;
            }
          }
        }
      }
    }
  }

  static moveBoxRuleArrow(currentThis:ArrowInterface, boxResizeElementSize:number):void{

    const leftScheme:number = currentThis.scheme.leftScheme;
    const topScheme:number = currentThis.scheme.topScheme;

    currentThis.lineList.forEach((item,index)=>{
      if (item.className===enumArrow.Line && item.selectDiv!==null){

        switch (item.type){
          case enumDirection.LEFT:
          case enumDirection.RIGHT:{

            item.selectDiv.style.left = item.left + leftScheme + Math.floor(item.width/2) - boxResizeElementSize/2 + 'px';
            item.selectDiv.style.top = item.top + topScheme - boxResizeElementSize/2 + 'px';
            break;
          }
          case enumDirection.UP:
          case enumDirection.DOWN:{

            item.selectDiv.style.left = item.left + leftScheme - boxResizeElementSize/2 + 'px';
            item.selectDiv.style.top = item.top + topScheme + Math.floor(item.height/2) - boxResizeElementSize/2 + 'px';
            break;
          }
        }
      }
    });
  }

  static ruleArrow(currentThis:ArrowInterface):void{

    if (currentThis.selected){

      let schemeHTML:HTMLDivElement = currentThis.scheme.schemeHTML;
      currentThis.lineList.forEach((item,index)=>{
        if (item.className===enumArrow.Line && item.selectDiv!==null){
          schemeHTML.removeChild(item.selectDiv);
          item.selectDiv = null;
        }
      });

    }else{
      const boxResizeElementSize:number = 10;
      let schemeHTML:HTMLDivElement = currentThis.scheme.schemeHTML;
      let classAttribute:string = currentThis.scheme.classAttribute;

      let lineArray:Array<ArrowLineInterface> = [];

      let previous:ArrowCurveInterface = null;
      let currentLine:ArrowLineInterface = null;

      currentThis.lineList.forEach((item,index)=>{
        if (item.className===enumArrow.Curve && previous!==null && currentLine!==null){
          lineArray.push(currentLine);
        }
        switch (item.className){
          case enumArrow.Curve:{
            previous = item;
            break;
          }
          case enumArrow.Line:{
            currentLine = item;
            break;
          }
        }
      });

      lineArray.forEach((item:ArrowLineInterface)=>{
        Utils.addBoxRuleArrow(
          item
          ,currentThis
          ,schemeHTML
          ,boxResizeElementSize
          ,classAttribute
        );
      });
    }

    currentThis.selected = !currentThis.selected;
  }

  static ruleMoveElement(currentThis:AllFiguresTypes | ArrowInterface):void {

    if ((currentThis as AllFiguresTypes).module!==undefined){
      Utils.ruleFigure((currentThis as AllFiguresTypes));
    }else{
      Utils.ruleArrow((currentThis as ArrowInterface));
    }

  }

  static isMovingElementCorrect(
    currentThis:AllFiguresTypes
    ,movingElement:{left:number,top:number,width:number,height:number}
    ,elementList:Array<AllElementListTypes>
    ,indent:number
    ,greedStep:number
  ):boolean{

    let listElementsWithoutArrows:Array<{name:string,left:number,right:number,top:number,bottom:number}> = Utils.getListElementsWithoutArrows(elementList,indent,currentThis);

    let path:Array<CoordinateXY> = [];
    path.push({x:movingElement.left/greedStep,y:movingElement.top/greedStep});
    path.push({x:(movingElement.left+movingElement.width)/greedStep,y:movingElement.top/greedStep});
    path.push({x:(movingElement.left+movingElement.width)/greedStep,y:(movingElement.top+movingElement.height)/greedStep});
    path.push({x:(movingElement.left)/greedStep,y:(movingElement.top+movingElement.height)/greedStep});

    //let check:Array<CoordinateXY> = [];
    let element:{name:string,left:number,right:number,top:number,bottom:number} = null;

    for (let i=0;i<listElementsWithoutArrows.length;i++){
      element = listElementsWithoutArrows[i];

      //if element is into path at all
      if (
        element.left>=path[0].x && element.top>=path[0].y
        && element.right<=path[1].x && element.top>=path[1].y
        && element.right<=path[2].x && element.bottom<=path[2].y
        && element.left>=path[3].x && element.bottom<=path[3].y
      ){
        return false;
      }

      //if path is into element at all
      if (
        path[0].x>=element.left && path[0].y>=element.top
        && path[1].x<=element.right && path[1].y>=element.top
        && path[2].x<=element.right && path[2].y<=element.bottom
        && path[3].x>=element.left && path[3].y<=element.bottom
      ){
        return false;
      }

      //check = Utils.getCrossingPiecesList(path,element.left,element.right,element.top,element.bottom);
      if (Utils.getCrossingPiecesList(path,element.left,element.right,element.top,element.bottom).length>0){
        return false;
      }
    }

    return true;
  }

  static getListElementsWithoutArrows(elementList:Array<AllElementListTypes>,indent:number, withoutElement?:AllFiguresTypes):Array<{name:string,left:number,right:number,top:number,bottom:number}>{

    let listElementsWithoutArrows:Array<{name:string,left:number,right:number,top:number,bottom:number}> = [];

    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;
    const greedStep:number = 5;

    elementList.forEach((element)=>{
      if (element.className!==enumFigure.Arrow){

        if (!(withoutElement!==undefined && withoutElement==element)){
          left =  Math.floor((element as FigureInterface).left/greedStep) - indent;
          right = Math.floor(((element as FigureInterface).left + (element as FigureInterface).width)/greedStep) + indent;
          top = Math.floor((element as FigureInterface).top/greedStep) - indent;
          bottom = Math.floor(((element as FigureInterface).top + (element as FigureInterface).height)/greedStep) + indent;

          listElementsWithoutArrows.push({name:(element as FigureInterface).id,left:left,right:right,top:top,bottom:bottom});
        }
      }
    });

    return listElementsWithoutArrows;
  }

  static addingElementClassName(ElementClassName:enumFigure,currentThis:SchemeInterface) {

    currentThis.originalSchemeCursor = currentThis.schemeHTML.style.cursor;
    currentThis.schemeHTML.style.cursor = 'copy';

    let schemeMouseDown:boolean = false;
    let leftScheme:number = currentThis.leftScheme;
    let topScheme:number = currentThis.topScheme;
    let rightScheme:number = leftScheme + currentThis.widthScheme + currentThis.leftContainer;
    let bottomScheme:number = topScheme + currentThis.heightScheme + currentThis.topContainer;
    let leftContainer:number = currentThis.leftContainer;
    let topContainer:number = currentThis.topContainer;

    let addElementBox:HTMLDivElement = null;
    let left:number = 0;
    let top:number = 0;
    let widthString:string = '';
    let heightString:string = '';

    let greedStep:number = currentThis.greedStep;

    function mouseDownListener(event) {
      schemeMouseDown = true;

      left = leftScheme+Math.floor((event.clientX-leftScheme)/greedStep)*greedStep - leftContainer;
      top = topScheme+Math.floor((event.clientY-topScheme)/greedStep)*greedStep - topContainer;

      addElementBox = document.createElement("div");
      addElementBox.setAttribute(currentThis.classAttribute,'');
      addElementBox.classList.toggle("move-element");
      addElementBox.classList.toggle("move-element-visible");
      addElementBox.style.left = left+'px';
      addElementBox.style.top = top+'px';
      addElementBox.style.width = greedStep*2+'px';
      addElementBox.style.height = greedStep*2+'px';

      currentThis.schemeHTML.appendChild(addElementBox);
    }

    function mouseUpListener(event) {
      schemeMouseDown = false;

      let moveLeft:number = Number(addElementBox.style.left.replace('px',''))-leftScheme;
      let moveTop:number = Number(addElementBox.style.top.replace('px',''))-topScheme;
      let moveWidth:number = Number(addElementBox.style.width.replace('px',''));
      let moveHeight:number = Number(addElementBox.style.height.replace('px',''));

      try {
        currentThis.schemeHTML.removeChild(addElementBox);
      }catch(err){

      }

      currentThis.modified = true;

      currentThis.schemeHTML.style.cursor = currentThis.originalSchemeCursor;
      currentThis.originalSchemeCursor = '';

      let ell:AllFiguresTypes;
      switch (ElementClassName){
        case enumFigure.SwitchElement:{
          ell = Factory.createSwitchElement(currentThis,'');
          ell.left = moveLeft;
          ell.top = moveTop;
          ell.width = moveWidth;
          ell.height = moveHeight;
          ell.draw();
          break;
        }
        case enumFigure.EndElement:{
          ell = Factory.createEndElement(currentThis,'');
          ell.left = moveLeft;
          ell.top = moveTop;
          ell.width = moveWidth;
          ell.height = moveHeight;
          ell.draw();
          break;
        }
        case enumFigure.DataProcessorPointElement:{
          ell = Factory.createDataProcessorPointElement(currentThis,'');
          ell.left = moveLeft;
          ell.top = moveTop;
          ell.width = moveWidth;
          ell.height = moveHeight;
          ell.draw();
          break;
        }
        case enumFigure.StartElement:{
          ell = Factory.createStartElement(currentThis,'');
          ell.left = moveLeft;
          ell.top = moveTop;
          ell.width = moveWidth;
          ell.height = moveHeight;
          ell.draw();
          break;
        }
        case enumFigure.ConditionElement:{
          ell = Factory.createConditionElement(currentThis,'');
          ell.left = moveLeft;
          ell.top = moveTop;
          ell.width = moveWidth;
          ell.height = moveHeight;
          ell.draw();
          break;
        }
        case enumFigure.SceneryElement:{
          ell = Factory.createSceneryElement(currentThis,'');
          ell.left = moveLeft;
          ell.top = moveTop;
          ell.width = moveWidth;
          ell.height = moveHeight;
          ell.draw();
          break;
        }
        case enumFigure.EnclosedAlgorithmElement:{
          ell = Factory.createEnclosedAlgorithmElement(currentThis,'');
          ell.left = moveLeft;
          ell.top = moveTop;
          ell.width = moveWidth;
          ell.height = moveHeight;
          ell.draw();
          break;
        }

      }

      currentThis.schemeHTML.removeEventListener('mousemove',mouseMoveListener);
      currentThis.schemeHTML.removeEventListener('mousedown',mouseDownListener);
      currentThis.schemeHTML.removeEventListener('mouseup',mouseUpListener);
    }

    function mouseMoveListener(event) {

      if (schemeMouseDown && event.which == 1) {

        if (event.clientY > topScheme && event.clientY < bottomScheme && event.clientX > leftScheme && event.clientX < rightScheme) {

          widthString = Math.floor((event.clientX - left - leftContainer)/greedStep/2)*greedStep*2 +'px';
          heightString = Math.floor((event.clientY - top - topContainer)/greedStep/2)*greedStep*2 +'px';

          if (addElementBox.style.width!==widthString){
            addElementBox.style.width = widthString;
          }
          if (addElementBox.style.height!==heightString){
            addElementBox.style.height = heightString;
          }
        }
      }
    }

    currentThis.schemeHTML.addEventListener('mousedown',mouseDownListener);
    currentThis.schemeHTML.addEventListener('mouseup',mouseUpListener);
    currentThis.schemeHTML.addEventListener('mousemove',mouseMoveListener);
  };

  static deleteElement(scheme:SchemeInterface, element:AllElementListTypes|SelectedArrowBoxInterface):void {

    let elementList:Array<AllElementListTypes> = scheme.elementList.slice();
    let schemeHTML:HTMLDivElement = scheme.schemeHTML;

    elementList.forEach((currentElement:ArrowInterface)=>{

      if (currentElement.className===enumFigure.Arrow){

        if (element.className===enumFigure.SwitchElement){

          (element as SwitchElementInterface).variantList.forEach((item)=>{
            if (currentElement.beginElement.id===item.id){
              currentElement.delete();
            }
          });
        }else{
          if (element.className!==enumFigure.SelectedBeginArrowBox && currentElement.beginElement.id===(element as AllFiguresTypes).id){
            currentElement.delete();
          }else{
            if (currentElement.endElement===element){

              if (element.className===enumFigure.SelectedArrowBox && (element as any).previousEndElement!=null){
                currentElement.endElement = (element as any).previousEndElement;
                currentElement.endPoint = (element as any).previousEndPoint;
              }else{
                currentElement.endElement = null;
                currentElement.endPoint = 0;

                while (currentElement.lineList.length>1){
                  if (currentElement.lineList[0].className!==enumArrow.End){
                    currentElement.lineList[0].delete();
                  }
                }
                currentElement.moveRoot();
              }
            }
          }
        }
      }
    });

    if (element.className===enumFigure.SwitchElement){
      (element as SwitchElementInterface).delete();
    }else{
      if ((element as FigureInterface).mainBlockDiv!==undefined && (element as FigureInterface).mainBlockDiv!==null){
        schemeHTML.removeChild((element as FigureInterface).mainBlockDiv);
      }
    }

    if ((element as FigureInterface).moveElement!==undefined && (element as FigureInterface).moveElement!==null){
      schemeHTML.removeChild((element as FigureInterface).moveElement);
      (element as FigureInterface).moveElement = null;
    }

    if ((element as FigureInterface).moveBoxPoint!==undefined){
      (element as FigureInterface).moveBoxPoint.forEach((item)=>{
        schemeHTML.removeChild(item);
      });
      (element as FigureInterface).moveBoxPoint = [];
    }

    for(let i=0;i<scheme.elementList.length;i++){
      if (scheme.elementList[i]===element){
        scheme.elementList.splice(i,1);
        break;
      }
    }

    scheme.currentElement = null;
    scheme.modified = true;
  }

  static addClearButton(field:HTMLInputElement,fnClear:any):void{

    field.style.backgroundImage = "url('"+"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAYAAACpUE5eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTQzOEVEQkZFMjRDMTFFM0JDMDVDMjFEMDk4MTc0QTMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTQzOEVEQzBFMjRDMTFFM0JDMDVDMjFEMDk4MTc0QTMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNDM4RURCREUyNEMxMUUzQkMwNUMyMUQwOTgxNzRBMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNDM4RURCRUUyNEMxMUUzQkMwNUMyMUQwOTgxNzRBMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pqwf5ocAAACpSURBVHjaYvT09GRjYGAQAuIXDISBBBC/3rZt219cCpighq0GYjkChslB1YniU8QEdVk0EC/FY6gcVD6akE+YoPQjPIYiG/aIUJgwIbGxGUqSYegGohtqQ6phIMCCRQykuRKIDwOxLSmGYXMhzJvtUMPaiYh9vAYih9kRImIfr4HYIuARqYYyERGbJBnKBM1OhGIT2VAJQrH8DohDicjLj6DqXuNTBBBgAL/OL+VnHD9pAAAAAElFTkSuQmCC"+"')";
    field.style.backgroundPosition = "100% 50%";
    field.style.backgroundRepeat = "no-repeat";
    field.style.paddingRight = "27px";
    field.style.transition = "background 0.4s";

    let originalCursor:string = field.style.cursor;

    field.addEventListener("mousemove",function (event) {
      let right:number = Number(field.style.left)+Number(field.style.width);
      if (event.clientX>=right){
        field.style.cursor = "pointer";
      }else{
        field.style.cursor = originalCursor;
      }
    });

    field.addEventListener("click",function (event) {

      let box = field.getBoundingClientRect();

      if (event.clientX>=box.right-27){
        fnClear(event,field);
      }
    });
  }

  static getAllFonts():Array<string>{

    let listFonts:Array<string> = [];
    let checkingFonts:Array<string> = [
      "academy engraved let"
      ,"algerian"
      ,"amaze"
      ,"arial"
      ,"arial black"
      ,"balthazar"
      ,"bankgothic lt bt"
      ,"bart"
      ,"bimini"
      ,"book antiqua"
      ,"bookman old style"
      ,"braggadocio"
      ,"britannic bold"
      ,"brush script mt"
      ,"calibri"
      ,"cambria"
      ,"candara"
      ,"century gothic"
      ,"century schoolbook"
      ,"chasm"
      ,"chicago"
      ,"colonna mt"
      ,"comic sans ms"
      ,"commercialscript bt"
      ,"consolas"
      ,"constantia"
      ,"coolsville"
      ,"corbel"
      ,"courier"
      ,"courier new"
      ,"cursive"
      ,"dayton"
      ,"desdemona"
      ,"estrangelo edessa"
      ,"fantasy"
      ,"flat brush"
      ,"footlight mt light"
      ,"franklin gothic medium"
      ,"futurablack bt"
      ,"futuralight bt"
      ,"gabriola"
      ,"garamond"
      ,"gautami"
      ,"gaze"
      ,"geneva"
      ,"georgia"
      ,"georgia italic impact"
      ,"geotype tt"
      ,"helterskelter"
      ,"helvetica"
      ,"herman"
      ,"highlight let"
      ,"impact"
      ,"jester"
      ,"joan"
      ,"john handy let"
      ,"jokerman let"
      ,"kelt"
      ,"kids"
      ,"kino mt"
      ,"la bamba let"
      ,"latha"
      ,"lithograph"
      ,"lucida console"
      ,"lucida sans console"
      ,"lucida sans unicode"
      ,"map symbols"
      ,"marlett"
      ,"matteroffact"
      ,"matisse itc"
      ,"matura mt script capitals"
      ,"mekanik let"
      ,"modern"
      ,"modern ms sans serif"
      ,"monaco"
      ,"monospace"
      ,"monotype sorts"
      ,"ms linedraw"
      ,"ms sans serif"
      ,"ms serif"
      ,"mv boli"
      ,"new york"
      ,"nyala"
      ,"olddreadfulno7 bt"
      ,"orange let"
      ,"palatino"
      ,"palatino linotype"
      ,"playbill"
      ,"pump demi bold let"
      ,"puppylike"
      ,"roland"
      ,"roman"
      ,"sans-serif"
      ,"script"
      ,"scripts"
      ,"scruff let"
      ,"segoe print"
      ,"segoe script"
      ,"segoe ui"
      ,"serif"
      ,"short hand"
      ,"signs normal"
      ,"simplex"
      ,"simpson"
      ,"small fonts"
      ,"stylus bt"
      ,"superfrench"
      ,"surfer"
      ,"swis721 bt"
      ,"swis721 blkoul bt"
      ,"symap"
      ,"symbol (symbol)"
      ,"tahoma"
      ,"technic"
      ,"tempus sans itc"
      ,"terk"
      ,"times"
      ,"times new roman"
      ,"trebuchet ms"
      ,"trendy"
      ,"txt"
      ,"tunga"
      ,"verdana"
      ,"victorian let"
      ,"vineta bt"
      ,"vivian"
      ,"webdings (webdings)"
      ,"western"
      ,"westminster"
      ,"westwood let"
      ,"wide latin"
      ,"wingdings (wingding)"
      ,"zapfellipt bt"
    ];

    let baseFonts = ['monospace', 'sans-serif', 'serif','cursive','fantasy'];

    let testString = "mmmmmmmmmmlli";
    let testSize = '72px';

    let h = document.getElementById("scheme");
    let s = document.createElement("span");
    s.style.fontSize = testSize;
    s.innerHTML = testString;
    let defaultWidth = {};
    let defaultHeight = {};
    for (let index in baseFonts) {
      //get the default width for the three base fonts
      s.style.fontFamily = baseFonts[index];
      h.appendChild(s);
      defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
      defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
      h.removeChild(s);
    }

    checkingFonts.forEach((font:string)=>{

      let detected = false;
      for (let index in baseFonts) {
        s.style.fontFamily = font + ',' + baseFonts[index]; // name of the font along with the base font for fallback.
        h.appendChild(s);

        if (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]){
          listFonts.push(font + ',' + baseFonts[index]);
        }
        h.removeChild(s);
      }
    });

    return listFonts;
  }

  static fillSelectOptions(ValueCell,item,listOptions:Array<{text:string,value:any}>):void{

    let fieldValue:HTMLSelectElement = document.createElement("select");

    let option:HTMLOptionElement;

    listOptions.forEach((element)=>{
      option = document.createElement("option");
      option.text = element.text;
      option.value = element.value;
      fieldValue.add(option);
    });

    fieldValue.value = item.value;

    fieldValue.onchange = function (event) {
      item.value = fieldValue.value;
    };

    ValueCell.appendChild(fieldValue);
  }

  static getHexRGBColor(color:string){

    color = color.replace(/\s/g,"");

    let aRGB = color.match(/^rgb\((\d{1,3}[%]?),(\d{1,3}[%]?),(\d{1,3}[%]?)\)$/i);

    if(aRGB){
      color = '';
      for (let i=1;  i<=3; i++) color += Math.round((aRGB[i][aRGB[i].length-1]=="%"?2.55:1)*parseInt(aRGB[i])).toString(16).replace(/^(.)$/,'0$1');
    }else color = color.replace(/^#?([\da-f])([\da-f])([\da-f])$/i, '$1$1$2$2$3$3');

    return color;
  }

  static getFarthestColor(checkedColor:string,color1:string,color2:string):string{

    let color:string = checkedColor.slice();

    if (color.substr(0,3)==='rgb'){
      color = '#'+Utils.getHexRGBColor(color);
    }

    let color1Distance:number = 0;
    let color2Distance:number = 0;

    for (let startPosition=1;startPosition<6;startPosition=startPosition+2){
      if (Math.abs(parseInt(color.substr(startPosition,2),16)-parseInt(color1.substr(startPosition,2),16))>Math.abs(parseInt(color.substr(startPosition,2),16)-parseInt(color2.substr(startPosition,2),16))){
        color1Distance=color1Distance+Math.abs(parseInt(color.substr(startPosition,2),16)-parseInt(color1.substr(startPosition,2),16));
      }else{
        color2Distance=color2Distance+Math.abs(parseInt(color.substr(startPosition,2),16)-parseInt(color2.substr(startPosition,2),16));
      }
    }

    if (color1Distance>color2Distance){
      return color1;
    }else{
      return color2;
    }
  }

  static getGUID():any{

    let validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");

    function gen(count):string {
      let out:string = "";
      for (let i=0; i<count; i++) {
        out += (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      }
      return out;
    }

    let Guid:any = function(guid) {
      if (!guid) throw new TypeError("Invalid argument; `value` has no value.");

      this.value = Guid.EMPTY;

      if (guid && guid instanceof Guid) {
        this.value = guid.toString();

      } else if (guid && Object.prototype.toString.call(guid) === "[object String]" && Guid.isGuid(guid)) {
        this.value = guid;
      }

      this.equals = function(other) {
        // Comparing string `value` against provided `guid` will auto-call
        // toString on `guid` for comparison
        return Guid.isGuid(other) && this.value == other;
      };

      this.isEmpty = function() {
        return this.value === Guid.EMPTY;
      };

      this.toString = function() {
        return this.value;
      };

      this.toJSON = function() {
        return this.value;
      };
    };

    Guid.EMPTY = "00000000-0000-0000-0000-000000000000";

    Guid.isGuid = function(value) {
      return value && (value instanceof Guid || validator.test(value.toString()));
    };

    Guid.create = function() {
      return new Guid([gen(2), gen(1), gen(1), gen(1), gen(3)].join("-"));
    };

    Guid.raw = function() {
      return [gen(2), gen(1), gen(1), gen(1), gen(3)].join("-");
    };

    return Guid;
  }

  static getSchemeDefaultProperties(scheme:SchemeInterface):any{

    let newScheme:SchemeInterface = Factory.createScheme(
      scheme.schemeHTML
      ,scheme.enclosedAlgorithmReturn
      ,scheme.classAttribute
    );

    return {
      id:newScheme.id
      ,title:''
      ,elementList:[]
      ,indent:newScheme.indent
      ,greedStep:newScheme.greedStep
      ,backgroundColor:newScheme.backgroundColor
      ,greedColor:newScheme.greedColor
    }
  }

  //Arrow static
  static readonly pointCaseArray:Array<Array<Array<{beginPoint:number,endPoint:number}>>> = [
    [
      [
        {beginPoint:1,endPoint:1},
        {beginPoint:2,endPoint:1},
        {beginPoint:4,endPoint:1},
        {beginPoint:4,endPoint:3},
        {beginPoint:4,endPoint:4}
      ],
      [
        {beginPoint:1,endPoint:2},
        {beginPoint:2,endPoint:2},
        {beginPoint:3,endPoint:2},
        {beginPoint:3,endPoint:3}
      ],
      [
        {beginPoint:3,endPoint:1},
        {beginPoint:3,endPoint:4}
      ],
      [
        {beginPoint:4,endPoint:2}
      ],
      [
        {beginPoint:1,endPoint:4},
        {beginPoint:2,endPoint:4}
      ],
      [
        {beginPoint:1,endPoint:3},
        {beginPoint:2,endPoint:3}
      ]
    ], //quarter 1
    [
      [
        {beginPoint:2,endPoint:3},
        {beginPoint:3,endPoint:3},
        {beginPoint:4,endPoint:1},
        {beginPoint:4,endPoint:3},
        {beginPoint:4,endPoint:4}
      ],
      [
        {beginPoint:1,endPoint:1},
        {beginPoint:1,endPoint:2},
        {beginPoint:2,endPoint:2},
        {beginPoint:3,endPoint:2}
      ],
      [
        {beginPoint:1,endPoint:3},
        {beginPoint:1,endPoint:4}
      ],
      [
        {beginPoint:4,endPoint:2}
      ],
      [
        {beginPoint:2,endPoint:4},
        {beginPoint:3,endPoint:4}
      ],
      [
        {beginPoint:2,endPoint:1},
        {beginPoint:3,endPoint:1}
      ]
    ],//quarter 2
    [
      [
        {beginPoint:2,endPoint:1},
        {beginPoint:2,endPoint:2},
        {beginPoint:2,endPoint:3},
        {beginPoint:3,endPoint:3},
        {beginPoint:4,endPoint:3}
      ],
      [
        {beginPoint:1,endPoint:1},
        {beginPoint:1,endPoint:4},
        {beginPoint:3,endPoint:4},
        {beginPoint:4,endPoint:4}
      ],
      [
        {beginPoint:1,endPoint:2},
        {beginPoint:1,endPoint:3}
      ],
      [
        {beginPoint:2,endPoint:4}
      ],
      [
        {beginPoint:3,endPoint:2},
        {beginPoint:4,endPoint:2}
      ],
      [
        {beginPoint:3,endPoint:1},
        {beginPoint:4,endPoint:1}
      ]
    ],//quarter 3
    [
      [
        {beginPoint:1,endPoint:1},
        {beginPoint:2,endPoint:1},
        {beginPoint:2,endPoint:2},
        {beginPoint:2,endPoint:3},
        {beginPoint:4,endPoint:1}
      ],
      [
        {beginPoint:1,endPoint:4},
        {beginPoint:3,endPoint:3},
        {beginPoint:3,endPoint:4},
        {beginPoint:4,endPoint:4}
      ],
      [
        {beginPoint:3,endPoint:1},
        {beginPoint:3,endPoint:2}
      ],
      [
        {beginPoint:2,endPoint:4}
      ],
      [
        {beginPoint:1,endPoint:2},
        {beginPoint:4,endPoint:2}
      ],
      [
        {beginPoint:1,endPoint:3},
        {beginPoint:4,endPoint:3}
      ]
    ] //quarter 4
  ];


  static removeDuplicationFromPath(path:Array<CoordinateXY>):Array<CoordinateXY>{

    let answer:Array<CoordinateXY> = path.slice();

    if (path.length>1){

      answer = [];

      let x:number = path[0].x;
      let y:number = path[0].y;

      answer.push(path[0]);

      for (let i=1;i<path.length;i++){
        if (path[i].x!==x || path[i].y!==y){
          answer.push(path[i]);
        }
        x = path[i].x;
        y = path[i].y;
      }
    }

    return answer;
  }

  static getDirection(x:number,y:number,nextX:number,nextY:number):enumDirection {
    let nextDirection = enumDirection.DEFAULT;
    if (x < nextX) {
      nextDirection = enumDirection.RIGHT;
    }
    if (x > nextX) {
      nextDirection = enumDirection.LEFT;
    }
    if (y > nextY) {
      nextDirection = enumDirection.UP;
    }
    if (y < nextY) {
      nextDirection = enumDirection.DOWN;
    }
    return nextDirection;
  }

  static addPointToPath(path:Array<any>,point:CoordinateXY):void {

    for (let i=path.length-1;i>=0;i--){
      if (path[i].x === point.x && path[i].y === point.y){
        return;
      }
    }

    path.push(point);
  }

  static getQuarterSimplyPath(startX:number,startY:number,finishX:number,finishY:number):number{

    let quarter:number = 1;

    if (Math.abs(finishY-startY)<=2 || Math.abs(finishX-startX)<=2){

      if (Math.abs(finishX-startX)<=2 && Math.abs(finishY-startY)<=2){

        if (Math.abs(finishX-startX)<=2){
          if (startY>finishY){
            quarter = 9;
          }else{
            quarter = 11;
          }
        }
        if (Math.abs(finishY-startY)<=2){
          if (startX>finishX){
            quarter = 12;
          }else{
            quarter = 10;
          }
        }

      }else{
        if (Math.abs(finishX-startX)<=2){
          if (startY>finishY){
            quarter = 5;
          }else{
            quarter = 7;
          }
        }
        if (Math.abs(finishY-startY)<=2){
          if (startX>finishX){
            quarter = 8;
          }else{
            quarter = 6;
          }
        }
      }
    }else{
      if (startX>finishX && startY>finishY){
        quarter = 1;
      }
      if (startX<finishX && startY>finishY){
        quarter = 2;
      }
      if (startX<finishX && startY<finishY){
        quarter = 3;
      }
      if (startX>finishX && startY<finishY){
        quarter = 4;
      }
    }

    return quarter;
  }

  static setPointsInSimplyPathOneRaw(
    pointCase:number
    ,simplyPath:Array<CoordinateXY>
    ,startX:number
    ,startY:number
    ,finishX:number
    ,finishY:number
    ,hasVariant:boolean
    ,variant:number
  ):void{

    switch (pointCase){
      case 1:{
        simplyPath.push({x:finishX,y:startY});
        break;
      }
      case 2:{
        simplyPath.push({x:startX,y:finishY});
        break;
      }
      case 3:{
        let yMiddle =  startY+Math.floor((finishY-startY)/2);
        simplyPath.push({x:startX,y:yMiddle});
        simplyPath.push({x:finishX,y:yMiddle});
        break;
      }
      case 4:{
        let xMiddle = startX+Math.floor((finishX-startX)/2);
        simplyPath.push({x:xMiddle,y:startY});
        simplyPath.push({x:xMiddle,y:finishY});
        break;
      }
      case 5:{
        hasVariant = true;

        switch (variant){
          case 1:{
            Utils.setPointsInSimplyPathOneRaw(2,simplyPath,startX,startY,finishX,finishY,hasVariant,variant);
            break;
          }
          case 2:{
            Utils.setPointsInSimplyPathOneRaw(1,simplyPath,startX,startY,finishX,finishY,hasVariant,variant);
            break;
          }
          case 3:{
            Utils.setPointsInSimplyPathOneRaw(3,simplyPath,startX,startY,finishX,finishY,hasVariant,variant);
            break;
          }
        }
        break;
      }
      case 6:{
        hasVariant = true;

        switch (variant){
          case 1:{
            Utils.setPointsInSimplyPathOneRaw(2,simplyPath,startX,startY,finishX,finishY,hasVariant,variant);
            break;
          }
          case 2:{
            Utils.setPointsInSimplyPathOneRaw(1,simplyPath,startX,startY,finishX,finishY,hasVariant,variant);
            break;
          }
          case 3:{
            Utils.setPointsInSimplyPathOneRaw(4,simplyPath,startX,startY,finishX,finishY,hasVariant,variant);
            break;
          }
        }
        break;
      }
    }
  }

  static setPointsInSimplyPathTwoRaw(quarter:number,simplyPath:Array<CoordinateXY>,startX:number,startY:number,finishX:number,finishY:number,beginPoint:number,endPoint:number):void{

    switch (quarter){
      case 5:{

        if (!(endPoint===4 && startX===finishX)){

          let yMiddle = startY;
          if (Math.abs(finishY-startY)>5){
            yMiddle =  startY+Math.floor((finishY-startY)/2);
          }

          if (endPoint===4 || endPoint===1){
            Utils.addPointToPath(simplyPath,{x:startX,y:yMiddle});
            Utils.addPointToPath(simplyPath,{x:startX-2,y:yMiddle});
            Utils.addPointToPath(simplyPath,{x:startX-2,y:finishY});
          }else{
            Utils.addPointToPath(simplyPath,{x:startX,y:yMiddle});
            Utils.addPointToPath(simplyPath,{x:startX+2,y:yMiddle});
            Utils.addPointToPath(simplyPath,{x:startX+2,y:finishY});
          }
        }

        break;
      }
      case 6:{

        if (!(endPoint===1 && startY===finishY)){

          let xMiddle =  startX;
          if (Math.abs(finishX-startX)>5){
            xMiddle =  startX+Math.floor((finishX-startX)/2);
          }

          if (endPoint===1 || endPoint===2){
            Utils.addPointToPath(simplyPath,{x:xMiddle,y:startY});
            Utils.addPointToPath(simplyPath,{x:xMiddle,y:startY-2});
            Utils.addPointToPath(simplyPath,{x:finishX,y:startY-2});
          }else{
            Utils.addPointToPath(simplyPath,{x:xMiddle,y:startY});
            Utils.addPointToPath(simplyPath,{x:xMiddle,y:startY+2});
            Utils.addPointToPath(simplyPath,{x:finishX,y:startY+2});
          }
        }

        break;
      }
      case 7:{

        if (!(endPoint===2 && startX===finishX)){

          let yMiddle = startY;
          if (Math.abs(finishY-startY)>5){
            yMiddle =  startY+Math.floor((finishY-startY)/2);
          }

          if (endPoint===2 || endPoint===1){
            Utils.addPointToPath(simplyPath,{x:startX,y:yMiddle});
            Utils.addPointToPath(simplyPath,{x:startX-2,y:yMiddle});
            Utils.addPointToPath(simplyPath,{x:startX-2,y:finishY});
          }else{
            Utils.addPointToPath(simplyPath,{x:startX,y:yMiddle});
            Utils.addPointToPath(simplyPath,{x:startX+2,y:yMiddle});
            Utils.addPointToPath(simplyPath,{x:startX+2,y:finishY});
          }
        }

        break;
      }
      case 8: {

        if (!(endPoint === 3 && startY === finishY)) {

          let xMiddle =  startX;
          if (Math.abs(finishX-startX)>5){
            xMiddle =  startX+Math.floor((finishX-startX)/2);
          }

          if (endPoint===3 || endPoint===2){
            Utils.addPointToPath(simplyPath,{x:xMiddle,y:startY});
            Utils.addPointToPath(simplyPath,{x:xMiddle,y:startY-2});
            Utils.addPointToPath(simplyPath,{x:finishX,y:startY-2});
          }else{
            Utils.addPointToPath(simplyPath,{x:xMiddle,y:startY});
            Utils.addPointToPath(simplyPath,{x:xMiddle,y:startY+2});
            Utils.addPointToPath(simplyPath,{x:finishX,y:startY+2});
          }

        }

        break;
      }
    }
  }

  static setPointsInSimplyPathThreeRaw(quarter:number,simplyPath:Array<CoordinateXY>,startX:number,startY:number,finishX:number,finishY:number,beginPoint:number,endPoint:number):void{

  }

  static getSimplyPathPointCase(pointQuarterCaseArray:Array<Array<{beginPoint:number,endPoint:number}>>,beginPoint:number,endPoint:number):number{

    for (let i=0;i<pointQuarterCaseArray.length;i++){
      for(let j=0;j<pointQuarterCaseArray[i].length;j++){
        if (pointQuarterCaseArray[i][j].beginPoint===beginPoint && pointQuarterCaseArray[i][j].endPoint===endPoint){
          return i+1;
        }
      }
    }

    return 0;
  }

  static getSimplyPath(startX:number,startY:number,finishX:number,finishY:number,beginPoint:number,endPoint:number, variant:number, hasVariant:boolean):Array<CoordinateXY> {

    let simplyPath:Array<CoordinateXY> = [];
    simplyPath.push({x:startX,y:startY});

    hasVariant = false;

    let quarter:number = Utils.getQuarterSimplyPath(startX,startY,finishX,finishY);

    switch (quarter) {
      case 1:
      case 2:
      case 3:
      case 4:{
        let pointCase:number = Utils.getSimplyPathPointCase(Utils.pointCaseArray[quarter-1],beginPoint,endPoint);
        Utils.setPointsInSimplyPathOneRaw(pointCase,simplyPath,startX,startY,finishX,finishY,hasVariant,variant);
        break;
      }
      case 5:
      case 6:
      case 7:
      case 8:{
        Utils.setPointsInSimplyPathTwoRaw(quarter,simplyPath,startX,startY,finishX,finishY,beginPoint,endPoint);
        break;
      }

      case 9:
      case 10:
      case 11:
      case 12:{
        Utils.setPointsInSimplyPathThreeRaw(quarter,simplyPath,startX,startY,finishX,finishY,beginPoint,endPoint);
        break;
      }

    }

    Utils.addPointToPath(simplyPath,{x:finishX,y:finishY});
    return simplyPath;
  }

  static getCrossingPiecesPoint(beginPoint:CoordinateXY,endPoint:CoordinateXY,crossingBeginPoint:CoordinateXY,crossingEndPoint:CoordinateXY):CoordinateXY {

    //vertical
    if (crossingBeginPoint.x===crossingEndPoint.x && beginPoint.x!=endPoint.x){

      if (beginPoint.x<endPoint.x){//right
        if (crossingBeginPoint.x>=beginPoint.x && crossingBeginPoint.x<=endPoint.x && crossingBeginPoint.y<=beginPoint.y && crossingEndPoint.y>=beginPoint.y){
          return {x:crossingBeginPoint.x,y:beginPoint.y};
        }
      }else{//left
        if (crossingBeginPoint.x<=beginPoint.x && crossingBeginPoint.x>=endPoint.x && crossingBeginPoint.y<=beginPoint.y && crossingEndPoint.y>=beginPoint.y){
          return {x:crossingBeginPoint.x,y:beginPoint.y};
        }
      }
    }

    //horizontal
    if (crossingBeginPoint.y===crossingEndPoint.y && beginPoint.y!=endPoint.y){

      if (beginPoint.y<endPoint.y){//down
        if (crossingBeginPoint.y>=beginPoint.y && crossingBeginPoint.y<endPoint.y && crossingBeginPoint.x<=beginPoint.x && crossingEndPoint.x>=beginPoint.x){
          return {x:beginPoint.x,y:crossingBeginPoint.y};
        }
      }else{//up
        if (crossingBeginPoint.y<=beginPoint.y && crossingBeginPoint.y>endPoint.y && crossingBeginPoint.x<=beginPoint.x && crossingEndPoint.x>=beginPoint.x){
          return {x:beginPoint.x,y:crossingBeginPoint.y};
        }
      }
    }

    return null;
  }

  static getCrossingPiecesList(path:Array<CoordinateXY>,left:number,right:number,top:number,bottom:number):Array<CoordinateXY> {

    let crossingPiecesList:Array<CoordinateXY> = [];
    let directionX,directionY:enumDirection;
    let pointRight,pointUp,pointLeft,pointDown:CoordinateXY;

    let previousPoint:CoordinateXY = path[0];
    for (let i=1;i<path.length;i++){

      directionX = Utils.getDirection(previousPoint.x,0,path[i].x,0);
      directionY = Utils.getDirection(0,previousPoint.y,0,path[i].y);

      switch (directionX){
        case enumDirection.RIGHT:{

          pointLeft = Utils.getCrossingPiecesPoint(previousPoint,path[i],{x:left,y:top},{x:left,y:bottom});
          if (pointLeft!==null){
            crossingPiecesList.push(pointLeft);
          }

          pointRight = Utils.getCrossingPiecesPoint(previousPoint,path[i],{x:right,y:top},{x:right,y:bottom});
          if (pointRight!==null){
            crossingPiecesList.push(pointRight);
          }
          break;
        }
        case enumDirection.LEFT:{

          pointRight = Utils.getCrossingPiecesPoint(previousPoint,path[i],{x:right,y:top},{x:right,y:bottom});
          if (pointRight!=null){
            crossingPiecesList.push(pointRight);
          }

          pointLeft = Utils.getCrossingPiecesPoint(previousPoint,path[i],{x:left,y:top},{x:left,y:bottom});
          if (pointLeft!=null){
            crossingPiecesList.push(pointLeft);
          }
          break;
        }
      }

      switch (directionY){
        case enumDirection.UP:{

          pointDown = Utils.getCrossingPiecesPoint(previousPoint,path[i],{x:left,y:bottom},{x:right,y:bottom});
          if (pointDown!==null){
            crossingPiecesList.push(pointDown);
          }
          pointUp = Utils.getCrossingPiecesPoint(previousPoint,path[i],{x:left,y:top},{x:right,y:top});
          if (pointUp!==null){
            crossingPiecesList.push(pointUp);
          }
          break;
        }
        case enumDirection.DOWN:{

          pointUp = Utils.getCrossingPiecesPoint(previousPoint,path[i],{x:left,y:top},{x:right,y:top});
          if (pointUp!==null){
            crossingPiecesList.push(pointUp);
          }
          pointDown = Utils.getCrossingPiecesPoint(previousPoint,path[i],{x:left,y:bottom},{x:right,y:bottom});
          if (pointDown!==null){
            crossingPiecesList.push(pointDown);
          }
          break;
        }
      }

      previousPoint = path[i];
    }

    return crossingPiecesList;
  }

  static isPointAfter(point1:CoordinateXY,point2:CoordinateXY,path:Array<CoordinateXY>):boolean{

    let result:boolean = true;

    let findPoint1:number = 0;
    for (let i=1;i<path.length;i++){

      if (path[i-1].y === path[i].y){//horizontal

        if (path[i-1].x < path[i].x){//right
          if (path[i-1].x <= point1.x && path[i-1].y <= point1.y && path[i].x >= point1.x && path[i].y >= point1.y){
            findPoint1 = i;
            break;
          }
        }else{//left
          if (path[i-1].x >= point1.x && path[i-1].y <= point1.y && path[i].x <= point1.x && path[i].y >= point1.y){
            findPoint1 = i;
            break;
          }
        }

      }else{//vertical
        if (path[i-1].y < path[i].y){//down
          if (path[i-1].x <= point1.x && path[i-1].y <= point1.y && path[i].x >= point1.x && path[i].y >= point1.y){
            findPoint1 = i;
            break;
          }
        }else{//up
          if (path[i-1].x <= point1.x && path[i-1].y >= point1.y && path[i].x >= point1.x && path[i].y <= point1.y){
            findPoint1 = i;
            break;
          }
        }
      }

    }

    let findPoint2:number = 0;
    for (let i=0;i<path.length;i++){
      if (path[i].x === point2.x && path[i].y === point2.y){
        findPoint2 = i;
        break;
      }
    }

    if (findPoint2<findPoint1){
      result = false;
    }else{
      if (findPoint2===findPoint1){
        if (path[findPoint1].x>path[findPoint1-1].x || path[findPoint1].y>path[findPoint1-1].y){
          if (point1.x>=point2.x && point1.y>=point2.y){
            result = false;
          }
        }else{
          if (point1.x<=point2.x && point1.y<=point2.y){
            result = false;
          }
        }
      }
    }

    return result;
  }

  static getPointSide(firstPoint:CoordinateXY,secondPoint:CoordinateXY,element:CoordinateRightBottom):number {

    let firstPointSide:number = 0;
    if (firstPoint.x===element.left){
      firstPointSide = 1;
    }
    if (firstPoint.x===element.right){
      firstPointSide = 3;
    }
    if (firstPoint.y===element.top){
      firstPointSide = 2;
    }
    if (firstPoint.y===element.bottom){
      firstPointSide = 4;
    }

    let secondPointSide = 0;
    if (secondPoint.x===element.left){
      secondPointSide = 1;
    }
    if (secondPoint.x===element.right){
      secondPointSide = 3;
    }
    if (secondPoint.y===element.top){
      secondPointSide = 2;
    }
    if (secondPoint.y===element.bottom){
      secondPointSide = 4;
    }

    return firstPointSide*10+secondPointSide;
  }

  static placeElementToPath(arrayPaths:Array<Array<CoordinateXY>>,element:CoordinateRightBottom):Array<Array<CoordinateXY>> {

    let resultArrayPaths:Array<Array<CoordinateXY>> = [];

    for (let pathCounter=0;pathCounter<arrayPaths.length;pathCounter++){

      let path:Array<CoordinateXY> = arrayPaths[pathCounter];

      let crossingPiecesList:Array<CoordinateXY> = Utils.getCrossingPiecesList(path,element.left,element.right,element.top,element.bottom);

      if (crossingPiecesList.length===2) {

        let firstPoint:CoordinateXY = crossingPiecesList[0];
        let secondPoint:CoordinateXY = crossingPiecesList[1];
        let pointSide:number = Utils.getPointSide(firstPoint,secondPoint,element);

        if (pointSide===13 || pointSide===24 || pointSide===31 || pointSide===42){

          let usedBranch = 0;//{1,2}

          for (let loopTwoTime=1;loopTwoTime<=2;loopTwoTime++){

            let newPath:Array<CoordinateXY> = [];

            newPath.push(path[0]);

            //The first path

            //We need take the first cut-point
            for (let i = 1; i < path.length; i++) {
              if (!Utils.isPointAfter(firstPoint, path[i], path)) {
                Utils.addPointToPath(newPath,path[i]);
              } else {
                break;
              }
            }

            Utils.addPointToPath(newPath,firstPoint);

            switch (pointSide){
              case 13:{

                switch (usedBranch){
                  case 0:{
                    if (Math.abs(firstPoint.y-element.bottom)<=Math.abs(firstPoint.y-element.top)){ //bottom

                      Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
                      Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
                      usedBranch = 1;
                    }else{//top
                      Utils.addPointToPath(newPath,{x: element.left, y: element.top});
                      Utils.addPointToPath(newPath,{x: element.right, y: element.top});
                      usedBranch = 2;
                    }
                    break;
                  }
                  case 1:{//bottom
                    Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
                    Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
                    usedBranch = 1;
                    break;
                  }
                  case 2:{//top
                    Utils.addPointToPath(newPath,{x: element.left, y: element.top});
                    Utils.addPointToPath(newPath,{x: element.right, y: element.top});
                    usedBranch = 2;
                    break
                  }
                }

                break;
              }
              case 24:{

                switch (usedBranch){
                  case 0:{
                    if (Math.abs(firstPoint.x-element.right)<=Math.abs(firstPoint.x-element.left)){ //right
                      Utils.addPointToPath(newPath,{x: element.right, y: element.top});
                      Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
                      usedBranch = 1;
                    }else{//left
                      Utils.addPointToPath(newPath,{x: element.left, y: element.top});
                      Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
                      usedBranch = 2;
                    }
                    break;
                  }
                  case 1:{//right
                    Utils.addPointToPath(newPath,{x: element.right, y: element.top});
                    Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
                    usedBranch = 1;
                    break;
                  }
                  case 2:{//left
                    Utils.addPointToPath(newPath,{x: element.left, y: element.top});
                    Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
                    usedBranch = 2;
                    break
                  }
                }

                break;
              }
              case 31:{

                switch (usedBranch){
                  case 0:{
                    if (Math.abs(firstPoint.y-element.bottom)<=Math.abs(firstPoint.y-element.top)){ //bottom
                      Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
                      Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
                      usedBranch = 1;
                    }else{//top
                      Utils.addPointToPath(newPath,{x: element.right, y: element.top});
                      Utils.addPointToPath(newPath,{x: element.left, y: element.top});
                      usedBranch = 2;
                    }
                    break;
                  }
                  case 1:{//bottom
                    Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
                    Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
                    usedBranch = 1;
                    break;
                  }
                  case 2:{//top
                    Utils.addPointToPath(newPath,{x: element.right, y: element.top});
                    Utils.addPointToPath(newPath,{x: element.left, y: element.top});
                    usedBranch = 2;
                    break
                  }
                }

                break;
              }
              case 42:{

                switch (usedBranch){
                  case 0:{
                    if (Math.abs(firstPoint.x-element.right)<=Math.abs(firstPoint.x-element.left)){ //right
                      Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
                      Utils.addPointToPath(newPath,{x: element.right, y: element.top});
                      usedBranch = 1;
                    }else{//left
                      Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
                      Utils.addPointToPath(newPath,{x: element.left, y: element.top});
                      usedBranch = 2;
                    }
                    break;
                  }
                  case 1:{//right
                    Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
                    Utils.addPointToPath(newPath,{x: element.right, y: element.top});
                    usedBranch = 1;
                    break;
                  }
                  case 2:{//left
                    Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
                    Utils.addPointToPath(newPath,{x: element.left, y: element.top});
                    usedBranch = 2;
                    break
                  }
                }

                break;
              }
            }

            //We need take the second cut-point
            newPath.push(secondPoint);

            for (let i = 1; i < path.length; i++) {
              if (Utils.isPointAfter(secondPoint, path[i], path)) {
                Utils.addPointToPath(newPath,path[i]);
              }
            }

            resultArrayPaths.push(newPath);
          }

        }else{

          let newPath:Array<CoordinateXY> = [];

          newPath.push(path[0]);

          //The first path

          //We need take the first cut-point
          for (let i = 1; i < path.length; i++) {
            if (!Utils.isPointAfter(firstPoint, path[i], path)) {
              newPath.push(path[i]);
            } else {
              break;
            }
          }

          newPath.push(firstPoint);

          switch (pointSide){
            case 12:{
              Utils.addPointToPath(newPath,{x: element.left, y: element.top});
              break;
            }
            case 14:{
              Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
              break;
            }
            case 21:{
              Utils.addPointToPath(newPath,{x: element.left, y: element.top});
              break;
            }
            case 23:{
              Utils.addPointToPath(newPath,{x: element.right, y: element.top});
              break;
            }
            case 32:{
              Utils.addPointToPath(newPath,{x: element.right, y: element.top});
              break;
            }
            case 34:{
              Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
              break;
            }
            case 41:{
              Utils.addPointToPath(newPath,{x: element.left, y: element.bottom});
              break;
            }
            case 43:{
              Utils.addPointToPath(newPath,{x: element.right, y: element.bottom});
              break;
            }
          }

          //We need take the second cut-point
          newPath.push(secondPoint);

          for (let i = 1; i < path.length; i++) {
            if (Utils.isPointAfter(secondPoint, path[i], path)) {
              newPath.push(path[i]);
            }
          }

          resultArrayPaths.push(newPath);
        }

      }else {
        resultArrayPaths.push(path);
      }
    }

    //arrayPaths = resultArrayPaths.slice();

    return resultArrayPaths;
  }

  static getArrayPoint(
    listElementsWithoutArrow:Array<{name:string,left:number,right:number,top:number,bottom:number}>
    ,startX:number
    ,startY:number
    ,finishX:number
    ,finishY:number
    ,beginPoint:number
    ,endPoint:number
  ):Array<Array<CoordinateXY>> {

    let resultArrayPaths:Array<Array<CoordinateXY>> = [];

    let hasVariant:boolean = false;
    let startPath:Array<CoordinateXY> = Utils.getSimplyPath(startX,startY,finishX,finishY,beginPoint,endPoint,1,hasVariant);
    resultArrayPaths.push(startPath);

    if (hasVariant){
      startPath = Utils.getSimplyPath(startX,startY,finishX,finishY,beginPoint,endPoint,2,hasVariant);
      resultArrayPaths.push(startPath);

      startPath = Utils.getSimplyPath(startX,startY,finishX,finishY,beginPoint,endPoint,3,hasVariant);
      resultArrayPaths.push(startPath);
    }

    listElementsWithoutArrow.forEach((item)=>{
      resultArrayPaths = Utils.placeElementToPath(resultArrayPaths,item);
    });

    return resultArrayPaths;
  }

  static oppositeDirection(beforeDirection:enumDirection,nextDirection:enumDirection):boolean {

    return (
      (beforeDirection === enumDirection.RIGHT && nextDirection === enumDirection.LEFT) ||
      (beforeDirection === enumDirection.LEFT && nextDirection === enumDirection.RIGHT) ||
      (beforeDirection === enumDirection.UP && nextDirection === enumDirection.DOWN) ||
      (beforeDirection === enumDirection.DOWN && nextDirection === enumDirection.UP));
  }

  static beginDiv(currentThis:ArrowInterface):void{

    if (currentThis.endElement!==null && currentThis.endElement.className!==enumFigure.SelectedArrowBox && currentThis.lineList.length>1){

      let coordinateOut = currentThis.beginElement.getBeginPointCoordinate(currentThis.beginPoint);

      let beginDiv = currentThis.beginDiv;
      if (beginDiv===null || beginDiv===undefined){
        beginDiv = document.createElement("div");
        beginDiv.setAttribute(currentThis.scheme.classAttribute,'');
        beginDiv.classList.add('scheme-arrow-selected-begin');
        currentThis.beginDiv = beginDiv;
        currentThis.scheme.schemeHTML.appendChild(beginDiv);
      }

      let arrowBegin = {
        type:coordinateOut.direction,
        left:coordinateOut.x-5,
        top:coordinateOut.y-5,
        width:10,
        height:10
      };

      beginDiv.style.left = arrowBegin.left+currentThis.scheme.leftScheme+"px";
      beginDiv.style.top = arrowBegin.top+currentThis.scheme.topScheme+"px";
      beginDiv.style.width = arrowBegin.width+'px';
      beginDiv.style.height = arrowBegin.height+'px';

      let coordinate = {
        direction:coordinateOut.direction,
        x:coordinateOut.x,
        y:coordinateOut.y
      };

      beginDiv.onclick = function(){
        Factory.createSelectedBeginArrowBox(currentThis,coordinate);
      };
    }else{
      if (currentThis.beginDiv!==null){
        currentThis.scheme.schemeHTML.removeChild(currentThis.beginDiv);
        currentThis.beginDiv = null;
      }
    }
  }

  static getArrowCurveTypeFromDirections(beginDirection:enumDirection,finishDirection:enumDirection):enumArrowCurveType{

    let result:enumArrowCurveType = enumArrowCurveType.DOWN_LEFT;

    let arrayEnum = [
      {name:'3_1', value:enumArrowCurveType.DOWN_LEFT}
      ,{name:'3_0', value:enumArrowCurveType.DOWN_RIGHT}
      ,{name:'1_3', value:enumArrowCurveType.LEFT_DOWN}
      ,{name:'1_2', value:enumArrowCurveType.LEFT_UP}
      ,{name:'0_2', value:enumArrowCurveType.RIGHT_UP}
      ,{name:'2_1', value:enumArrowCurveType.UP_LEFT}
      ,{name:'2_0', value:enumArrowCurveType.UP_RIGHT}
      ,{name:'0_3', value:enumArrowCurveType.RIGHT_DOWN}
    ];

    let findName:string = beginDirection.toString()+"_"+finishDirection.toString();
    for (let i=0;i<arrayEnum.length;i++){
      if (arrayEnum[i].name===findName){
        result = arrayEnum[i].value;
        break;
      }
    }

    return result;
  }

  //Figure
  static stateEditableTitle(elementHTML:HTMLDivElement, element:AllFiguresTypes|VariantInterface, classAttribute:string,readOnly:boolean):void{

    let editableTitle:HTMLDivElement = document.createElement("div");
    editableTitle.setAttribute(classAttribute,'');
    editableTitle.classList.add("select-none");
    editableTitle.classList.add("editable-title");
    editableTitle.style.textAlign = "center";
    editableTitle.innerText = element.title;
    element.editableTitleDiv = editableTitle;
    elementHTML.appendChild(element.editableTitleDiv);

    let edit:HTMLInputElement = document.createElement("input");
    edit.setAttribute(classAttribute,'');
    edit.classList.add("editable-title");
    edit.type = "text";
    edit.hidden = true;
    elementHTML.appendChild(edit);

    if (!readOnly){

      let finishEditing = function(isCanceled:boolean){

        if (!isCanceled){
          editableTitle.innerText = edit.value;
          element.title = edit.value;
        }

        editableTitle.hidden = false;
        edit.hidden = true;
      };

      edit.onchange = function (event) {
        finishEditing(false);
      };

      edit.onkeydown = function (event:KeyboardEvent) {

        switch (event.key){
          case 'Escape':{
            finishEditing(true);
            break;
          }
          case 'Enter':{
            finishEditing(false);
            break;
          }
        }
      };

      edit.onblur = function (event:FocusEvent) {
        finishEditing(false);
      };

      editableTitle.ondblclick = function (event) {

        edit.value = element.title;
        edit.style.width = Number(editableTitle.style.width.replace("px",""))-5+"px";
        edit.style.top = editableTitle.style.paddingTop;

        editableTitle.hidden = true;
        edit.hidden = false;

        edit.focus();
      };
    }
  }

  static enumFigureAsString(className:enumFigure):{name:enumFigure,value:string,reference:string}{

    let arr:Array<{name:enumFigure,value:string,reference:string}> = [];

    arr.push({name:enumFigure.SwitchElement,value:"SwitchElement",reference:"Switch"});
    arr.push({name:enumFigure.Variant,value:"Variant",reference:"Variant"});
    arr.push({name:enumFigure.DataProcessorPointElement,value:"DataProcessorPointElement",reference:"Data processor point"});
    arr.push({name:enumFigure.EndElement,value:"EndElement",reference:"End"});
    arr.push({name:enumFigure.StartElement,value:"StartElement",reference:"Start"});
    arr.push({name:enumFigure.ConditionElement,value:"ConditionElement",reference:"Condition"});
    arr.push({name:enumFigure.SceneryElement,value:"SceneryElement",reference:"Scenery"});
    arr.push({name:enumFigure.EnclosedAlgorithmElement,value:"EnclosedAlgorithmElement",reference:"Enclosed algorithm"});
    arr.push({name:enumFigure.Arrow,value:"Arrow",reference:"Arrow"});
    arr.push({name:enumFigure.SelectedArrowBox,value:"SelectedArrowBox",reference:"SelectedArrowBox"});
    arr.push({name:enumFigure.SelectedBeginArrowBox,value:"SelectedBeginArrowBox",reference:"SelectedBeginArrowBox"});

    return arr[className];
  }

}
