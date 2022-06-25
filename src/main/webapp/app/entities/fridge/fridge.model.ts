import { IItem } from 'app/entities/item/item.model';

export interface IFridge {
  id?: number;
  inventories?: IItem[] | null;
}

export class Fridge implements IFridge {
  constructor(public id?: number, public inventories?: IItem[] | null) {}
}

export function getFridgeIdentifier(fridge: IFridge): number | undefined {
  return fridge.id;
}
