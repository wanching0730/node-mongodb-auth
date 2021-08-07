/*
Database logic to find:
1. Followers of user
2. Who the user is following
3. Nearby friends of the user within specific distance (in meters)
*/

const db = require("../models");
const User = db.user;
const Following = db.following;

module.exports = {
    createFollowing: async(following) => {
        await Following.create(following);
    },

    findFollowing: async (userId) => {
        let followingIds = await Following.find({user_id: userId});
        followingIds = followingIds.map(following => following.following_id);

        let followingUsers = await User.find({id: {$in: followingIds}});
        return (followingUsers);
    },

    findFollowers: async (userId) => {
        let followerIds = await Following.find({following_id: userId});
        followerIds = followerIds.map(follower => follower.user_id);

        let followers = await User.find({id: {$in: followerIds}});
        return (followers);
    },

    findNearbyFriends: async(userId, distance) => {
        const userLocation = await User.findOne({id: userId});

        // only people that user is following are considered "friends"
        let following = await module.exports.findFollowing(userId);
        following = following.map(f => f.id).filter(f => f.id !== userId);

        let nearbyFriends = await User.find({
            $and: [{
                location: {
                    $near: {
                        $maxDistance: distance, // unit in meters
                        $geometry: {
                            type: "Point",
                            coordinates: userLocation.location.coordinates
                        }
                    }
                }
            },
            {
                id: {$in: following}
            }
            ]
        });

        return (nearbyFriends);
    }
}
