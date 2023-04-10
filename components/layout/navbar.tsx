'use client';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import API from '@/libs/enums/API_KEY';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import Coin from '@/libs/enums/coin.enum';
import { IUser } from '@/libs/interface/user';
import MobilNavbar from './mobilNavbar';
import { useRouter } from 'next/navigation';


import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import Modal from '../../components/Modal';

//@ts-ignore
import { io } from "socket.io-client";
import SocketEnum from '@/libs/enums/socket';

import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function Navbar() {

    const router = useRouter();
    const [user, setUser] = useState<IUser>();

    const [craUsdt, setCraUsdt] = useState<any>();



    useEffect(() => socketInitializer(), []);

    const socketInitializer = () => {

      const socket = io(`${SocketEnum.id}`, {
          transports: ["websocket"],
      });

      socket.on("connect", () => {
          console.log("mobileNavbar connect");
      });

      socket.on('status', (data: any) => {
          console.log("mobileNavbar status", data);
          //setStatus(true);
      });

      socket.on('time', (data: any) => {
          console.log("mobileNavbar time", data);
          //setTime(data)
      });

      socket.on('horse1Orana', (data: any) => {
          console.log("mobileNavbar horse1Orana", data);
          //setHorse1Oran(data)
      });

      socket.on('horse2Orana', (data: any) => {
          console.log("mobileNavbar horse2Orana", data);
          //setHorse2Oran(data)
      });
   
      
      socket.on('price', (data: any) => {
          //console.log(socket.id + " mobileNavbar price", data.price);
          
          //setCurrentPrice(data.price);

      });

      socket.on('prize', (data: any) => {
        console.log(socket.id + " mobileNavbar prize", data);
        

        //setErrMsg(data);
        //setErr(true);
        //❤️songpalabs❤️

        setSuccessMsg(data.username + ": ❤️" + data.amount + "❤️ CRA");
        setSucc(true);

        //setCurrentPrice(data.price);


      });

      socket.on('winner', (data: any) => {
        console.log(socket.id + " mobileNavbar winner", data);
        
        //setCurrentPrice(data.price);
      });


      socket.on('cra_usdt', (data: any) => {
        ///console.log(socket.id + " cra_usdt price", data[0]?.ticker?.latest);

        setCraUsdt(data[0]?.ticker?.latest);
        


      });


    }



    const [succ, setSucc] = useState(false);
    const [err, setErr] = useState(false);
    const [successMsg, setSuccessMsg] = useState<String>("");
    const [errMsg, setErrMsg] = useState<String>("");

    const handleClickSucc = () => {

      setSuccessMsg("ok");
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

        setErrMsg("ok");
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



    const getUser = async () => {
        const inputs = {
            method: 'getOne',
            API_KEY: process.env.API_KEY,
            userToken: getCookie('user')
        }
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputs)
        })
        const user = await res.json();

        console.log("=====navbar user", user);

        setUser(user?.user?.user);
        
    }



    const [wallet, setWallet] = useState<any>(null);


    const [game, setGame] = useState<any>();

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (hasCookie("user") && !user) {
            setInterval(() => {
                getUser()
            }, 5 * 1000)
        }
    })


    useEffect(() => {


        const getGame = async () => {
          const res = await fetch('/api/game', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              cache: 'no-store',
              body: JSON.stringify({
                  method: "getGameByUsername",
                  API_KEY: process.env.API_KEY,
                  username: user?.username,
              })
          })
          const data = await res.json()
    
         
          setGame(data.game)
        }
  
  
        if (hasCookie("user") && user) {
                getGame();
        }
  
        setWallet(user?.nftWalletAddress);
  
      }, [user]);


    return (
        <>
            {/* //? LG Screen üstü görüntü */}
            <div className="hidden items-center justify-center w-full h-20 bg-[#000000] sticky top-0 z-50 
                lg:flex
                ">

<div className="flex w-[800px] items-center justify-center p-5">


                <div className="flex flex-col gap-3 items-center justify-center w-[200px] absolute top-2 bg-[#000000] rounded-lg h-full z-50 
                     
                     ">
                    <Link href={"/Landing"} className="hover:opacity-50">
                        <Image src={"/cracle_ci.png"} alt="" width={25} height={25} />
                    </Link>

                    {/*
                    <div className=" font-normal text-xs text-gray-200 tracking-widest">Change Your Life</div>
                    */}

                    
                    <div className="flex w-[250px] items-center justify-center text-white text-l font-bold">
                        CRACLE X2E
                    </div>
            
                </div>


                <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="flex w-full bg-[#000000] text-[11px] h-[30px] relative ">
                        

                        <div className="marquee-container relative w-full">
                            <div className="marquee ">
{/*
                                <span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet culpa voluptates quis incidunt officiis optio fugiat voluptatum enim aliquid reprehenderit, praesentium repudiandae cum velit quos dicta eum quasi suscipit consectetur.
                                </span>
                */}

                            </div>
                            <div className="marquee marquee2 ">

{/*                                
                                <span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum perferendis eveniet inventore est velit ad modi ratione repellat doloremque dicta quod asperiores numquam dignissimos quo, reprehenderit ex rem nulla ipsam!
                                </span>
*/}

                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-full h-[50px] bg-[#000000] px-3 ">
                        
                        <button className="hover:opacity-50">


                        {user && !game &&
                            <Image
                            src={user?.img}
                            width={30}
                            height={30}
                            alt="pfp"
                            className="rounded-md"
                            onClick={() => {
                                router.push('/gameT2E')
                            }}
                            />
                        }
                        

                    {/*
                        user && 
                        <div className="flex flex-row">
                        <Image
                            src={'/metamask.png'}
                            width={20}
                            height={20}
                            alt="pp"
                            className="rounded-full"
                        />
                        
                        <button
                        className={` ml-2 text-[11px] text-orange-500 `}
                        onClick={() => {
                            //deleteCookie('user'), router.push('/')


                        }}
                        >
                            Connect Wallet
                        </button>
                        </div>
                    */}


                        </button>



                        <div className="flex items-center w-full justify-end gap-4">

                            {
                            user && <div
                                className={`flex flex-row items-center justify-center  bg-black rounded-md h-[36px] text-center px-5 text-[#BA8E09] border border-[#BA8E09] `}
                            >

                                <Link
                                    className="pr-5 hover:opacity-50"
                                    href={"/Landing/deposit"}
                                >
                                    <Image src={"/wallet-icon-white.png"} width={20} height={20} alt="logo" />
                                </Link>

                                {Number(user?.deposit).toFixed(0)}
                                
                                
                                &nbsp;<span className="text-[#9293A6]">{" "}{Coin.symbol}</span>
                                

                            </div>
                            }

                            {    
                                !user && <Link
                                    href={"/Landing/login"}
                                    className={`text-[13px] text-[#9293A6]  border-t-2 border-green-500 p-1`}
                                >
                                    Sign In
                                </Link>
                            }
                            
                            {/*
                                
                                !user && <Link
                                    href={"/gameT2E/register"}
                                    className={`text-[13px] text-[#9293A6]  border-t-2 border-yellow-500 p-1`}
                                >
                                    Sign Up
                                </Link>
                                
                        */}


                            {
                                user && <button
                                    //href={"/gameT2E/profile"}
                                    
                                    
                                    className={`flex items-center shadow-xl  justify-center rounded-md p-1 gap-2  h-[36px] px-2 text-[#D4D1CB] text-l`}
                                    onClick={() => setShowModal(!showModal)}
                                >
                                {user?.username}

                                </button>
                            } 


                        </div>
                    </div>
                </div>


                </div>

            </div>



            <Modal
              
              show={showModal}
              onClose={() => setShowModal(false)}
                
            >

            <div className="w-full flex flex-row items-center justify-left gap-1 bg-red-900 ">

              {wallet !== "0x" && 

                  <button
                    className="w-full text-white text-center justify-left pl-3 p-2 items-left bg-red-900 hover:bg-[#141111] flex flex-row"
                    onClick={() => {
                      setShowModal(false), router.push('/Landing/mynft')
                  }}
                  >
                      <Image
                        src={"/metamask-fox.svg"}
                        alt="meta-svg"
                        width={20}
                        height={20}
                      />
                    <h2 className="pl-3 text-left text-xs">
                          <span className="text-[#f5841f]">Connected with</span>
                          <p className="text-sm text-white">{wallet?.slice(0, 5)}...{wallet?.slice(wallet.length - 5, wallet?.length)}</p>
                    </h2>

                  </button>
              }
              {wallet === "0x" && 
          
                    <button
                      className="w-full text-white text-center justify-center p-5 items-center bg-red-900 hover:bg-[#141111] flex flex-row"
                      onClick={() => {
                        setShowModal(false), router.push('/gameT2E/mynft')
                      }}
                      >
                        <Image
                            src={"/metamask-fox.svg"}
                            alt="meta-svg"
                            width={20}
                            height={20}
                        />
                        <h2 className="text-sm pl-3">
                            <span className="text-[#f5841f]">METAMASK</span> CONNECT
                        </h2>
                    </button>
           
              }

            </div>


            <div className='flex flex-col pl-5 pr-3 mt-3 text-gray-200 '>


              <div className="w-full rounded-lg flex flex-col items-center justify-center pt-2 gap-1">                                    
                  
                  <div className="w-full rounded-lg flex flex-row items-center justify-left  gap-1 ">

                    {user && <Image
                        src={user?.img}
                        width={90}
                        height={90}
                        alt="pfp"
                        className="rounded-md"
                    />}

                    <div className="w-full rounded-lg flex flex-col items-center justify-left p-2 gap-1 ">
                      <div className='text-xs'>Equity Value (CRA)</div>

                      <div className='text-xl font-extrabold'>
                        {`${Number(user?.deposit).toFixed(0)}`}
                      </div>

                      <div className='text-sm font-extrabold'>

                      =&nbsp;{ user?.deposit ? `${Number(user?.deposit * craUsdt).toFixed(0)}` : `0`}&nbsp;&nbsp;<span className="text-[8px] text-green-500">USDT</span>
                      
                      </div>

                      {user &&
                      <button
                          className={`text-[12px] text-red-500`}
                          onClick={() => {
                            setShowModal(false);
                            deleteCookie('user');
                            //////getUser();
                            router.push('/gameT2E');
                          }}
                      >
                          Log Out
                      </button>
                      }
                    </div>
                                                        
                  </div>


                  <button
                    className={` w-full pt-3 items-left text-l text-white`}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E/depositRequests')
                    }}
                    >
                      Deposit
                  </button>

                  <button
                    className={`w-full pt-1 items-left text-l text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E/withdrawRequests')
                    }}
                    >
                      Withdrawal
                  </button>

                  <button
                    className={`w-full pt-1 items-left text-l text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E/betHistory')
                    }}
                    >
                      Bet History
                  </button>

                  <button
                    className={` disabled pt-1 w-full items-left text-l text-white `}
                    onClick={() => {
                        setShowModal(false), router.push('/gameT2E')
                    }}
                    >
                      Game Ranking
                  </button>

{/*
                  <button
                    className={` btn btn-success w-full`}
                    onClick={() => {
                      
                        ///setShowModal(false), deleteCookie('user'), router.push('/gameT2E')
                    }}
                    >
                        How to Bet in T2E Game?
                  </button>
                  */}

              </div>

            </div>

            </Modal>



            <Stack spacing={2} sx={{ width: "100%" }}>

              <Snackbar
                  open={succ}
                  autoHideDuration={6000}
                  onClose={handleCloseSucc}
              >
                  <Alert
                      onClose={handleCloseSucc}
                      severity="info"
                      sx={{ width: "100%" }}
                  >
                      {successMsg}
                  </Alert>
              </Snackbar>

              <Snackbar open={err} autoHideDuration={6000} onClose={handleCloseErr}>
                  <Alert
                      onClose={handleCloseErr}
                      severity="error"
                      sx={{ width: "100%" }}
                  >
                      {errMsg}
                  </Alert>
              </Snackbar>
            </Stack>    



            {/* //? Mobil Navbar */}
            
            <MobilNavbar user={user} />
                        


        </>
    )
}


