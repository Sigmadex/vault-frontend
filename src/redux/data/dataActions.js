// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());

    try {
      let unlocked_total = await store
        .getState()
        .blockchain.vaultcontract.methods.getUnlocked_TotalBalance()
        .call();

        let owner = await store
        .getState()
        .blockchain.vaultcontract.methods.owner()
        .call();
      // let cost = await store
      //   .getState()
      //   .blockchain.smartContract.methods.cost()
      //   .call();

        if (owner.toLowerCase() !== store.getState().blockchain.account){
          dispatch(fetchDataFailed("You are not owner of the contract"));
        }
        else {
          dispatch(
            fetchDataSuccess({
              unlocked_total,
              // cost,
            })
          );
        }
        
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
