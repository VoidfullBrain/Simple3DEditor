import { Transform as TransformEnum } from "../../../../enum/enum.transform";
import { SelectionType as SelectionTypeEnum } from "../../../../enum/enum.selection-type";
import {Transform} from "../../../../editor/api/api.transform";
import {SelectionType} from "../../../../editor/api/api.selection-type";

export const config = {
  buttonContainers: [
    {
      name: 'transform',
      className: Transform,
      icon: 'assets/svg/transform.svg',
      buttons: [
        {
          name: TransformEnum.translate,
          methodName: 'translate',
          icon: 'assets/svg/translate.svg',
        },
        {
          name: TransformEnum.scale,
          methodName: 'scale',
          icon: 'assets/svg/scale.svg',
        },
        {
          name: TransformEnum.rotate,
          methodName: 'rotate',
          icon: 'assets/svg/rotate.svg',
        },
      ]
    },
    {
      name: 'selection-type',
      className: SelectionType,
      icon: 'assets/svg/geometry-arrow.svg',
      buttons: [
        {
          name: SelectionTypeEnum.geometry,
          methodName: 'geometrySelection',
          icon: 'assets/svg/geometry.svg',
        },
        {
          name: SelectionTypeEnum.polygon,
          methodName: 'polygonSelection',
          icon: 'assets/svg/polygon.svg',
        },
        {
          name: SelectionTypeEnum.edge,
          methodName: 'edgeSelection',
          icon: 'assets/svg/edge.svg',
        },
        {
          name: SelectionTypeEnum.point,
          methodName: 'pointSelection',
          icon: 'assets/svg/point.svg',
        },
      ]
    },
  ]
};
