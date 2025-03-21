import { Exclude } from 'class-transformer';

export class User {
  id!: number;

  email!: string;

  name?: string | null;

  profileImage?: string | null;

  @Exclude()
  password?: string | null;

  @Exclude()
  salt?: string | null;

  googleId?: string | null;

  googleEmail?: string | null;

  createdAt!: Date;

  updatedAt!: Date;

  credits?: string | null;

  googleResourceId?: string | null;

  localGoogleId?: string | null;

  tier?: string | null;

  @Exclude()
  refreshToken?: string | null;

  // Relaciones
  connections?: any[];
  discordWebhooks?: any[];
  localGoogleCredential?: any;
  notions?: any[];
  slacks?: any[];
  workflows?: any[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
