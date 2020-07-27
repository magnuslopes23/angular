import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
import { Observable} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpMsgService } from './process-http-msg.service';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor( private http : HttpClient,
    private processHttpMsgService : ProcessHttpMsgService) { }

  getDishes(): Observable<Dish[]>{
    return this.http.get<Dish[]>(baseURL + 'dishes')
     .pipe(catchError(this.processHttpMsgService.handelError));
  }
  getDish(id: number): Observable<Dish> {
    return this.http.get<Dish>(baseURL + 'dishes/' + id)
    .pipe(catchError(this.processHttpMsgService.handelError));
    
  }
  getFeaturedDish(): Observable<Dish> {
    return this.http.get<Dish>(baseURL + 'dishes?featured=true').pipe(map(dishes=>dishes[0]))
    .pipe(catchError(this.processHttpMsgService.handelError));
  }
  getDishIds(): Observable<string[] | any>{
    return this.getDishes().pipe(map(dishes=> dishes.map(dish=>dish.id)))
    .pipe(catchError(error => error));
  }
}
