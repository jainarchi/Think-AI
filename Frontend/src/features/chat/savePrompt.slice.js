import {createSlice } from '@reduxjs/toolkit'


const savePromptSlice = createSlice({
    name: 'userPrompt',
    initialState: {
        selectPrompt: null,
        savedPrompts : []
        
    },

    reducers:{
        
    setSelectPrompt:(state , action) =>{
      state.selectPrompt = action.payload;
    },
    
    clearSelectPrompt:(state)=>{
      state.selectPrompt = null
    },

    setSavedPrompts :(state , action) =>{
      state.savedPrompts = action.payload
    },


    deleteSavedPrompt:(state , action) =>{
      const {promptId} = action.payload
      state.savedPrompts = state.savedPrompts.filter(p => p.id != promptId)
    },
     

    addOneSavedPrompt:(state , action) =>{
      state.savedPrompts.unshift(action.payload)
    },


    }
})

export const {
  setSelectPrompt,
  clearSelectPrompt,

  setSavedPrompts,
  deleteSavedPrompt,
  addOneSavedPrompt
  
} = savePromptSlice.actions


export default savePromptSlice.reducer

    



/*
  savedPrompt = [
   {
    id:
    title:
    description:
   
  },
  



  ]


*/