import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InspectPage } from './inspect.page';

describe('InspectPage', () => {
  let component: InspectPage;
  let fixture: ComponentFixture<InspectPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InspectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
