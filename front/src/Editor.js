/*
Liam McBride (mailmcbride)
*/

import { useEffect } from 'react'
import './Editor.css'


function Editor(props) {
    function KeyValueBlock(props) {
        return (
            <div className="key-value-container">
                <input 
                    onChange={props.updateSelection} 
                    checked={props.selection.indexOf(Number(props.id)) != -1} 
                    type="checkbox" 
                    id={"check_" + props.id}>
                </input>
                <input 
                    onBlur={props.dataChange} 
                    id={"key_" + props.id} 
                    type="text" 
                    defaultValue={props.data[props.conf.keyName]} 
                />
                <input 
                    onBlur={props.dataChange} 
                    id={"val_" + props.id} 
                    type="number" 
                    defaultValue={props.data[props.conf.valueName]} 
                />
                <button onClick={() => props.removeData(props.id)}>
                    {
                        //SVG taken from https://iconmonstr.com/trash-can-1-svg/
                    }
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24"><path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" /></svg>
                </button>
            </div>
        )
    }

    function KeyValueContainer() {
        let blocks = []
        for (var i = 0; i < props.data.length; i++) {
            blocks.push(
                <KeyValueBlock updateSelection={props.updateSelection} selection={props.selection} conf={props.conf} removeData={props.removeData} key={i} dataChange={props.dataChange} data={props.data[i]} id={i} />
            )
        }

        const setTitleInput = () => {
            return (
                <div className='title-container'>
                    <input onBlur={props.handleMetaDataChange} id={"title-input"} defaultValue={props.conf.title.text}/>
                </div>
            )
        }

        const setKVInputs = () => {
            if(props.data.length != 0){
                return null
            }

            return (
                <div className='key-value-container'>
                    <div style={{
                        display: "block",
                        width: "26px"
                    }}></div>
                    <input onBlur={props.handleMetaDataChange} id={"key-name-input"} defaultValue={props.conf.keyName}/>
                    <input onBlur={props.handleMetaDataChange} id={"value-name-input"} defaultValue={props.conf.valueName}/>
                </div>
            )
        }

        return (
            <div className="key-value-column-container">
                {setTitleInput()}
                {setKVInputs()}
                <div className='key-value-container'>
                    <div style={{
                        display: "block",
                        width: "26px"
                    }}></div>
                    <input id={"new-key-input"} />
                    <input id={"new-value-input"} />
                    <button onClick={() => {
                        var newKey = document.getElementById("new-key-input").value
                        var newValue = document.getElementById("new-value-input").value

                        if (!isNaN(Number(newValue)) && newKey !== "") {
                            props.addData(newKey, Number(newValue), -1)
                        }

                    }}>Add</button>
                </div>
                {blocks}
            </div>
        )
    }

    useEffect(() => {}, [props, props.data])

    return (
        <div>
            <KeyValueContainer />
        </div>
    );
}

export default Editor;
