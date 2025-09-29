import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometryInputComponent } from './geometry-input.component';

describe('GeometryInputComponent', () => {
  let component: GeometryInputComponent;
  let fixture: ComponentFixture<GeometryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeometryInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeometryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
