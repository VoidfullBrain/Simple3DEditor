import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Editor} from "../../editor/editor";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit, AfterViewInit{

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private editor!: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  ngAfterViewInit(): void {
    this.editor.canvasRef = this.canvasRef;
    this.editor.createScene();
    this.disableDefaultBrowserBehavior();
  }

  private disableDefaultBrowserBehavior(): void {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('auxclick', (e) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    });
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    });
  }

  ngOnInit(): void {
  }
}
