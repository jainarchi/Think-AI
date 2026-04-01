import axios from 'axios'


const api = axios.create({
    baseURL:'http://localhost:3000/api/auth',
    withCredentials: true
})


export async function register({username , email , password}) {
    const response = await api.post('/register' ,{username , email , password})
    return response.data
    
}


export async function login({email , password}) {
    const response = await api.post('/login', {email , password})
    return response.data
    // msg user
    
}


export async function getMe() {

    const response = await api.get('/get-me')
    return response.data
    // user
    
}



export async function logout(){
    const response = await api.post('/logout')
    return response.data
}





export async function resentVerificationEmail({ email }) {

    const response = await api.post('/resend-verification' , {email})
    return response.data
    
    
}

export async function forgetPassword({email}) {

    const response = await api.post('/forget-password' , {email})
    return response.data 
    // msg - sent true
    
}



export async function resetPassword({newPassword}) {

    const response = await api.post(`/reset-password?token=${token}`, {newPassword} )
    return response.data
    
}

