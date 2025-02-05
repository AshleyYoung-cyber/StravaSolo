require('dotenv').config();
const { sequelize, User, Run, Workout, Goal } = require('../models');

async function seedDatabase() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database (optional, since you've already done this)
    await sequelize.sync({ force: true });

    // Create test users
    const users = await User.bulkCreate([
      {
        username: 'testrunner1',
        email: 'runner1@example.com',
        password: 'hashedpassword123', // In reality, this should be hashed
        firstName: 'Sarah',
        lastName: 'Smith'
      },
      {
        username: 'testrunner2',
        email: 'runner2@example.com',
        password: 'hashedpassword123',
        firstName: 'Mike',
        lastName: 'Johnson'
      }
    ]);

    // Create test runs for first user
    await Run.bulkCreate([
      {
        userId: users[0].id,
        distance: 5000, // in meters
        duration: 1800, // in seconds (30 minutes)
        date: new Date('2024-03-15'),
        averagePace: 360, // seconds per km
        calories: 450,
        notes: 'Morning run in the park'
      },
      {
        userId: users[0].id,
        distance: 8000,
        duration: 2400,
        date: new Date('2024-03-17'),
        averagePace: 300,
        calories: 720,
        notes: 'Long weekend run'
      }
    ]);

    // Create test workouts
    await Workout.bulkCreate([
      {
        userId: users[0].id,
        name: 'Interval Training',
        description: '5x400m sprints with 200m recovery',
        type: 'INTERVAL',
        plannedDistance: 5000
      },
      {
        userId: users[1].id,
        name: 'Easy 5K',
        description: 'Steady pace run',
        type: 'STEADY',
        plannedDistance: 5000
      }
    ]);

    // Create test goals
    await Goal.bulkCreate([
      {
        userId: users[0].id,
        type: 'DISTANCE',
        target: 100000, // 100km monthly target
        timeframe: 'MONTHLY',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-31'),
        status: 'IN_PROGRESS'
      },
      {
        userId: users[1].id,
        type: 'FREQUENCY',
        target: 12, // 12 runs per month
        timeframe: 'MONTHLY',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-03-31'),
        status: 'IN_PROGRESS'
      }
    ]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    console.error('Full error details:', JSON.stringify(error, null, 2));
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seedDatabase(); 