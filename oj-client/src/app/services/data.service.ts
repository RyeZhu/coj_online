import {Injectable} from '@angular/core';
import {Problem} from '../models/problem.model';
import {PROBLEMS} from '../mock-problems';

@Injectable()
export class DataService {

  constructor() {
  }

  //1. get all problems
  getProblems(): Problem[] {
    return PROBLEMS;
  }

  //2. get problem by id
  getProblem(id: number): Problem {
    return PROBLEMS.find(Problem => Problem.id === id);
  }

}
