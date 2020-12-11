import { NestApplicationOptions } from '@nestjs/common';
import { readFile } from 'fs';

import { NodeEnv } from '../constants';

export async function setupHttps(): Promise<NestApplicationOptions> {
  const readFileAsync = (path: string) =>
    new Promise((resolve, reject) =>
      readFile(path, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      })
    );

  const options: NestApplicationOptions = {};

  if (process.env.NODE_ENV === NodeEnv.DEVELOPMENT || !process.env.NODE_ENV) {
    const rootDir = __dirname + '/../../../';

    options.httpsOptions = {
      key: await readFileAsync(rootDir + 'localhost.key'),
      cert: await readFileAsync(rootDir + 'localhost.crt')
    };
  }

  return options;
}
