import { Injectable } from '@nestjs/common';
import { NextServer } from './types';

@Injectable()
export class NextService {
  constructor(public readonly next: NextServer) {}
}
