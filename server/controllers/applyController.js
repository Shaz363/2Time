import Applications from "../models/applocations.js";
import Jobs from "../models/jobsModel.js";
import Users from "../models/userModel.js";

export const applyJob = async (req, res, next) => {
  try {
    const { cv, cover_letter, expectedSalary } = req.body;
    const userId = req.body.user.userId;
    const jobId = req.params.id;

    const new_app = {
      user: userId,
      job: jobId,
      cover_letter,
      cv,
      expectedSalary,
    };

    const jobApply = new Applications(new_app);
    await jobApply.save();

    // update job applicants
    const job = await Jobs.findById(jobId);
    job.application.push(jobApply._id);
    job.applicants.push(userId);

    await Jobs.findByIdAndUpdate(jobId, job, {
      new: true,
    });

    // update user applied jobs
    const user = await Users.findById(userId);
    user.jobsApplied.push(jobApply._id);
    await Users.findByIdAndUpdate(userId, user, { new: true });

    res.status(200).json({
      success: true,
      message: "Applied SUccessfully",
      jobApply,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getJobsApplied = async (req, res, next) => {
  try {
    const { userId } = req.body.user;

    const appliedJobs = await Applications.find({ user: userId }).populate({
      path: "job",
      select: "jobTitle jobType location company applicants detail",
      populate: {
        path: "company",
        select: "name profileUrl -password",
      },
    });

    res.status(200).json({ appliedJobs, success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getAllApplicants = async (req, res, next) => {
  try {
    const { id } = req.params;

    const applicants = await Applications.find({ job: id }).populate({
      path: "user",
      select: "-password name location contact profileUrl",
    });

    res.status(200).json({ data: applicants, success: true });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
