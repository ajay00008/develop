const {Types} = require('mongoose');
const {Router} = require('express');
const auth = require('../../middleware/auth');

const router = Router();

router.get("/", auth ,  async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;
    console.log(limit, page, skip);
    try {
      const loggedInUserId = req.auth.id;
      // const loggedInUserId = '64c56f0ee396e3a8bc81d29d';
  
      const aggregate = [
        {
          $match: {
            $or: [
              {
                sender: new Types.ObjectId(loggedInUserId),
              },
              {
                reciever: new Types.ObjectId(loggedInUserId),
              },
            ],
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reciever",
            foreignField: "_id",
            as: "recieverinfo",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "senderinfo",
          },
        },
        {
          $project: {
            room_id: "$roomId",
            userId: {
              $cond: [
                {
                  $eq: ["$sender", new Types.ObjectId(loggedInUserId)],
                },
                {
                  $arrayElemAt: ["$recieverinfo._id", 0],
                },
                "$sender",
              ],
            },
            userName: {
              $cond: [
                {
                  $eq: ["$sender", new Types.ObjectId(loggedInUserId)],
                },
                {
                  $arrayElemAt: ["$recieverinfo.username", 0],
                },
                "$senderinfo.username",
              ],
            },
            lastmessageDetails: "$$ROOT",
          },
        },
        {
          $group: {
            _id: "$room_id",
            roomId: {
              $first: "$room_id",
            },
            userId: {
              $first: "$userId",
            },
            userName: {
              $first: "$userName",
            },
            messages: {
              $push: "$lastmessageDetails",
            },
          },
        },
        {
          $facet: {
            chats: [
              {
                $skip: Number(skip),
              },
              {
                $limit: Number(limit),
              },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$totalCount",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];
      const [{ chats, totalCount }] = await Message.aggregate(aggregate);
      res.status(200).json({ chats, totalCount: totalCount?.count || 0 });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  });
  

  module.exports = router;