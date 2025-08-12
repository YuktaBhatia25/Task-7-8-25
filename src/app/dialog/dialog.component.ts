import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task, TaskService } from '../task.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent {
  task: Task[] = [];
  taskForm!: FormGroup;
  mode: 'add' | 'view' | 'edit';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskService: TaskService,
    private fb: FormBuilder,
  ) {

    // this.taskForm = this.fb.group({
    //   date: [''],
    //   title: [''],
    //   description: [''],
    //   status: ['']
    // }
    // )
    this.mode = data.mode || 'add';
    this.taskForm = this.fb.group({
      date: [data.date || '', Validators.required],
      title: [data.title || '', Validators.required],
      description: [data.description || '', Validators.required],
      status: [data.status || '', Validators.required]
    });
    if (this.mode === 'view') {
      this.taskForm.disable();
    }
  }

  add(): void {
    const { date, title, description, status } = this.taskForm.value;

    const newTask: Task = { date, title, description,status };

    this.taskService.addTask(newTask).subscribe(() => {
      this.dialogRef.close(newTask);
    });
  }

  edit(){
    console.log("clicked");
    this.mode = 'edit';
    this.taskForm.enable();
  }

  update(){
    const task = this.taskForm.value;
    // console.log(task);
    this.taskService.updateTask(this.data.id, task).subscribe(() => {
      this.dialogRef.close(task);
    })
  }

  onclose(): void {
    this.dialogRef.close();
  }
}