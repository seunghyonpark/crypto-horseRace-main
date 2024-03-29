'use client';
import { Slide, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridApi, GridCellValue, DataGrid } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import { IUser } from "@/libs/interface/user";
import Link from 'next/link';

import ModalAlert from '@/components/ModalAlert';
import { useTransferToken } from '@thirdweb-dev/react';



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function RewardList() {


  const [requests, setRequests] = useState<any>([]);

  const [deposits, setDeposits] = useState<any>([]);


  const [open, setOpen] = React.useState(false);

  const [selectedUser, setSelectedUser] = useState<any>();

  const [userAdmin, setUserAdmin] = useState<any>();

  ///const [showModal, setShowModal] = useState(false);



  const [user, setUser] = useState<IUser>();


  const [username, setUsername] = useState<string>('');

  


  const getUser = async () => {
    const inputs = {
        method: 'getOne',
        API_KEY: process.env.API_KEY,
        userToken: getCookie('admin')
    }
    const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
    })
    const user = await res.json()
    setUser(user.user.user)

    console.log(user.user.user);

  }

  useEffect(() => {

    getUser();

  }, []);


  const columns: GridColDef[] = [
    {
        field: "id",
        headerName: "ID",
        flex: 0.01,
        minWidth: 80,
        align: "center",
        headerAlign: "center",
    },
    {
        field: "username",
        headerName: "Nick Name",
        align: "center",
        headerAlign: "center",
        width: 150,
        minWidth: 250,
    },
    {
      field: "betCount",
      headerName: "Bet Count",
      align: "right",
      headerAlign: "center",
      type: "number",
      flex: 0.2,
      minWidth: 100,

    }, 
    {
      field: "prizeAmount",
      headerName: "Prize Amount",
      align: "right",
      headerAlign: "center",
      type: "number",
      flex: 0.2,
      minWidth: 100,

    },
    {
      field: "prizeFee",
      headerName: "Prize Fee",
      align: "right",
      headerAlign: "center",
      type: "number",
      flex: 0.2,
      minWidth: 100,

    },

    {
      field: "rewardAmount",
      headerName: "Reward Amount",
      align: "right",
      headerAlign: "center",
      type: "number",
      flex: 0.2,
      minWidth: 100,

    },

];


  const search = async () => {
    if (!username) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a username!',
      });
      return;
    }


    const res = await fetch('/api/depositRequests', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: "getAllforUsername",
        API_KEY: process.env.API_KEY,
        username: username,
      }),
    })

    const data = await res.json();

    setRequests(data?.depositRequests);
  }



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

    const getAll = async () => {
      const res = await fetch('/api/bethistory', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              method: "getAllReward",
              API_KEY: process.env.API_KEY,
          }),
      })
      const data = await res.json();

      setRequests(data.reward);

    }

    getAll();

  }, []);



  const [depositSum, setDepositSum] = React.useState(0)

  const getAllSum = async () => {
      const res = await fetch('/api/depositRequests', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              method: "getAllAmount",
              API_KEY: process.env.API_KEY,
              userToken: getCookie("admin")
          }),
      })
      const data = await res.json()

      setDepositSum(data.sum)
      
      //if (data.payments.length == 0) return setRequests(0)
      //setRequests(data.payments.length)
  }

  React.useEffect(() => {
      getAllSum()
  }, [])
  


 


  const rows = requests?.map((item: any, i: number) => {
    return {
        kayitId: item._id,
        id: i,
        username: item._id,
        betCount: item.betCount,
        prizeAmount: item.prizeAmount,
        prizeFee: item.prizeFee,
        rewardCount: item.rewardCount,
        rewardAmount: item.rewardAmount,
    }
  })
  


  return (
    <>


        <div className='flex flex-col p-10 mt-5 text-gray-200'>
          <h1 className='font-bold italic text-2xl'>Reward</h1>

{/*
          <h1 className='font-bold italic text-2xl'>Total Reward Amount: {Number(depositSum).toFixed(2)}</h1>
          
  */}
          <div className='flex flex-row  justify-left mt-5 mb-5'>
            <input
                placeholder="Nick Name"
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
                className="input input-bordered w-full max-w-xs text-white"
            />

            <button
                onClick={() => {
                    //user?.deposit && user?.deposit > 10000 ? setMiktar("10000") : setMiktar(user?.deposit)

                    search();
                }}
                className='btn btn-xs h-12 ml-2 text-yellow-500 border-yellow-500 hover:bg-white bg-white '
            >
                Search
            </button>
          </div>


          <div style={{ width: "100%", height: 2710, color: "white" }}>

          {rows && (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={100}
              rowsPerPageOptions={[10]}
              hideFooterSelectedRowCount
              sx={{

                bgcolor: "white", //table background color
                boxShadow: 2,
                border: 2,
                borderColor: 'primary.light',
                '& .MuiDataGrid-cell:hover': {
                  color: 'primary.main',
                },

              }}
              
            />
          )}


          </div>
        </div>


{/*
        {selectedUser && (
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle> Withdraw Request from {selectedUser?.email1}</DialogTitle>
                    <DialogContent className='space-y-3'>
                        <DialogContentText>
                            ID(E-mail): <span className='font-bold italic'> {selectedUser?.email1} </span>
                        </DialogContentText>
                        <DialogContentText>
                            Request Amount: <span className='font-bold italic'> {selectedUser?.requestAmount} </span>
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
        */}


            
        {selectedUser && (
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle> User Edit Form  </DialogTitle>

            <DialogContent className='space-y-3'>

            {user?.admin && user?.adminLevel === 0 && (

              <div className='flex gap-1 items-center'>
                <input
                  type="checkbox"
                  defaultChecked={selectedUser?.admin}
                  id='admin'
                  className="checkbox checkbox-primary"
                />
                <p>Admin?</p>
              </div>
            )}

              <DialogContentText>
                ID(E-mail): <span className='font-bold italic'> {selectedUser?.email} </span>
              </DialogContentText>

              <DialogContentText>
                Nick Name: <span className='font-bold italic'> {selectedUser?.username} </span>
              </DialogContentText>

              <DialogContentText>
                Balance (CRA): <span className='font-bold italic'> {selectedUser?.coin} </span>
              </DialogContentText>

              <DialogContentText>
                Deposit Address: <span className='font-bold italic'> {selectedUser?.walletAddress} </span>
              </DialogContentText>



            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        )}

        



    </>
  )
}
