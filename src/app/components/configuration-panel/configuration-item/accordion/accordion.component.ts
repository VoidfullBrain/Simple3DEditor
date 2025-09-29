import {Component, Input} from '@angular/core';
import * as THREE from "three";

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent {
  @Input()
  public selectedObject!: THREE.Object3D;

  @Input()
  public transform!: keyof THREE.Object3D;
}
