import { registerAs } from '@nestjs/config';

let config = {
  localhost: {
    port: 4101,
    uploadLimit: '250mb',
    env: 'localhost',
    aws: {
      s3: {
        buckets: {
          mediaBucket: '<bucket-name-here>',
        },
        keys: {
          accessKeyId: '<access-key-here>',
          secretAccessKey: '<secret-access-key-here>',
        },
      },
    },
    phoneOTPWaitTime: 60 * 1000, // 1 minute
  },
  dev: {
    port: 4101,
    uploadLimit: '250mb',
    env: 'dev',
    aws: {
      s3: {
        buckets: {
          mediaBucket: '<bucket-name-here>',
        },
        keys: {
          accessKeyId: '<access-key-here>',
          secretAccessKey: '<secret-access-key-here>',
        },
      },
    },
  },
  test: {
    port: 4111,
    uploadLimit: '250mb',
    env: 'test',
    aws: {
      s3: {
        buckets: {
          mediaBucket: '<bucket-name-here>',
        },
        keys: {
          accessKeyId: '<access-key-here>',
          secretAccessKey: '<secret-access-key-here>',
        },
      },
    },
  },

  production: {
    port: 4101,
    uploadLimit: '250mb',
    env: 'prod',
    aws: {
      s3: {
        buckets: {
          mediaBucket: '<bucket-name-here>',
        },
        keys: {
          accessKeyId: '<access-key-here>',
          secretAccessKey: '<secret-access-key-here>',
        },
      },
    },
  },
};

export default registerAs(
  'app',
  () => config[process.env.NODE_ENV || 'dev'] || config['dev'],
);
