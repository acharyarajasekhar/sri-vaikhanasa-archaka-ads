import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchakaPostViewComponent } from './archaka-post-view.component';

describe('ArchakaPostViewComponent', () => {
  let component: ArchakaPostViewComponent;
  let fixture: ComponentFixture<ArchakaPostViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchakaPostViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchakaPostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
