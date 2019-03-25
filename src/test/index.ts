import { logger } from '@iinfinity/logger';
import { Redion } from '../../dist';

logger.info('Hello, test!');

const redion = new Redion({ key: ['test'] } as any);
