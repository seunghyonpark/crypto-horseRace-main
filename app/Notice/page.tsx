'use client';

import SocketEnum from '@/libs/enums/socket';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

//@ts-ignore
import { io } from "socket.io-client";

import API from '@/libs/enums/API_KEY';
import { IUser } from '@/libs/interface/user';
import { getCookie, hasCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

import Link from 'next/link';



import axios from 'axios';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';

import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import HollowCandleStick from "highcharts/modules/hollowcandlestick.js";




// code for web3
import {
    useActiveClaimConditionForWallet,
    useAddress,
    useClaimConditions,
    useClaimedNFTSupply,
    useClaimerProofs,
    useClaimIneligibilityReasons,
    useContract,
    useContractMetadata,
    useUnclaimedNFTSupply,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { BigNumber, utils } from "ethers";
  import { parseIneligibility } from "../../utils/parseIneligibility";
  
  import Modal from '../../components/Modal';


  // Put Your NFT Drop Contract address from the dashboard here
  //const myNftDropContractAddress = "0x90E2dD8C48cA35534Dd70e3eC19B362cdf71981E";
  
  const myNftDropContractAddress = "0x327dA22b2bCdfd6F4EE4269892bd39Fe6c637BcC";
  
  



// Bebas Neue


export default function Notice() {

    const [status, setStatus] = useState<any>();

    const [time, setTime] = useState<any>(0);

    const [horse1Oran, setHorse1Oran] = useState<any>([]);
    const [horse2Oran, setHorse2Oran] = useState<any>([]);

    const [currentPrice, setCurrentPrice] = useState<any>(0);

    const [basePrice, setBasePrice] = useState<any>(0);
    const [longShort, setlongShort] = useState<any>("Long");
    
    const [myBetAmount, setMyBetAmount] = useState<any>("");

    const [socket, setSocket] = useState<any>();

    const [username, setUsername] = useState<any>();
    
    const MySwal = withReactContent(Swal);

    const router = useRouter();

    const [craUsdt, setCraUsdt] = useState<any>();

    const { push } = useRouter();

    
    useEffect(() => {

      const socketIo = io(`${SocketEnum.id}`, {
        transports: ["websocket"],
      });

      socketIo.on("connect", () => {

        console.log("Landing connect");

        console.log("Landing userToken", getCookie('user'));

       
        if (hasCookie('user')) {
 
          const inputs = {
            method: 'getOne',
            API_KEY: API.key,
            userToken: getCookie('user')
          };

          (async () => {

              const res = await fetch('/api/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
              })
              const user = await res.json();
              
              setUsername(user.user.user.username);

              socketIo.emit("user", user.user.user.username);

          })();

        }


      });

      socketIo.on('status', (data: any) => {
          console.log(socketIo.id + " Landing status", data);

          setStatus(data);

          /*
          if (data === true) {
              setBasePrice(currentPrice);
          }
          */

          //setStatus(true);
      });

      /*
      socketIo.on('time', (data: any) => {
          console.log("Landing time", data);
          setTime(data)
      });
      */


      socketIo.on('horse1Orana', (data: any) => {
          console.log("Landing horse1Orana", data);
          setHorse1Oran(data)
      });

      socketIo.on('horse2Orana', (data: any) => {
          console.log("Landing horse2Orana", data);
          setHorse2Oran(data)
      });
  
      
      socketIo.on('price', (data: any) => {

          setCurrentPrice(data.price);

      });


      socketIo.on('cra_usdt', (data: any) => {
        ///console.log(socket.id + " cra_usdt price", data[0]?.ticker?.latest);

        setCraUsdt(data[0]?.ticker?.latest);
        


      });



      socketIo.on('logout', (data: any) => {
        console.log(socketIo.id + " Landing logout", data);

        
        socketIo.disconnect();

      });



      

      /*
      if (socket) {
        socket.disconnect();
      }
      */
      

      setSocket(socketIo);
    
    /////}, [router]);
    }, []);


    if (typeof Highcharts === "object") {
      // init the module
      Indicators(Highcharts);
      DragPanes(Highcharts);
      AnnotationsAdvanced(Highcharts);
      PriceIndicator(Highcharts);
      FullScreen(Highcharts);
      StockTools(Highcharts);
      HollowCandleStick(Highcharts);
    }






///const [chartData, setChartData] = useState<any>();


  useEffect(() => {

    
    setTimeout(() => {
      ////push( '/' );
    }, 10000);

  });




  const [showModal, setShowModal] = useState(false);


    
    return (
        <>

        <div className='flex w-full h-full items-center justify-center pt-28 '>      

          <Image
            src="/notice.jpg"
            alt="Picture of the author"
            width={500}
            height={500}
          />


        </div>


        </>

    )
}
