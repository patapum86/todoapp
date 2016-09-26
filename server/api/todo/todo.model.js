'use strict';

import mongoose from 'mongoose';

var todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  date: Date,
  finished: Date
});

export default mongoose.model('Todo', todoSchema);
