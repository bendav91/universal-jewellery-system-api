/* eslint-disable @typescript-eslint/no-empty-interface */

export interface Auth0Request {
  user: Auth0User;
}
export interface Auth0User {
  _id: string;
  clientID: string;
  created_at: '2022-10-19T20:21:04.996Z';
  email_verified: boolean;
  name: string;
  email: string;
  user_id: string;
  nickname: string;
  picture: string;
  identities: Auth0Identity[];
  persistent: Persistent;
  app_metadata: AppMetadata;
  updated_at: string;
  global_client_id: string;
}

export interface Auth0Identity {
  provider: string;
  user_id: string;
  connection: string;
  isSocial: boolean;
}

export interface Persistent {}

export interface AppMetadata {}
