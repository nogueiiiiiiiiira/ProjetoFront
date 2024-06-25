import axios from 'axios';

export const apiBiblioteca = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true, 
})

export const apiBooks = axios.create({
    baseURL: "https://www.googleapis.com/books/v1/volumes?q=searchTerm"
})

apiBiblioteca.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

export default apiBiblioteca;