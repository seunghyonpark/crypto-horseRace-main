'use client';
import API from '@/libs/enums/API_KEY';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import { GridColDef, GridValueGetterParams, DataGrid, GridApi, GridCellValue } from '@mui/x-data-grid';
import { hasCookie, getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { IUser } from "@/libs/interface/user";

import { Stack, Snackbar, Alert } from "@mui/material";

import { useQRCode } from 'next-qrcode';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


import dynamic from "next/dynamic";
import { array } from 'yup';

const CC = dynamic(() => import("@/components/copy-clipboard").then(mod => mod.CopyClipboard), { ssr: false })



const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



const columnsReferral: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        flex: 0.01,
        minWidth: 50,
        align: "center",
        headerAlign: "center",
    },
    {
        field: "username",
        headerName: "Nick Name",
        align: "center",
        headerAlign: "center",
        type: "number",
        flex: 0.2,
        minWidth: 100,

    },
    {
        field: "betCount",
        type: "number",
        headerName: "Bet Cnt",
        flex: 0.1,
        minWidth: 60,
        align: "right",
        headerAlign: "center",
    },
    {
        field: "betAmount",
        type: "number",
        headerName: "Bet Amount",
        flex: 0.1,
        minWidth: 100,
        align: "right",
        headerAlign: "center",
        valueFormatter: (params) => {
            return new Number(params.value).toFixed(0);
        },
    },
    {
        field: "prizeAmount",
        type: "number",
        headerName: "Prize",
        flex: 0.1,
        minWidth: 100,
        align: "right",
        headerAlign: "center",
        valueFormatter: (params) => {
            return new Number(params.value).toFixed(0);
        },
    },
    {
        field: "prizeFee",
        type: "number",
        headerName: "Fee",
        flex: 0.1,
        minWidth: 100,
        align: "right",
        headerAlign: "center",
        valueFormatter: (params) => {
            return new Number(params.value).toFixed(0);
        },
    },

    {
        field: "rewardAmount",
        type: "number",
        headerName: "Reward",
        flex: 0.1,
        minWidth: 100,
        align: "right",
        headerAlign: "center",
        valueFormatter: (params) => {
            return new Number(params.value).toFixed(0);
        },
    },

];

const columnsReward: GridColDef[] = [

    {
        field: "username",
        headerName: "Nick Name",
        align: "center",
        headerAlign: "center",
        type: "number",
        flex: 0.2,
        minWidth: 120,

    },

    {
        field: "resultAmount",
        type: "number",
        headerName: "RESULT",
        flex: 0.1,
        minWidth: 130,
        align: "right",
        headerAlign: "center",

        renderCell: (params) => {

            if (params.value < 0) {
                return (

                    <div className='w-full flex flex-row font-bold items-right '>
                        <div className='w-full text-right text-white '>
                            - {Number(Math.abs(params.value)).toFixed(0)} 
                        </div>
                        <div className='w-[80px] text-white text-right '>
                            LOSE
                        </div>
                    </div>
                );

            } else if (params.value > 0) {
                return (
                    <div className='w-full flex flex-row font-bold items-right'>
                        <div className='w-full text-right justify-end text-white '>
                            + {Number(params.value).toFixed(0)}
                        </div>
                        <div className='w-[80px] text-white text-right '>
                            WIN
                        </div>
                    </div>
                );
            }
        },
        
    },
    {
        field: "prizeFee",
        type: "number",
        headerName: "Fee",
        flex: 0.1,
        minWidth: 60,
        align: "right",
        headerAlign: "center",
        valueFormatter: (params) => {
            return new Number(params.value).toFixed(0);
        },
    },

    {
        field: "referralReward",
        type: "number",
        headerName: "Reward",
        flex: 0.1,
        minWidth: 80,
        align: "right",
        headerAlign: "center",
        valueFormatter: (params) => {
            return new Number(params.value).toFixed(0);
        },
    },

 
    {
        field: "date",
        headerName: "DATE",
        align: "center",
        headerAlign: "center",
        width: 160,
        type: "dateTime",
        minWidth: 150,
        valueFormatter: (params) => {

            var date = new Date(params.value);
        
            return format(date, "yyyy.MM.dd HH:mm:ss");

            //return new Date(params.value).toLocaleString();

        }, // burada tarih formatı değiştirilebilir.
    },


];



export default function ReferralList() {

    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any>();

    const [wallet, setWallet] = useState<any>(null);
    const [user, setUser] = useState<IUser>();


    const [succ, setSucc] = React.useState(false);
    const [err, setErr] = React.useState(false);
    const [errMsgSnackbar, setErrMsgSnackbar] = useState<String>("");
    const [successMsgSnackbar, setSuccessMsgSnackbar] = useState<String>("");

    const [mobileNumber, setMobileNumber] = useState<any>(null);
    const [authCodeState, setAuthCodeState] = React.useState(false);
    const [authCode, setAuthCode] = useState<any>(null);

    const [promitonLink, setPromotionLink] = useState<any>(null);


    const [referrals, setReferrals] = useState<any>([]);
    const [rewards, setRewards] = useState<any>([]);




    function duzenle(e: any) {
        setSelectedUser(e)
        handleClickOpen()
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {

        const getAllUserByReferral = async () => {

            const res = await fetch('/api/bethistory', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: "getAllRewardForReferral",
                    API_KEY: process.env.API_KEY,
                    referral: user?.referralCode,
                }),
            })
            const data = await res.json();
    
            console.log("referrals=>", data.reward );
    
            setReferrals(data.reward);

        }

        /*
        const getAllRewardByReferral = async () => {

            const res = await fetch('/api/bethistory', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    method: "getAllforReferral",
                    API_KEY: process.env.API_KEY,
                    referral: user?.referralCode,
                }),
            })
            const data = await res.json();
    
            ////console.log("referrals=>", data.users.users );
    
            setRewards(data.betHistory);

        }
        */

        if (user) {
            getAllUserByReferral();
            ////getAllRewardByReferral();
        }
        
    }, [user])


    const getUser = async () => {
        if (hasCookie("user")) {
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
            setWallet(user.user.user.walletAddress)
            setPromotionLink("https://craclegamez.io/myPage/register?referral=" + user.user.user.referralCode);
        }
    }


    useEffect(() => {

        if (hasCookie("user") && !user) {
            getUser();
        }
        
    }, [user])





    const { Canvas } = useQRCode();

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



      const sendAuthCode = async () => {

        if (!mobileNumber) {
            setErrMsgSnackbar("Mobile Number is required");
            handleClickErr();

            return;
        }
    
        const formInput = {
            method: 'sendAuthCode',
            API_KEY: process.env.API_KEY,
            userToken: getCookie("user"),
            mobileNumber: mobileNumber,
        };
        fetch("/api/sms", {
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



    const updateWalletAddress = async () => {

        if (!mobileNumber) {
            setErrMsgSnackbar("Mobile Number is required");
            handleClickErr();

            return;
        }

        if (!authCode) {
            setErrMsgSnackbar("Auth Code is required");
            handleClickErr();

            return;
        }
    
        const formInput = {
            method: 'updateWalletAddress',
            API_KEY: process.env.API_KEY,
            userToken: getCookie("user"),
            authCode: authCode,
        };
        fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formInput),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.user) {
    
              getUser();
    
              setSuccessMsgSnackbar(data.message);
              handleClickSucc();
    
            } else {
    
              setErrMsgSnackbar(data.message);
              handleClickErr();
    
            }
    
        });
    
      }


    const rowsReferral = referrals?.map((item: any, i: number) => {
        return {
            kayitId: item._id,
            id: i,
            username: item._id,
            betCount: item.betCount,
            betAmount: item.betAmount,
            prizeAmount: item.prizeAmount,
            prizeFee: item.prizeFee,
            rewardCount: item.rewardCount,
            rewardAmount: item.rewardAmount,
        }
      })

      

    const rowsReward = rewards.map((item: any, i: number) => {
        return {
            kayitId: item._id,
            id: i,
            betAmount: item.betAmount,
            basePrice: item.basePrice,
            prizeAmount: item.prizeAmount,
            resultAmount: item.prizeAmount - item.betAmount,
            prizeFee: item.prizeFee,
            selectedSide: item.selectedSide,
            closePrice: item.closePrice,
            winnerHorse: item.winnerHorse,
            date: item.date,
            username: item.username,
            userToken: item.userToken,
            referral: item.referral,
            referralReward: item.referralReward,
        }
    })



    return (
        <>
            <div className='flex flex-col p-10 mt-0 text-gray-800'>


                <h1 className='font-bold italic text-2xl text-gray-200'>Referral Link
                </h1>
                
                <div className="w-full border rounded-lg flex flex-col items-center justify-center p-2 gap-5 py-10">

                    <h4 className="text-white">Referral Code</h4>

                    <div className='w-full max-w-xs md:w-1/2 '>

                        <input
                            ///type="number"
                            placeholder="Referral Code"
                            id="referralCode"
                            ///value={depositCount}
                            defaultValue={user?.referralCode}

                            //onChange={(e) => {
                            //    setDepositCount(e.target.value);
                            //}}

                            className="input input-bordered w-full max-w-xs text-gray-800 text-xl font-bold mb-1"
                        />

                    </div>


                    {user?.referralCode &&
                        <>
                            <div className='w-full flex flex-row items-center justify-center centent-center'>
                                {/*
                                <CC content={user?.walletAddress}/>
                                */}

                                <Button
                                    color="success" variant='contained' className='bg-green-500'
                                    onClick={() =>
                                        {
                                        navigator.clipboard.writeText(user?.referralCode);
                                        setSucc(true);
                                        setSuccessMsgSnackbar("Your referral code is [" + user?.referralCode + "] copied to clipboard");
                                        }
                                    }
                                >
                                    Copy
                                </Button>
                            </div>

                        </>
                    }



<h4 className="text-white mt-2">Custom Promotion Link</h4>

<div className='w-full max-w-xs md:w-1/2 '>

    <textarea
        ///type="number"
        placeholder="Promotion Link"
        id="promotionLink"
        ///value={depositCount}
        defaultValue={promitonLink}



        //onChange={(e) => {
        //    setDepositCount(e.target.value);
        //}}
        rows={3}
        className="block pt-1 input input-bordered w-full max-w-xs text-gray-800 text-sm mb-1"
    />

</div>


{user?.referralCode &&
    <>
        <div className='w-full flex flex-row items-center justify-center centent-center'>
            {/*
            <CC content={user?.walletAddress}/>
            */}

            <Button
                color="success" variant='contained' className='bg-green-500'
                onClick={() =>
                    {
                    navigator.clipboard.writeText(promitonLink);
                    setSucc(true);
                    setSuccessMsgSnackbar("Your promotion link is copied to clipboard");
                    }
                }
            >
                Copy
            </Button>
        </div>

    </>
}

                </div>



                
                <h1 className='mt-5 font-bold italic text-2xl text-white'>My Referrals</h1>
                <div style={{ width: "100%", height: 600, color: "white" }}>

                {rowsReferral && (
                    <DataGrid
                        rows={rowsReferral}
                        columns={columnsReferral}
                        pageSize={9}
                        rowsPerPageOptions={[10]}
                        hideFooterSelectedRowCount
                        sx={{
                            color: "white",
                        }}
                    />
                )}

                </div>


                <h1 className='mt-5 font-bold italic text-2xl text-white'>My Rewards</h1>
                <div style={{ width: "100%", height: 600, color: "white" }}>

                {rowsReward && (
                    <DataGrid
                        rows={rowsReward}
                        columns={columnsReward}
                        pageSize={9}
                        rowsPerPageOptions={[10]}
                        hideFooterSelectedRowCount
                        sx={{
                            color: "white",
                        }}
                    />
                )}

                </div>

            </div>



    <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={succ}
          autoHideDuration={6000}
          onClose={handleCloseSucc}
        >
          <Alert
            onClose={handleCloseSucc}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMsgSnackbar}
          </Alert>
        </Snackbar>
        <Snackbar open={err} autoHideDuration={6000} onClose={handleCloseErr}>
          <Alert
            onClose={handleCloseErr}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errMsgSnackbar}
          </Alert>
        </Snackbar>
      </Stack>


        </>
    )
}

