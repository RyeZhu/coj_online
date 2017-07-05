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

  pageId: number = 0;

  searchTerm: string = '';
  searchSubscription: Subscription;
  problemsSubscription: Subscription;
  itemsPerPage: number;

  constructor(@Inject('data') public data,
              @Inject('input') private input) {
  }

  ngOnInit(): void {
    this.itemsPerPage = this.data.getItemsPerPage();
    this.getProblems();
    this.getSearchTerm();
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
    this.problemsSubscription.unsubscribe();
  }

  getProblems() {
    // this.problems = this.data.getProblems();
    this.problemsSubscription = this.data.getProblems()
      .subscribe(
        problems => this.problems = problems,
        error => console.log(error),
        () => console.log('get problem complete')
      );
  }

  getSearchTerm(): void {
    this.searchSubscription = this.input.getInput()
      .subscribe(searchTerm => this.searchTerm = searchTerm);
  }

}
