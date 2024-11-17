import { createApi } from 'unsplash-js';

export const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || ''
});

export const THERAPY_COLLECTION_ID = '1364150'; 