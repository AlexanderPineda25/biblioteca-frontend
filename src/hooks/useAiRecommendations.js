import { useState } from 'react';
import { getAiRecommendations } from '../api/catalog.api.js';
import { getApiErrorMessage } from '../utils/apiError.js';

export function useAiRecommendations() {
  const [interest, setInterest] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await getAiRecommendations(interest);
      setResult(response.data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'No se pudo consultar el servicio de IA.'));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setInterest('');
    setResult(null);
    setError('');
  };

  return { interest, setInterest, result, loading, error, submit, reset };
}
