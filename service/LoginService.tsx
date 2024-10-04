import axios from "axios";
import '../config.js';

export const axiosInstance = axios.create({
	baseURL: `${global.config.url}:${global.config.port}`
})

export class LoginService{

    login(login: String, senha: String){
        return axiosInstance.post("/auth/login", 
            { username: login, password: senha});
    }

}