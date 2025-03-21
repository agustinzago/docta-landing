import { Prisma } from '@prisma/client';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: Prisma.UserUncheckedCreateInput;
}

export default RequestWithUser;
