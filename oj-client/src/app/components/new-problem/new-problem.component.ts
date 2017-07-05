import {Component, Inject, OnInit} from '@angular/core';
import {Problem} from '../../models/problem.model';
import {Router} from '@angular/router';

import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";


const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: '',
  desc: '',
  difficulty: 'Easy'
});

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  public difficulties = ['Easy', 'Medium', 'Hard', 'Super'];

  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);

  constructor(@Inject("data") public data: DataService,
              @Inject("auth") public auth: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    //console.log(this.newProblem);
  }

  checkProblem() {
    this.newProblem.name = this.newProblem.name.trim();
    this.newProblem.desc = this.newProblem.desc.trim();
    if (!/\w{1,}/.test(this.newProblem.name)) {
      return false;
    }
    if (!/\w{1,}/.test(this.newProblem.desc)) {
      return false;
    }
    return true;
  }

  addProblem() {
    //0. check Problem is null
    if (!this.checkProblem()) {
      return;
    }

    //1. check Problem name is exist or not
    // let result: Problem = this.data.getProblemByName(this.newProblem.name);
    // if (isNullOrUndefined(result)) {
    // }

    //2. add Problem to data service
    this.data.addProblem(this.newProblem)
      .subscribe((problem: Problem) => {
        //3. reset newProblem to default
        // this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
        this.router.navigate(['/problems']);
      });

  }

}
