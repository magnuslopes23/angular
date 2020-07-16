import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LEADERS } from '../shared/leaders';
import { LeaderService } from '../services/leader.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  leaders:Leader[];
  constructor(private leaderservices:LeaderService) { }

  ngOnInit() {
    this.leaderservices.getLeaders()
    .then((leaders)=>this.leaders=leaders);
  }

}
