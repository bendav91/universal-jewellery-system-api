import { Auth0User } from 'src/interfaces/auth0-user.interface';

export const mockAuth0User: Auth0User = {
  _id: '9344d71dbf2306a35dd73165c4471bfb',
  clientID: 'bdP4wzN8vxj5ql0A19DSBmOWV24J0yut',
  created_at: '2022-10-19T20:21:04.996Z',
  email: 'mock@user.com',
  email_verified: true,
  identities: [
    {
      connection: 'Username-Password-Authentication',
      provider: 'auth0',
      user_id: '63505c30b4ed9631f129fac9',
      isSocial: false,
    },
  ],
  name: 'mock@user.com',
  nickname: 'mockuser',
  picture: 'https://placeimg.com/480/480/people/sepia',
  updated_at: '2022-10-22T09:57:50.339Z',
  user_id: 'auth0|73205c350b4ed9932f829afb2',
  global_client_id: 'AqfiTb9lQSxy7z14Agb6Nf7B7tonMWN4',
  app_metadata: {},
  persistent: {},
};
