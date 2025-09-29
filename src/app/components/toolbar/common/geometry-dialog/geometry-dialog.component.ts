import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {GeometryDialogData} from "../../../../editor/interface/interface.GeometryDialogData";
import {Operator} from "../../../../editor/operator/operator";
import {Geometry as GeometryEnum} from "../../../../enum/enum.geometry";
import {GeometryInputArgs} from "../../../../types/config/type.geometry-input-args";

@Component({
  selector: 'app-geometry-dialog',
  templateUrl: './geometry-dialog.component.html',
  styleUrls: ['./geometry-dialog.component.css']
})
export class GeometryDialogComponent {
  private operator!: Operator;

  public data: GeometryDialogData;

  public type!: string;

  @Input()
  public name!: string;

  @Input()
  public width!: number;

  @Input()
  public height!: number;

  @Input()
  public depth!: number;

  @Input()
  public widthSegments!: number;

  @Input()
  public heightSegments!: number;

  @Input()
  public depthSegments!: number;

  @Input()
  public radius!: number;

  @Input()
  public radiusTop!: number;

  @Input()
  public radiusBottom!: number;

  @Input()
  public radialSegments!: number;

  public attributes: Array<{ name: string, hasAttribute: boolean }> = [
    {
      name: 'width',
      hasAttribute: false
    },
    {
      name: 'height',
      hasAttribute: false
    },
    {
      name: 'depth',
      hasAttribute: false
    },
    {
      name: 'widthSegments',
      hasAttribute: false
    },
    {
      name: 'heightSegments',
      hasAttribute: false
    },
    {
      name: 'depthSegments',
      hasAttribute: false
    },
    {
      name: 'radius',
      hasAttribute: false
    },
    {
      name: 'radiusTop',
      hasAttribute: false
    },
    {
      name: 'radiusBottom',
      hasAttribute: false
    },
    {
      name: 'radialSegments',
      hasAttribute: false
    },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) data: GeometryDialogData, operator: Operator) {
    this.operator = operator;
    this.data = data;
    this.type = data.button.type as string;
    this.addAttributes();
  }

  public buttonClickHandler = () => {
    const args = {
      name: this.name,
      width: this.width,
      height: this.height,
      depth: this.depth,
      widthSegments: this.widthSegments,
      heightSegments: this.heightSegments,
      depthSegments: this.depthSegments,
      radius: this.radius,
      radiusTop: this.radiusTop,
      radiusBottom: this.radiusBottom,
      radialSegments: this.radialSegments
    };
    this.operator.operate(this.data.className, this.data.button.methodName, args);
  }

  public valueChanged = (value: GeometryInputArgs) => {
    const attribute = value.name as keyof GeometryDialogComponent;
    (this[attribute] as number) = value.value;
  }

  private addAttributes = () => {
    switch(this.type) {
      case GeometryEnum.cube:
        this.attributes[0].hasAttribute = true;
        this.attributes[1].hasAttribute = true;
        this.attributes[2].hasAttribute = true;
        this.attributes[3].hasAttribute = true;
        this.attributes[4].hasAttribute = true;
        this.attributes[5].hasAttribute = true;
        break;
      case GeometryEnum.cylinder:
        this.attributes[7].hasAttribute = true;
        this.attributes[8].hasAttribute = true;
        this.attributes[1].hasAttribute = true;
        this.attributes[9].hasAttribute = true;
        this.attributes[4].hasAttribute = true;
        break;
      case GeometryEnum.cone:
        this.attributes[6].hasAttribute = true;
        this.attributes[1].hasAttribute = true;
        this.attributes[9].hasAttribute = true;
        this.attributes[4].hasAttribute = true;
        break;
      case GeometryEnum.sphere:
        this.attributes[6].hasAttribute = true;
        this.attributes[3].hasAttribute = true;
        this.attributes[4].hasAttribute = true;
        break;
    }
  }
}
