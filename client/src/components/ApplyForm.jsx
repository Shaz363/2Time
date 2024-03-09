import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { apiRequest, handleFileUpload } from "../utils";
import CustomButton from "./CustomButton";
import Loading from "./Loading";
import TextInput from "./TextInput";

const ApplyForm = ({ open, setOpen, jobId }) => {
  const { user } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const [isApplying, setIsApplying] = useState(false);
  const [uploadCV, setUploadCv] = useState(null);

  const closeModal = () => setOpen(false);

  const onSubmit = async (data) => {
    setIsApplying(true);
    try {
      const uri = uploadCV && (await handleFileUpload(uploadCV));

      const newData = uri ? { ...data, cv: uri } : data;

      const res = await apiRequest({
        url: "/apply-job/" + jobId,
        token: user?.token,
        data: newData,
        method: "POST",
      });

      if (res?.success) {
        toast.success(res?.messsage);
        window.location.reload();
      }

      setIsApplying(false);
    } catch (error) {
      setIsApplying(false);
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <>
      <Transition appear show={open ?? false} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg font-semibold leading-6 text-gray-900'
                  >
                    Job Application
                  </Dialog.Title>
                  <form
                    className='w-full mt-2 flex flex-col gap-5'
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className='flex flex-col'>
                      <label className='text-gray-600 text-sm mb-1'>
                        Cover Letter
                      </label>
                      <textarea
                        className='ounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2 resize-none'
                        rows={4}
                        cols={6}
                        {...register("cover_letter", {
                          required: "Cover Letter is required!.",
                        })}
                        aria-invalid={errors.cover_letter ? "true" : "false"}
                      ></textarea>
                      {errors.cover_letter && (
                        <span
                          role='alert'
                          className='text-xs text-red-500 mt-0.5'
                        >
                          {errors.cover_letter?.message}
                        </span>
                      )}
                    </div>

                    {/* <div className='w-full flex gap-2'> */}
                    <div className='w-full'>
                      <TextInput
                        name='expectedSalary'
                        label='Expected Salary'
                        placeholder='Expected Salary in USD'
                        type='text'
                        register={register("expectedSalary", {
                          required: "Expected Salary is required!",
                        })}
                        error={
                          errors.expectedSalary
                            ? errors.expectedSalary?.message
                            : ""
                        }
                      />
                    </div>

                    <div className='flex gap-2 flex-col'>
                      <label className='text-gray-600 text-sm mb-1'>
                        Resume
                      </label>
                      <input
                        type='file'
                        onChange={(e) => setUploadCv(e.target.files[0])}
                      />
                    </div>

                    <div className='mt-4'>
                      {isApplying ? (
                        <Loading />
                      ) : (
                        <CustomButton
                          type='submit'
                          containerStyles='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none '
                          title={"Submit"}
                        />
                      )}
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ApplyForm;
