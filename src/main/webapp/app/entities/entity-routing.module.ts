import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'fridge',
        data: { pageTitle: 'Fridges' },
        loadChildren: () => import('./fridge/fridge.module').then(m => m.FridgeModule),
      },
      {
        path: 'item',
        data: { pageTitle: 'Items' },
        loadChildren: () => import('./item/item.module').then(m => m.ItemModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
