import { registerAs } from '@nestjs/config';

let config = {
  localhost: {
    host: '0.0.0.0',
    port: 27017,
    name: '<db-name>-local',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
  dev: {
    host: '0.0.0.0',
    port: 27017,
    name: '<db-name>-dev',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
  test: {
    host: '0.0.0.0',
    port: 27017,
    name: '<db-name>-test',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
  production: {
    host: '0.0.0.0',
    port: 27017,
    name: '<db-name>-prod',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
};

export default registerAs('db', () => {
  console.log(process.env.NODE_ENV);
  return config[process.env.NODE_ENV || 'dev'] || config['dev'];
});
