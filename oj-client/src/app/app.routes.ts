import {Routes, RouterModule} from '@angular/router'

//for logout -> NavBar
//for login callback
import {CallbackComponent} from "./components/callback/callback.component";

//for problems
import {ProblemDetailComponent} from './components/problem-detail/problem-detail.component';
import {ProblemListComponent} from './components/problem-list/problem-list.component';
// import {NewProblemComponent} from './components/new-problem/new-problem.component';

//for user profile
import {SubmissionsComponent} from "./components/submissions/submissions.component";
import {FavoritesComponent} from "./components/favorites/favorites.component";
import {ProfileComponent} from "./components/profile/profile.component";

// import {AuthGuardService} from "./services/auth-guard.service";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'problems',
    pathMatch: 'full'
  },
  {
    path: 'problems',
    component: ProblemListComponent
  },
  {
    path: 'problems/:id',
    component: ProblemDetailComponent
  },
  // {
  //   path: 'new-problem',
  //   component: NewProblemComponent
  // },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate:['authGuard']
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    canActivate:['authGuard']
  },
  {
    path: 'submissions',
    component: SubmissionsComponent,
    canActivate:['authGuard']
  },
  {
    path: '**',
    redirectTo: 'problems'
  }

];

export const routing = RouterModule.forRoot(routes);
