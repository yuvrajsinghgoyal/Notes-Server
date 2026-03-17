import Task from '../models/Task.js';

// @desc    Get tasks for user with pagination, filter, search
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { user: req.user._id };

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Search by title
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Task.countDocuments(query);

        res.status(200).json({
            tasks,
            page,
            pages: Math.ceil(total / limit),
            total,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            res.status(400);
            throw new Error('Please add a task title');
        }

        const task = await Task.create({
            title,
            description,
            status,
            user: req.user._id,
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check for user ownership
        if (task.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to update this task');
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        // Check for user ownership
        if (task.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to delete this task');
        }

        await task.deleteOne();

        res.status(200).json({ id: req.params.id, message: 'Task removed' });
    } catch (error) {
        next(error);
    }
};

export {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
