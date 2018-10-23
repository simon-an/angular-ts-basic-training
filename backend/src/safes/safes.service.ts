import { Safe } from './interfaces/safe.interface';
import { Injectable, HttpException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { SafeItem } from './interfaces/safeitem';

@Injectable()
export class SafesService {
  private readonly safes: Safe[] = [
    {
      id: uuid(),
      value: 999,
      itemSize: 2,
      active: true,
      activeSince: new Date(),
    },
    {
      id: uuid(),
      value: 123,
      itemSize: 3,
      active: true,
      activeSince: new Date(),
    },
  ];

  private readonly items: SafeItem[][] = [
    [
      {
        id: uuid(),
        price: 134,
        invoiceId: null,
        name: 'Fahhrad',
      },
      {
        id: uuid(),
        price: 234,
        invoiceId: null,
        name: 'Fahhrad',
      },
    ],
    [
      {
        id: uuid(),
        price: 12,
        invoiceId: null,
        name: 'Fahhrad',
      },
      {
        id: uuid(),
        price: 34,
        invoiceId: null,
        name: 'Auto',
      },
      {
        id: uuid(),
        price: 45,
        invoiceId: null,
        name: 'Laptop',
      },
      {
        id: uuid(),
        price: 56,
        invoiceId: null,
        name: 'UsbStick',
      },
    ],
  ];

  constructor() {
    let newsafes = [];
    this.safes.forEach(safe => {
      const index = this.safes.indexOf(safe);
      const items2 = this.items[index];
      const prize = items2
        .map(item => item.price)
        .reduce((val, sum) => sum + val);
      const result = { ...safe, value: prize, itemSize: items2.length };
      newsafes = [...newsafes, result];
    });
    this.safes = newsafes;
  }

  create(safe: Safe) {
    this.safes.push(safe);
  }

  getItems(safeId: string): SafeItem[] {
    const index = this.safes.indexOf(
      this.safes.find(safe => safe.id === safeId),
    );
    if (index > -1) {
      return this.items[index];
    }
    return null;
  }

  findAll(): Safe[] {
    return this.safes;
  }

  findOne(id: string): Safe {
    const safe2 = this.safes.find(safe => safe.id === id);
    return safe2;
  }
}
