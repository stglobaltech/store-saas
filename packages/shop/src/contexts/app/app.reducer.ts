export const initialState = {
  searchTerm: "",
  isSticky: false,
  isSidebarSticky: true,
  isDrawerOpen: false,
  isModalOpen: false,
  workFlowPolicy: {},
  branches: [],
  activeStoreId: null,
};

type ActionType =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_STICKY" }
  | { type: "REMOVE_STICKY" }
  | { type: "SET_SIDEBAR_STICKY" }
  | { type: "REMOVE_SIDEBAR_STICKY" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "TOGGLE_MODAL" }
  | { type: "WORK_FLOW_POLICY"; payload: any }
  | { type: "BRANCHES"; payload: any }
  | { type: "POLICY_AND_BRANCHES"; payload: any }
  | { type: "ACTIVE_STORE_ID"; payload: any };

type StateType = typeof initialState;

export function appReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return {
        ...state,
        searchTerm: action.payload,
      };
    case "SET_STICKY":
      return {
        ...state,
        isSticky: true,
      };
    case "REMOVE_STICKY":
      return {
        ...state,
        isSticky: false,
      };
    case "SET_SIDEBAR_STICKY":
      return {
        ...state,
        isSidebarSticky: true,
      };
    case "REMOVE_SIDEBAR_STICKY":
      return {
        ...state,
        isSidebarSticky: false,
      };
    case "TOGGLE_DRAWER":
      return {
        ...state,
        isDrawerOpen: !state.isDrawerOpen,
      };
    case "TOGGLE_MODAL":
      return {
        ...state,
        isModalOpen: !state.isModalOpen,
      };
    case "WORK_FLOW_POLICY":
      return { ...state, workFlowPolicy: action.payload };
    case "BRANCHES":
      return { ...state, branches: action.payload };
    case "ACTIVE_STORE_ID":
      return { ...state, activeStoreId: action.payload };
    case "POLICY_AND_BRANCHES":
      if (!state.activeStoreId) {
        return {
          ...state,
          workFlowPolicy: action.payload.policy,
          branches: action.payload.branches,
          activeStoreId: action.payload.storeId,
        };
      }
      return {
        ...state,
        workFlowPolicy: action.payload.policy,
        branches: action.payload.branches,
      };

    default: {
      throw new Error(`Unsupported action type at App Reducer`);
    }
  }
}
