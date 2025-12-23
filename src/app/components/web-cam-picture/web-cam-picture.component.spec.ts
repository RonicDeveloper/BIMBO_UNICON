import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCamPictureComponent } from './web-cam-picture.component';

describe('WebCamPictureComponent', () => {
  let component: WebCamPictureComponent;
  let fixture: ComponentFixture<WebCamPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebCamPictureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebCamPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
