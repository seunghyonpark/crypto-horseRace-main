'use client';

import { Inter } from '@next/font/google'
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
//import YuruyenAt from '@/components/betEkrani/yuruyenAt';

import Footer from "@/components/layout/footer";



const inter = Inter({ subsets: ['latin'] });



export default function Home() {

  return (

    <main className={inter.className}>

      <div className="bg-[#0C0E1A] text-lg">
        <div className="w-full h-full flex flex-col ">
          <div className="flex">
            <div className="flex flex-col w-full min-h-screen h-full">
              
              <div className='w-full h-5 lg:h-16'></div>

              <div style={{ minHeight: "calc(100vh - 12rem)" }}>

                <div className="bg-center bg-no-repeat bg-contain bg-[url(/back.svg)] h-full">

                  <div className="
                    flex flex-col items-center justify-center gap-14 lg:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full
                  ">

                    <h1 className='text-white text-center w-full text-lg font-bebasNeue md:text-3xl'>Cracle Games</h1>



                  <div className="border border-gray-500 p-10 m-10 rounded-md
                    flex flex-col items-center justify-center gap-14 lg:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full
                  ">

                    <Image src="/mint_main.gif" width={500} height={500} alt="NFT" />

                    <p className='text-white text-center w-full text-lg font-bebasNeue md:text-3xl'>
                      Mint your CRACLE Rabbit NFT.
                    </p>
                    <Link href={"/"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">Comming Soon</span>
                    </Link>

                  </div>


                  <div className="border border-gray-500 p-10 m-10 rounded-md
                    flex flex-col items-center justify-center gap-14 lg:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full
                  ">

                    <Image src="/gameT2E.png" width={500} height={500} alt="gameT2E" />

                  {/*
                    <Link href={"/hipodrom"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">Go To Hipodrom</span>
                    </Link>
                  */}

                    <p className='text-white text-center w-full text-lg font-bebasNeue md:text-3xl'>
                      CRACLE T2E is a Long/Short trading game.<br></br>You can earn more $CRA by winning this game.
                    </p>

                    <Link href={"https://demo.craclegamez.io/gameT2E"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">Demo Play</span>
                    </Link>
                    <Link href={"/gameT2E"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">Play Now</span>
                    </Link>
                  </div>




                  <div className="border border-gray-500 p-10 m-10 rounded-md
                    flex flex-col items-center justify-center gap-14 lg:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full
                  ">

                    <Image src="/gameP2E.jpg" width={500} height={500} alt="gameP2E" />

                    <p className='text-white text-center w-full text-lg font-bebasNeue md:text-3xl'>
                      CRACLE P2E is a race horse game.<br></br>You can earn more $CRA by playing this game.
                    </p>
                    <Link href={"/"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">Comming Soon</span>
                    </Link>

                  </div>
                


                  <div className="border border-gray-500 p-10 m-10 rounded-md
                    flex flex-col items-center justify-center gap-14 lg:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full
                  ">

                    <Image src="/gameClumsybird.png" width={500} height={500} alt="gameClumsybird" />

                    <p className='text-white text-center w-full text-lg font-bebasNeue md:text-3xl'>
                      Clumsy Bird is a casual game.<br></br>You can earn more $CRA by playing this game.
                    </p>
                    <Link href={"/"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">Comming Soon</span>
                    </Link>

                  </div>

                  <div className="border border-gray-500 p-10 m-10 rounded-md
                    flex flex-col items-center justify-center gap-14 lg:py-10 bg-gradient-radial from-transparent via-[#0C0E1A] to-transparent bg-blend-difference h-full
                  ">

                    <Image src="/gameCryptoPlinko.png" width={500} height={500} alt="gameClumsybird" />

                    <p className='text-white text-center w-full text-lg font-bebasNeue md:text-3xl'>
                      Crypto Plinko is a casual game.<br></br>You can earn more $CRA by playing this game.
                    </p>
                    <Link href={"/"} className="w-64 h-16 bg-gradient-to-r from-[#08FF08] to-[#008013] rounded-lg flex items-center justify-center">
                      <span className="text-gray-200 text-2xl ">Comming Soon</span>
                    </Link>

                  </div>


                  


                  </div>

                  <footer>
                    <Footer />
                  </footer>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



    </main>


  )
}
