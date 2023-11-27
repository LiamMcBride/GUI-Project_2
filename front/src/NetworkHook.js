// useApi.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = (apiFunction, dependencies = [], fileName) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiFunction();
        console.log(response[0])

        for(let i = 0; i < response.length; i++){
            console.log(fileName)
            console.log(response[i].fileName)
            if(response[i]["fileName"] === fileName){
                setData(response[i])
            }
        }

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

  return { data, error, loading };
};

export default useApi;
