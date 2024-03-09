import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";
import { JobCard, Loading } from "../components";

const ApplyHistory = () => {
  const { user } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsFetching(true);
        const res = await apiRequest({
          url: "/apply-job",
          method: "GET",
          token: user.token,
        });

        setJobs(res?.appliedJobs);

        setIsFetching(false);
      } catch (error) {
        setIsFetching(false);
        console.log(error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className='w-full flex items-center justify-center px-10 py-8'>
      {isFetching ? (
        <Loading />
      ) : (
        <div className='w-full '>
          <h1 className='text-xl text-gray-500 font-semibold'>
            Application History
          </h1>
          <div className='w-full h-full flex flex-col md:flex-row mt-6 gap-4'>
            {jobs?.length > 0 ? (
              jobs.map(({ _id, job, status, createdAt }) => {
                const newJob = {
                  _id: job._id,
                  name: job?.company?.name,
                  logo: job?.company?.profileUrl,
                  jobTitle: job?.jobTitle,
                  jobType: job?.jobType,
                  location: job?.location,
                  detail: job?.detail,
                  createdAt,
                  status,
                  applicants: job?.applicants?.length,
                };

                return <JobCard job={newJob} key={_id} />;
              })
            ) : (
              <div className='w-full flex items-center justify-center py-10'>
                <p className='text-center text-xl font-semibold text-gray-400'>
                  No Jobs Applied Yet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplyHistory;
