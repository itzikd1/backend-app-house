// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear all relevant tables
  await prisma.carLocationHistory.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.savedShoppingListItem.deleteMany({});
  await prisma.savedShoppingList.deleteMany({});
  await prisma.shoppingItem.deleteMany({});
  await prisma.shoppingCategory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.subgoal.deleteMany({});
  await prisma.goal.deleteMany({});
  await prisma.recipe.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.family.deleteMany({});

  // Create a test family
  const family = await prisma.family.create({
    data: { name: 'Test Family' },
  });

  // Create two test users with hashed password
  const hashedPassword = await bcrypt.hash('testtest', 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'test@test.com',
        name: 'Test User 1',
        password: hashedPassword,
        role: 'USER',
        familyId: family.id,
      },
    }),
    prisma.user.create({
      data: {
        email: 'test2@test.com',
        name: 'Test User 2',
        password: hashedPassword,
        role: 'USER',
        familyId: family.id,
      },
    }),
  ]);

  // Helper function to create items for a user
  async function createUserItems(user) {
    // Notes
    for (let i = 1; i <= 4; i++) {
      await prisma.note.create({
        data: {
          title: `Note ${i} for ${user.email}`,
          content: `This is note ${i} for ${user.email}`,
          userId: user.id,
          familyId: family.id,
        },
      });
    }
    // Tasks
    for (let i = 1; i <= 4; i++) {
      await prisma.task.create({
        data: {
          title: `Task ${i} for ${user.email}`,
          description: `This is task ${i} for ${user.email}`,
          creatorId: user.id,
          familyId: family.id,
          priority: 'Medium',
        },
      });
    }
    // Shopping Items
    for (let i = 1; i <= 4; i++) {
      await prisma.shoppingItem.create({
        data: {
          name: `Shopping Item ${i} for ${user.email}`,
          quantity: i,
          creatorId: user.id,
          familyId: family.id,
        },
      });
    }
    // Recipes
    for (let i = 1; i <= 3; i++) {
      await prisma.recipe.create({
        data: {
          title: `Recipe ${i} for ${user.email}`,
          ingredients: [
            { name: 'Ingredient A', amount: '1 unit' },
            { name: 'Ingredient B', amount: '2 units' },
          ],
          instructions: [
            `Step 1 for recipe ${i}`,
            `Step 2 for recipe ${i}`,
          ],
          userId: user.id,
          familyId: family.id,
        },
      });
    }
    // Cars
    for (let i = 1; i <= 2; i++) {
      const car = await prisma.car.create({
        data: {
          make: `Make${i}`,
          model: `Model${i}`,
          year: 2020 + i,
          licensePlate: `${user.email}-CAR${i}`,
          userId: user.id,
          familyId: family.id,
        },
      });
      // Car Location History
      for (let j = 1; j <= 2; j++) {
        await prisma.carLocationHistory.create({
          data: {
            carId: car.id,
            parkedById: user.id,
            location: `Location ${j} for ${car.licensePlate}`,
            latitude: 32.0 + j,
            longitude: 34.0 + j,
          },
        });
      }
    }
    // Goals and Subgoals
    for (let i = 1; i <= 2; i++) {
      const goal = await prisma.goal.create({
        data: {
          title: `Goal ${i} for ${user.email}`,
          description: `Description for goal ${i}`,
          userId: user.id,
          familyId: family.id,
        },
      });
      for (let j = 1; j <= 2; j++) {
        await prisma.subgoal.create({
          data: {
            title: `Subgoal ${j} for goal ${i}`,
            goalId: goal.id,
          },
        });
      }
    }
    // Categories
    for (let i = 1; i <= 2; i++) {
      await prisma.category.create({
        data: {
          name: `Category ${i} for ${user.email}`,
          userId: user.id,
        },
      });
    }
    // Shopping Categories
    for (let i = 1; i <= 2; i++) {
      await prisma.shoppingCategory.create({
        data: {
          name: `ShoppingCategory ${i} for ${user.email}`,
        },
      });
    }
    // Saved Shopping List and Items
    const savedList = await prisma.savedShoppingList.create({
      data: {
        name: `Saved List for ${user.email}`,
        userId: user.id,
      },
    });
    for (let i = 1; i <= 2; i++) {
      await prisma.savedShoppingListItem.create({
        data: {
          name: `Saved Item ${i} for ${user.email}`,
          quantity: i,
          savedListId: savedList.id,
          userId: user.id,
          familyId: family.id,
        },
      });
    }
  }

  // Create items for each user
  for (const user of users) {
    await createUserItems(user);
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
