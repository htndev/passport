import { EntityRepository, Repository } from 'typeorm';

import { UserEmailConfirmation } from './../entities/user-email-confirmation.entity';

@EntityRepository(UserEmailConfirmation)
export class UserEmailConfirmationRepository extends Repository<UserEmailConfirmation> {}
