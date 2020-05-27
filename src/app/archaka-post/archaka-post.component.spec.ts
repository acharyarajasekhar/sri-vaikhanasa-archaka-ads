import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchakaPostComponent } from './archaka-post.component';

describe('ArchakaPostComponent', () => {
  let component: ArchakaPostComponent;
  let fixture: ComponentFixture<ArchakaPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchakaPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchakaPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
