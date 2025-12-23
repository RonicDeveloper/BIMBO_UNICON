import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsViewComponent } from './guests-view.component';

describe('GuestsViewComponent', () => {
  let component: GuestsViewComponent;
  let fixture: ComponentFixture<GuestsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
