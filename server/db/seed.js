const {db, User} = require('./index');

const users = [
  {
    email: 'erik.a.jenson@gmail.com',
    name: 'Erik',
    password: 'Erik'
  },
  {
    email: 'janienne.kondrich@gmail.com',
    name: 'Janienne',
    password: 'Janienne'
  },
  {
    email: 'ellajenson@gmail.com',
    name: 'Ella',
    password: 'Ella'
  },
  {
    email: 'evangelinejenson@gmail.com',
    name: 'Evie',
    password: 'Evie'
  }
];

async function seed() {
  await db.sync({force: true})
  await User.bulkCreate(users)

  console.log('db synced!')
  console.log(`seeded ${users.length} users`)
  console.log(`seeded successfully`)
}

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
async function runSeed() {
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed()
}