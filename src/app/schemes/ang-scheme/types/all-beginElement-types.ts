import {SelectedBeginArrowBoxInterface} from "../figures/selected-begin-arrow-box-interface";
import {DataProcessorPointElementInterface} from "../figures/data-processor-point-element-interface";
import {StartElementInterface} from "../figures/start-element-interface";
import {ConditionElementInterface} from "../figures/condition-element-interface";
import {EnclosedAlgorithmElementInterface} from "../figures/enclosed-algorithm-element-interface";
import {VariantInterface} from "../figures/switch-element-interface";

export type AllBeginElementTypes =
  DataProcessorPointElementInterface
  | VariantInterface
  | StartElementInterface
  | ConditionElementInterface
  | EnclosedAlgorithmElementInterface
  | SelectedBeginArrowBoxInterface;

export type AllBeginElementTypesHavingBeginPoint =
  DataProcessorPointElementInterface
  | VariantInterface
  | StartElementInterface
  | EnclosedAlgorithmElementInterface;
