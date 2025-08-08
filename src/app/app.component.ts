import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DialogComponent } from './dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Task, TaskService } from './task.service';
import { ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Calendar';

  tasks: Task[] = [];

  constructor(private dialog: MatDialog, private taskService: TaskService) { }

  ngOnInit() {
    this.getData()
  }

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'addBtn, dayGridMonth, dayGridWeek'
    },
    // weekends: false,
    // hiddenDays: [0, 6],
    events: [],

    customButtons: {
      addBtn: {
        text: 'Add Task',
        click: (info: any) => this.openDialog({mode: 'add'})
      }
    },

    // eventClick: this.handleEventClick.bind(this),
    eventClick: (info: any) => {
      // console.log(info.event.title);
      const task = this.tasks.find(task => task.title === info.event.title);
      // console.log(task);
      if (task) {
        this.openDialog({ ...task, mode: 'view' });
      }
    },
    dateClick: this.handleDateClick.bind(this),
  };

  handleEventClick(info: any) {
    alert('Event clicked: ' + info.event.title);
  }

  handleDateClick(arg: any): void {
    // alert('Date clicked: ' + arg.dateStr);
    console.log(arg);
    this.openDialog({ date: arg.dateStr, mode: 'add' })
  }

  getData(): void {
    this.taskService.getAll().subscribe(data => {
      this.tasks = data;
      this.loadTasks();
    });
  }

  // This Function is used to load the tasks
  loadTasks(): void {
    // if (!this.calendarComponent) return;

    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();

    this.tasks.forEach(task => {
      calendarApi.addEvent({
        title: task.title,
        start: new Date(task.date).toISOString().split('T')[0],
        allDay: true,
        extendedProps: {
          description: task.description,
          status: task.status
        }
      });
    });
  }

  // This Function is for DialogComponent this is used to pass the data to DialogComponent
  openDialog(data: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: data || {}
    });

    dialogRef.afterClosed().subscribe((result: Task) => {
      if (result) {
        // console.log(result);
        this.taskService.getAll().subscribe(tasks => {
          this.tasks = tasks;
          this.loadTasks();
        });
      }
    });
  }
  
}

