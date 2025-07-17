import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  ferry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ferry',
    required: true
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  tripType: { type: String, enum: ['one-way', 'round-trip'], required: true },

  departureDate: {
    type: Date,
    required: function () {
      return this.tripType === 'one-way';
    }
  },
  arrivalTime: {
    type: String,
    required: function () {
      return this.tripType === 'one-way';
    }
  },
  onwardStatus: { 
    type: String,
    enum: ['scheduled', 'departed'],
    required: function () {
      return this.tripType === 'one-way';
    },
  },

  returnDate: {
    type: Date,
    required: function () {
      return this.tripType === 'round-trip';
    }
  },
  returnTime: {
    type: String,
    required: function () {
      return this.tripType === 'round-trip';
    }
  },
  returnStatus: { 
    type: String,
    enum: ['scheduled', 'departed'],
    required: function () {
      return this.tripType === 'round-trip';
    },
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
