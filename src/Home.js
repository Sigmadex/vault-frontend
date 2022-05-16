import React, { useEffect, useState } from "react";
import { useDispatch, useSelector  } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData} from "./redux/data/dataActions";
import { useParams } from 'react-router-dom'
import { ethers } from "ethers";
import store from "./redux/store";

import './App.scss';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Modal from './components/Modal';

function Home() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [txData, setTxData] = useState([]);
  const [withdraw, setWithdraw] = useState(false);
  const [firstModal, setFirstModal] = useState(true);
  const [errorModal, setErrorModal] = useState("");
  const { address } = useParams()
  const getData = () => {
    if ((blockchain.account !== undefined && blockchain.account !== null) && blockchain.vaultcontract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  store.subscribe(() => {
    setErrorModal(store.getState().blockchain.errorMsg);
  });

  useEffect(() => {
   // console.log('empty call')
   // dispatch(connect(address));
  }, []);

  useEffect(() => {
    console.log('address call')
    dispatch(connect(address));
  }, [address]);

  useEffect(() => {
    if (blockchain.account !== undefined && blockchain.account !== null)
      getData();
  }, [blockchain.account]);

  const connectWallet = (e) =>{
    e.preventDefault();
    console.log("connectWallet", address);
    dispatch(connect(address));
  }

  const closeErrorModal = () => {
    setErrorModal("");
  }

  const ev_withdraw = async (e) => {
    e.preventDefault();
    if (data.unlocked > 0)
    {
      setWithdraw(true);
      await blockchain.vaultcontract.methods.withdraw(blockchain.account, data.unlocked).send({
        from:blockchain.account,
      }).once("error", (err) => {
        console.log(err);
        setWithdraw(false);
      })
      .then((receipt) => {
        setWithdraw(false);
      });
      getData();
    }
    else 
      setErrorModal("Not available.");
  }

  const d_connectWallet = () => {
    return (
      <button onClick={(e) => { connectWallet(e) }} type="button" className="w-[138px] rounded-[10px] h-9 border text-[#404C55] h-[46px] mt-6 border-gray-700 focus:border-gray-100 hover:border-lime-800 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center ">
        Connect Wallet
      </button>
    )
  }

  const string_makeShort = (str) => {
    return str.substring(0,6)+"..."+str.substring(str.length - 3, str.length);
  }
  const see_transaction = async (e) => {
    setFirstModal(false);
    let txList = [];
    const apiUrl = blockchain.apiUrl+'api?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address='+address+'&apikey='+blockchain.apiKey;
    fetch(apiUrl)
      .then((response) => response.json())
      .then( async function(data) {
          await Promise.all(data.result.map(async (tx) => {
            console.log("tx", tx);
            let timestamp = await blockchain.web3.eth.getBlock(parseInt(tx.blockNumber));
            let detail = await blockchain.web3.eth.getTransactionReceipt(tx.transactionHash);
            let value = "0x"+tx.data.substring(tx.data.length-64, tx.data.length);
            console.log("value", value);
            txList.push({
              id: string_makeShort(tx.transactionHash),
              vaultaddress: string_makeShort(tx.address),
              destination: string_makeShort(detail.from),
              timestamp: timestamp.timestamp,
              claimamount: ethers.BigNumber.from(value).div("1000000000000000000").toString(),
            });
          }));
          setTxData(txList);
      });
  }

  const see_firstModal = (e) => {
    setFirstModal(true);
  }
  const d_withdraw = () => {
    if (withdraw === false)
      return (
        <div className = "flex items-center ">
          <button onClick={(e) => { ev_withdraw(e) }} type="button" className="m-3 w-[138px] rounded-[10px] h-9 border text-[#404C55] h-[46px] mt-6 border-gray-700 focus:border-gray-100 hover:border-lime-800 font-medium text-sm px-5 py-2.5 text-center ">
            Withdraw
          </button>
          <button onClick={(e) => { see_transaction(e) }} type="button" className="m-3 w-[138px] rounded-[10px] h-9 border text-[#404C55] h-[46px] mt-6 border-gray-700 focus:border-gray-100 hover:border-lime-800 font-medium text-sm px-5 py-2.5 text-center ">
            History
          </button>
        </div>
      )
    else 
    return (
      <button type="button" disabled = "disabled" className="w-[138px] rounded-[10px] h-9 border text-[#404C55] h-[46px] mt-6 border-gray-700 focus:border-gray-100 hover:border-lime-800 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center ">
        Processing...
      </button>
    )
  }

  const d_firstModal = () => {
    return (
      <div className="p-4 md:w-[604px] w-[402px] h-max rounded-[20px] bg-white border shadow-md sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-2 pt-2">
          <p className="mb-5 text-[#404C55] text-[38px] font-bold">
              Claim SDEX
          </p>
          <p className="mb-7 text-[#404C55] text-[14px]">
            Your vault balances are displayed below:
          </p>
          <img src = "/images/icon-lock.png" alt = "lock" className = "mb-5"/>
          
          <ul className="my-4 space-y-3 bg-white border shadow-md rounded-[20px] md:w-[500px] w-[300px]">
            <li className="flex items-center justify-between pl-3 pr-3 pt-3 text-base font-bold text-gray-900  rounded-lg">
              <span className="flex flex-row items-center ">
                <span className = "mr-4 ml-3" style = {{position:"relative"}}>
                  <img src = "/images/sdexlock.png" alt = "sdexlock" className = ""/>
                  <img src = "/images/sigmaGroup.png" alt = "timer" className = "" style = {{position:"absolute", left:"26px", top:"13px", width: "13px", height:"21px"}}/>
                </span>
                <span className = "text-[#404C55] text-[14px]"> Locked:
                </span>
              </span>
              <span className="text-[#404C55] text-[14px] mr-5">
              {!data.total ? "N/A" : ethers.BigNumber.from(data.total).sub(data.unlocked).div("1000000000000000000").toString()}
              </span>
            </li>
            <li className="flex items-center justify-between p-3 text-base font-bold text-gray-900  rounded-lg">
              <span className="flex flex-row items-center ">
                <span className = "mr-4 ml-3">
                  <img src = "/images/sdex.png" alt = "sdexlock" className = ""/>
                </span>
                <span className = "text-[#404C55] text-[14px]"> Available:
                </span>
              </span>
              <span className="text-[#404C55] text-[14px] mr-5">
              {!data.unlocked ? "N/A" : ethers.BigNumber.from(data.unlocked).div("1000000000000000000").toString()}
              </span>
            </li>
          </ul>
          {!blockchain.account ? d_connectWallet() : d_withdraw()}
        </div>
      </div>
    );
  }

  const d_secondModal = () => {
    return (
      <div className="p-4 md:w-[804px] w-[602px] h-max rounded-[20px] bg-white border shadow-md sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex flex-col items-center pb-2 pt-2">
          <p className="mb-5 text-[#404C55] text-[38px] font-bold">
              Claim SDEX History
          </p>
          <p className="mb-7 text-[#404C55] text-[14px]">
            The following SDEX claim transactions have occurred:
          </p>
          <div className="my-4 space-y-3 bg-white relative overflow-x-auto shadow-md rounded-[20px] md:w-[700px] w-[500px]">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
              <thead className="text-xs text-[#404C55] ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                      TX ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Timestamp
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Vault Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Destination
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Claim Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                   txData.map(tx => (
                    <tr className="bg-white dark:bg-gray-800 dark:border-gray-700" key={tx.id}>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {tx.id}
                      </th>
                      <td className="px-6 py-4">
                        {tx.timestamp}
                      </td>
                      <td className="px-6 py-4">
                        {tx.vaultaddress}
                      </td>
                      <td className="px-6 py-4">
                        {tx.destination}
                      </td>
                      <td className="px-6 py-4">
                        {tx.claimamount}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          
          <div className = "flex flex-row justify-end items-center md:w-[700px] w-[500px]">
            <button onClick={(e) => { see_firstModal(e) }} type="button" className="m-3 w-138 rounded-[10px] h-9 border text-[#404C55] h-[46px] mt-6 border-gray-700 focus:border-gray-100 hover:border-lime-800 font-medium text-sm px-5 py-2.5 text-center inline-flex">
              Next
            </button>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="font-sans wrapper">
      <div className = "container" >
        <Header add = {address}/>
        <main className='mt-36 min-h-screen py-8 text-white flex flex-row justify-center'>
          {firstModal ? d_firstModal() : d_secondModal()}
          <Modal open={errorModal != ""} message={errorModal} close={closeErrorModal} />
        </main>
        <Footer/>
      </div>
    </div>
  );
}

export default Home;
