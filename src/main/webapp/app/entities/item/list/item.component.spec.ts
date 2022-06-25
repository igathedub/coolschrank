import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ItemService } from '../service/item.service';

import { ItemComponent } from './item.component';

describe('Item Management Component', () => {
  let comp: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;
  let service: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ItemComponent],
    })
      .overrideTemplate(ItemComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ItemService);

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
    expect(comp.items?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
