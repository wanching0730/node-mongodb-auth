/*
Database logic to find followers of user and who the user is following
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
    }
}
