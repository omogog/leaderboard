import { Counter } from './counter';

export interface Team {
    id: string;
    name: string;
    counters: Counter[];
}