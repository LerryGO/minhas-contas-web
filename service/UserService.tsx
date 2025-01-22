import axios from "axios";
import { Project } from "../types";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
})

export class UserService{
    getAll(){
        return axiosInstance.get("/user");
    }

    insert(user : Project.User){
        return axiosInstance.post("/user", user);
    }

    update(user : Project.User){
        return axiosInstance.put("/user", user);
    }

    delete( id : number){
        return axiosInstance.delete("/user/"+ id);
    }
}