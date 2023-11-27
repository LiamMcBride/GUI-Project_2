import axios from 'axios';

export async function getDataSet(name) {
    await axios.get('http://localhost:3000/db/find').then(res => {
        let sets = res["data"]
        for(let x = 0; x < sets.length; x++){
            if (sets[x].fileName === name){
                console.log(sets[x]['dataset'].data)
                return sets[x]['dataset']
            }
        }
        // saveNewTitles(res["data"][0]["datasets"])
        // setId(res["data"][0]["_id"])
    }).catch((err) => { //catches error if there is one and sets titles to empty
        console.log(err)
        throw err
    })
    // return JSON.parse(localStorage.getItem(name))
}

export function setDataSet(name, dataset) {
    localStorage.setItem(name, JSON.stringify(dataset))
}

export function getNumberOfDataSets() {
    return localStorage.length
}

export function getDataSetNameFromIndex(index) {
    return localStorage.key(index)
}