import { registerEnumType } from 'type-graphql';

export enum ProductType {
  BOOK = 'book',
  BAGS = 'bags',
  GROCERY = 'grocery',
  MEDICINE = 'medicine',
  CLOTH = 'cloth',
  CLOTHING = 'clothing',
  FURNITURE = 'furniture',
  FURNITURE_TWO = 'furniture-two',
  MAKEUP = 'makeup',
  BAKERY = 'bakery',
}

registerEnumType(ProductType, {
  name: 'ProductType',
  description: 'The basic product types',
});
