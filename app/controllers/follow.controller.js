/*
Business logic and validation to find:
1. Followers of user
2. Who the user is following
3. Nearby friends of the user within specific distance (in meters)
*/

const db = require("../models");
const Following = db.following;

const CustomError = require("../utils/custom-error");
const logger = require("../utils/logger")(__filename);

const {createFollowing, findFollowers, findFollowing, findNearbyFriends} = require("../services/follow.service");

module.exports = {
    createFollowing: async (req, res) => {
        const following = new Following({
            user_id: req.body.userId,
            following_id: req.body.followingId
        });

        await createFollowing(following);
        res.status(200).send({message: "User's following details are updated successfully"});
    },

    findFollowing: async (req, res) => {
        let userId = req.params.id;

        logger.info(`Retrieving list of following users of user ${userId}`);

        // check user ID
        if (!userId) throw new CustomError(400, "Error: User ID cannot be empty");

        res.status(200).send(await findFollowing(userId));
    },

    findFollowers: async (req, res) => {
        let userId = req.params.id;

        logger.info(`Retrieving list of followers of user ${userId}`);

        // check user ID
        if (!userId) throw new CustomError(400, "Error: User ID cannot be empty");

        res.status(200).send(await findFollowers(userId));
    },

    findNearbyFriends: async (req, res) => {
        let {userId, distance} = req.body;

        logger.info(`Retrieving list of ${userId}'s nearby friends`);

        // check user ID
        if (!userId) throw new CustomError(400, "Error: User ID cannot be empty");

        // check desired nearby distance
        if (!distance) throw new CustomError(400, "Error: Distance cannot be empty");

        res.status(200).send(await findNearbyFriends(userId, distance));
    }
}
