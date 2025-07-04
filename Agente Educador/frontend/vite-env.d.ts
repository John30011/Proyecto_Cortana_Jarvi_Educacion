/// <reference types="vite/client" />

// Tipos para las variables de entorno
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production';
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_SENTRY_DSN: string;
  // Agrega más variables de entorno según sea necesario
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Tipos para módulos de imágenes
declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}

// Tipos para módulos de estilos
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Tipos para módulos de fuentes
declare module '*.woff' {
  const content: string;
  export default content;
}

declare module '*.woff2' {
  const content: string;
  export default content;
}

declare module '*.ttf' {
  const content: string;
  export default content;
}

declare module '*.eot' {
  const content: string;
  export default content;
}

declare module '*.otf' {
  const content: string;
  export default content;
}

// Tipos para módulos de datos
declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.yaml' {
  const data: any;
  export default data;
}

declare module '*.yml' {
  const data: any;
  export default data;
}

// Tipos para módulos de prueba
declare module '*.test.ts' {
  const content: any;
  export default content;
}

declare module '*.test.tsx' {
  const content: any;
  export default content;
}

// Tipos para módulos de utilidad
declare module 'uuid';
declare module 'react-markdown';
declare module 'remark-gfm';
declare module 'rehype-raw';
declare module 'rehype-sanitize';

// Tipos para módulos de animación
declare module 'framer-motion';
declare module 'react-intersection-observer';

type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

type Values<T> = T[keyof T];

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Overwrite<T, U> = Omit<T, keyof U> & U;

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

// Tipos para React
type FCWithChildren<P = object> = React.FC<React.PropsWithChildren<P>>;

type ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  React.ComponentProps<T>;

type AriaAttributes = React.AriaAttributes;
type HTMLAttributes<T> = React.HTMLAttributes<T>;
type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;
type InputHTMLAttributes<T> = React.InputHTMLAttributes<T>;
type SelectHTMLAttributes<T> = React.SelectHTMLAttributes<T>;
type TextareaHTMLAttributes<T> = React.TextareaHTMLAttributes<T>;
type LabelHTMLAttributes<T> = React.LabelHTMLAttributes<T>;
type FormHTMLAttributes<T> = React.FormHTMLAttributes<T>;

// Tipos para estilos
interface CSSModuleClasses {
  readonly [key: string]: string;
}

// Tipos para eventos
type EventHandler<E extends React.SyntheticEvent> = (event: E) => void;
type MouseEventHandler = React.MouseEventHandler<HTMLElement>;
type ChangeEventHandler = React.ChangeEventHandler<HTMLElement>;
type FormEventHandler = React.FormEventHandler<HTMLElement>;
type KeyboardEventHandler = React.KeyboardEventHandler<HTMLElement>;
type FocusEventHandler = React.FocusEventHandler<HTMLElement>;

// Tipos para referencias
type Ref<T> = React.Ref<T>;
type ForwardedRef<T> = React.ForwardedRef<T>;
type MutableRefObject<T> = React.MutableRefObject<T>;
type RefObject<T> = React.RefObject<T>;

declare global {
  interface Window {
    // Agregar propiedades globales de window aquí
    gtag: (...args: any[]) => void;
    dataLayer: Record<string, any>[];
  }

  // Extender los tipos de elementos HTML si es necesario
  interface HTMLDialogElement {
    showModal: () => void;
    close: () => void;
  }
}
