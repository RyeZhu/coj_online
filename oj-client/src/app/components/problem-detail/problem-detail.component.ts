import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router"
import {Problem} from "../../models/problem.model";

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: [
    './problem-detail.component.css',
    '../problem-list/problem-list.component.css'
  ]
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem;

  constructor(private route: ActivatedRoute,
              @Inject("data") private data) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      //+params['id'] convert string to int value
      this.problem = this.data.getProblem(+params['id']);
    });
  }

}
