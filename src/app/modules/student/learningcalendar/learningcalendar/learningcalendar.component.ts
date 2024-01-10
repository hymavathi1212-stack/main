import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-learningcalendar',
  templateUrl: './learningcalendar.component.html',
  styleUrls: ['./learningcalendar.component.scss'],
  // standalone:true,
  // imports:[MatStepperModule]
})
export class LearningcalendarComponent implements OnInit {

 


  id:any={}
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
 
  learningcalendar:any=[]
  constructor (private http:HttpClient , private route:ActivatedRoute){


  }

  ngOnInit(): void {
    this.http.get("http://localhost:1337/learningcalendar/").subscribe((response:any)=>{
      console.log(response)
      this.learningcalendar=response
    })
  }
  }
