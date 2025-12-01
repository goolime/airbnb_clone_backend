import { loggerService } from '../../services/logger.service.js'
import { ordersService } from '../order/orders.services.js'
import { propertyService } from '../property/property.service.js'
import { reviewService } from '../reviews/review.service.js'
import { usersService } from './users.service.js'



export async function getUser (req,res){
    const { userId } = req.params
    try {
        const user = await usersService.getById(userId)
        user.password = undefined; // Do not send password back to client
        res.send(user)
        loggerService.info(`User ${userId} retrieved successfully`)
    }
    catch (err) {
        loggerService.error(`Cannot get user ${userId}`, err)
        res.status(400).send({ err: `Cannot get user ${userId}` })
    }
}

export async function updateUser(req,res){
    const {password,fullname,imgUrl} = req.body;
    const { userId } = req.params
    const user= {_id: userId, password, fullname, imgUrl};
    if(!password) delete user.password;
    if(!fullname) delete user.fullname;
    if(!imgUrl) delete user.imgUrl;
    try {
        if (user.username) {
            throw new Error('Cannot update username via this endpoint')
        }
        const updatedUser = await usersService.save(user)
        res.send(updatedUser)
        loggerService.info(`User ${userId} updated successfully`)
    }
    catch (err) {
        loggerService.error(`Cannot update user ${userId}`, err)
        res.status(400).send({ err: `Cannot update user ${userId}` })
    }
}

export async function deleteUser(req,res){
    const { userId } = req.params
    try {
        const userProperties = await propertyService.getPropertiesByUserId(userId)
        for (let propertyId of userProperties) {
            propertyService.remove(propertyId)
            ordersService.removeFutureOrdersByPropertyId(propertyId)
            reviewService.removeReviewsByPropertyId(propertyId)
        }
        await reviewService.removeReviewsByUserId(userId)
        await ordersService.removeFutureOrdersByUserId(userId)
        await usersService.remove(userId)
        res.send({ msg: `User ${userId} removed successfully` })
        loggerService.info(`User ${userId} removed successfully`)
    } catch (err) {
        loggerService.error(`Cannot remove user ${userId}`, err)
        res.status(400).send({ err: `Cannot remove user ${userId}` })
    }
}