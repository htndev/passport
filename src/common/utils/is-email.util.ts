import { IsEmail as isEmail } from 'class-validator';

export const IsEmail = isEmail({ allow_ip_domain: false }, { message: 'Email is not in email format. E.g, john.doe@example.com' })
