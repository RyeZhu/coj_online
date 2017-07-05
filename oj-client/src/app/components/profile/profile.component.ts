import {Component, Inject, OnInit} from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public username: string = '';
  public email: string = '';

  constructor(@Inject('auth') private auth) {
  }

  ngOnInit() {
    this.showProfile();
  }

  showProfile() {
    let profile = this.auth.getProfile();
    //console.dir(profile);

    this.username = profile.nickname;
    this.email = profile.name;
  }

  resetPassword() {
    this.auth.resetPassword();
  }

}
