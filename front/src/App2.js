/*
Liam McBride (mailmcbride)
*/

import useApi from "./NetworkHook";
import axios from "axios";
import { useEffect, useState } from "react";

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
    
    const { data, error, loading } = useApi(fetchDataFromApi, [])
    
    
    useEffect(() => {},[fileName])


    if(loading) {
        return <div>I'm loading</div>
    }
    else if(error) {
        return <div>Error</div>
    }

    function render(name) {
        for(let i = 0; i < data.length; i++){
            console.log(name)
            if(data[i].fileName === name){
                return data[i].data.title
            }
        }
    }


    return (
        <div>{render(fileName)}</div>
    );
}

export default App2;
