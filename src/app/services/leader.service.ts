import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpMsgService } from './process-http-msg.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor( private http:HttpClient,
    private processHttpMsgService : ProcessHttpMsgService) { }
  getLeaders():Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leadership')
     .pipe(catchError(this.processHttpMsgService.handelError));
  }

  getFeaturedLeader(): Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership?featured=true').pipe(map(leadership => leadership[0]))
     .pipe(catchError(this.processHttpMsgService.handelError));
  }
}
