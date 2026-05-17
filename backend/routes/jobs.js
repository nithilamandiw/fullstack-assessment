const express = require("express");
const router = express.Router();
const JobRequest = require("../models/JobRequest");
const auth = require("../middleware/auth");

router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, "i");
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    const jobs = await JobRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const job = await JobRequest.findById(req.params.id);

    if (!job) {
      const err = new Error("Job request not found");
      err.statusCode = 404;
      throw err;
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { title, description, category, location, contactName, contactEmail } =
      req.body;

    // Manual check for required fields before hitting Mongoose
    if (!title || !title.trim()) {
      const err = new Error("Title is required");
      err.statusCode = 400;
      throw err;
    }
    if (!description || !description.trim()) {
      const err = new Error("Description is required");
      err.statusCode = 400;
      throw err;
    }

    const job = await JobRequest.create({
      title,
      description,
      category,
      location,
      contactName,
      contactEmail,
    });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", auth, async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      const err = new Error("Status field is required");
      err.statusCode = 400;
      throw err;
    }

    const validStatuses = ["Open", "In Progress", "Closed"];
    if (!validStatuses.includes(status)) {
      const err = new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
      err.statusCode = 400;
      throw err;
    }

    const job = await JobRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!job) {
      const err = new Error("Job request not found");
      err.statusCode = 404;
      throw err;
    }

    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const job = await JobRequest.findByIdAndDelete(req.params.id);

    if (!job) {
      const err = new Error("Job request not found");
      err.statusCode = 404;
      throw err;
    }

    res.json({ success: true, message: "Job request deleted", data: job });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
