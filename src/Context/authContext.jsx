import { createContext, useReducer, useEffect } from "react";
import { BASE_URL } from "../config.js"; // Import BASE_URL

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role); // Make sure role is saved too

      return {
        ...state,
        user: action.payload.user || state.user,
        token: action.payload.token,
        role: action.payload.role || state.role,
        isAuthenticated: true,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  });

  // Function to get the token from context
  const getAuthToken = () => {
    return state.token || localStorage.getItem("token");
  };

  // Fetch user data and set it in the context
  useEffect(() => {
    const token = getAuthToken();
    if (token && !state.isAuthenticated) {
      fetch(`${BASE_URL}/doctor/profile/me`, { // Adjusted for doctor context
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user data");
          return res.json();
        })
        .then((data) => {
          if (data.success && data.data) {
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: {
                token,
                user: data.data, // Assuming profile/me returns user object
                role: data.data.role || state.role,
              },
            });
          }
        })
        .catch((err) => console.error("Error fetching user data:", err));
    }
  }, [state.isAuthenticated, BASE_URL]);

  // Add token to headers for all requests that need authentication
  const authFetch = (url, options = {}) => {
    const token = getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers, // Merge additional headers if provided
    };

    return fetch(url, { ...options, headers });
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
