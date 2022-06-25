import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IItem } from '../item.model';
import { ItemService } from '../service/item.service';
import { ItemDeleteDialogComponent } from '../delete/item-delete-dialog.component';

@Component({
  selector: 'jhi-item',
  templateUrl: './item.component.html',
})
export class ItemComponent implements OnInit {
  items?: IItem[];
  isLoading = false;

  constructor(protected itemService: ItemService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.itemService.query().subscribe({
      next: (res: HttpResponse<IItem[]>) => {
        this.isLoading = false;
        this.items = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IItem): number {
    return item.id!;
  }

  delete(item: IItem): void {
    const modalRef = this.modalService.open(ItemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.item = item;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
