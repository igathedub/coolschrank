import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ItemService } from '../service/item.service';
import { IItem, Item } from '../item.model';
import { IFridge } from 'app/entities/fridge/fridge.model';
import { FridgeService } from 'app/entities/fridge/service/fridge.service';

import { ItemUpdateComponent } from './item-update.component';

describe('Item Management Update Component', () => {
  let comp: ItemUpdateComponent;
  let fixture: ComponentFixture<ItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let itemService: ItemService;
  let fridgeService: FridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ItemUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    itemService = TestBed.inject(ItemService);
    fridgeService = TestBed.inject(FridgeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Fridge query and add missing value', () => {
      const item: IItem = { id: 456 };
      const fridge: IFridge = { id: 43004 };
      item.fridge = fridge;

      const fridgeCollection: IFridge[] = [{ id: 87129 }];
      jest.spyOn(fridgeService, 'query').mockReturnValue(of(new HttpResponse({ body: fridgeCollection })));
      const additionalFridges = [fridge];
      const expectedCollection: IFridge[] = [...additionalFridges, ...fridgeCollection];
      jest.spyOn(fridgeService, 'addFridgeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ item });
      comp.ngOnInit();

      expect(fridgeService.query).toHaveBeenCalled();
      expect(fridgeService.addFridgeToCollectionIfMissing).toHaveBeenCalledWith(fridgeCollection, ...additionalFridges);
      expect(comp.fridgesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const item: IItem = { id: 456 };
      const fridge: IFridge = { id: 67549 };
      item.fridge = fridge;

      activatedRoute.data = of({ item });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(item));
      expect(comp.fridgesSharedCollection).toContain(fridge);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Item>>();
      const item = { id: 123 };
      jest.spyOn(itemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ item });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: item }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(itemService.update).toHaveBeenCalledWith(item);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Item>>();
      const item = new Item();
      jest.spyOn(itemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ item });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: item }));
      saveSubject.complete();

      // THEN
      expect(itemService.create).toHaveBeenCalledWith(item);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Item>>();
      const item = { id: 123 };
      jest.spyOn(itemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ item });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(itemService.update).toHaveBeenCalledWith(item);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackFridgeById', () => {
      it('Should return tracked Fridge primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackFridgeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
