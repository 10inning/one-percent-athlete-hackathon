import { useState } from "react"
import { useDispatch } from "react-redux"
import { UpdatePrompt } from "../../store/prompt/prompt.reducer";
import {FaArrowUpLong} from "react-icons/fa6"
import "./PromptInput.Styles.scss"
import AutoResizeTextarea from "../TextArea/TextArea.component"
import { getChatResponse } from "../../utils/API/getChatResponse"

function PromptInput() {
    // Stores the Prompt Input Entered by USer
    const [prompt, setPrompt] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const dispatch = useDispatch()

    async function handleSumbit(){
        try{
            dispatch(UpdatePrompt({type: "user", prompt: prompt}, "@update/prompt"))
            console.log(prompt)
            setPrompt("")
            const res = await getChatResponse(prompt)
            console.log(res)
            dispatch(UpdatePrompt({ type: "llm", prompt: res }));
        }catch(error){
            setErrorMessage(error)
            
        }
    }

    function HandleChange(value){
        setPrompt(value)
    }

    return (
        <div className="prompt-input-container">
            <AutoResizeTextarea value={prompt} onChange={HandleChange} />
            <button className="prompt-input-button" onClick={handleSumbit} disabled={!prompt}><FaArrowUpLong/></button>
            {/* <p>{errorMessage}</p> */}
        </div>
    )
}

export default PromptInput