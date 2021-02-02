import { Repository, EntityRepository } from 'typeorm';

import { Email } from '../entities/email.entity';

@EntityRepository(Email)
export class EmailRepository extends Repository<Email> {
  async findEmailByUuid(uuid: string): Promise<Email | undefined> {
    return this.findOne({ uuid });
  }
}
