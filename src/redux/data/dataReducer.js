const initialState = {
  loading: false,
  unlocked: 0,
  total: 0,
  cost: 0,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        unlocked: action.payload.unlocked_total[0],
        total: action.payload.unlocked_total[1],
        // cost: action.payload.cost,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    case "WITHDRAW":
        return {
          ...state,
          successful : "1"
        }
          
    default:
      return state;
  }
};

export default dataReducer;
