import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmxViewComponent } from './dmx-view.component';

describe('DmxViewComponent', () => {
  let component: DmxViewComponent;
  let fixture: ComponentFixture<DmxViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DmxViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DmxViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
