import { Combobox, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { AiOutlineCloseCircle, AiOutlineSearch } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { HeroImage } from "../assets";
import { popularSearch } from "../utils/data";
import CustomButton from "./CustomButton";

const SearchInput = ({
  lists = [],
  placeholder,
  icon,
  value,
  setValue,
  styles,
}) => {
  const filteredLists =
    value === ""
      ? lists
      : lists.filter((el) =>
          el
            ?.toLowerCase()
            ?.replace(/\s+/g, "")
            ?.includes(value?.toLowerCase()?.replace(/\s+/g, ""))
        );

  return (
    <div className={`flex  w-full items-center ${styles}`}>
      <Combobox value={value} onChange={setValue}>
        <div className='relative mt-1 w-full '>
          <div className='relative w-full flex items-center justify-between cursor-default overflow-hidden rounded-lg  text-left focus:outline-none sm:text-sm'>
            {icon}
            <Combobox.Input
              className='w-full h-full p-2 outline-none  text-base'
              placeholder={placeholder}
              displayValue={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <AiOutlineCloseCircle
              className='hidden md:flex text-gray-600 text-xl cursor-pointer'
              onClick={() => setValue("")}
            />
          </div>

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            // afterLeave={() => setValue("")}
          >
            <Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
              {filteredLists.length === 0 && value !== "" ? (
                <div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
                  No Result Found.
                </div>
              ) : (
                filteredLists?.slice(0, 5)?.map((suggestion, index) => (
                  <Combobox.Option
                    key={suggestion + index}
                    className={`relative cursor-pointer select-none py-2 pl-10 pr-4 hover:bg-blue-100 text-gray-900`}
                    value={suggestion}
                  >
                    <span className={`block truncate font-normal`}>
                      {suggestion}
                    </span>
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

const Header = ({
  title,
  type,
  handleClick,
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  suggestions,
}) => {
  return (
    <div className='bg-[#f7fdfd]'>
      <div
        className={`container mx-auto px-5 ${
          type ? "h-[500px]" : "h-[350px]"
        } flex items-center relative`}
      >
        <div className='w-full z-10'>
          <div className='mb-8'>
            <p className='text-blue-600 font-bold text-4xl'>{title}</p>
          </div>

          <form className='w-full flex gap-8 items-center justify-around bg-white px-2 md:px-5 py-2.5 md:py-6 shadow-2xl rounded'>
            <SearchInput
              placeholder={
                type ? "Job Title or Keywords..." : "Company name..."
              }
              icon={<AiOutlineSearch className='text-gray-600 text-xl' />}
              value={searchQuery}
              setValue={setSearchQuery}
              key='jobTitles'
              lists={suggestions?.titles}
            />
            <SearchInput
              placeholder='Add Country or City...'
              icon={<CiLocationOn className='text-gray-600 text-xl' />}
              value={location}
              setValue={setLocation}
              styles={"hidden md:flex"}
              key='jobType'
              lists={suggestions?.locations}
            />

            <div>
              <CustomButton
                onClick={handleClick}
                title='Search'
                containerStyles={
                  "text-white py-2 md:py3 px-3 md:px-10 focus:outline-none bg-blue-600 rounded-full md:rounded-md text-sm md:text-base"
                }
              />
            </div>
          </form>

          {type && (
            <div className='w-full lg:1/2 flex flex-wrap gap-3 md:gap-6 py-10 md:py-14'>
              {popularSearch.map((search, index) => (
                <span
                  key={index}
                  className='bg-[#1d4fd826] text-[#1d4ed8] py-1 px-2 rounded-full text-sm md:text-base'
                >
                  {search}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className='w-1/3 h-full absolute top-24 md:-top-6 lg:-top-14 right-16 2xl:right-[18rem]'>
          <img src={HeroImage} className='object-contain' />
        </div>
      </div>
    </div>
  );
};

export default Header;
