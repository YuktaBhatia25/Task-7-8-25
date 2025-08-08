import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Task {
  date: string
  title: string,
  description: string,
  status: string
}
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url = 'http://localhost:3000/tasks'

  constructor(private http : HttpClient) { }

  addTask(task: Task): Observable<Task>{
    return this.http.post<Task>(this.url, task);
  }

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }
}
