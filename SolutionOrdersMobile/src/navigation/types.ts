import type { Item } from '../types/models';

export type RootStackParamList = {
  Home: undefined;
  Items: undefined;
  CreateItem: undefined;
  EditItem: { item: Item };
  RailTraction: undefined;
  RailSleepers: undefined;
  Categories: undefined;
  Units: undefined;
  Clients: undefined;
  Workers: undefined;
  Orders: undefined;
  CreateOrder: undefined;
  EditOrder: { orderId: number };
};