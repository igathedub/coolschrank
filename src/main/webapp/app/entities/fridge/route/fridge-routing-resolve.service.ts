import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFridge, Fridge } from '../fridge.model';
import { FridgeService } from '../service/fridge.service';

@Injectable({ providedIn: 'root' })
export class FridgeRoutingResolveService implements Resolve<IFridge> {
  constructor(protected service: FridgeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFridge> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((fridge: HttpResponse<Fridge>) => {
          if (fridge.body) {
            return of(fridge.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Fridge());
  }
}
