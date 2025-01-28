import { BaseService } from "./BaseService";

export class UserProfileService extends BaseService{
   constructor(){
    super("/user-profile");
   }
}