'use client';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridValueGetterParams, DataGrid, GridApi, GridCellValue } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import { format } from "date-fns";
import { useRouter, useSearchParams } from 'next/navigation';




const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});



export default function BetHistoryList() {
    const [requests, setRequests] = useState<any>([]);
    const [open, setOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState<any>();

    const { push } = useRouter();

    const columns: GridColDef[] = [
 

        {
            field: "date",
            headerName: "DATE",
            align: "center",
            headerAlign: "center",
            width: 150,
            type: "dateTime",
            minWidth: 100,
            valueFormatter: (params) => {

                var date = new Date(params.value);
            
                return format(date, "yy/MM/dd HH:mm:ss");

                //return new Date(params.value).toLocaleString();

            }, // burada tarih formatı değiştirilebilir.
        },

        {
            field: "betAmount",
            type: "number",
            headerName: "BET",
            flex: 0.1,
            minWidth: 60,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "basePrice",
            type: "number",
            headerName: "ENTRY",
            flex: 0.1,
            minWidth: 80,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "prizeAmount",
            type: "number",
            headerName: "OUTCOME",
            flex: 0.1,
            minWidth: 90,
            align: "center",
            headerAlign: "center",
            
        },
        {
            field: "selectedSide",
            headerName: "L/S",
            align: "center",
            headerAlign: "center",
            flex: 0.2,
            minWidth: 100,
        },
        {
            field: "selectedSide",
            headerName: "RESULTS",
            align: "center",
            headerAlign: "center",
            flex: 0.2,
            minWidth: 100,
        },

        /*
        {
            field: "winnerHorse",
            headerName: "Result",
            align: "center",
            headerAlign: "center",
            flex: 0.1,
            minWidth: 100,

        },
        */



        /*
        {
            field: "action",
            headerName: "Edit",
            align: "center",
            headerAlign: "center",
            sortable: false,
            width: 125,
            renderCell: (params) => {
                const onClick = (e: any) => {
                    e.stopPropagation(); // don't select this row after clicking

                    const api: GridApi = params.api;
                    const thisRow: Record<string, GridCellValue> = {};

                    api
                        .getAllColumns()
                        .filter((c) => c.field !== "__check__" && !!c)
                        .forEach(
                            (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
                        );

                    return duzenle(params.row);
                };
                return (
                    <Button color="success" variant='contained' className='bg-green-500' onClick={onClick}>
                        Edit
                    </Button>
                );
            },
        },
        */

    ];

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


    const requestAccepted = async () => {
        let hash = (document.getElementById("hash") as HTMLInputElement).value;
        let isPay = (document.getElementById("isPay") as HTMLInputElement).checked;

        const formInputs = {
            method: "update",
            _id: selectedUser.kayitId,
            userToken: selectedUser.userToken,
            txHash: hash,
            status: hash.length > 3 && isPay ? "Accepted and Paid" : isPay ? "Accepted" : "Waiting",
            gonderildi: isPay,
            API_KEY: process.env.API_KEY,
        }
        const res = await fetch('/api/bethistory', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs)
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const requestRejected = async () => {

        let isPay = false;
        let hash = "empty";
        let status = "Rejected"

        const formInputs = {
            method: "reject",
            _id: selectedUser.kayitId,
            userToken: selectedUser.userToken,
            txHash: hash,
            status: status,
            gonderildi: isPay,
            API_KEY: process.env.API_KEY,
        }
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formInputs)
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const deleteRequest = async () => {
        const res = await fetch('/api/paymentRequests', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "delete",
                API_KEY: process.env.API_KEY,
                _id: selectedUser.kayitId,
            }),
        })
        const data = await res.json()
        handleClose()
        getAll()
    }

    const getAll = async () => {
        const res = await fetch('/api/bethistory', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                method: "getAllforUser",
                API_KEY: process.env.API_KEY,
                userToken: getCookie("user")
            }),
        })
        const data = await res.json();

        //console.log("data=>", data  );

        ///console.log("betHistory=>", data.betHistory, "user=>", getCookie("user")  );

        setRequests(data.betHistory)
    }

    useEffect(() => {
        getAll();
    }, [])


    const rows = requests.map((item: any, i: number) => {
        return {
            kayitId: item._id,
            id: i,
            betAmount: item.betAmount,
            basePrice: item.basePrice,
            prizeAmount: item.prizeAmount,
            selectedSide: item.selectedSide,
            closePrice: item.closePrice,
            winnerHorse: item.winnerHorse,
            date: item.date,
            userToken: item.userToken,
        }
    })


    

    return (
        <>
            <div className='flex flex-col p-10 mt-0 text-gray-200'>



                <div className="w-full border rounded-lg flex flex-col items-center justify-center p-2 gap-1 py-5">
                    <h4 className="  text-red-500 text-xl font-bold">
                        T2E <span className="text-white">GAME</span>
                    </h4>

                    <h4 className=" text-red-500 text-xl font-bold">
                        Recent Bettings
                    </h4>

                    <h4 className=" text-green-500 text-xl font-extrabold">
                        WIN
                    </h4>

                    <h4 className=" text-green-500 text-4xl font-extrabold ">
                    {rows[0]?.prizeAmount - rows[0]?.betAmount} <span className="text-white text-xl font-bold">CRA</span>
                    </h4>
                    <h4 className=" text-white text-sm font-bold">
                        Betting Time: {rows[0]?.date }
                    </h4>
                    <h4 className=" text-white text-sm font-bold">
                        Entry Price: {Number(rows[0]?.basePrice).toFixed(2)}
                    </h4>
                    <h4
                        className=" text-white text-sm font-bold"
                        style={{
                            color: `${(rows[0]?.basePrice - rows[0]?.closePrice) > 0 ? "#ff0000" : "#00ff00"}`,
                        }}
                    >
                        Last Price: {Number(rows[0]?.closePrice).toFixed(2)} 

                    </h4>

                </div>

                <div className="w-full flex items-center justify-center p-3">

                        <button
                    onClick={() => {
                        ////paraYatir();
                        push( '/gameT2E' );
                    }}
                    className="btn btn-success max-w-xs w-full text-xl bg-color-#66CDAA hover:bg-color-#66CDAA  text-white font-bold py-2 px-4 rounded-full"
                    >
                    GO BET
                    </button>
                </div>


                <h1 className='text-sm mt-5'>YOUR BET HISTROY</h1>
                <div className="mt-5" style={{ width: "100%", height: 600, color: "white" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={9}
                        rowsPerPageOptions={[10]}
                        hideFooterSelectedRowCount
                        sx={{
                            color: "white",
                            ///bgcolor: "#343a40",
                        }}
                    />
                </div>
            </div>
            {selectedUser && (
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle> Bet Histories from {selectedUser?.email1}</DialogTitle>
                    <DialogContent className='space-y-3'>
                        <DialogContentText>
                            ID(E-mail): <span className='font-bold italic'> {selectedUser?.email1} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Deposit Amount: <span className='font-bold italic'> {selectedUser?.depositAmount} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Type: <span className='font-bold italic'> {selectedUser?.type} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Status: <span className='font-bold italic'> {selectedUser?.status} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Wallet Address: <span className='font-bold italic'> {selectedUser?.wallet} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Created At: <span className='font-bold italic'> {selectedUser?.createdAt} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Transaction Hash: <span className='font-bold italic'> {selectedUser?.txHash} </span>
                        </DialogContentText>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" defaultChecked={selectedUser?.gonderildi} id='isPay' className="checkbox checkbox-primary" />
                            <p>Payment Send?</p>
                        </div>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="hash"
                            label="Transaction Hash"
                            type="hash"
                            fullWidth
                            defaultValue={selectedUser?.txHash}
                            color='secondary'
                            variant="standard"
                        />
                    </DialogContent>

                    <DialogContentText className='text-center text-xs italic'>If you reject the request than request amount will be refund to user!</DialogContentText>
                    
                    <DialogActions>
                        <Button color='error' onClick={deleteRequest}>Delete</Button>
                        <Button color='error' onClick={requestRejected}>Reject</Button>
                        <Button onClick={handleClose}>Close</Button>
                        <Button color='success' onClick={requestAccepted}>Save</Button>
                    </DialogActions>
                    
                </Dialog>
            )}




        </>
    )
}

