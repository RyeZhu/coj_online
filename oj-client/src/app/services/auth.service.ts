import {Injectable} from '@angular/core';
import {AUTH_CONFIG} from './auth0-variables';

import {Http, HttpModule, Response, Headers} from '@angular/http';
import {Router} from '@angular/router';

import * as auth0 from 'auth0-js';
import {isNullOrUndefined} from "util";

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class AuthService {
  domain = AUTH_CONFIG.domain;
  clientID = AUTH_CONFIG.clientID;
  audience = `https://${AUTH_CONFIG.domain}/userinfo`;
  redirectUri = AUTH_CONFIG.callbackURL;
  responseType = 'token id_token';
  scope = 'openid profile';
  // scope = 'openid';

  callbackRedirectUri = 'callbackRedirectUri';

  auth0 = new auth0.WebAuth({
    domain: this.domain,
    clientID: this.clientID,
    audience: this.audience,
    redirectUri: this.redirectUri,
    responseType: this.responseType,
    scope: this.scope
  });

  userProfile: any;

  constructor(public router: Router,
              public http: Http) {
  }

  public login(): void {
    //for restore url
    localStorage.setItem(this.callbackRedirectUri, window.location.href);
    // console.dir(window.location);
    this.auth0.authorize({
      domain: this.domain,
      clientID: this.clientID,
      audience: this.audience,
      redirectUri: this.redirectUri,
      responseType: this.responseType,
      scope: this.scope
    });
  }

  /**
   * for callback
   */
  public callbackAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult)
          .then(profile => {
            localStorage.setItem('profile', JSON.stringify(profile));

            window.location.href = localStorage.getItem(this.callbackRedirectUri);
            localStorage.removeItem(this.callbackRedirectUri);
          })
          .catch(error => console.log(error));
        // this.router.navigate(['/problems']);
      } else if (err) {
        console.log(err);
        // alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  private setProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  private setSession(authResult): Promise<any> {

    return new Promise((resolv, reject) => {
      // Set the time that the access token will expire at
      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);

      this.setProfile((err, profile) => {
        if (profile) {
          resolv(profile);
        } else {
          reject(err);
        }
      });
    });
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    // Go back to the home route
    //this.router.navigate(['/']);
  }


  public getProfile(): any {
    let profile = localStorage.getItem('profile');
    if (isNullOrUndefined(profile)) {
      return {};
    }
    return JSON.parse(profile);
  }


  public isAuthenticated(): boolean {
    let expires_at = localStorage.getItem('expires_at');
    if (isNullOrUndefined(expires_at)) {
      return false;
    }
    // console.dir(expires_at);
    const expiresAt = JSON.parse(expires_at);
    return new Date().getTime() < expiresAt;
  }

  public resetPassword(): void {
    let url: string = `https://${this.domain}/dbconnections/change_password`;
    let headers = new Headers({'content-type': 'application/json'});
    let body = {
      client_id: this.clientID,
      email: this.getProfile().name,
      connection: 'Username-Password-Authentication'
    };
    // this.auth0.changePassword();
    this.http.post(url, body, headers)
      .toPromise()
      .then((res: Response) => {
        console.dir(res);
        // alert(res["_body"]);
        this.logout();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }
}
