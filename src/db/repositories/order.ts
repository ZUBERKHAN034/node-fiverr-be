import orderSchemaModel from '../models/order';
import type { IOrder } from '../models/order';
import { BaseRepository } from './base';

export default class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(orderSchemaModel);
  }
}
