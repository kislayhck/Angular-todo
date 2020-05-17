import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthenticationService, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  taskForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  dialogRef: MatDialogRef<any>
  userList = [];
  taskList = [];
  
  id = new FormControl('');
  title = new FormControl('', [
    Validators.required,
  ]);

  priority = new FormControl('', [
    Validators.required,
  ]);

  completion_date = new FormControl('', [
   
  ]);

  assign_user = new FormControl('', [
    Validators.required,
  ]);


  detail = new FormControl('', [
    Validators.required,
  ]);

  task_creator = new FormControl(this.auth.getUserDetails()._id, [

  ]);

  is_active = new FormControl(false, [
   
  ]); 

  constructor(public dialog: MatDialog, public auth: AuthenticationService, private fb: FormBuilder,
    private router: Router, private _snackBar: MatSnackBar, ) {
      this.createForm();
    // this.taskForm = fb.group({
    //   _id: "",
    //   title: this.title,
    //   priority: this.priority,
    //   completion_date: this.completion_date,
    //   detail: this.detail,
    //   assign_user: this.assign_user,
    // });
  }

    createForm(){
      this.taskForm = this.fb.group({
        _id: this.id,
        title: this.title,
        priority: this.priority,
        completion_date: this.completion_date,
        detail: this.detail,
        assign_user: this.assign_user,
        task_creator: this.task_creator,
        is_active :this.is_active
      });
    }


  ngOnInit(): void {
    let userId = this.auth.getUserDetails()._id || '';
    this.getUsers();
    this.getTasks();
  }

  /**
   * getUsers
   */
  public getUsers() {
    this.auth.users().subscribe(
      (res) => {
        this.userList = res;
      },
      err => {
        console.error(err);
        this._snackBar.open(err.error.message, 'Close', {
          duration: 2000,
        });
      }
    );

  }

  public getTasks() {
    let userId = this.auth.getUserDetails()._id || '';
    this.auth.getTask(userId,).subscribe(
      (res) => {
        this.taskList = res;
        // this.taskList.map( data =>{
        //   data.is_active = data.is_active == 0 ? true : false; 
        // })
        console.log(this.taskList);
      },
      err => {
        console.error(err);
        this._snackBar.open(err.error.message, 'Close', {
          duration: 2000,
        });
      }
    );

  }
  openDialog(ref: TemplateRef<any>): void {
    console.log('come')
    this.dialogRef = this.dialog.open(ref, {
      width: '550px',
      // data: {name: this.name, animal: this.animal}
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  submit() {
    console.log(this.taskForm.value, '', this.taskForm.get('_id').value)
    if (this.taskForm.valid) {
      if (this.taskForm.get('_id').value){
        let taskId = this.taskForm.get('_id').value;
        this.auth.updateTask(taskId ,this.taskForm.value).subscribe(
          () => {
            this.dialogRef.close();
            this.getTasks();
            this.taskForm.reset();
            this._snackBar.open("Task Update Successfully", 'Close', {
              duration: 2000,
            });
          },
          err => {
            console.error(err);
            this._snackBar.open("Something went wrong.", 'Close', {
              duration: 2000,
            });
          }
        );
  
      } else {
         this.taskForm.removeControl('_id');
         this.taskForm.get('task_creator').setValue(this.auth.getUserDetails()._id);
         this.taskForm.get('is_active').setValue(false);
         console.log(this.taskForm.value)
         this.auth.addTask(this.taskForm.value).subscribe(
          () => {
            // this.dialog.closeAll();
            this.dialogRef.close();
            this.getTasks();
            this.taskForm.reset();
            this.createForm();
            this._snackBar.open("Task Create Successfully", 'Close', {
              duration: 2000,
            });
            // this.router.navigateByUrl("/profile");
          },
          err => {
            console.error(err);
            this._snackBar.open(err.error.message, 'Close', {
              duration: 2000,
            });
          }
        );

      }

    }
  }

  public delateTask(taskID) {
    let retMsg = confirm('Do you want to delete this task ?');
    if (retMsg) {
      this.auth.deleteTask(taskID).subscribe(
        () => {
          this.getTasks();
          this._snackBar.open("Task Delete Successfully", 'Close', {
            duration: 2000,
          });
          // this.router.navigateByUrl("/profile");
        },
        err => {
          console.error(err);
          this._snackBar.open(err.error.message, 'Close', {
            duration: 2000,
          });
        }
      );

    }
  }  //


  updateTask(task, ref) {
    let currentUserId = this.auth.getUserDetails()._id || '';
    let taskCreatirId = task.task_creator || "";
    if(currentUserId == taskCreatirId){
      this.dialogRef = this.dialog.open(ref, {
        width: '550px',
      });
      this.dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        console.log(result);
        this.taskForm.reset();
      });
     // task.is_active =  (task.is_active == true ? 0 : 1);
      this.taskForm.patchValue(task);
    }else {
      window.alert('You have no access to edit task.')
    }
   
  }

  public getAssignUserName(assignUserId){
    let userName = '';
    let currentUserId = this.auth.getUserDetails()._id || '';

    for(let user of this.userList){
        if(user._id == currentUserId && user._id == assignUserId){
          return userName  = 'Me'
        }
        if(user._id == assignUserId){
          return userName  = user.name || ''
        }
    }
  }

  public getCreatorName(creatorId){
    let userName = '';
    let currentUserId = this.auth.getUserDetails()._id || '';

    for(let user of this.userList){
        if(user._id == currentUserId && user._id == creatorId){
          return userName  = 'Me'
        }
        if(user._id == creatorId){
          return userName  = user.name || ''
        }
    }
  }

  public getCreatorUserName(creatorId){
    let userName = '';
    let currentUserId = this.auth.getUserDetails()._id || '';

    for(let user of this.userList){
        if(user._id == currentUserId && user._id == creatorId){
          return userName  = user.name || ''
        }
        if(user._id == creatorId){
          return userName  = user.name || ''
        }
    }
  }


  public getCreatorEmail(creatorId){
    let userEmail = '';
    let currentUserId = this.auth.getUserDetails()._id || '';

    for(let user of this.userList){
        if(user._id == currentUserId && user._id == creatorId){
          return userEmail  = user.email || '';
        }
        if(user._id == creatorId){
          return userEmail  = user.email || '';
        }
    }
  } 
  
  public completeTask(taskId , taskState){
    console.log(taskState);

    let taskStatus = {
      status : taskState
    }
    console.log(taskStatus);
    console.log(this.taskList)
    this.auth.updateStatus(taskId, taskStatus).subscribe(
      () => {
        // this.dialogRef.close();
        this.getTasks();
        // this.taskForm.reset();
        this._snackBar.open("Task Update Successfully", 'Close', {
          duration: 2000,
        });
      },
      err => {
        console.error(err);
        this._snackBar.open("Something went wrong.", 'Close', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * getClassName
   */
  public getClassName(task) {
     let className = "";
     let primeUser:Boolean = this.auth.getUserDetails().is_prime;
     if(task.priority == 'high' && primeUser){
       className = 'bg-danger'
     } else  if(task.priority == 'medium' && primeUser){
      className = 'bg-warning'
    } else  if(task.priority == 'low' && primeUser){
      className = 'bg-success'
    }else{
      className = ''
    }
    console.log(className)
    return className;
  }

  public chnageIntoPrime(){
    let isPrimeUser:Boolean = this.auth.getUserDetails().is_prime;
    let userId = this.auth.getUserDetails()._id;
    let userStatus = {
      is_prime : !isPrimeUser
    }
    if(!isPrimeUser){
      this.auth.updateUserPrime(userId, userStatus).subscribe(
        () => {
          this.auth.logout()
          this._snackBar.open("Your account switch to prime", 'Close', {
            duration: 2000,
          });
        },
        err => {
          console.error(err);
          this._snackBar.open("Something went wrong.", 'Close', {
            duration: 2000,
          });
        }
      );    }

  }

}
