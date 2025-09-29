import {Component, Input} from '@angular/core';
import {ButtonContainer} from "../../../../types/config/type.button-container";
import {config} from "../../../../config/components/toolbar/top/config";

@Component({
  selector: 'app-toolbar-top',
  templateUrl: './toolbar-top.component.html',
  styleUrls: ['./toolbar-top.component.css']
})
export class ToolbarTopComponent {
  @Input()
  buttonContainers: Array<ButtonContainer> = config.buttonContainers;

  public readonly position: string = 'bottom';
}
