import {Pipe, PipeTransform} from '@angular/core';
import {Problem} from "../models/problem.model";

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(problems: Problem[], args: string): any {
    return problems.filter((problem: Problem) => problem.name.toLowerCase().includes(args.toLowerCase()));
  }

}
