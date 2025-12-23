import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSocketsComponent } from './web-sockets.component';

describe('MainApplicationComponent', () => {
  let component: WebSocketsComponent;
  let fixture: ComponentFixture<WebSocketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebSocketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebSocketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
