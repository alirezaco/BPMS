import { ProcessStandalones } from './process.standalones';
import { RunAutopayStandalone } from './run-autopay.standalone';

export * from './process.standalones';
export * from './run-autopay.standalone';

export const standalones = [ProcessStandalones, RunAutopayStandalone];
