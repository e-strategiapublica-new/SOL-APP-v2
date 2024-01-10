import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationIntegrationsComponent } from './administration-integrations.component';

describe('AdministrationIntegrationsComponent', () => {
  let component: AdministrationIntegrationsComponent;
  let fixture: ComponentFixture<AdministrationIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationIntegrationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
