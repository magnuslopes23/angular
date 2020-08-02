import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpMsgService } from './process-http-msg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http : HttpClient,
    private processHttpMsgService : ProcessHttpMsgService) { }
  
    submitFeedback(feedback: Feedback): Observable<Feedback> {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
      };
      return this.http.post<Feedback>(baseURL + 'feedback/', feedback  , httpOptions)
        .pipe(catchError(this.processHttpMsgService.handelError));
    }
}
