import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Task } from '../task.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Task[] = [];

  displayedColumns: string[] = ['date', 'title', 'description', 'status'];
  dataSource = new MatTableDataSource<Task>();

  status: string = ''

  ngOnInit() {
    this.dataSource.data = [...this.tasks]
  }

  filterStatus(status: string) {
    if (status == 'Completed') {
      console.log(status)
    }
    else if (status == 'Pending') {
      console.log(status);
    } else if (status == 'To Do') {
      console.log(status);
    }
  }
  filterDate(){
    
  }
  
}
