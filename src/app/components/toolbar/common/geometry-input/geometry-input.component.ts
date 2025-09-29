import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GeometryInputArgs} from "../../../../types/config/type.geometry-input-args";

@Component({
  selector: 'app-geometry-input',
  templateUrl: './geometry-input.component.html',
  styleUrls: ['./geometry-input.component.css']
})
export class GeometryInputComponent {

  @Input()
  public label!: string;

  @Input()
  public name!: string;

  public value!: number;

  @Input()
  public required!: boolean;

  @Output()
  public valueChange = new EventEmitter<GeometryInputArgs>();

  public onChange = () => {
    this.valueChange.emit(
      {
        name: this.name,
        value: this.value
      }
    );
  }
}
