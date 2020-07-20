import { Component, OnInit,ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap} from 'rxjs/operators';
import { Comment  } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})
export class DishdetailsComponent implements OnInit {
    
  dish:Dish;
  dishIds: string[];
  prev: string;
  next: string;
  @ViewChild('cform') commentFormDirective;
  commentForm : FormGroup;
  comment : Comment;
  
  formErrors ={
    author:'',
    comment:'',
  }
  validationMessages={
    author:{
      'required':' name is required',
      'minlength':' name must be atleast 2 characters long',
      'maxlengh':' name  cannot be more than 25 characters long',
    },
    comment:{
      'required':' comment is required',
      'minlength':'comment  must be atleast 4 characters long',
    },
  }

  constructor( private dishservice : DishService,
    private route:ActivatedRoute,
    private location:Location,
    private fb:FormBuilder) {
      this.createForm();
     }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds =dishIds)
    this.route.params.pipe(switchMap((params:Params)=> this.dishservice.getDish(params['id']))).subscribe((dish)=> {this.dish=dish; this.setPrevNext(dish.id)});
  }

  goBack(){
    this.location.back();
  }
  setPrevNext(dishId:string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index -1)% this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index +1)% this.dishIds.length];
  }

  createForm(){
    this.commentForm = this.fb.group({
      author:['',[Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      comment:['',[Validators.required, Validators.minLength(4)]],
      rating:[5]
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }
  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date=new Date().toISOString();
    console.log(this.comment);
    this.dish.comments.push(this.comment);
    this.commentForm.reset({
      author: '',
      rating:5,
      comment: '',
      
    });
    this.commentFormDirective.resetForm();
  }
  onInputChange(event: any) {
  this.commentForm=event.value;
}

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

}
