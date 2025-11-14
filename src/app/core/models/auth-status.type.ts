export type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

export enum AuthType {
  CHECKING = 'checking',
  AUTHENTICATED = 'authenticated',
  NOT_AUTHENTICATED = 'not-authenticated'
}
