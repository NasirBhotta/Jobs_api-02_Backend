const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findOne({ createdBy: req.user.id, _id: id });

  if (!job) {
    throw new NotFoundError("Object against this ID is not Found");
  }

  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const existingJob = await Job.findOne({
    createdBy: req.user.id,
    company: req.body.company,
    position: req.body.position,
  });

  if (existingJob) {
    res.status(StatusCodes.CONFLICT).json({ msg: "already Present" });
  } else {
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const userID = req.user.id;

  if (req.body.company === "" || req.body.position === "") {
    throw new BadRequestError("company or position fields connot be empty");
  }

  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: userID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    throw new NotFoundError("product not Found");
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const userID = req.user.id;

  const job = await Job.findOneAndDelete({ _id: id, createdBy: userID });

  if (!job) {
    throw new NotFoundError("product not Found");
  }

  res.status(StatusCodes.OK).json({ job });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
