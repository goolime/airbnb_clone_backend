import { loggerService } from '../../services/logger.service.js'
import { reduceList } from '../../services/utils.js'
import { ordersService } from '../order/orders.services.js'

import { dbService } from '../../services/db.service.js'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'airbnb_properties'

export const propertyService = {
    query,
    getById,
    remove,
    save,
    getPropertiesByCity,
    getPropertiesByUserId
}

async function query(filterBy,orderBy = { field: 'name', direction: 1 }) { 
    try{
    const criteria = {}
    // Build criteria based on filterBy
    for (const field in filterBy) {
        switch (field) {
            case 'type':
                if (filterBy.type !== 'any' && filterBy.type !== 'room' && filterBy.type !== 'home') continue
                else if (filterBy.type === 'room') criteria.type = { $in: ['Guesthouse', 'Hotel'] }
                else if (filterBy.type === 'home') criteria.type = { $in: ['House', 'Apartment'] }
                break
            case 'types':
            case 'amenities':
            case 'accessibility':
            case 'labels':
            case 'rules':
                criteria[field] = { $all: filterBy[field] } 
                break
            case 'minPrice':
                if (filterBy.minPrice > filterBy?.maxPrice) throw new Error('minPrice cannot be greater than maxPrice')
                criteria.price = { ...criteria.price, $gte: filterBy.minPrice }
                break
            case 'maxPrice':
                if (filterBy.maxPrice <= 0) throw new Error('maxPrice must be greater than 0')
                criteria.price = { ...criteria.price, $lte: filterBy.maxPrice }
                break   
            case 'bedrooms':
            case 'beds':
            case 'bathrooms':
                criteria[field] = { $gte: filterBy[field] }
                break
            case 'guests':
                for (const guestType in filterBy.guests) {
                    criteria[`capacity.${guestType}`] = { $gte: filterBy.guests[guestType] }
                }
                break
            case 'loc':
                criteria['loc.lat'] = { $gte: filterBy.loc.minLat, $lte: filterBy.loc.maxLat }
                criteria['loc.lng'] = { $gte: filterBy.loc.minLng, $lte: filterBy.loc.maxLng }
                break
            case 'raiting':
            case 'dates':
                // Handled after fetching properties
                break
            default:
                loggerService.warn(`Unknown filter field: ${field}`)
        }   
    }
    const collection = await dbService.getCollection(COLLECTION_NAME)
    const properties= await collection.find(criteria).toArray()
    let filteredProperties = properties.filter(property => ordersService.isPropertyAvailable(property._id, filterBy.dates.from, filterBy.dates.to))
    filteredProperties.sort((a,b) => {
        if(a[orderBy.field] < b[orderBy.field]) return -1 * orderBy.direction;
        if(a[orderBy.field] > b[orderBy.field]) return 1 * orderBy.direction;
        return 0;
    })
    loggerService.info(`PropertyService - query: found ${filteredProperties.length} properties that match criteria`)
    return filteredProperties
    } catch (err) {
        loggerService.error('Cannot query properties', err)
        throw err
    }
}


async function getById(propertyId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const criteria={_id: ObjectId.createFromHexString(propertyId.toString())}
        const property = await collection.findOne(criteria)
        if (!property) throw new Error(`Property with id ${propertyId} not found`)
        loggerService.debug(`PropertyService - getById: ${propertyId} found`)
        return property;
    } catch (err) {
        loggerService.error(`PropertyService - getById(${propertyId}) failed`, err)
        throw err
    }
}

async function remove(propertyId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const criteria={_id: new ObjectId(propertyId)}
        const deleteResult = await collection.deleteOne(criteria)
        if (deleteResult.deletedCount === 0) throw new Error(`Property with id ${propertyId} not found`)
        loggerService.debug(`PropertyService - remove: ${propertyId} removed`)
        return propertyId;
    } catch (err) {
        loggerService.error('Cannot remove property', err)
        throw err
    }
}

async function save(property) {
    console.log('property in service:', property)
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        if (property._id) {
            const criteria={_id: new ObjectId(property._id)}
            const updateData = {$set: {}}
            for (const key in property) {
                if (key !== '_id' && key !== 'password') {
                    updateData.$set[key] = property[key]
                }
            }
            const updateResult = await collection.updateOne(criteria, updateData)
            if (updateResult.matchedCount === 0) throw new Error(`Property with id ${property._id} not found`)
            loggerService.debug(`PropertyService - update: ${property._id} updated`)
            return await getById(property._id)
        } else {
            const insertResult = await collection.insertOne(property)
            property._id = insertResult.insertedId
            loggerService.debug(`PropertyService - add: ${property._id} added`)
            return property;
        }   
    } catch (err) {
        loggerService.error('Cannot save property', err)
        throw err
    }
}

async function getPropertiesByCity(city) {
    try{
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const criteria = {
            "loc.lat": { $gte: city.minLat, $lte: city.maxLat },
            "loc.lng": { $gte: city.minLng, $lte: city.maxLng }
        }
        const filteredProperties = await collection.find(criteria).toArray()
        if (!filteredProperties.length) throw new Error(`No properties found in ${city.city}, ${city.countryCode}`)
        loggerService.debug(`PropertyService - getPropertiesByCity in ${city.city}, ${city.countryCode} \n found ${filteredProperties.length} properties`)
        return reduceList(filteredProperties,8);
    } catch (err) {
        loggerService.error('Cannot get properties by city', err)
        throw err
    }
}

async function getPropertiesByUserId(userId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const criteria={host: ObjectId.createFromHexString(userId.toString())}
        const userProperties = await collection.find(criteria).toArray()
        return userProperties.map(property => property._id.toString())
    } catch (err) {
        loggerService.error('Cannot get properties by user id', err)
        throw err
    }
}