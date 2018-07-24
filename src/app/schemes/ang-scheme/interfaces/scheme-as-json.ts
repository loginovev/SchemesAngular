import {AllElementListTypes} from "../types/all-elementList-types";
import {AllFiguresTypes} from "../types/all-figures-types";

export interface SchemeAsJson{
  version:string;
  id:string;
  title:string;
  elementList:AllElementListTypes[];
  indent:number;

  greedStep:number;
  backgroundColor:string;
  greedColor:string;
}
