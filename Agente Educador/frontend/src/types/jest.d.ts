// Type definitions for Jest environment
/// <reference types="jest" />

declare namespace NodeJS {
  interface Global {
    // Extend the NodeJS global type with Jest's globals
    expect: typeof import('@jest/globals').expect;
    it: typeof import('@jest/globals').it;
    describe: typeof import('@jest/globals').describe;
    beforeAll: typeof import('@jest/globals').beforeAll;
    afterAll: typeof import('@jest/globals').afterAll;
    beforeEach: typeof import('@jest/globals').beforeEach;
    afterEach: typeof import('@jest/globals').afterEach;
    jest: typeof import('@jest/globals').jest;
  }
}

// Extend the global window object with any custom properties
declare interface Window {
  // Add any custom window properties here if needed
}

// This allows TypeScript to understand the global jest object
declare const jest: typeof import('@jest/globals').jest;
declare const describe: typeof import('@jest/globals').describe;
declare const it: typeof import('@jest/globals').it;
declare const expect: typeof import('@jest/globals').expect;
declare const beforeAll: typeof import('@jest/globals').beforeAll;
declare const afterAll: typeof import('@jest/globals').afterAll;
declare const beforeEach: typeof import('@jest/globals').beforeEach;
declare const afterEach: typeof import('@jest/globals').afterEach;
