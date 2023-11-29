// useApi.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useApi = (dependencies) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
      const callAPI = async () => {
        setLoading(true);
        try {
          const result = await axios.get(
            'http://localhost:3000/db/find'
          );
          setData(result.data);
        } catch (err) {
          setError(err.message || "Unexpected Error!");
        } finally {
          setLoading(false);
        }
      };
      callAPI()
    
  }, dependencies);
  
  return { networkData: data, error, loading };
};

export default useApi;

//example of what the old data looks like
/*
fileName is retrieved via the key
{
    title: "Grade Distribution",
    data: [
        {grade: 'A', count: 5},
        {grade: 'A-', count: 10},
        {grade: 'B+', count: 12},
        {grade: 'B', count: 23},
        {grade: 'B-', count: 7},
        {grade: 'C+', count: 9},
        {grade: 'C', count: 16},
        {grade: 'C', count: 3},
        {grade: 'D+', count: 8},
        {grade: 'D', count: 11},
        {grade: 'D-', count: 13},
        {grade: 'F', count: 2},
    ]
}
*/

//example of what the data object will look like
/*
[
  {
      "_id": "6564f38dd35cd2baf4bbd324",
      "fileName": "pr1.json",
      "dataset": {
          "title": "World population",
          "data": [
              {
                  "year": "1950",
                  "population": 2.525
              },
              {
                  "year": "1960",
                  "population": 3.018
              },
              {
                  "year": "1970",
                  "population": 3.682
              },
              {
                  "year": "1980",
                  "population": 4.44
              },
              {
                  "year": "1990",
                  "population": 5.31
              },
              {
                  "year": "2000",
                  "population": 6.127
              },
              {
                  "year": "2010",
                  "population": 6.93
              }
          ]
      }
  },
  {
      "_id": "6564f3d9d35cd2baf4bbd325",
      "fileName": "empty.json",
      "dataset": {
          "title": "Empty",
          "data": []
      }
  },
  {
      "_id": "6564f420d35cd2baf4bbd326",
      "fileName": "grades.json",
      "dataset": {
          "title": "Grade Distribution",
          "data": [
              {
                  "grade": "A",
                  "count": 5
              },
              {
                  "grade": "A-",
                  "count": 10
              },
              {
                  "grade": "B+",
                  "count": 12
              },
              {
                  "grade": "B",
                  "count": 23
              },
              {
                  "grade": "B-",
                  "count": 7
              },
              {
                  "grade": "C+",
                  "count": 9
              },
              {
                  "grade": "C",
                  "count": 16
              },
              {
                  "grade": "C",
                  "count": 3
              },
              {
                  "grade": "D+",
                  "count": 8
              },
              {
                  "grade": "D",
                  "count": 11
              },
              {
                  "grade": "D-",
                  "count": 13
              },
              {
                  "grade": "F",
                  "count": 2
              }
          ]
      }
  }
]*/