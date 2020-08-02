import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { Feedback, ContactType } from '../shared/feedback';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {flyInOut, expand } from '../animations/app.animations';
import { FeedbackService } from '../services/feedback.service';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations:[flyInOut(), expand()]
})
export class ContactComponent implements OnInit {

  feedbackForm:FormGroup;
  feedback:Feedback;
  feedbackCopy:Feedback;
  errMess:string;
  isLoading:boolean;
  isShowingResponse:boolean
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;
  formErrors={
    'firstname':'',
    'lastname':'',
    'telnum':'',
    'email':''
  };

  validationMessages={
    'firstname':{
      'required':'First name is required',
      'minlength':'First name must 2 least 2 characters long',
      'maxlengh':'First name  cannot be more than 25 characters long',
    },
    'lastname':{
      'required':'Last name is required',
      'minlength':'Last name must 2 least 2 characters long',
      'maxlengh':'Last name  cannot be more than 25 characters long',
    },
    'telnum':{
      'required':'tel. number is required',
      'pattern':'tel. num must contain only numbers',
    },
    'email':{
      'required':'tel. number is required',
      'email':'email not in vaild format',
    },
  }


  constructor(private fb : FormBuilder,
    private feedbackservice:FeedbackService) { 
    this.createForm();
    this.isLoading=false;
    this.isShowingResponse=false
  }

  ngOnInit() {
  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern]],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onSubmit() {
    this.isLoading=true;
    this.feedback = this.feedbackForm.value;
    this.feedbackCopy=this.feedback;
    console.log(this.feedback);
    this.feedbackservice.submitFeedback(this.feedback)
      .subscribe(feedback => {this.feedback=feedback}, errmess => {this.feedback=null;this.feedbackCopy=null;this.errMess=<any>errmess}, () =>{
        this.isShowingResponse=true;
        setTimeout(()=>{
          this.isLoading=false;
          this.isShowingResponse=false;
        },5000)
      });
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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
