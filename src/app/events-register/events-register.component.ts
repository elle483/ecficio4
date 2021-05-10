import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'models/user';
import { IttopService } from '../ittop.service';
import { WindowRefService } from '../window-ref.service';
@Component({
  selector: 'app-events-register',
  templateUrl: './events-register.component.html',
  styleUrls: ['./events-register.component.css']
})
export class EventsRegisterComponent implements OnInit {

  registrationForm:FormGroup;
  submitted: boolean = false;
  err:string="";
  userDetails:User=<User>{};
  currency="INR";
  currencyIcon="₹";

  constructor(private us:IttopService,private fb:FormBuilder,
    private router:Router,private winRef: WindowRefService) {
      this.registrationForm = this.fb.group({
        email:    ['', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])],
        name: ['',Validators.required],
        rollno: ['', Validators.required],
        college: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
      });
    }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      email:    ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])],
      name: ['',Validators.required],
      rollno: ['', Validators.required],
      college: ['', Validators.required],
      phone: ['', Validators.compose([Validators.required, Validators.min(5999999999), Validators.max(9999999999)])],
    });
  }

  get f() { 
    return this.registrationForm.controls; 
  }  


  createCode(){
    this.submitted = true;
    if (this.registrationForm.invalid) {
        return;
    }

    this.us.validEmail({email:this.registrationForm.value.email, phone: this.registrationForm.value.phone}).subscribe((data:any)=>{
      console.log(data);
      if(data['message']=='success')
      {
        this.userDetails.email=this.registrationForm.value.email;
        this.us.razorpayOrder().subscribe((baka:any)=>{
          console.log(baka);
          if(baka['message']=='success'){
            this.paywithRazor(baka);
          }
          else{
            alert('some error occured');
          }
        });
      }
      else if(data['message']=='already exists'){
        alert('phone number already exists!!');
      }
      else 
        alert('Enter real email address!!');
    });

  }  


  paywithRazor(data:any){
    this.userDetails.name=this.registrationForm.value.name;
    this.userDetails.email=this.registrationForm.value.email;
    this.userDetails.phone=this.registrationForm.value.phone;
    this.userDetails.college=this.registrationForm.value.college;
    this.userDetails.rollno=this.registrationForm.value.rollno;
    var options = {
      order_id: data['order']['id'],
      description: 'Ecficio 4.0 Events Payment',
      currency: this.currency, // your 3 letter currency code
      key: data['key'], // your Key Id from Razorpay dashboard
      amount: Number(data['amount']), // Payment amount in smallest denomiation e.g. cents for USD
      name: 'Ecficio',
      handler: function (response:any){
        
      },
      prefill: {
        email: this.registrationForm.value.email,
        contact: this.registrationForm.value.phone,
        name: this.registrationForm.value.name
      },
      theme: {
      },
      modal: {
        ondismiss: function () {
          alert('dismissed')
        }
      }
    }; 
    options.handler=((response)=>{
      console.log(response);
        this.userDetails.transactionid=response.razorpay_payment_id;
        this.userDetails.paymentAmount=Number(data['amount']);
        this.userDetails.timestamp =(new Date()).toString();
        this.userDetails.eventsp=true;
        this.userDetails.competitionsp1=false;
        this.userDetails.competitionsp2=false;
        this.userDetails.competitionsp3=false;
        this.userDetails.event1_creative=[];
        this.userDetails.event2_sherlocked=[];
        this.userDetails.event3_natvar=[];
        this.userDetails.event4_nirmoktar=[];
        this.userDetails.event5_picture=[];
        this.userDetails.event6_explore=[];
        this.userDetails.competition1=[];
        this.userDetails.competition2=[];
        this.userDetails.competition3=[];
        this.us.addEUser(this.userDetails).subscribe((data:any)=>{
          if(data['message']=='success'){
            alert("receipt:"+data['receipt']);
            this.router.navigate(['/login']);
          }
          else{
            alert('some error occured');
          }
        });
    });

    var rzpy=new this.winRef.nativeWindow.Razorpay(options);
    rzpy.open();
  }

}
