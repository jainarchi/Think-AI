import "dotenv/config"
import { tavily as Tavily }from "@tavily/core";


const tavily = new Tavily ({
    apiKey : process.env.TAVILY_API_KEY
})




export const searchInternet =  async ({query}) =>{

    const result  = await tavily.search(query , {
        maxquery : 5
    })

    console.log(JSON.stringify(result))


    return JSON.stringify(result)

}