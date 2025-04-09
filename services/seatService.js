import Seat from '../models/seat.js';

const bulkCreateSeats = async (seatsData) => {
    try {
        const result = await Seat.insertMany(seatsData);
        return result;
    } catch (error) {
        console.error('Error creating multiple seats:', error);
        throw error; // Re-throw the error for the calling function to handle
    }
};


// Create a new seat
const createSeat = async (seatData) => {
    const seat = new Seat(seatData);
    return await seat.save();
};

// Get all seats
const getAllSeats = async () => {
    return await Seat.find().populate('screen'); // Populate screen reference
};

// Get a seat by ID
const getSeat = async (seatId) => {
    return await Seat.findById(seatId).populate('screen');
};

// Update a seat
const updateSeat = async (seatId, seatData) => {
    return await Seat.findByIdAndUpdate(seatId, seatData, { new: true });
};

// Delete a seat
const deleteSeat = async (seatId) => {
    return await Seat.findByIdAndDelete(seatId);
};

export {createSeat,getAllSeats,getSeat,updateSeat,deleteSeat, bulkCreateSeats};