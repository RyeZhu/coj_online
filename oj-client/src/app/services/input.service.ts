import {Inject, Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs/Rx';

@Injectable()
export class InputService {

  private inputSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {

  }

  changeInput(term: string): void {
    this.inputSubject$.next(term);
  }

  getInput(): Observable<string> {
    return this.inputSubject$.asObservable();
  }

}
