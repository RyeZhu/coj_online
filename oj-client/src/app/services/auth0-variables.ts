interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'iL-15SKHCgIBg804Jaq4qZSiZQyyHVa5',
  domain: 'git.auth0.com',
  callbackURL: 'http://localhost:3000/callback'
};
