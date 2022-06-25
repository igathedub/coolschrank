import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IFridge, Fridge } from '../fridge.model';
import { FridgeService } from '../service/fridge.service';

@Component({
  selector: 'jhi-fridge-update',
  templateUrl: './fridge-update.component.html',
})
export class FridgeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected fridgeService: FridgeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fridge }) => {
      this.updateForm(fridge);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const fridge = this.createFromForm();
    if (fridge.id !== undefined) {
      this.subscribeToSaveResponse(this.fridgeService.update(fridge));
    } else {
      this.subscribeToSaveResponse(this.fridgeService.create(fridge));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFridge>>): void {
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

  protected updateForm(fridge: IFridge): void {
    this.editForm.patchValue({
      id: fridge.id,
    });
  }

  protected createFromForm(): IFridge {
    return {
      ...new Fridge(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}
