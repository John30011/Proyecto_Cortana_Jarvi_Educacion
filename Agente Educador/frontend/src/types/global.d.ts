// Tipos globales para Jest y Testing Library
declare namespace NodeJS {
  interface Global {
    // Jest
    jest: typeof import('@jest/globals').jest;
    expect: typeof import('@jest/globals').expect;
    it: typeof import('@jest/globals').it;
    test: typeof import('@jest/globals').test;
    describe: typeof import('@jest/globals').describe;
    beforeAll: typeof import('@jest/globals').beforeAll;
    afterAll: typeof import('@jest/globals').afterAll;
    beforeEach: typeof import('@jest/globals').beforeEach;
    afterEach: typeof import('@jest/globals').afterEach;
    
    // Testing Library
    // Agrega aquí cualquier otra utilidad global que necesites
  }
}

// Extender el objeto Window
declare interface Window {
  // Agrega aquí cualquier propiedad global de window que necesites
}

// Extender el objeto global
// eslint-disable-next-line no-var
declare var global: NodeJS.Global & typeof globalThis;
