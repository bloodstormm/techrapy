import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LookupValue, GroupedLookupValues, groupLookupValues } from '@/types/patientData';

export function useLookupValues() {
  const [lookupValues, setLookupValues] = useState<GroupedLookupValues>({} as GroupedLookupValues);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    getLookupValues();
  }, []);

  const getLookupValues = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('lookup_values')
        .select('*')
        .order('label', { ascending: true })

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data) {
        const grouped = groupLookupValues(data as LookupValue[]);
        setLookupValues(grouped);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar valores'));
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLookupValues = () => {
    getLookupValues();
  };

  return {
    lookupValues,
    isLoading,
    error,
    refreshLookupValues
  };
}