import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Problem} from '../../models/problem.model';
import {Subscription} from 'rxjs/Subscription';


@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit, OnDestroy {
  problems: Problem[];
  subscriptionProblem: Subscription;

  constructor(@Inject('data') private data) {
  }

  ngOnInit() {
    this.getProblems()
  }

  ngOnDestroy() {
    this.subscriptionProblem.unsubscribe();
  }

  getProblems() {
    // this.problems = this.data.getProblems();
    this.subscriptionProblem = this.data.getProblems()
      .subscribe(
        problems => this.problems = problems,
        error => console.log(error),
        () => console.log('get problem complete')
      );
  }

}
