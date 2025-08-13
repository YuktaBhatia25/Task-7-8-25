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

  selectedView: string = 'month';

  constructor(private dialog: MatDialog, private taskService: TaskService) { }

  ngOnInit() {
    this.getData()
    this.loadProducts();
  }

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'today',
      center: 'prev title next',
      right: 'addBtn'
    },
    // weekends: false,
    // hiddenDays: [0, 6],
    events: [],

    customButtons: {
      addBtn: {
        text: 'Add Task',
        click: (info: any) => this.openDialog({ mode: 'add' })
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

  change(viewName: string): void {
    const calendar = this.calendarComponent.getApi();

    // console.log(viewName);

    if (viewName === 'workWeek') {
      calendar.changeView('dayGridWeek')
      calendar.setOption('hiddenDays', [0, 6])
    } else if (viewName === 'dayGridWeek') {
      calendar.changeView('dayGridWeek')
      calendar.setOption('hiddenDays', [])
    } else if (viewName === 'list') {
      this.selectedView = 'list'
    }
    else {
      calendar.changeView('dayGridMonth')
      calendar.setOption('hiddenDays', [])
    }
  }
  handleDateClick(arg: any): void {
    // alert('Date clicked: ' + arg.dateStr);
    // console.log(arg);
    this.openDialog({ date: arg.dateStr, mode: 'add' })
  }

  getData(): void {
    this.taskService.getAll().subscribe(data => {
      this.tasks = data;
      this.loadTasks();
    });
  }
  
  loadProducts(): void {
    this.taskService.getProducts().subscribe(data => {
      if (data.products) {
        data.products.forEach((product: any) => {
          console.log(product.id, product.reviews[0].rating)
        })
      }
    })
  }

  // This Function is used to load the tasks
  loadTasks(): void {
    if (!this.calendarComponent) return;

    const calendarApi = this.calendarComponent.getApi();
    calendarApi.removeAllEvents();
    console.log(new Date().toISOString().split('T')[0]);
    this.tasks.forEach(task => {
      let color = '';

      if (task.status == 'Completed') {
        color = 'green'
      }
      else if (task.status == 'Pending') {
        color = 'red'
      }
      else {
        color = 'orange'
      }
      calendarApi.addEvent({
        title: task.title,
        start: new Date(task.date).toISOString().split('T')[0],
        backgroundColor: color,
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

