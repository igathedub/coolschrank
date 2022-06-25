import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFridge } from '../fridge.model';
import { FridgeService } from '../service/fridge.service';

@Component({
  templateUrl: './fridge-delete-dialog.component.html',
})
export class FridgeDeleteDialogComponent {
  fridge?: IFridge;

  constructor(protected fridgeService: FridgeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.fridgeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
