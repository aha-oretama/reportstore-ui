module.exports = {
  // To switch in CI
  test: process.env.DATABASE_URL
    ? {
        use_env_variable: 'DATABASE_URL',
        logging: false,
      }
    : {
        username: 'postgres',
        password: 'testpassword',
        database: 'testerve_test',
        host: 'localhost',
        port: '5433',
        logging: false,
        dialect: 'postgres',
      },
  development: {
    username: 'postgres',
    password: 'devpassword',
    database: 'testerve_dev',
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    // To connect heroku postgres, https://stackoverflow.com/questions/58965011/sequelizeconnectionerror-self-signed-certificate
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    // Workaround for pg is not bundled in nextjs ,https://github.com/vercel/ncc/issues/345#issuecomment-487404520
    dialectModule: require('pg'),
  },
};
