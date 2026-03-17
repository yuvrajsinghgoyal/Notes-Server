import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a text value for title'],
        },
        description: {
            type: String,
            // We can optionally store encrypted strings here if requested, 
            // but the assignment asked for "Encrypt sensitive request payload" mainly. 
            // Storing as regular string here; encryption can happen via middleware/crypto-js
        },
        status: {
            type: String,
            enum: ['pending', 'in-progress', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);
export default Task;
