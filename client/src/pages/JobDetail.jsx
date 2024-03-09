import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { ApplyForm, CustomButton, JobCard, Loading } from "../components";
import { socket } from "../socket";
import { apiRequest } from "../utils";

const noLogo =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/450px-No_image_available.svg.png";

const ApllicantCard = () => {};

const JobDetail = () => {
  const { id } = useParams();

  const { user } = useSelector((state) => state.user);

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isView, setIsView] = useState(true);

  const [selected, setSelected] = useState("0");
  const [isFetching, setIsFetching] = useState(false);
  const [open, setOpen] = useState(false);

  const getJobDetails = async () => {
    setIsFetching(true);

    try {
      const res = await apiRequest({
        url: "/jobs/get-job-detail/" + id,
        method: "GET",
        token: user?.token,
      });

      setJob(res?.data);
      setSimilarJobs(res?.similarJobs);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  const fetchApllicants = async () => {
    try {
      const res = await apiRequest({
        url: "/apply-job/all/" + id,
        method: "GET",
        token: user?.token,
      });

      setApplicants(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setIsFetching(true);

    try {
      if (window.confirm("Delete Job Post?")) {
        const res = await apiRequest({
          url: "/jobs/delete-job/" + job?._id,
          token: user?.token,
          method: "DELETE",
        });

        if (res?.success) {
          toast.success(res?.messsage);
          window.location.replace("/");
        }
      }
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  const handleStartChat = ({ to, app_id }) => {
    // if (user.accountType === "company") {
    socket.emit("start_chatting", {
      to: to,
      from: user?._id,
      app_id: app_id,
    });
    // } else {
    //   socket.emit("start_chatting", {
    //     to: to,
    //     from: user?._id,
    //     app_id: app_id,
    //   });
    // }
  };

  useEffect(() => {
    id && getJobDetails();

    id && user?.accountType === "company" && fetchApllicants();

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  return (
    <div className='container mx-auto'>
      <div className='w-full flex flex-col md:flex-row gap-10'>
        {/* LEFT SIDE */}
        {isFetching ? (
          <Loading />
        ) : (
          <div className='w-full h-fit md:w-2/3 2xl:2/4'>
            {user.accountType === "company" && (
              <div className='w-full flex gap-4 py-6'>
                <button
                  onClick={() => setIsView(true)}
                  className={`w-full h-10 rounded-md ${
                    isView
                      ? "border-b border-blue-600 text-blue-600 font-semibold"
                      : "text-black font-medium"
                  }`}
                >
                  Job Details
                </button>
                <button
                  onClick={() => setIsView(false)}
                  className={`w-full h-10 rounded-md ${
                    !isView
                      ? "border-b border-blue-600 text-blue-600 font-semibold"
                      : "text-black font-medium"
                  }`}
                >
                  Applicants Infomation
                </button>
              </div>
            )}
            <div className=' bg-white px-5 py-10 md:px-10 shadow-md'>
              {isView ? (
                <>
                  <div className='w-full flex items-center justify-between'>
                    <div className='w-3/4 flex gap-2'>
                      <img
                        src={job?.company?.profileUrl || noLogo}
                        alt={job?.company?.name}
                        className='w-20 h-20 md:w-24 md:h-20 rounded'
                      />

                      <div className='flex flex-col'>
                        <p className='text-xl font-semibold text-gray-600'>
                          {job?.jobTitle}
                        </p>

                        <span className='text-base'>{job?.location}</span>

                        <span className='text-base text-blue-600'>
                          {job?.company?.name}
                        </span>

                        <span className='text-gray-500 text-sm'>
                          {moment(job?.createdAt).fromNow()}
                        </span>
                      </div>
                    </div>

                    <div className=''>
                      <AiOutlineSafetyCertificate className='text-3xl text-blue-500' />
                    </div>
                  </div>

                  <div className='w-full flex flex-wrap md:flex-row gap-2 items-center justify-between my-10'>
                    <div className='bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
                      <span className='text-sm'>Salary</span>
                      <p className='text-lg font-semibold text-gray-700'>
                        $ {job?.salary}
                      </p>
                    </div>

                    <div className='bg-[#bae5f4] w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
                      <span className='text-sm'>Job Type</span>
                      <p className='text-lg font-semibold text-gray-700'>
                        {job?.jobType}
                      </p>
                    </div>

                    <div className='bg-[#fed0ab] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
                      <span className='text-sm'>No. of Applicants</span>
                      <p className='text-lg font-semibold text-gray-700'>
                        {job?.applicants?.length}
                      </p>
                    </div>

                    <div className='bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
                      <span className='text-sm'>No. of Vacancies</span>
                      <p className='text-lg font-semibold text-gray-700'>
                        {job?.vacancies}
                      </p>
                    </div>

                    <div className='bg-[#ffcddf] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
                      <span className='text-sm'>Yr. of Experience</span>
                      <p className='text-lg font-semibold text-gray-700'>
                        {job?.experience}
                      </p>
                    </div>
                  </div>

                  <div className='w-full flex gap-4 py-5'>
                    <CustomButton
                      onClick={() => setSelected("0")}
                      title='Job Description'
                      containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
                        selected === "0"
                          ? "bg-black text-white"
                          : "bg-white text-black border border-gray-300"
                      }`}
                    />

                    <CustomButton
                      onClick={() => setSelected("1")}
                      title='Company'
                      containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
                        selected === "1"
                          ? "bg-black text-white"
                          : "bg-white text-black border border-gray-300"
                      }`}
                    />
                  </div>

                  <div className='my-6'>
                    {selected === "0" ? (
                      <>
                        <p className='text-xl font-semibold'>Job Decsription</p>

                        <span className='text-base'>
                          {job?.detail[0]?.desc}
                        </span>

                        {job?.detail[0]?.requirements && (
                          <>
                            <p className='text-xl font-semibold mt-8'>
                              Requirement
                            </p>
                            <span className='text-base'>
                              {job?.detail[0]?.requirements}
                            </span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className='mb-6 flex flex-col'>
                          <p className='text-xl text-blue-600 font-semibold'>
                            {job?.company?.name}
                          </p>
                          <span className='text-base'>
                            {job?.company?.location}
                          </span>
                          <span className='text-sm'>{job?.company?.email}</span>
                        </div>

                        <p className='text-xl font-semibold'>About Company</p>
                        <span>{job?.company?.about}</span>
                      </>
                    )}
                  </div>

                  <div className='w-full'>
                    {user?._id === job?.company?._id ? (
                      <div className='flex  gap-2'>
                        <CustomButton
                          title='Delete Post'
                          onClick={handleDeletePost}
                          containerStyles={`w-full flex items-center justify-center text-white bg-red-700 py-3 px-5 outline-none rounded-full text-base`}
                        />
                      </div>
                    ) : job?.applicants.includes(user._id) ? (
                      <div className='flex gap-4 '>
                        <CustomButton
                          title='Applied Already'
                          containerStyles={`w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base cursor-not-allowed`}
                        />
                        <Link to='/direct-chats' className='w-full'>
                          <CustomButton
                            title='Chats'
                            onClick={() =>
                              handleStartChat({
                                to: job?.company?._id,
                                app_id: job?.application[0]._id,
                              })
                            }
                            containerStyles={`w-full flex items-center justify-center text-black bg-transparent py-3 px-5 border border-gray-500 rounded-full text-base`}
                          />
                        </Link>
                      </div>
                    ) : (
                      <CustomButton
                        onClick={() => setOpen(true)}
                        title='Apply Now'
                        containerStyles={`w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base`}
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className='text-xl font-semibold text-gray-500 mb-5'>
                    Job Applicants
                  </h3>
                  <table className='text-left min-w-full bg-white border border-gray-300'>
                    <thead>
                      <tr>
                        <th className='py-2 px-4 border-b'>No.</th>
                        <th className='py-2 px-4 border-b'>Name</th>
                        <th className='py-2 px-4 border-b'>Salary</th>
                        <th className='py-2 px-4 border-b'>Date</th>
                        <th className='py-2 px-4 border-b'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants?.map((ap, index) => (
                        <tr>
                          <td className='py-2 px-4 border-b'>{index + 1}</td>
                          <td className='py-2 px-4 border-b'>
                            {ap?.user.name}
                          </td>
                          <td className='py-2 px-4 border-b'>
                            ${ap.expectedSalary}
                          </td>
                          <td className='py-2 px-4 border-b'>
                            {new Date(ap.createdAt).toLocaleDateString()}
                          </td>
                          <td className='py-2 px-4 border-b'>
                            <Link
                              to='/direct-chats'
                              onClick={() =>
                                handleStartChat({
                                  to: ap.user._id,
                                  app_id: ap._id,
                                })
                              }
                              className=' text-blue-600 px-4 py-2 rounded'
                            >
                              Chat
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className='w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0'>
          <p className='text-gray-500 font-semibold'>Similar Job Post</p>

          <div className='w-full flex flex-wrap gap-4'>
            {similarJobs?.slice(0, 6).map((job, index) => {
              const data = {
                name: job?.company.name,
                logo: job?.company.profileUrl,
                ...job,
              };
              return <JobCard job={data} key={index} />;
            })}
          </div>
        </div>
      </div>

      <ApplyForm open={open} setOpen={setOpen} jobId={job?._id} />
      <Toaster richColors />
    </div>
  );
};

export default JobDetail;
