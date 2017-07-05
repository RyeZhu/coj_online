import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router'
import {Problem} from '../../models/problem.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: [
    './problem-detail.component.css',
    '../problem-list/problem-list.component.css'
  ]
})
export class ProblemDetailComponent implements OnInit, OnDestroy {
  problem: Problem;
  showDetail: boolean = false;
  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              @Inject('data') private data) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(params => {
      // console.dir(params['id']);
      //+params['id'] convert string to int value
      // this.problem = this.data.getProblem(+params['id']);
      this.data.getProblem(+params['id']).subscribe(
        (problem: Problem) => this.problem = problem,
        (err) => console.error(err)
      )
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
