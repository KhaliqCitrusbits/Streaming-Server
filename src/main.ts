import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as hls from 'hls-server';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(3000);
  setupStreamingServer(app);
}

function setupStreamingServer(app: INestApplication) {
  new hls(app.getHttpServer(), {
    provider: {
      exists: (req, cb) => {
        const ext = req.url.split('.').pop();

        if (ext !== 'm3u8' && ext !== 'ts') {
          return cb(null, true);
        }
        console.log(process.env.PWD + req.url);
        fs.access(process.env.PWD + req.url, fs.constants.F_OK, function (err) {
          if (err) {
            console.log('File not exist');
            return cb(null, false);
          }
          cb(null, true);
        });
      },
      getManifestStream: (req, cb) => {
        const stream = fs.createReadStream(process.env.PWD + req.url);
        cb(null, stream);
      },
      getSegmentStream: (req, cb) => {
        const stream = fs.createReadStream(process.env.PWD + req.url);
        cb(null, stream);
      },
    },
  });
}
bootstrap();
