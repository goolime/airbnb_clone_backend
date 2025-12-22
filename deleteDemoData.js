import { exit } from 'process';
import { dbService } from './services/db.service.js';

const USER_COLLECTION = 'airdnd_users';
const PROPERTY_COLLECTION = 'airdnd_properties';
const ORDER_COLLECTION = 'airdnd_orders';
const REVIEW_COLLECTION = 'airdnd_reviews';

const usersCollection = await dbService.getCollection(USER_COLLECTION);
const propertiesCollection = await dbService.getCollection(PROPERTY_COLLECTION);
const ordersCollection = await dbService.getCollection(ORDER_COLLECTION);
const reviewsCollection = await dbService.getCollection(REVIEW_COLLECTION);

await usersCollection.deleteMany({})
await propertiesCollection.deleteMany({})
await ordersCollection.deleteMany({})
await reviewsCollection.deleteMany({})

exit();