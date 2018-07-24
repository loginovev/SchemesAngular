import {DataProcessorPointElementInterface} from "../figures/data-processor-point-element-interface";
import {EndElementInterface} from "../figures/end-element-interface";
import {SwitchElementInterface} from "../figures/switch-element-interface";
import {StartElementInterface} from "../figures/start-element-interface";
import {ConditionElementInterface} from "../figures/condition-element-interface";
import {SceneryElementInterface} from "../figures/scenery-element-interface";
import {EnclosedAlgorithmElementInterface} from "../figures/enclosed-algorithm-element-interface";

export type AllFiguresTypes=
    DataProcessorPointElementInterface
    | EndElementInterface
    | SwitchElementInterface
    | StartElementInterface
    | ConditionElementInterface
    | SceneryElementInterface
    | EnclosedAlgorithmElementInterface;
