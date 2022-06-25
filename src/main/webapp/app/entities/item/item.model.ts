import { IFridge } from 'app/entities/fridge/fridge.model';

export interface IItem {
  id?: number;
  name?: string | null;
  actual?: number | null;
  target?: number;
  fridge?: IFridge | null;
}

export class Item implements IItem {
  constructor(
    public id?: number,
    public name?: string | null,
    public actual?: number | null,
    public target?: number,
    public fridge?: IFridge | null
  ) {}
}

export function getItemIdentifier(item: IItem): number | undefined {
  return item.id;
}
