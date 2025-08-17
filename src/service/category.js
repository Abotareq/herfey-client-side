import axios from "axios"
const API_BASE = 'http://localhost:5000/api/category';
// get all
export const getAllCategories = async () => {
    const {data} = await axios.get(API_BASE);
    console.log("get all ",data)
    return data;
}
// get by id
export const getCategoriesById = async (categoryId) => {
    const {data} =  await axios.get(`${API_BASE}/${categoryId}`);
    console.log("get by id", data)
    return data.data.category
}