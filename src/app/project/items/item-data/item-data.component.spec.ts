import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDataComponent } from './association-data.component';

describe('ItemDataComponent', () => {
  let component: ItemDataComponent;
  let fixture: ComponentFixture<ItemDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
