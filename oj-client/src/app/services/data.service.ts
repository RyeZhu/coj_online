import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Problem} from '../models/problem.model';
// import {PROBLEMS} from "../mock-problems";

import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

const PAGE_ITEMSPERPAGE: number = 10;

@Injectable()
export class DataService {

  private problemsSource$: BehaviorSubject<Problem[]> = new BehaviorSubject<Problem[]>([]);

  constructor(private http: Http) {
  }

  /**
   * get all problems
   * @returns {Observable<Problem[]>}
   */
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

  /**
   * handle promise error
   * @param error
   * @returns {Promise<never>}
   */
  private handleError(error: Response | any): void {
    console.error('An error occurred', error);
  }


  /**
   * get problem by id
   * @param id
   * @returns {Promise<Problem>}
   */
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


  /**
   * add New Problem
   * @param problem
   * @returns {Promise<Problem>}
   */
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

  /**
   * get problem list number of items per page
   * @returns {number}
   */
  getItemsPerPage(): number {
    return PAGE_ITEMSPERPAGE;
  }

  buildAndRun(language: string, code: string): Observable<any> {
    let headers: Headers = new Headers({'content-type': 'application/json'});
    let data: any = {
      language: language,
      code: code
    };
    return this.http.post('/api/v1/build_and_run', data, headers).map((res: Response) => res.json());
  }

}
