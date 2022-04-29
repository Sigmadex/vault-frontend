import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";

export default function Header({add}) {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const getData = () => {
        console.log("blockchain.account, blockchain.vaultcontract", blockchain.account, blockchain.vaultcontract);
        if ((blockchain.account !== undefined && blockchain.account !== null) && blockchain.vaultcontract !== null) {
        console.log("blockchain.account->real", blockchain.account);
        dispatch(fetchData(blockchain.account));
        }
    };
    const connectWallet = (e) =>{
        e.preventDefault();
        dispatch(connect(add));
        getData();
    }
    const d_connectWallet = () => {
        return (
            <button onClick={(e) => { connectWallet(e) }} type="button" className="w-138 rounded-[10px] h-9 border border-gray-400 focus:border-gray-100 hover:border-lime-800 font-medium text-sm px-5 py-2.5 text-center inline-flex items-center ">
                Connect Wallet
            </button>
        )
    }
    const d_dispalyWallet = () => {
        const shortWalletAddress = blockchain.account.substring(0,6)+"..."+blockchain.account.substring(38,42);
        return (
            <span className = "text-center inline-flex items-center px-1 py-1.5 text-[14px]">
                {shortWalletAddress}
            </span>
        )
    }
    return (
    <div className='top-0 left-0 w-full h-12 z-10'>
        <div className='container-fluid p-12 mx-auto flex items-center justify-between h-full text-white gap-7'>
            <div className='md:w-40' >
                <img src = "/images/logo12.png" alt = "logo"/>
            </div>
            <ul className="flex flex-row gap-5">
                <li>
                    <img src = "/images/avax.png" className = "mt-0.5" alt = "avax"/>
                </li>
                <li>
                    {!blockchain.account ? d_connectWallet() : d_dispalyWallet()}
                </li>
            </ul>
        </div>
      </div>
  )
}
