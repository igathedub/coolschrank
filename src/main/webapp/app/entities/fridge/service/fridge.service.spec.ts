import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFridge, Fridge } from '../fridge.model';

import { FridgeService } from './fridge.service';

describe('Fridge Service', () => {
  let service: FridgeService;
  let httpMock: HttpTestingController;
  let elemDefault: IFridge;
  let expectedResult: IFridge | IFridge[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FridgeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Fridge', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Fridge()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Fridge', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Fridge', () => {
      const patchObject = Object.assign({}, new Fridge());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Fridge', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Fridge', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addFridgeToCollectionIfMissing', () => {
      it('should add a Fridge to an empty array', () => {
        const fridge: IFridge = { id: 123 };
        expectedResult = service.addFridgeToCollectionIfMissing([], fridge);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fridge);
      });

      it('should not add a Fridge to an array that contains it', () => {
        const fridge: IFridge = { id: 123 };
        const fridgeCollection: IFridge[] = [
          {
            ...fridge,
          },
          { id: 456 },
        ];
        expectedResult = service.addFridgeToCollectionIfMissing(fridgeCollection, fridge);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Fridge to an array that doesn't contain it", () => {
        const fridge: IFridge = { id: 123 };
        const fridgeCollection: IFridge[] = [{ id: 456 }];
        expectedResult = service.addFridgeToCollectionIfMissing(fridgeCollection, fridge);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fridge);
      });

      it('should add only unique Fridge to an array', () => {
        const fridgeArray: IFridge[] = [{ id: 123 }, { id: 456 }, { id: 60247 }];
        const fridgeCollection: IFridge[] = [{ id: 123 }];
        expectedResult = service.addFridgeToCollectionIfMissing(fridgeCollection, ...fridgeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fridge: IFridge = { id: 123 };
        const fridge2: IFridge = { id: 456 };
        expectedResult = service.addFridgeToCollectionIfMissing([], fridge, fridge2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fridge);
        expect(expectedResult).toContain(fridge2);
      });

      it('should accept null and undefined values', () => {
        const fridge: IFridge = { id: 123 };
        expectedResult = service.addFridgeToCollectionIfMissing([], null, fridge, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fridge);
      });

      it('should return initial array if no Fridge is added', () => {
        const fridgeCollection: IFridge[] = [{ id: 123 }];
        expectedResult = service.addFridgeToCollectionIfMissing(fridgeCollection, undefined, null);
        expect(expectedResult).toEqual(fridgeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
