import React from "react";
import { JobImg } from "../assets";

const About = () => {
  return (
    <div className='container mx-auto flex flex-col gap-8 2xl:gap-14 py-6 '>
      <div className='w-full flex flex-col-reverse md:flex-row gap-10 items-center p-5'>
        <div className='w-full md:2/3 2xl:w-2/4'>
          <h1 className='text-3xl text-blue-600 font-bold mb-5'>About Us</h1>
          <p className='text-justify leading-7'>
          Welcome to 2 Time Opportunities, where we believe in the power of second chances and the
          potential for growth in every individual. Our company is dedicated to providing a unique 
          platform that bridges the gap between skilled professionals seeking a second career opportunity
          and companies eager to tap into a diverse pool of talent.At 2 Time Employment Solutions, we 
          believe in the power of second chances and the untapped potential within individuals seeking
          a fresh start. Our company is dedicated to creating opportunities for those who are ready to 
          embark on a new chapter in their professional journey.


          </p>
        </div>
        <img src={JobImg} alt='About' className='w-auto h-[300px]' />
      </div>

      <div className='leading-8 px-5 text-justify'>
        <p>
       <b>Our Mission:</b>
At 2 Time Opportunities, our mission is to redefine the employment landscape by recognizing 
and harnessing the untapped potential of individuals who are ready for a fresh start.
We are committed to creating a positive impact on lives by facilitating meaningful
connections between skilled professionals and forward-thinking employers.<br/>

<b>What Sets Us Apart:</b>

Focus on Second Chances: We understand that career paths are not always linear. 
Our platform is designed to offer a supportive environment for individuals seeking
 a second chance to showcase their skills and contribute to the workforce.

Diverse Talent Pool: We believe in the strength of diversity. Our commitment to inclusivity ensures that companies gain access to a broad range of talented individuals, each bringing a unique set of skills, experiences, and perspectives.

Tailored Matchmaking: Through advanced matching algorithms and personalized assessments, we ensure that candidates are not just matched with any job but are connected with opportunities that align with their skills, interests, and aspirations.
<br/>
<b>For Job Seekers:</b>
If you are ready for a second chance in your career journey, 2 Time Opportunities is here for you. Explore job opportunities that match your skills, receive personalized career guidance, and embark on a new chapter of professional success.
<br/>
For Employers:
Partner with 2 Time Opportunities to access a pool of qualified and motivated individuals ready to contribute their skills to your organization. Benefit from our innovative approach to talent acquisition, ensuring that you find the right fit for your team.
<br/>
Join Us in Transforming Lives:
Whether you are a job seeker or an employer, we invite you to join us in reshaping the narrative around second career opportunities. At 2 Time Opportunities, we believe that everyone deserves a chance to rewrite their story, and we are here to make that happen.

Embrace the power of second chances with 2 Time Opportunities – Where Potential Meets Possibility.
        </p>
      </div>
    </div>
  );
};

export default About;
