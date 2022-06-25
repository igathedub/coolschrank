import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FridgeService } from '../service/fridge.service';

import { FridgeComponent } from './fridge.component';

describe('Fridge Management Component', () => {
  let comp: FridgeComponent;
  let fixture: ComponentFixture<FridgeComponent>;
  let service: FridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FridgeComponent],
    })
      .overrideTemplate(FridgeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FridgeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FridgeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.fridges?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
