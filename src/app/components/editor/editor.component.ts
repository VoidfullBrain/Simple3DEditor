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
  }

  ngOnInit(): void {
  }
}
