import axios from 'axios'



const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'


const api = axios.create({
    baseURL:BASE_URL,
    withCredentials: true
})


export async function saveOnePrompt({prompt}) {
    const response = await api.post('/api/chats/save-prompt' , {
       description: prompt
    })
    return response.data   
}


export async function getSavedPrompts(){
    const response = await api.get('/api/chats/saved-prompt')
    return response.data
}


export async function deleteOneSavedPrompt({promptId}){
    const response = await api.delete(`/api/chats/delete-prompt/${promptId}`)
    return response.data
}