import {AbstractEventHandler} from "../abstract.event-handler";
import * as THREE from "three";
import {Axis as AxisService} from "../../../service/service.axis";

export class CommonKey extends AbstractEventHandler {
  public static ctrlDown: boolean = false;
  public static shiftDown: boolean = false;
  public static leftMouseDown: boolean = false;
  public static mousePosition: THREE.Vector2 = new THREE.Vector2();
  public static prevMousePosition: THREE.Vector2 = new THREE.Vector2();
  public static leftMouseDownTime: number = 0;
  public static leftMouseUpTime: number = 0;

  public keyDownCtrl = (event: KeyboardEvent) => {
    if(event.ctrlKey) {
      CommonKey.ctrlDown = true;
    }
    if(event.shiftKey) {
      CommonKey.shiftDown = true;
    }
  }

  public keyUpCtrl = (event: KeyboardEvent) => {
    if(!event.ctrlKey) {
      CommonKey.ctrlDown = false;
    }
    if(!event.shiftKey) {
      CommonKey.shiftDown = false;
    }
  }

  public leftMouseDown = (event: MouseEvent) => {
    if(event.button == 0) {
      CommonKey.leftMouseDown = true;
      CommonKey.mousePosition.x = event.clientX;
      CommonKey.mousePosition.y = event.clientY;
      CommonKey.prevMousePosition = CommonKey.mousePosition;
      CommonKey.leftMouseDownTime = Date.now();
    }
  }

  public mouseUp = (event: MouseEvent) => {
    if(event.button == 0) {
      CommonKey.leftMouseDown = false;
      AxisService.isAxisSelected = false;
    }
    CommonKey.mousePosition.x = 0;
    CommonKey.mousePosition.y = 0;
    CommonKey.prevMousePosition = CommonKey.mousePosition;
  }
}
