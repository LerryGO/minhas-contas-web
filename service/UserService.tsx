import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class UserService{
    getAll(){
        return axiosInstance.get("/user");
    }
}