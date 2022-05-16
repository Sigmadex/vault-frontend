// constants
import Web3EthContract from "web3-eth-contract";
import Web3 from "web3";
import { fetchData } from "../data/dataActions";

// log


const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};


export const connect = (vaultaddress) => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const abiVault = await fetch("/config/Vault.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    /*const abiSDEX = await fetch("/config/SDEX.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });*/
    const config = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi_vault = await abiVault.json();
    //const abi_sdex = await abiSDEX.json();
    const config_config = await config.json();

    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      Web3EthContract.setProvider(ethereum);
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        console.log(networkId)
        const apiKey = config_config.API_KEY
        const apiUrl = config_config.API_URL
        if (parseInt(networkId) === parseInt(config_config.NETWORK_ID) ) {
          console.log("redo");
          const vaultobject = new Web3EthContract(
            abi_vault,
            vaultaddress
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              apiKey: apiKey,
              apiUrl: apiUrl,
              vaultcontract: vaultobject,
              web3: web3,
            })
          );
          dispatch(fetchData(accounts[0]));
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            console.log("accountschanged");
            dispatch(updateAccount(accounts[0], vaultobject, apiKey, apiUrl));
          });
          
          // Add listeners end
        } else {
          // let msg = "Change Network to Avalanche"
          // alert(msg);
          dispatch(connectFailed(`Change network to ${config_config.NETWORK_ID}.`));
        }

        ethereum.on("chainChanged", () => {
          console.log("chain changed");
          window.location.reload();
        });
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const updateAccount = (account, vaultobject, apiKey, apiUrl) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account, vault: vaultobject, apiKey: apiKey, apiUrl:apiUrl }));
    dispatch(fetchData(account));
  };
};
