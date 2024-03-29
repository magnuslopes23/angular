import { Component, OnInit, Inject} from '@angular/core';
import { Dish } from '../shared/dish';

import { Promotion } from '../shared/promotion';

import { DishService } from '../services/dish.service';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import {flyInOut,expand} from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations:[flyInOut(), expand()]
})
export class HomeComponent implements OnInit {
  dish:Dish;
  promotion:Promotion;
  leader:Leader;
  errMess:string;

  constructor(private dishservice:DishService, private promotionservive:PromotionService,
    private leaderservices:LeaderService,
    @Inject ('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe((dish)=>this.dish=dish,(errmess) => this.errMess = errmess);
    this.promotionservive.getFeaturedPromotion().subscribe((promotion)=>this.promotion=promotion,(errmess) => this.errMess = errmess);
    this.leaderservices.getFeaturedLeader().subscribe((leader)=>this.leader=leader,(errmess) => this.errMess = errmess);
    console.log(this.leader)
  }

}
