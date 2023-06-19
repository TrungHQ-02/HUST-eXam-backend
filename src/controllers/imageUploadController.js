import express from "express";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import multer from "multer";
import firebaseConfig from "../config/firebaseConfig";
import questionService from "../services/questionService";

const router = express.Router();

//Initialize a firebase application
// console.log(firebaseConfig);
initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload/question/:questionId",
  upload.single("filename"),
  async (req, res) => {
    try {
      const dateTime = giveCurrentDateTime();

      const storageRef = ref(
        storage,
        `files/${req.file.originalname + "       " + dateTime}`
      );

      // Create file metadata including the content type
      const metadata = {
        contentType: req.file.mimetype,
      };

      // Upload the file in the bucket storage
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

      // Grab the public url
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("File successfully uploaded.");
      const questionId = req.params.questionId;
      let msg = await questionService.handleUploadImage(
        questionId,
        downloadURL
      );
      return res.status(msg.statusCode).json(msg);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
);

router.delete(
  "/upload/question/:questionId",
  upload.single("filename"),
  async (req, res) => {
    try {
      let questionId = req.params.questionId;
      let image_link_to_delete = req.body.link;
      let msg = await questionService.handleDeleteImage(
        questionId,
        image_link_to_delete
      );
      return res.status(msg.statusCode).json(msg);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
);
const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

export default router;
