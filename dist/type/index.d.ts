import { RedisOptions } from 'ioredis';
export interface User {
    id: string;
    name: string;
}
export interface Session {
    id: string;
    time: number;
    [index: string]: any;
}
export interface Options {
    maxAge?: number;
    domain?: string;
    httpOnly?: boolean;
    name: string;
    overwrite?: boolean;
    redis?: RedisOptions;
    secert?: string[];
}
