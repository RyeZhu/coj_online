import {Component, Inject, OnInit} from '@angular/core';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(@Inject('auth') private auth,
              private router: Router) {
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    } else {
      this.auth.callbackAuthentication()
    }

  }

}
