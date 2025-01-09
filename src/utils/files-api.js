import { useEffect, useState } from "react";

import axios from "axios";

export function useGetToken(
  dontRunFirst = false,
  credential = {
    username: "dev",
    password: "dev",
  }
) {
  // state
  const [data, setData] = useState([]);
  const [option, setOptiob] = useState({});
  const [error, setError] = useState(null);

  // Encode the username and password
  const token = btoa(`${credential.username}:${credential.password}`);

  const CORS = "https://cors.bodha.co.id";
  const FTP_API = "http://10.1.111.141:30155/api/v2";

  const refetch = async (options) => {
    try {
      const { data } = await axios.get(`${CORS}/${FTP_API}/user/token`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      // const { data } = await axios.post('/api/file-auth', {
      //   key: encryptedText
      // })

      const { items, ...other } = data;

      setData(items || data);
      setOptiob(other);
      setError(null);
    } catch (error) {
      setError(error);

      throw error;
    } finally {
    }
  };

  useEffect(() => {
    if (!dontRunFirst) {
      refetch();
    }
  }, [dontRunFirst]);

  return {
    data,
    option,
    error,
    refetch,
  };
}
