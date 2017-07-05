import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs/Rx";
import {Router} from "@angular/router";
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  title: String = 'OC';
  username: String = "";
  searchBox: FormControl = new FormControl();
  subscription: Subscription;


  constructor(@Inject('auth') public auth,
              @Inject('input') private input,
              private router: Router) {
  }

  ngOnInit(): void {
    this.showUsername();

    this.subscription = this.searchBox
      .valueChanges
      .debounceTime(200)//setup debounceTime
      .subscribe(
        term => {
          this.router.navigate(['/problems']);
          this.input.changeInput(term);
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showUsername(): void {
    if (this.auth.isAuthenticated()) {
      this.username = this.auth.getProfile().nickname;
    }
  }

  login(): void {
    this.auth.login();
  }

  logout(): void {
    this.auth.logout();
  }

  searchProblem(): void {

  }

}
