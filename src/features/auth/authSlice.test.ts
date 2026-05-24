import authReducer, { logout } from "./authSlice";
import { loginUserThunk } from "./authThunk";
import { describe, it, expect } from "vitest";

describe("authSlice", () => {
  it("should clear user and token on logout", () => {
    const initialState = {
      user: {
        _id: "1",
        fullName: "John Doe",
        email: "john.doe@example.com",
      },
      token: "abc123",
      loading: false,
      error: null,
    };

    const state = authReducer(initialState, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it("should set loading true when login is pending", () => {
    const initialState = {
      user: null,
      token: "abc123",
      loading: false,
      error: null,
    };
    const state = authReducer(
      initialState,
      loginUserThunk.pending("", {
        email: "john@gmail.com",
        password: "123456",
      }),
    );

    expect(state.loading).toBe(true);
  });
});
