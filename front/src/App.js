/*
Liam McBride (mailmcbride)
*/

import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import './App.css';
import BarChart from './BarChart';
import Editor from './Editor';
import './load.js'
import Toolbar from './Toolbar';
import { getDataSet, setDataSet } from './DataHandler.js';

function App() {
  //file and data state variables
  const [fileName, setFileName] = useState('pr1.json') //base data set
  const [metaData, setMetaData] = useState({ title: "", key: "", value: "" }) //meta data only really gets used on title or kv name changes. Looks to file data if these are empty
  console.log("info you want is here")
  console.log(getDataSet(fileName))
  const [data, setData] = useState(null) //checks if we have a valid filename to use
  //file changing and brushing state variables
  const [modified, setModified] = useState(fileName === "") //indicates it's not saved when new dataset is created
  const [selection, setSelection] = useState([]) //empty selection by default

  //generates the configuration file for the BarChart.js component
  //Editor.js also uses it for the names of keys, values, and the title
  const configuration = () => {
    const obj = () => {
      var newObj = {}
      //don't load file from localStorage if there's no name
      if (fileName !== "") {
        newObj = getDataSet(fileName)
      }
      //create default title and data if there's no name
      else {
        newObj = { title: "new data set", data: [] }
      }

      //check meta data values and overwrite default or localStorage values
      if (metaData.title !== "") {
        newObj.title = metaData.title
      }
      if (metaData.key !== "") {
        newObj.key = metaData.key
      }
      if (metaData.value !== "") {
        newObj.value = metaData.value
      }
      return newObj
    }

    var keys = []
    console.log(`Configuration was called. Here's data: ${data}`)
    //if metaData has a key or value name don't take from file
    if (metaData.key !== "" && metaData.value !== "") {
      keys = [metaData.key, metaData.value]
    }
    //if no metaData and no data to pull kv from, generate defaults
    else if (obj().data.length == 0) {
      keys = ["key", "value"]
    }
    //if no metaData and there is data available, pull kv names from it
    else {
      keys = Object.keys(obj().data[0])
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
        text: obj().title,
      },
      bar: {
        barSpacing: 10
      }
    }
  }

  //changes the fileName, data, resets modified indicator, and clears metaData
  const updateFileName = (name) => {
    setFileName(name)
    setData(getDataSet(name).data)
    setModified(false)
    setMetaData({ title: "", key: "", value: "" })
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

  //[_ _ 2 _ 4 5 _]
  //[_ _ 2 _ 5 _]

  function shiftSelection(index) {
    var newSelection = []
    selection.forEach((d, i) => {
      if (index != d) {
        if (index < d) {
          newSelection.push(d - 1)
        }
        else {
          newSelection.push(d)
        }
      }
    })
    setSelection(newSelection)
  }

  //removes data based on index, used by Editor's delete buttons
  function removeDataAtIndex(index) {
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

  //saves an existing data set
  const saveDataSet = () => {
    //recreates object from load.js with new data
    const dataset = {
      title: configuration().title.text,
      data: data
    }

    setDataSet(fileName, dataset)
    //has been saved so is no longer modified
    setModified(false)
  }

  //responsible for creating a new data set
  const newDataSet = () => {
    //clear the fileName so that we don't try and read from localStorage
    setFileName("")
    setData([]) //blank data
    setModified(true) //isn't saved so modified should be true
    setMetaData({ title: "", key: "", value: "" }) //blank metaData
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

      setDataSet(fName, dataset)
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
      newObj["key"] = metaData.key
      newObj["value"] = metaData.value
    }
    else if (id === "key-name-input") {
      newObj["title"] = metaData.title
      newObj["key"] = e.target.value
      newObj["value"] = metaData.value
    }
    else if (id === "value-name-input") {
      newObj["title"] = metaData.title
      newObj["key"] = metaData.key
      newObj["value"] = e.target.value
    }

    setMetaData(newObj)
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tData = await getDataSet(fileName);
        // Set the state with the data from the API
        setData(tData);
        console.log("data is set")
        console.log(tData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData()
  }, [])

  const loadedDisplay = () => {
    return (
      <div className="App" style={{ paddingTop: 50 }}>
        <Toolbar
          modified={modified}
          fileName={fileName}
          handleNew={newDataSet}
          handleSave={saveDataSet}
          handleLoad={updateFileName}
          handleSaveAs={saveDataSetAs}
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
              updateSelection={updateSelectionBar}
              selection={selection}
              conf={configuration()}
              data={data}
            />
          </Box>
        </div>


      </div>
    )
  }

  const loadingDisplay = () => <div>Loading</div>
  console.log(data)
  if (data === null) {
    console.log("data was null: display loading")
    return loadingDisplay()
  }
  return (
    loadedDisplay()
  );
}

export default App;
