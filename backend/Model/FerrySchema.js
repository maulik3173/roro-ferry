import mongoose from 'mongoose';

const FerrySchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    ferryCode: { type: String, required: true, unique: true },
    classes: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            seats: [
                {
                    seatNumber: { type: String, required: true },
                    isBooked: { type: Boolean, default: false }, 
                }
            ]
        },
    ],
    categories: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
        },
    ],
});

const Ferry = mongoose.model("Ferry", FerrySchema);
export default Ferry;