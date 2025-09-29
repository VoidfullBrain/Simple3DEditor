import {Component, Input, OnInit} from '@angular/core';
import * as THREE from "three";
import {Editor} from "../../../../../editor/editor";
import {Axis as AxisService} from "../../../../../editor/service/service.axis";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit{
  @Input()
  public selectedObject!: THREE.Object3D;

  @Input()
  public transform!: keyof THREE.Object3D;

  @Input()
  public axis!: keyof THREE.Vector3;

  public value!: number;

  private editor: Editor;

  private axisService: AxisService;

  public objectChangedSubscription: Subscription;

  constructor(editor: Editor, axisService: AxisService) {
    this.editor = editor;
    this.axisService = axisService;

    this.objectChangedSubscription = this.editor.objectChanged.subscribe(this.changeSelectedObject);
  }

  public onInputTransform = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const axisObject = this.axisService.getSelectedAxisObject();

    ((this.selectedObject[this.transform] as THREE.Vector3)[this.axis] as number) = parseFloat(input.value);
    if(axisObject) {
      ((axisObject[this.transform] as THREE.Vector3)[this.axis] as number) = parseFloat(input.value);
    }
  }

  ngOnInit() {
    this.value = ((this.selectedObject[this.transform] as THREE.Vector3)[this.axis] as number);
  }

  private changeSelectedObject = () => {
    if(this.selectedObject != undefined) {
      this.value = ((this.selectedObject[this.transform] as THREE.Vector3)[this.axis] as number);
    }
  }
}
