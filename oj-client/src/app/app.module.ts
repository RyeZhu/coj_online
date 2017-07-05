import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgxPaginationModule} from 'ngx-pagination';

//1. set route rule for problems component
import {routing} from './app.routes';

import {AppComponent} from './app.component';

//2. make inject servie data provider
import {AuthService} from "./services/auth.service";
import {AuthGuardService} from "./services/auth-guard.service";
import {DataService} from './services/data.service';
import {InputService} from "./services/input.service";

import {SearchPipe} from './pipes/search.pipe';

//3. import problems component
import {CallbackComponent} from './components/callback/callback.component';
import {CollaborationService} from "./services/collaboration.service";
import {EditorComponent} from './components/editor/editor.component';
import {FavoritesComponent} from './components/favorites/favorites.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NewProblemComponent} from './components/new-problem/new-problem.component';
import {ProfileComponent} from './components/profile/profile.component';
import {ProblemDetailComponent} from './components/problem-detail/problem-detail.component';
import {ProblemListComponent} from './components/problem-list/problem-list.component';
import {SubmissionsComponent} from './components/submissions/submissions.component';
import { BeautifulPipe } from './pipes/beautiful.pipe';


@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
    EditorComponent,
    FavoritesComponent,
    NavbarComponent,
    NewProblemComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    ProfileComponent,
    SubmissionsComponent,
    SearchPipe,
    BeautifulPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    NgxPaginationModule,
    // AvatarModule
  ],
  providers: [{
    provide: "data",
    useClass: DataService
  }, {
    provide: "auth",
    useClass: AuthService
  }, {
    provide: "authGuard",
    useClass: AuthGuardService
  }, {
    provide: "collaboration",
    useClass: CollaborationService
  }, {
    provide: "input",
    useClass: InputService
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
