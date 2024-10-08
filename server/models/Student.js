const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  }
});

const Student = mongoose.model("student", studentSchema);
module.exports = Student;
