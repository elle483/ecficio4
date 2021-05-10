import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'models/user';

@Injectable({
  providedIn: 'root'
})
export class IttopService {

  
  //mlink:string="http://localhost:3000";
  //mlink:string="https://ecficiom.herokuapp.com";
  mlink="";

  constructor(private http:HttpClient) { }

  //deploy
  addEUser(obj:User){
    return this.http.post(this.mlink+'/user/addEUser',obj);
  }
  validEmail(obj:any){
    return this.http.post(this.mlink+'/user/validEmail',obj);
  }
  razorpayOrder(){
    return this.http.post(this.mlink+'/user/razorpayOrder',{});
  }
}
