import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchakaPostEditorComponent } from './archaka-post-editor.component';

describe('ArchakaPostEditorComponent', () => {
  let component: ArchakaPostEditorComponent;
  let fixture: ComponentFixture<ArchakaPostEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchakaPostEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchakaPostEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
