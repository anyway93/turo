import axios from "axios"

export const api_tours = async () => {

    const res = await axios.get('/api/tours').then()

    const data = res.data

    console.log(data)

    return data
}