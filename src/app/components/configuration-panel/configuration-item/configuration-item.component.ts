import {
  Component,
  Input,
} from '@angular/core';
import * as THREE from "three";

@Component({
  selector: 'app-configuration-item',
  templateUrl: './configuration-item.component.html',
  styleUrls: ['./configuration-item.component.css']
})
export class ConfigurationItemComponent {
  @Input()
  public selectedObject!: THREE.Object3D;
}
