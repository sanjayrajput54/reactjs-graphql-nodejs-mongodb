const EventModel = require("../../models/event");
const UserModel = require("../../models/user");
const { transformEvent } = require("./merge");
module.exports = {
  events: async () => {
    try {
      const eventsRes = await EventModel.find({});
      return eventsRes.map((event) => transformEvent(event));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Un-Authrized user");
    }
    try {
      const event = new EventModel({
        ...args.eventInput,
        date: new Date(args.eventInput.date),
        creator: req.userId
      });
      let eventCreate = await event.save();
      const userExists = await UserModel.findById("6058b2b2dede993b808a325b");
      if (!userExists) {
        throw new Error("User not found");
      }
      userExists["addedEvents"].push(event);
      await userExists.save();
      return transformEvent(eventCreate);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
