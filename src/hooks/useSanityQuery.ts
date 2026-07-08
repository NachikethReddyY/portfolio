import { useEffect, useState } from 'react';

import { fetchSanity, hasSanityConfig } from '../lib/sanity/client';

type QueryState<T> = {
  data: T;
  isLoading: boolean;
  error: string | null;
  isFallback: boolean;
};

const emptyParams: Record<string, string | number | boolean> = {};

export function useSanityQuery<T>(
  query: string,
  fallbackData: T,
  params: Record<string, string | number | boolean> = emptyParams,
): QueryState<T> {
  const paramsKey = JSON.stringify(params);
  const [state, setState] = useState<QueryState<T>>({
    data: fallbackData,
    isLoading: hasSanityConfig,
    error: null,
    isFallback: !hasSanityConfig,
  });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!hasSanityConfig) {
        setState({
          data: fallbackData,
          isLoading: false,
          error: null,
          isFallback: true,
        });
        return;
      }

      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const result = await fetchSanity<T>(query, params);
        if (!isMounted) {
          return;
        }

        setState({
          data: result ?? fallbackData,
          isLoading: false,
          error: result ? null : 'No published content found in Sanity. Showing sample content.',
          isFallback: !result,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState({
          data: fallbackData,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unable to load Sanity content.',
          isFallback: true,
        });
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [fallbackData, paramsKey, query]);

  return state;
}
