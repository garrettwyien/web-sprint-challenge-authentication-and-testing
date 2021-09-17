const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')
const bcrypt = require('bcryptjs')
const jwtDecode = require('jwt-decode')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

// Write your tests here
test('sanity', () => {
  expect(true).not.toBe(false)
})

describe('auth-router.js', ()=>{
  describe('[POST] /api/auth/register', ()=>{
    it('[1] creates a new user with appropriate credentials and id', async () =>{
      const testUser = { username: 'miranda', password: '123'};
      await request(server).post('/api/auth/register').send(testUser);
      const resultUser = await db('users').where('username', 'miranda').first();
      expect(resultUser).toMatchObject({ username: 'miranda' });
    }, 750)
    it('[2] creates a new user with the correct hashed password', async () =>{
      const testUser = { username: 'miranda', password: '123'};
      await request(server).post('/api/auth/register').send(testUser)
      const resultUser = await db('users').where('username', 'miranda').first()
      expect(bcrypt.compareSync('123', resultUser.password)).toBeTruthy()
    }, 750)
    it('[3] responds with correct error message with existing username', async () =>{
      const testUser = { username: 'miranda', password: '123'};
      await request(server).post('/api/auth/register').send(testUser);
      let res = await request(server).post('/api/auth/register').send(testUser); 
      expect(res.body.message).toMatch(/username taken/i);
      expect(res.status).toBe(422)
    }, 750)
    it('[4] responds with correct error message and status with missing username or password', async () =>{
      const testUser = { username: 'miranda', password: ''};
      let res = await request(server).post('/api/auth/register').send(testUser); 
      expect(res.body.message).toMatch(/username and password required/i);
      expect(res.status).toBe(422);
    }, 750)
  })
  describe('[POST] /api/auth/login', ()=>{
    it('[1] responds with correct message with valid credentials', async () =>{
      const testUser = { username: 'miranda', password: '123'};
      await request(server).post('/api/auth/register').send(testUser)
      let res = await request(server).post('/api/auth/login').send(testUser);
      expect(res.body.message).toMatch(/welcome, miranda/i);
    }, 750)
    it('[2] responds with correct error message with existing username', async () =>{
      const testUser = { username: 'asndlknasd', password: '123'};
      let res = await request(server).post('/api/auth/login').send(testUser); 
      expect(res.body.message).toMatch(/invalid credentials/i);
      expect(res.status).toBe(422)
    }, 750)
    it('[3] responds with correct error message and status with missing username or password', async () =>{
      const testUser = { username: 'miranda', password: ''};
      await request(server).post('/api/auth/register').send(testUser); 
      let res = await request(server).post('/api/auth/login').send(testUser);
      expect(res.body.message).toMatch(/username and password required/i);
      expect(res.status).toBe(422);
    }, 750)
  })
  
});