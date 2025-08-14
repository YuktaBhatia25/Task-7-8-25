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

  ngOnInit() {
    this.dataSource.data = [...this.tasks]
  }

  filterValues = {
    startDate: '',
    endDate: '',
    title: '',
    description: '',
    status: ''
  };
 
 
  filters() {
    let data = [...this.tasks];

    if (this.filterValues.startDate && this.filterValues.endDate) {
      // console.log(this.filterValues.startDate, this.filterValues.endDate);
      const start = new Date(this.filterValues.startDate);
      const end = new Date(this.filterValues.endDate);
      data = data.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= start && taskDate <= end;
      });
      this.dataSource.data = data
      .sort((a, b) => 
        new Date(a.date).getDate() - new Date(b.date).getDate()
      );
    }
    
    if(this.filterValues.status){
      data = data.filter(task => 
        task.status.toLowerCase() == this.filterValues.status.toLowerCase()
      );
      this.dataSource.data = data;
    }

    if(this.filterValues.title){
      data = data.filter(task =>
        task.title.toLowerCase().includes(this.filterValues.title.toLowerCase())
      );
      this.dataSource.data = data;
    }

    if(this.filterValues.description){
      // console.log(this.filterValues.description);
      data = data.filter(task =>
        task.description.toLowerCase().includes(this.filterValues.description.toLowerCase())
      );
      this.dataSource.data = data;
    }
    this.dataSource.data = data;
  }
}
