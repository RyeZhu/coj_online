import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Problem} from '../models/problem.model';
// import {PROBLEMS} from "../mock-problems";

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class DataService implements OnInit, OnDestroy {

  private problemsSource$: BehaviorSubject<Problem[]> = new BehaviorSubject<Problem[]>([]);

  constructor(private http: Http) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  //1. get all problems
  getProblems(): Observable<Problem[]> {
    let problemsUrl: string = '/api/v1/problems';

    console.log('getProblems:' + problemsUrl);
    this.http.get(problemsUrl)
      .subscribe(
        (res: Response) => this.problemsSource$.next(res.json()),
        err => this.handleError(err),
        () => console.log(`request ${problemsUrl} complete`)
      );

    return this.problemsSource$.asObservable();
  }

  private handleError(error: Response | any): void {
    console.error('An error occurred', error);
  }


  //2. get problem by id
  getProblem(id: number): Observable<Problem> {
    let problemUrl: string = `/api/v1/problem/${id}`;
    console.log('getProblem:' + problemUrl);
    return new Observable<Problem>(observer => {
      this.http.get(problemUrl)
        .subscribe(
          (res: Response) => {
            console.log(res.json());
            observer.next(res.json())
          },
          err => this.handleError(err),
          () => console.log(`request ${problemUrl} complete`)
        );
    });
  }

  //3. add New Problem
  addProblem(problem: Problem): Observable<Problem> {
    let problemUrl: string = `/api/v1/problems/`;
    console.log('addProblem:' + problemUrl);

    let headers = new Headers({'content-type': 'application/json'});

    return new Observable<Problem>(observer => {
      this.http.post(problemUrl, problem, headers)
        .subscribe(
          (res: Response) => {
            console.log(res.json());
            this.getProblems();
            observer.next(res.json());
          },
          err => this.handleError(err),
          () => console.log(`request ${problemUrl} complete`)
        )
    });
  }

}
