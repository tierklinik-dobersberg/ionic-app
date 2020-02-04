import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DwvPage } from './dwv.page';

describe('DwvPage', () => {
  let component: DwvPage;
  let fixture: ComponentFixture<DwvPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwvPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DwvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
