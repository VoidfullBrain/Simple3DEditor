import {Geometry as GeometryEnum} from "../../../../enum/enum.geometry";
import {Geometry} from "../../../../editor/api/api.geometry";

export const config = {
  buttonContainers: [
    {
      name: 'geometries',
      className: Geometry,
      icon: 'assets/svg/geometry.svg',
      buttons: [
        {
          name: GeometryEnum.cube,
          methodName: 'addCube',
          icon: 'assets/svg/cube.svg',
          type: GeometryEnum.cube,
          clickOpenDialog: true,
        },
        {
          name: GeometryEnum.cylinder,
          methodName: 'addCylinder',
          icon: 'assets/svg/cylinder.svg',
          type: GeometryEnum.cylinder,
          clickOpenDialog: true,
        },
        {
          name: GeometryEnum.sphere,
          methodName: 'addSphere',
          icon: 'assets/svg/sphere.svg',
          type: GeometryEnum.sphere,
          clickOpenDialog: true,
        },
        {
          name: GeometryEnum.cone,
          methodName: 'addCone',
          icon: 'assets/svg/cone.svg',
          type: GeometryEnum.cone,
          clickOpenDialog: true,
        },
      ]
    }
  ]
};
