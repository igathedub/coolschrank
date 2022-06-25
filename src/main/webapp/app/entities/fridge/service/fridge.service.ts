import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFridge, getFridgeIdentifier } from '../fridge.model';

export type EntityResponseType = HttpResponse<IFridge>;
export type EntityArrayResponseType = HttpResponse<IFridge[]>;

@Injectable({ providedIn: 'root' })
export class FridgeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/fridges');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(fridge: IFridge): Observable<EntityResponseType> {
    return this.http.post<IFridge>(this.resourceUrl, fridge, { observe: 'response' });
  }

  update(fridge: IFridge): Observable<EntityResponseType> {
    return this.http.put<IFridge>(`${this.resourceUrl}/${getFridgeIdentifier(fridge) as number}`, fridge, { observe: 'response' });
  }

  partialUpdate(fridge: IFridge): Observable<EntityResponseType> {
    return this.http.patch<IFridge>(`${this.resourceUrl}/${getFridgeIdentifier(fridge) as number}`, fridge, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFridge>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFridge[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addFridgeToCollectionIfMissing(fridgeCollection: IFridge[], ...fridgesToCheck: (IFridge | null | undefined)[]): IFridge[] {
    const fridges: IFridge[] = fridgesToCheck.filter(isPresent);
    if (fridges.length > 0) {
      const fridgeCollectionIdentifiers = fridgeCollection.map(fridgeItem => getFridgeIdentifier(fridgeItem)!);
      const fridgesToAdd = fridges.filter(fridgeItem => {
        const fridgeIdentifier = getFridgeIdentifier(fridgeItem);
        if (fridgeIdentifier == null || fridgeCollectionIdentifiers.includes(fridgeIdentifier)) {
          return false;
        }
        fridgeCollectionIdentifiers.push(fridgeIdentifier);
        return true;
      });
      return [...fridgesToAdd, ...fridgeCollection];
    }
    return fridgeCollection;
  }
}
