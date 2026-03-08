const mangoose = require("mongoose");

const TaskSchema = new mangoose.Schema({
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [60, "name can not be more than 60 characters"],
  },  
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mangoose.model("Task", TaskSchema);
