import {ElementRef} from "@angular/core";

export class Canvas {
  public static makeInstance = (canvasRef: ElementRef) => {
    const canvas = canvasRef.nativeElement;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    return canvas;
  }
}
