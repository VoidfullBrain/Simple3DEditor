import * as THREE from "three";
import {Transform as TransformEnum} from "../../../../enum/enum.transform";
import {Editor} from "../../../editor";

export class Axis {
  public object: THREE.Object3D;
  public arrowGroup: THREE.Group;

  private readonly isMainArrowHelper: boolean;

  private headLength: number = 0.3;
  private headWidth: number = 0.1;
  private headSegments: number = 5;

  private xAxis: THREE.Vector3 = new THREE.Vector3(1, 0 , 0);
  private yAxis: THREE.Vector3 = new THREE.Vector3(0, 1 , 0);
  private zAxis: THREE.Vector3 = new THREE.Vector3(0, 0 , 1);

  private axes: Array<THREE.Vector3> = [
    this.xAxis,
    this.yAxis,
    this.zAxis
  ];

  private axisColors: Array<number> = [
    0xff0000,
    0x00ff00,
    0x0000ff
  ];

  private axisNames: Array<string> = [
    'x',
    'y',
    'z'
  ];

  private length!: Array<number>;

  constructor(object: THREE.Object3D, isMainArrowHelper: boolean = false) {
    this.object = object;
    this.arrowGroup = new THREE.Group();
    this.arrowGroup.name = 'axes';
    this.isMainArrowHelper = isMainArrowHelper;
  }

  private addAxis = (direction: THREE.Vector3, index: number) => {
    direction.normalize();
    const origin = new THREE.Vector3( 0, 0, 0 );

    const arrowHelper = new THREE.ArrowHelper( direction, origin, this.length[index], this.axisColors[index] , this.headLength, this.headWidth);
    if(this.isMainArrowHelper) {
      arrowHelper.name = 'mainArrowHelper';
    } else {
      arrowHelper.name = this.axisNames[index];

      const coneMaterial = arrowHelper.cone.material as THREE.MeshBasicMaterial;
      coneMaterial.depthTest = false;

      const lineMaterial = arrowHelper.line.material as THREE.LineBasicMaterial;
      lineMaterial.depthTest = false;
    }
    this.arrowGroup.add(arrowHelper);
    this.object.add(this.arrowGroup);
  }

  public setAxes = (length: Array<number>) => {
    this.length = length;
    this.axes.forEach(this.addAxis);
    this.setAxesHead();
  }

  public setAxesHead = () => {
    const axes = this.arrowGroup.children as Array<THREE.ArrowHelper>;
    axes.forEach((arrowHelper) => {
      if(this.axisNames.includes(arrowHelper.name)) {
        const index = this.axisNames.indexOf(arrowHelper.name);
        const position = arrowHelper.cone.position;
        const arrowHead = this.getArrowHead(index);

        arrowHead.geometry.computeBoundingBox();

        const boundingBox = arrowHead.geometry.boundingBox;
        const size = new THREE.Vector3();

        boundingBox?.getSize(size);

        arrowHelper.remove(arrowHelper.cone);
        arrowHelper.cone = arrowHead;
        arrowHelper.add(arrowHelper.cone);

        arrowHelper.cone.position.x = position.x;
        arrowHelper.cone.position.y = position.y - size?.y / 2;
        arrowHelper.cone.position.z = position.z;
      }
    });
  }

  private getArrowHead = (colorIndex: number) => {
    const material = new THREE.MeshBasicMaterial({color: this.axisColors[colorIndex]});
    material.depthTest = false;

    let geometry: THREE.BufferGeometry;

    switch (Editor.transformMode) {
      case TransformEnum.scale:
        geometry = new THREE.BoxGeometry(this.headWidth * 2, this.headWidth * 2, this.headWidth * 2);
        break;
      case TransformEnum.rotate:
        geometry = new THREE.SphereGeometry(this.headWidth, this.headSegments, this.headSegments);
        break;
      case TransformEnum.translate:
      default:
        geometry = new THREE.ConeGeometry(this.headWidth, this.headLength, this.headSegments);
        break;
    }

    return new THREE.Mesh(geometry, material);
  }
}
