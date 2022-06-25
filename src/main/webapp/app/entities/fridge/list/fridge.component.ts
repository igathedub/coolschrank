import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFridge } from '../fridge.model';
import { FridgeService } from '../service/fridge.service';
import { FridgeDeleteDialogComponent } from '../delete/fridge-delete-dialog.component';

@Component({
  selector: 'jhi-fridge',
  templateUrl: './fridge.component.html',
})
export class FridgeComponent implements OnInit {
  fridges?: IFridge[];
  isLoading = false;

  constructor(protected fridgeService: FridgeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.fridgeService.query().subscribe({
      next: (res: HttpResponse<IFridge[]>) => {
        this.isLoading = false;
        this.fridges = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IFridge): number {
    return item.id!;
  }

  delete(fridge: IFridge): void {
    const modalRef = this.modalService.open(FridgeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fridge = fridge;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
