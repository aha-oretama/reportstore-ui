module.exports = {
  test: process.env.DATABASE_URL
    ? {
        use_env_variable: 'DATABASE_URL',
      }
    : {
        username: null,
        password: null,
        database: null,
        host: 'localhost',
        port: '5432',
        dialect: 'postgres',
      },
  development: {
    username: null,
    password: null,
    database: null,
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_URL',
  },
};
