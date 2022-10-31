import { ApiProperty } from '@nestjs/swagger';

export class Auth0UserDto implements Readonly<Auth0UserDto> {
  @ApiProperty({
    example: '5f7c8ec7c33c6c004bbafe82',
  })
  _id: string;

  @ApiProperty({
    example: 'auth0|73205c350b4ed9932f829afb2',
  })
  clientID: string;

  @ApiProperty({
    example: '2022-10-19T20:21:04.996Z',
  })
  created_at: string;

  @ApiProperty({
    example: true,
  })
  email_verified: boolean;

  @ApiProperty({
    example: 'j+smith@example.com',
  })
  name: string;

  @ApiProperty({
    example: 'j+smith@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'auth0|5f7c8ec7c33c6c004bbafe82',
  })
  user_id: string;

  @ApiProperty({
    example: 'j+smith',
  })
  nickname: string;

  @ApiProperty({
    example: 'http://www.gravatar.com/avatar/?d=identicon',
  })
  picture: string;

  @ApiProperty({
    example: [],
  })
  identities: [];

  @ApiProperty({
    example: {},
  })
  persistent: Record<string, never>;

  @ApiProperty({
    example: {},
  })
  app_metadata: Record<string, never>;

  @ApiProperty({
    example: '2022-10-31T08:08:13.832Z',
  })
  updated_at: string;

  @ApiProperty({
    example: 'gmOWNgklfRm4tyl5YYnl3JDSJy19h1bR',
  })
  global_client_id: string;

  constructor(partial: Partial<Auth0UserDto>) {
    Object.assign(this, partial);
  }
}

export class Auth0UserRequestDto implements Readonly<Auth0UserRequestDto> {
  @ApiProperty()
  public user: Auth0UserDto;

  constructor(partial: Partial<Auth0UserRequestDto>) {
    Object.assign(this, partial);
  }
}
