import {createSeat,getAllSeats,getSeat,updateSeat,deleteSeat, bulkCreateSeats } from '../services/seatService.js';

const bulkcreate = async (req, res) => {
    try {
        const seatsData = req.body; 

        if (!Array.isArray(seatsData) || seatsData.length === 0) {
            return res.status(400).json({ success: false, message: 'Please provide an array of seat data.' });
        }

        const createdSeats = await bulkCreateSeats(seatsData);
        res.status(201).json({ success: true, message: 'Seats created successfully', data: createdSeats });
    } catch (error) {
        console.error('Error creating multiple seats:', error);
        res.status(500).json({ success: false, message: 'Failed to create multiple seats', error: error.message });
    }
};

// Create a new seat
const create = async (req, res) => {
    try {
        const seat = await createSeat(req.body);
        res.status(201).json({ success: true, seat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all seats
const list = async (req, res) => {
    try {
        const seats = await getAllSeats();
        res.status(200).json({ success: true, seats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a seat by ID
const getById = async (req, res) => {
    try {
        const seat = await getSeat(req.params.id);
        if (!seat) {
            return res.status(404).json({ success: false, message: 'Seat not found' });
        }
        res.status(200).json({ success: true, seat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a seat
const update = async (req, res) => {
    try {
        const seat = await updateSeat(req.params.id, req.body);
        if (!seat) {
            return res.status(404).json({ success: false, message: 'Seat not found' });
        }
        res.status(200).json({ success: true, seat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a seat
const  remove = async (req, res) => {
    try {
        const seat = await deleteSeat(req.params.id);
        if (!seat) {
            return res.status(404).json({ success: false, message: 'Seat not found' });
        }
        res.status(200).json({ success: true, message: 'Seat deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { create, list, getById, update, remove, bulkcreate };