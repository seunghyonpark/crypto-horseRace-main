'use client';
import { Tooltip } from '@mui/material';
import React, { useEffect, useState } from "react";
import { hasCookie, getCookie } from 'cookies-next';

import { useRouter, useSearchParams } from 'next/navigation';

import API from "@/libs/enums/API_KEY";
import { IUser } from "@/libs/interface/user";
import DomainEnum from "@/libs/enums/domain";

import Button from "@mui/material/Button";

import MuiAlert, { AlertProps } from "@mui/material/Alert";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";

import { VscGear, VscCheck } from "react-icons/vsc";

import { useFormik } from "formik";
import * as Yup from "yup";


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
////import 'swiper/swiper.scss';
import "swiper/swiper.min.css";



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


// Yup schema to validate the form
const schemaUsername = Yup.object().shape({
    username: Yup.string()
        .required(),
});



export default function MyPage() {

    const router = useRouter();


    const [user, setUser] = useState<IUser>();
    const [settings, setSettings] = useState<any>();


    const MySwal = withReactContent(Swal);

    const [succ, setSucc] = React.useState(false);
    const [err, setErr] = React.useState(false);
    const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
    const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");

    const [authCodeState, setAuthCodeState] = React.useState(false);
    const [authCode, setAuthCode] = useState<any>(null);

    const [emailVerified, setEmailVerified] = React.useState(false);
    
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

      setEmailVerified(user.user.user.emailVerified)
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

    };



    const sendAuthCodeByEmail = async () => {

      let userToken = crypto.randomUUID();
  
      const formInput = {
          method: 'sendAuthCodeByEmail',
          API_KEY: process.env.API_KEY,
          email: user?.email,
          userToken: userToken,
      };
      fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formInput),
      })
      .then((res) => res.json())
      .then((data) => {

          if (data.data) {
  
              setSuccessMsgSnackbar(data.message);
              handleClickSucc();

              setAuthCodeState(true);
  
          } else {
  
              setErrMsgSnackbar(data.message);
              handleClickErr();
  
          }
  
      });
  
    }


    const verifyUserByEmail = async () => {
    
      const formInput = {
          method: 'verifyUserByEmail',
          API_KEY: process.env.API_KEY,
          email: user?.email,
          authCode: authCode,
      };
      fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formInput),
      })
      .then((res) => res.json())
      .then((data) => {

          console.log("verifyUserByEmail", data);

          if (data?.status) {

              ///alert("success");
  
              ////setSuccessMsgSnackbar(data.message);
              ////handleClickSucc();

              setEmailVerified(true);
  
          } else {

              setErrMsgSnackbar("Invalid Auth Code");
              handleClickErr();
  
          }
  
      });
  
    }



    const handleClickSucc = () => {
      setSucc(true);
    };

    const handleCloseSucc = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSucc(false);
    };

    const handleClickErr = () => {
        setErr(true);
    };

    const handleCloseErr = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setErr(false);
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

            const formInput = {
                method: 'updatePassword',
                API_KEY: process.env.API_KEY,
                userToken: getCookie('user'),
                currentPassword: currentPassword,
                pass1: pass1,
                pass2: pass2,
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
                        router.push("/");
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



    // Formik hook to handle the form state
    const formikUsername = useFormik({
        
        ////console.log("useFormik===========");

        initialValues: {
            username: "",
        },

        // Pass the Yup schema to validate the form
        validationSchema: schemaUsername,

        // Handle form submission
        onSubmit: async ({ username}) => {
            // Make a request to your backend to store the data

            const formInput = {
                method: 'updateUsername',
                API_KEY: process.env.API_KEY,
                userToken: getCookie('user'),
                username: username,
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
                        router.push("/");
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

    ////const { errorsUsername, touchedUsername, valuesUsername, handleChangeUsername, handleSubmitUsername } = formikUsername;
    ///const { handleChange, handleSubmit } = formikUsername;

    ///const { errorsUsername, touchedUsername, valuesUsername, handleChangeUsername, handleSubmitUsername } = formikUsername;

    

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
      props,
      ref
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });


    return (
        <>
            <div className='flex flex-col items-center p-5 w-full h-full gap-10 text-white'>
                <h1 className='font-bold italic text-2xl w-full text-start'>Poker</h1>
                




                <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                    >
                    <SwiperSlide>Slide 1</SwiperSlide>
                    <SwiperSlide>Slide 2</SwiperSlide>
                    <SwiperSlide>Slide 3</SwiperSlide>
                    <SwiperSlide>Slide 4</SwiperSlide>
                    ...
                </Swiper>


            </div>
        </>
    )
}
