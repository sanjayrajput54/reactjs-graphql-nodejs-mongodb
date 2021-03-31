const EventModel = require("../../models/event");
const BookingModel = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");
module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Un-Authrized user");
    }
    const bks = await BookingModel.find({
      user:req.userId
    });
    return bks.map((bk) => {
      return transformBooking(bk);
    });
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Un-Authrized user");
    }
    const fetchEvent = await EventModel.findOne({ _id: args.eventId });
    const newBk = new BookingModel({
      event: fetchEvent,
      user: req.userId
    });
    const result = await newBk.save();
    return transformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Un-Authrized user");
    }
    try {
      const bk = await BookingModel.findById(args.bookingId).populate("event");
      await BookingModel.deleteOne({ _id: args.bookingId });
      return transformEvent(bk.event);
    } catch (err) {
      throw err;
    }
  }
};
