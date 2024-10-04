import axios from "axios";
import { BaseService } from "./BaseService";


export class ComunicaService extends BaseService {

    constructor(){
        super("/comunica");
    }

}