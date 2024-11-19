import { UserProfile } from './user.profile';
import { Claim } from './auth.claim';

export class AuthContext {
  claims!: Claim[];
  userProfile!: UserProfile;

  get isAdmin() {
    return !!this.claims && !!this.claims.find(c =>
      c.claimType === 'role' && c.claimValue === 'Admin');
  }
}
