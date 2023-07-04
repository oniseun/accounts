module.export = {
  driver: 'pg',
  type: 'postgress',
  host: 'localhost',
  port: 3306,
  username: 'postgress',
  password: 'password',
  database: 'account',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
};
