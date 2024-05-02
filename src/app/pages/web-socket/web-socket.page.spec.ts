import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WebSocketPage } from './web-socket.page';

describe('WebSocketPage', () => {
  let component: WebSocketPage;
  let fixture: ComponentFixture<WebSocketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSocketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
