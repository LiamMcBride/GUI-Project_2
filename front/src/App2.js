/*
Liam McBride (mailmcbride)
*/

import useApi from "./NetworkHook";
import axios from "axios";
import { useState } from "react";

function App2() {

    const { fileName, setFileName } = useState("pr1.json")
    
    const fetchDataFromApi = async () => {
        try {
            const response = await axios.get('http://localhost:3000/db/find');
            return response.data;
        } catch (error) {
            throw error;
        }
    };
    
    const { data, error, loading } = useApi(fetchDataFromApi, [], "pr1.json")

    if(loading) {
        return <div>I'm loading</div>
    }
    else if(error) {
        return <div>Error</div>
    }
    else if(data !== undefined) {
        console.log(data)
    }

    return (
        <div>{data.fileName}</div>
    );
}

export default App2;
