import {
    saveOnePrompt,
    getSavedPrompts,
    deleteOneSavedPrompt

} from '../service/savePrompt.api.js'

import {
  setSelectPrompt,
  clearSelectPrompt,
  setSavedPrompts,
  deleteSavedPrompt,
  addOneSavedPrompt
}from '../savePrompt.slice.js'


import { setCurrentChatId } from '../chat.slice.js'
import { useDispatch } from 'react-redux'



export const useSavePrompt = () =>{
    const dispatch = useDispatch()


    
    // save one prompt to state and fill in input 

    const handleSelectPrompt = (prompt , withChat) =>{
      dispatch(setSelectPrompt(prompt))

      if(withChat=== 'new'){
        dispatch(setCurrentChatId(null))
      }
    }



    const handleClearSelectPrompt = () => {
      dispatch(clearSelectPrompt())
      console.log('clear ')
    }


    //  save one prompt to db

    const handleSavePrompt = async (prompt) =>{

      try{
         const data = await saveOnePrompt({ prompt})
         const newprompt = data.savedPrompt

          dispatch(addOneSavedPrompt({
            id: newprompt._id,
            title : newprompt.title,
            description : newprompt.description

          }))

      }catch(err){
        console.log( "saved failed" , err)

      } 
    }



    
    // get all saved prompt from db and dispatch set Saved Prompt

    const handleGetSavedPrompts = async () =>{
      const data = await getSavedPrompts()
      dispatch(setSavedPrompts(data.savedPrompts.map( (p) =>(
        {
            id : p._id,
            title: p.title,
            description : p.description
        }
      ))))
      console.log(data.message)
      console.log(data.savedPrompts)
    }




  // delete one prompt from db and optimised UI instant feedback

    const handleDeleteSavedPrompt = async (promptId) => {
     try{
      dispatch(deleteSavedPrompt({promptId}))

      const data = await deleteOneSavedPrompt({promptId})
      console.log(data.message)
     }
     catch(err){
      console.log("delete failed" , err.message)
      handleGetSavedPrompts()
     }
    }




    return {
        handleSelectPrompt,
        handleClearSelectPrompt,

        handleSavePrompt,
        handleGetSavedPrompts,
        handleDeleteSavedPrompt
    }





}






