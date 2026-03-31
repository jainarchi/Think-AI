import axios from 'axios'


const api = axios.create({
    baseURL:'http://localhost:3000',
    withCredentials: true
})


export async function sendMessage({message , chatId}){
     const response = await api.post('/api/chats/message' , {
        message , chatId
     }) 
     return response.data
} 


export async function getChats() {
    const response = await api.get('/api/chats')
    return response.data
    // chats
    
}

export async function getMessages({chatId}) {
    const response = await api.get(`/api/chats/${chatId}/messages`)
    return response.data
    // messages 
    
}

export async function deleteChat({chatId}) {
    const response = await api.delete(`/api/chats/${chatId}`)
    return response.data
    
}

export async function editChatTitle({chatId , newTitle}) {
    const response = await api.patch(`/api/chats/${chatId}/edit-title` , { newTitle})
    return response.data
    
}
