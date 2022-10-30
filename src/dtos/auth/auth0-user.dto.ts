import {
  AppMetadata,
  Auth0Identity,
  Auth0Request,
  Persistent,
} from 'src/interfaces/auth0-user.interface';

export class Auth0UserDto implements Readonly<Auth0UserDto>, Auth0Request {
  public user: {
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
  };

  constructor(partial: Partial<Auth0UserDto>) {
    Object.assign(this, partial);
  }
}
