// useApi.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = (apiFunction, dependencies = []) => {
  const [networkData, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiFunction();
        setData(response)

        // setData(response[0]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data: networkData, error, loading };
};

export default useApi;
