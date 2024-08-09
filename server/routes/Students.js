const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const StudentModal = require("../models/Student");

const basePath = path.resolve(__dirname, "..");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${basePath}/uploads`);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

//add student
router.route("/add").post(upload.single("image"), async (req, res) => {
  const { name, age, gender } = req.body;
  const image = req.file ? req.file.filename : null;

  const newStudent = new StudentModal({
    name,
    age,
    gender,
    image,
  });

  try {
    await newStudent.save();
    res.status(200).json({ message: "Student Added!", student: newStudent });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//get all students
router.route("/").get(async (req, res) => {
  try {
    const students = await StudentModal.find();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students :", error);
    res.status(500).json({ message: "server Error" });
  }
});

// update student

router.route("/update/:id").put(upload.single("image"), async (req, res) => {
  let studentId = req.params.id;
  const { name, age, gender } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    // Fetch the student record to get the current image
    const student = await StudentModal.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Prepare the updated student data
    const updateStudent = {
      name,
      age,
      gender,
      image: newImage ? newImage : student.image, // If new image, use it; otherwise, keep the old image
    };

    // If a new image was uploaded, delete the old image file
    if (newImage && student.image) {
      const oldImagePath = path.join(__dirname, "..", "uploads", student.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });
    }

    // Update the student record in the database
    const updatedStudent = await StudentModal.findByIdAndUpdate(
      studentId,
      updateStudent,
      { new: true }
    );

    res.status(200).json({ message: "Student updated!", student: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//delete student

router.route("/delete/:id").delete(async (req, res) => {
  let studentId = req.params.id;

  try {
    const student = await StudentModal.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found !" });
    }

    if(student.image){
          //get the image file path
    const imagePath = path.join(__dirname, "..", "uploads", student.image);

    //delete the image file if exist
    fs.unlink(imagePath, (error) => {
      if (error) {
        console.error("error deleting image", error);
      }
    });
    }

    //delete student record
    const deleteStudent = await StudentModal.findByIdAndDelete(studentId);
    if (!deleteStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student Deleted !" });
  } catch (error) {
    res.status(500).json({ message: "server Error" });
  }
});

//get single user details
router.route("/student/:id").get(async (req, res) => {
  let studentId = req.params.id;

  try {
    const singleUserDetails = await StudentModal.findById(studentId);
    if (!singleUserDetails) {
      return res.status(404).json({ message: "Student not Found" });
    }
    res
      .status(200)
      .json({ message: "User Fethched!", userData: singleUserDetails });
  } catch (error) {
    res.status(500).json({ message: "server Error" });
  }
});

module.exports = router;
