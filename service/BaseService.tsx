import axios from "axios";
import { Project } from "../types";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL_API
})

export class BaseService{
    url: string;

    constructor(url: string){
        this.url = url;
    }

    getAll(){
        return axiosInstance.get(this.url);
    }

    getById( id: number){
        return axiosInstance.get(this.url + "/" + id);
    }

    insert(data : any){
        return axiosInstance.post(this.url, data);
    }

    update(data : any){
        return axiosInstance.put(this.url, data);
    }

    delete( id : number){
        return axiosInstance.delete(this.url + "/" + id);
    }

}