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
  private url2 = 'https://dummyjson.com/products';

  constructor(private http : HttpClient) { }

  addTask(task: Task): Observable<Task>{
    return this.http.post<Task>(this.url, task);
  }

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }

  getProducts(){
    return this.http.get<any>(this.url2);
  }

  updateTask(id: number, task: Task) :Observable<Task[]>{
    return this.http.put<Task[]>(`${this.url}/${id}`, task)
  }
}
