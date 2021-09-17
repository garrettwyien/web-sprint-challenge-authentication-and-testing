const db = require('../../data/dbConfig')

function find(){
    return db("users")
    .select('users.id', 'users.username');
}

function findById(id){
    return db("users")
    .where({ id })
    .first();
}

async function add(newUser){
    const [id] = await db("users")
    .insert(newUser);
    return findById(id)
}

function findBy(filter) {
    return db("users")
    .where(filter);
  }

module.exports = {
    find,
    findBy,
    findById,
    add,
}