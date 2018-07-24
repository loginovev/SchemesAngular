import {AllElementListTypes} from "../types/all-elementList-types";
export interface EnclosedSchemeInterface{

    idElement:string;
    elementList:Array<AllElementListTypes>;
    indent:number;
    greedStep:number;
    backgroundColor:string;
    greedColor:string;
}
