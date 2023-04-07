'use client';
import Horses from '@/libs/enums/horses.enums';
import SocketEnum from '@/libs/enums/socket';
import { IGame } from '@/libs/interface/game';
import React, { useEffect, useState } from 'react'
//@ts-ignore
import { io } from "socket.io-client";

export default function BetTables() {
    const [games, setGames] = useState<any>()
    const [status, setStatus] = useState<any>()
    const [winner, setWinner] = useState<any>()

    useEffect(() => socketInitializer(), []);

    const socketInitializer = () => {
        const socket = io(`${SocketEnum.id}`, {
            transports: ["websocket"],
        });
        socket.on("connect", () => {
        });

        socket.on('status', (data: any) => { setStatus(data) })

        socket.on("winner", (data: any) => { setWinner(data) })
    };

    const getGames = async () => {
        const res = await fetch('/api/game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            body: JSON.stringify({
                method: "getGames",
                API_KEY: process.env.API_KEY
            })
        })
        const data = await res.json()
        setGames(data.games)
    }

    // const sonuclariBelirle = async () => {

    //     if (winner !== undefined) {
    //         games?.map(async (game: IGame) => {
    //             if (game.selectedSide === winner) {
    //                 const res = await fetch('/api/deposit', {
    //                     method: 'POST',
    //                     headers: { 'Content-Type': 'application/json' },
    //                     body: JSON.stringify({
    //                         method: 'winDeposit',
    //                         API_KEY: process.env.API_KEY,
    //                         userToken: game.userToken,
    //                         deposit: game.betAmount * 2
    //                     })
    //                 })
    //                 const data = await res.json()

    //                 const res2 = await fetch('/api/game', {
    //                     method: 'POST',
    //                     headers: { 'Content-Type': 'application/json' },
    //                     body: JSON.stringify({
    //                         method: 'deleteAll',
    //                         API_KEY: process.env.API_KEY
    //                     })
    //                 })
    //                 const data2 = await res2.json()
    //             }
    //         })
    //     }
    // }


    // useEffect(() => {
    //     sonuclariBelirle()
    // }, [winner])


    useEffect(() => {
        getGames()
    },)

    return (
        <>


        
            <div className='flex flex-col w-full lg:w-2/3 items-center'>
                <div className='grid grid-cols-1 lg:grid-cols-1 w-full gap-3 rounded-lg  text-gray-200'>
                    
                    <div className='w-full flex flex-col items-center border p-2 bg-[#16171c] rounded-lg border-black max-h-[350px] overflow-y-hidden'>
                        
                        <h2 className='border-b w-full text-center text-lg  border-black mb-2 '>Games</h2>

                        <ul className='flex flex-col list-disc'>
                            {
                                games?.map((game: IGame, i: number) => {
                                    /*
                                    if (game.selectedSide === Horses.Horse1) {
                                        return (
                                            <li key={i} >{`${game.username.slice(0, 2)}...${game.username.slice(game.username.length - 2, game.username.length)}`} <span className='text-yellow-500'>{game.betAmount}</span> </li>
                                        )
                                    }
                                    */

                                    return (
                                        <li key={i} >
                                            {`${game.username}`}
                                            &nbsp;<span className='text-yellow-500'>{game.betAmount}</span>
                                            &nbsp;<span className='text-yellow-500'>{game.selectedSide}</span>
                                      
                                        </li>
                                    )

                                })
                            }
                        </ul>
                    </div>





                </div>
            </div>
        </>
    )
}

