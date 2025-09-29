import {Component, Input} from '@angular/core';
import {ButtonContainer} from "../../../../types/config/type.button-container";
import {config} from "../../../../config/components/toolbar/left/config";

@Component({
  selector: 'app-toolbar-left',
  templateUrl: './toolbar-left.component.html',
  styleUrls: ['./toolbar-left.component.css']
})
export class ToolbarLeftComponent {
  @Input()
  buttonContainers: Array<ButtonContainer> = config.buttonContainers;

  public readonly position: string = 'right';
}
