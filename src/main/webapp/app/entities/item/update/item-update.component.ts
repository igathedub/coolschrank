import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IItem, Item } from '../item.model';
import { ItemService } from '../service/item.service';
import { IFridge } from 'app/entities/fridge/fridge.model';
import { FridgeService } from 'app/entities/fridge/service/fridge.service';

@Component({
  selector: 'jhi-item-update',
  templateUrl: './item-update.component.html',
})
export class ItemUpdateComponent implements OnInit {
  isSaving = false;

  fridgesSharedCollection: IFridge[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    actual: [],
    target: [null, [Validators.required, Validators.min(0)]],
    fridge: [],
  });

  constructor(
    protected itemService: ItemService,
    protected fridgeService: FridgeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ item }) => {
      this.updateForm(item);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const item = this.createFromForm();
    if (item.id !== undefined) {
      this.subscribeToSaveResponse(this.itemService.update(item));
    } else {
      this.subscribeToSaveResponse(this.itemService.create(item));
    }
  }

  trackFridgeById(_index: number, item: IFridge): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(item: IItem): void {
    this.editForm.patchValue({
      id: item.id,
      name: item.name,
      actual: item.actual,
      target: item.target,
      fridge: item.fridge,
    });

    this.fridgesSharedCollection = this.fridgeService.addFridgeToCollectionIfMissing(this.fridgesSharedCollection, item.fridge);
  }

  protected loadRelationshipsOptions(): void {
    this.fridgeService
      .query()
      .pipe(map((res: HttpResponse<IFridge[]>) => res.body ?? []))
      .pipe(map((fridges: IFridge[]) => this.fridgeService.addFridgeToCollectionIfMissing(fridges, this.editForm.get('fridge')!.value)))
      .subscribe((fridges: IFridge[]) => (this.fridgesSharedCollection = fridges));
  }

  protected createFromForm(): IItem {
    return {
      ...new Item(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      actual: this.editForm.get(['actual'])!.value,
      target: this.editForm.get(['target'])!.value,
      fridge: this.editForm.get(['fridge'])!.value,
    };
  }
}
