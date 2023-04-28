'use client';
import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from "react";
import { hasCookie, getCookie } from 'cookies-next';

import { useRouter, useSearchParams } from 'next/navigation';

import API from "@/libs/enums/API_KEY";
import { IUser } from "@/libs/interface/user";
import DomainEnum from "@/libs/enums/domain";



import { useFormik } from "formik";
import * as Yup from "yup";


// Yup schema to validate the form
const schema = Yup.object().shape({

    currentPassword: Yup.string()
        .required(),
        ///.min(7),
    pass1: Yup.string()
        .required()
        .min(7),
    pass2: Yup.string()
        .required()
        .min(7),
});





export default function MyPage() {

    const router = useRouter();


    const [user, setUser] = useState<IUser>();
    const [settings, setSettings] = useState<any>();
    
    const getUser = async () => {
      const inputs = {
        method: 'getOne',
        API_KEY: API.key,
        userToken: getCookie('user')
      }
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })
      const user = await res.json()
      setUser(user.user.user)
    }
    
    const getSettings = async () => {
      const res = await fetch(DomainEnum.address + '/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: "get",
          API_KEY: process.env.API_KEY,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await res.json();
      if (data.status === false) {
        return
      } else {
        setSettings(data.settings[0]);
      }
    }
    
    
    useEffect(() => {
      getUser();
      getSettings();
    }, [])


    const verify = async () => {



      const inputs = {
        method: 'verifyEmail',
        API_KEY: API.key,
        userToken: getCookie('user')
      }
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      })
      const user = await res.json()
      
      console.log("verify user ", user);

      



      /*
      try {
        setStatus('loading');
        await fetcher('/api/gooduser/email/verify', { method: 'POST' });
  
        toast.success(
          'An email has been sent to your mailbox. Follow the instruction to verify your email.'
        );
        setStatus('success');
  
      } catch (e) {
        toast.error(e.message);
        setStatus('');
      }
      */
  
    };



    // Formik hook to handle the form state
    const formik = useFormik({
        
        ////console.log("useFormik===========");

        initialValues: {
            currentPassword: "",
            pass1: "",
            pass2: "",
        },

        // Pass the Yup schema to validate the form
        validationSchema: schema,

        // Handle form submission
        onSubmit: async ({ currentPassword, pass1, pass2}) => {
            // Make a request to your backend to store the data

            let userToken = getCookie("admin");


            //console.log("pass1: " + pass1)
            //console.log("pass2: " + pass2)
            //console.log("userToken: " + userToken)



            const formInput = {
                method: 'updatePassword',
                API_KEY: process.env.API_KEY,
                currentPassword: currentPassword,
                pass1: pass1,
                pass2: pass2,
                userToken: userToken,
            };
            fetch("/api/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formInput),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        alert(data.message);
                        //handleClickSucc();
                        router.push("/admin");
                    }
                    else {

                        alert(data.message);
                        //setErrMsg(data.message);
                        //handleClickErr();
                    }
                    //todo
                    // handleClickSucc();
                });


        },
    });

    // Destructure the formik object
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    
    return (
        <>
            <div className='flex flex-col items-center p-5 w-full h-full gap-10 text-white'>
                <h1 className='font-bold italic text-2xl w-full text-start'>My Page</h1>
                <div className='flex flex-col lg:flex-row gap-5  justify-center w-full lg:w-1/3'>

                <div className='flex flex-col p-4 border gap-5 rounded-lg w-full'>
                    <div className='font-medium text-sm text-gray-200'>Email: {user?.email}</div>


                    <div className='font-medium text-sm text-gray-200'>Email Verified:
                      {
                        (user?.emailVerified === true) ?
                        ( <span className='text-green-500'> Verified</span> ) :
                        (
                          <>
                            <span className='text-red-500'> Not Verified</span>
                            &nbsp;&nbsp;
                            <button className='btn btn-primary' onClick={() => verify()}>Verify Email</button>
                          </>
                        )
                      }
                    </div>

                    <div className='font-medium text-sm text-gray-200'>Nick Name: {user?.username}</div>
                    <button className='btn btn-primary' onClick={() => router.push('/myPage/referral')}>Referrals</button>
                </div>

                    {/* //? Password Settings */}
                    <div className='flex flex-col p-4 border gap-5 rounded-lg w-full'>
                        <h2 className='font-medium text-xl text-gray-200'>Change Password</h2>


                        <form
                            className="mt-1"
                            onSubmit={handleSubmit} method="POST">

                            <div className='flex flex-col gap-2'>

                                <label className='mt-5'>Current password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    id='currentPassword'
                                    className='input border-white border placeholder:text-gray-500 italic'
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                />
                                {errors.currentPassword && touched.currentPassword && <span>{errors.currentPassword}</span>}


                                <label className='mt-5'>New password</label>
                                <input
                                    type="password"
                                    name="pass1"
                                    id='pass1'
                                    className='input border-white border placeholder:text-gray-500 italic'
                                    value={values.pass1}
                                    onChange={handleChange}
                                />
                                {errors.pass1 && touched.pass1 && <span>{errors.pass1}</span>}


                                <label className='mt-5'>Re-enter new password</label>
                                <input
                                    type="password"
                                    name="pass2"
                                    id='pass2'
                                    className='input border-white border placeholder:text-gray-500 italic'
                                    value={values.pass2}
                                    onChange={handleChange}
                                />
                                {errors.pass2 && touched.pass2 && <span>{errors.pass2}</span>}

                            </div>


                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-600 text-white text-center justify-center m-5 p-5 rounded-md ">
                                    Submit
                            </button>

                        </form>

                    </div>



                    {/* //? Password Settings */}
                    <div className='flex flex-col p-4 border gap-5 rounded-lg w-full'>
                      <h2 className='font-medium text-xl text-gray-200'>Change Nick Name</h2>

                      <form
                          className="mt-1"
                          onSubmit={handleSubmit} method="POST">

                          <div className='flex flex-col gap-2'>

                              <label className='mt-5'>Current Nick Name</label>
                              
                              <div
                                  className=' border-white placeholder:text-gray-500 italic'
                              >
                              {user?.username}

                              </div>

                              <label className='mt-5'>New Nick Name</label>
                              <input
                                  type="text"
                                  name="username"
                                  id='username'
                                  className='input border-white border placeholder:text-gray-500 italic'
                                  ///value={values.username}
                                  onChange={handleChange}
                              />
                              {errors.pass1 && touched.pass1 && <span>{errors.pass1}</span>}

                          </div>


                          <button
                              type="submit"
                              className="bg-green-500 hover:bg-green-600 text-white text-center justify-center m-5 p-5 rounded-md ">
                                  Submit
                          </button>

                      </form>

                    </div>


                </div>

            </div>
        </>
    )
}
