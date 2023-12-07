/*
Liam McBride (mailmcbride)
*/

import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import './App.css';
import BarChart from './BarChart';
import DotPlot from './DotPlot';
import Editor from './Editor';
import './load.js'
import {useApi, updateAPIData, createAPIData} from './NetworkHook';
import Toolbar from './Toolbar';

function App() {
  //file and data state variables
  const [fileName, setFileName] = useState('pr1.json') //base data set
  const [editedMetaData, setEditedMetaData] = useState({ title: "", key: "", value: "" }) //meta data only really gets used on title or kv name changes. Looks to file data if these are empty
  const [data, setData] = useState([]) //checks if we have a valid filename to use
  
  //file changing and brushing state variables
  const [modified, setModified] = useState(fileName === "") //indicates it's not saved when new dataset is created
  const [selection, setSelection] = useState([]) //empty selection by default
  const [clipBoard, setClipBoard] = useState([]) //empty selection by default
  const [displayType, setDisplayType] = useState('bar') //empty selection by default

  const {networkData, error, loading, setLoading} = useApi([fileName]);

  //generates the configuration file for the BarChart.js component
  //Editor.js also uses it for the names of keys, values, and the title
  const configuration = () => {
    const obj = () => {
      var newObj = {}
      //don't load file from localStorage if there's no name
      if (fileName !== "") {
        newObj["data"] = data
        newObj["title"] = getNetworkObjectByFileName().dataset["title"]
        // newObj = JSON.parse(localStorage.getItem(fileName))
      }
      //create default title and data if there's no name
      else {
        newObj = { title: "new data set", data: [] }
      }

      //check meta data values and overwrite default or localStorage values
      if (editedMetaData.title !== "") {
        newObj.title = editedMetaData.title
      }
      if (editedMetaData.key !== "") {
        newObj.key = editedMetaData.key
      }
      if (editedMetaData.value !== "") {
        newObj.value = editedMetaData.value
      }
      return newObj
    }

    var keys = []
    //if metaData has a key or value name don't take from file
    if (editedMetaData.key !== "" && editedMetaData.value !== "") {
      keys = [editedMetaData.key, editedMetaData.value]
    }
    //if no metaData and no data to pull kv from, generate defaults
    else if (obj().data.length == 0 || getNetworkObjectByFileName().dataset.data.length == 0) {
      keys = ["key", "value"]
    }
    //if no metaData and there is data available, pull kv names from it
    else {
      keys = Object.keys(getNetworkObjectByFileName().dataset.data[0])
    }

    return {
      dataPadding: 5,
      keyName: keys[0],
      valueName: keys[1],
      viewBox: {
        width: 100,
        height: 100
      },
      title: {
        text: obj().title == '' ? getNetworkObjectByFileName().dataset.title : obj().title,
      },
      bar: {
        barSpacing: 10
      }
    }
  }

  //changes the fileName, data, resets modified indicator, and clears metaData
  const updateFileName = (name) => {
    setFileName(name)
    console.log(getNetworkObjectByFileName(name).dataset.data)
    setData(getNetworkObjectByFileName(name).dataset.data)
    setModified(false)
    setEditedMetaData({ title: "", key: "", value: "" })
  }
  
  //event handlers
  //passed to editor to handle data additions
  //is also used as a helper function by handleDataChange
  const updateData = (key, value, index) => {
    //data is being updated, so file is modified
    setModified(true)
    //temp variable so we can alter data w/ directly modifying a state var
    var tData = data

    //if index != -1 we are modifying an existing data point
    if (index != -1) {
      if (value != -1) {
        tData[index][configuration().valueName] = value
      }
      if (key !== "") {
        tData[index][configuration().keyName] = key
      }
    }

    //now we deep copy tData into newData so that state updates properly
    var newData = []

    //create a brand new object each iteration to make sure state updates
    for (var i = 0; i < tData.length; i++) {
      var newObject = {}

      newObject[configuration().keyName] = tData[i][configuration().keyName]
      newObject[configuration().valueName] = tData[i][configuration().valueName]
      newData.push(newObject)
    }

    //if index == -1 we are adding a new data point and we do that here
    if (index == -1) {
      var newObject = {}

      newObject[configuration().keyName] = key
      newObject[configuration().valueName] = Number(value)
      newData.push(newObject)
    }

    //set state
    setData(newData)
  }

  function shiftSelection(index){
    var newSelection = []
    selection.forEach((d,i) => {
      if (index != d){
        if (index < d){
          newSelection.push(d - 1)
        }
        else{
          newSelection.push(d)
        }
      }
    })
    setSelection(newSelection)
  }

  //removes data based on index, used by Editor's delete buttons
  function removeDataAtIndex(index) {
    console.log("Removing: " + index)
    shiftSelection(index)

    //data has been modified
    setModified(true)
    var newData = []

    for (var i = 0; i < data.length; i++) {
      //only add values that don't match the index param
      if (i != index) {
        var newObject = {}

        newObject[configuration().keyName] = data[i][configuration().keyName]
        newObject[configuration().valueName] = data[i][configuration().valueName]
        newData.push(newObject)
      }
    }

    //set new data
    setData(newData)
  }

  function removeSelectionData() {

    //data has been modified
    setModified(true)
    var newData = []

    for (var i = 0; i < data.length; i++) {
      //only add values that don't match the index param
      if (!selection.includes(i)) {
        var newObject = {}

        newObject[configuration().keyName] = data[i][configuration().keyName]
        newObject[configuration().valueName] = data[i][configuration().valueName]
        newData.push(newObject)
      }
    }
    setSelection([])
    //set new data
    setData(newData)
  }

  function saveToClipBoard() {
    let newBoard = []
    selection.forEach((s) => {
      console.log(data[s])
      newBoard.push(data[s])
    })
    console.log(newBoard)
    setClipBoard(newBoard)

  }

  function updateMultipleData(arr){
     var newData = []

    //create a brand new object each iteration to make sure state updates
    for (var i = 0; i < data.length; i++) {
      var newObject = {}

      newObject[configuration().keyName] = data[i][configuration().keyName]
      newObject[configuration().valueName] = data[i][configuration().valueName]
      newData.push(newObject)
    }

    for (var i = 0; i < arr.length; i++) {
      newData.push(arr[i])
    }

    //set state
    setData(newData)
  }

  function pasteClipBoard() {
    if(clipBoard.length !== 0){
      let key = configuration().keyName
      let value = configuration().valueName
      let [oldKey, oldValue] = Object.keys(clipBoard[0])
      let updateArray = []
      clipBoard.forEach((c) => {
        let nPoint = {}
        nPoint[key] = c[oldKey]
        nPoint[value] = c[oldValue]
        updateArray.push(nPoint)
      })
      updateMultipleData(updateArray)
    }
  }

  function handleDisplayChange(e) {
    setDisplayType(e.target.value)
  } 
  
  //saves an existing data set
  const saveDataSet = () => {
    //recreates object from load.js with new data
    const dataset = {
      title: configuration().title.text,
      data: data
    }

    // localStorage.setItem(fileName, JSON.stringify(dataset));
    updateAPIData(getNetworkObjectByFileName()["_id"], fileName, dataset)
    //has been saved so is no longer modified
    setModified(false)
  }

  //responsible for creating a new data set
  const newDataSet = () => {
    //clear the fileName so that we don't try and read from localStorage
    setFileName("")
    setData([]) //blank data
    setModified(true) //isn't saved so modified should be true
    setEditedMetaData({ title: "", key: "", value: "" }) //blank metaData
  }

  //save dataset with a new fileName
  const saveDataSetAs = (fName) => {
    //don't do anything if no new fileName is provided
    if (fName != null && fName !== "") {
      //same as saveDataSet but with fName not fileName
      const dataset = {
        title: configuration().title.text,
        data: data
      }

      createAPIData(fName, dataset)
      setLoading(true)
      setModified(false)
      setFileName(fName)
    }
  }

  //triggered when a data element is selected or deselected in BarChart
  const updateSelectionBar = (e) => {
    //get index from id string
    var index = Number(e.target.id.split('_')[1])
    //is the element already selected? Are we adding or removing?
    var add = e.target.className.baseVal !== "selected-bar"
    
    //generate a new array to properly set state
    var newSelection = selection
    if (add) {
      newSelection.push(index)
    }

    var tSelection = []
    newSelection.forEach((i) => !add && i == index ? null : tSelection.push(i))
    setSelection(tSelection)
  }

  //update selection from the editor
  const updateSelectionEditor = (e) => {
    var index = Number(e.target.id.split('_')[1])
    var add = e.target.checked == true //if it's checked we are now adding
    var newSelection = selection
    if (add) {
      newSelection.push(index)
    }

    var tSelection = []
    newSelection.forEach((i) => !add && i == index ? null : tSelection.push(i))
    setSelection(tSelection)
  }

  //handles changes to meta data in editor
  const handleMetaDataChange = (e) => {
    var id = e.target.id
    var newObj = {}

    //determines what input triggered it and modifies newObj accordingly
    if (id === "title-input") {
      newObj["title"] = e.target.value
      newObj["key"] = editedMetaData.key
      newObj["value"] = editedMetaData.value
    }
    else if (id === "key-name-input") {
      newObj["title"] = editedMetaData.title
      newObj["key"] = e.target.value
      newObj["value"] = editedMetaData.value
    }
    else if (id === "value-name-input") {
      newObj["title"] = editedMetaData.title
      newObj["key"] = editedMetaData.key
      newObj["value"] = e.target.value
    }

    setEditedMetaData(newObj)
    setModified(true) //has now had metaData modified
  }

  //handler from Editor that handles determining if it's a value or key modification and the index
  const handleDataChange = (e) => {
    setModified(true)
    var index = e.target.id.split('_')

    if (index[0] == "val") {
      updateData("", Number(e.target.value), Number(index[1]))
    }
    else if (index[0] == "key") {
      updateData(e.target.value, -1, Number(index[1]))
    }
  }

  const handleEdit = (e) => {
    let id = (e.target.id)

    if(id === "cut"){
      console.log("cut")
      saveToClipBoard()
      if(selection.length != 0){
        removeSelectionData()
      }
    }
    else if(id === "copy"){
      console.log("copy")
      saveToClipBoard()
    }
    else if(id === "paste"){
      console.log("paste")
      pasteClipBoard()
    }
  }

  function getNetworkObjectByFileName(name=fileName) {
    if (name === ""){
      return {fileName: "no file name", dataset: {title: "New Data Set", data: []}}
    }
    let tData = [...networkData]
    for(let i = 0; i < networkData.length; i++){
      if(tData[i].fileName === name){
        return tData[i]
      }
    }
    setLoading(true)
  }

  useEffect(() => {
    console.log("useEffect")
    if(!loading && error == null){
      let tData = [...networkData]
      tData = getNetworkObjectByFileName().dataset.data
      setData(tData)
    }
  }, [loading, error, networkData, fileName])

  if(loading){
    return <h1>Loading</h1>
  }
  else if(error){
    return <h1>Error</h1>
  }

  const displayChart = () => {
    if(displayType === 'bar'){
      return (
        <BarChart 
          updateSelection={updateSelectionBar} 
          selection={selection} 
          conf={configuration()} 
          data={data} 
        />
        )
      }
      return (
        <DotPlot 
          updateSelection={updateSelectionBar} 
          selection={selection} 
          conf={configuration()} 
          data={data} 
        />
    )
  }

  return (
    <div className="App" style={{ paddingTop: 50 }}>
      <Toolbar 
        modified={modified} 
        fileName={fileName} 
        handleNew={newDataSet} 
        handleSave={saveDataSet} 
        handleLoad={updateFileName} 
        handleSaveAs={saveDataSetAs}
        handleEdit={handleEdit}
        networkData={networkData}
        handleDisplayChange={handleDisplayChange}
      />
      <div className="app-child">
        <Box sx={{
          maxWidth: "400px",
          height: "400px",
          border: "black solid 2px",
          borderRadius: "5px",
          flexGrow: "1",
          margin: "8px"
        }}>
          <Editor 
            handleMetaDataChange={handleMetaDataChange} 
            updateSelection={updateSelectionEditor} 
            selection={selection} 
            removeData={removeDataAtIndex} 
            addData={updateData} 
            dataChange={handleDataChange} 
            data={data} 
            conf={configuration()} 
          />
        </Box>
        <Box sx={{
          maxWidth: "400px",
          height: "400px",
          border: "black solid 2px",
          borderRadius: "5px",
          display: "inline-block",
          flexGrow: "1",
          margin: "8px"
        }}>
        <BarChart 
          chartType={displayType}
          updateSelection={updateSelectionBar} 
          selection={selection} 
          conf={configuration()} 
          data={data} 
        />
          
        </Box>
      </div>


    </div>
  );
}

export default App;
