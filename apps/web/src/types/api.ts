export * from '@murmura/shared-types';

export type ViewStatus = 'idle' | 'loading' | 'success' | 'error';

export type FormattedUiError = {
  title: string;
  description: string;
};
