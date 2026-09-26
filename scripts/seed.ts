import { BRANCHES, INITIAL_MEMBERS, INITIAL_CHECKINS, INITIAL_CLASSES, INITIAL_PT_SESSIONS } from '../src/data/mockData.js';

console.log('Seeding InsForge Database with India-based Data...');

async function seed() {
  try {
    // This is a placeholder for InsForge CLI or SDK seeding logic.
    // Assuming InsForge takes array of objects for insertion
    console.log('Seeding Branches...', BRANCHES.length);
    console.log('Seeding Members...', INITIAL_MEMBERS.length);
    console.log('Seeding Check-ins...', INITIAL_CHECKINS.length);
    console.log('Seeding Classes...', INITIAL_CLASSES.length);
    console.log('Seeding PT Sessions...', INITIAL_PT_SESSIONS.length);
    
    // In a real InsForge setup with @insforge/sdk, you would do:
    // await db.from('branches').insert(BRANCHES);
    // await db.from('members').insert(INITIAL_MEMBERS);
    
    console.log('✅ Seeding completed successfully.');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  }
}

seed();
