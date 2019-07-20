import {BaseResourceModel} from '../../../shared/models/base-resource.model';
import {CategoryModel} from '../../categories/shared/category.model';

export class EntryModel extends BaseResourceModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public type?: string,
    public amount?: string,
    public date?: string,
    public paid?: boolean,
    public categoryId?: number,
    public category?: CategoryModel
  ) {
    super();
  }

  static types = {
    expense: 'Despesa',
    revenue: 'Receita'
  };

  static fromJson(jsonData: any): EntryModel {
    return Object.assign(new EntryModel(), jsonData);
  }

  get paidText(): string {
    return this.paid ? 'Pago' : 'Pendente';
  }
}
