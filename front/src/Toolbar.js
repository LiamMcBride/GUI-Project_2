/*
Liam McBride (mailmcbride)
*/

import { useState } from 'react'
import './Toolbar.css'
import {getNumberOfDataSets, getDataSetNameFromIndex} from './DataHandler.js'

function Toolbar(props) {
    //drop down toggle variables
    const [dropDownToggle, setDropDownToggle] = useState(false)
    const [loadToggle, setLoadToggle] = useState(false)
    const [saveAsToggle, setSaveAsToggle] = useState(false)

    //used to make sure all menus close when performing actions it makes sense for
    const closeDropDown = () => {
        setDropDownToggle(false)
        setLoadToggle(false)
        setSaveAsToggle(false)
    }

    //menu that provides a textbox and button to write the name of the new file
    const saveAsMenu = (show) => {
        if (show) {
            return (
                <div className="save-as-menu-div">
                    <input id="new-file-name-input"></input>
                    <button 
                        onClick={() => {
                            //make sure the filename isn't blank, if it is do nothing
                            if (document.getElementById("new-file-name-input") !== "" || document.getElementById("new-file-name-input") != null){
                                closeDropDown()
                                props.handleSaveAs(document.getElementById("new-file-name-input").value)
                            }
                        }}
                    >
                        Save
                    </button>
                </div>
            )
        }
        else {
            return null
        }
    }

    //menu for selecting which specific file to load
    const loadMenu = (show) => {
        if (show) {
            var elems = []

            for (var i = 0; i < getNumberOfDataSets(); i++) { //populates the elems var with the existing file names
                elems.push(getDataSetNameFromIndex(i))
            }
            //if you created a new file with no name yet, this will indicate that to the user
            //as well as give select a default value so you are able to switch to all valid filenames
            if(props.fileName === ""){ 
                elems.push("no file yet")
            }
            return (
                <div className="load-menu-div">
                    <select 
                        value={props.fileName === "" ? "no file yet" : props.fileName}  //no file yet is rendered if no file name
                        onChange={(e) => {
                            props.handleLoad(e.target.value)
                            closeDropDown()
                        }}
                    >
                        {elems.map((v, i) => <option key={i} id={i} value={v}>{v}</option>)}
                    </select>
                </div>
            )
        }
        return null
    }

    //main drop down element
    const dropDown = (show) => {
        if (show) {
            return (
                <div className="file-window-div">
                    <button
                        onClick={() => {
                            closeDropDown()
                            props.handleNew()
                        }}
                    >
                        New
                    </button>
                    <button
                        onClick={() => setLoadToggle(!loadToggle)} //toggle 2nd menu
                    >
                        Load
                    </button>
                    <button 
                        disabled={props.fileName === ""} //if no file exists, we can only do a save as, so disable save
                        onClick={() => {
                            closeDropDown()
                            props.handleSave()
                        }}
                    >
                        Save
                    </button>
                    <button 
                        onClick={() => setSaveAsToggle(!saveAsToggle)} //toggle 2nd menu
                    >
                        Save As
                    </button>
                </div>
            )
        }
        else {
            return null
        }
    }

    return (
        <div className="toolbar">
            <button className="drop-down-toggle-button" 
                onClick={() => dropDownToggle ? closeDropDown() : setDropDownToggle(true)} //close all or open just main menu
            >
                File
                {
                    //modified indicator only renders if modified is true
                }
                <p className={props.modified ? "" : "hidden"}>Modified</p>
            </button>
            {
                //main menu, load sub-menu, and save as sub-menu are conditionally rendered here off of state vars
            }
            {dropDown(dropDownToggle)}
            {loadMenu(loadToggle)}
            {saveAsMenu(saveAsToggle)}
            <h1>Project 1</h1>
        </div>
    );
}

export default Toolbar;
