import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent  {

  taskName: string = '';
  taskDate: string = '';
  taskTime: string = '';

  saveTask() {
    // Add logic to save the task (e.g., call a service)
    console.log('Task saved:', {
      name: this.taskName,
      date: this.taskDate,
      time: this.taskTime
    });
  }}
