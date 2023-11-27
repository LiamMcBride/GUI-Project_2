export function getDataSet(name){
    return JSON.parse(localStorage.getItem(name))
}

export function setDataSet(name, dataset){
    localStorage.setItem(name, JSON.stringify(dataset))
}

export function getNumberOfDataSets(){
    return localStorage.length
}

export function getDataSetNameFromIndex(index){
    return localStorage.key(index)
}