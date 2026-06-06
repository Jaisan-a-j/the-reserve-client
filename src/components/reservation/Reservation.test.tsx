import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Reservation from "./Reservation";
import { vi, describe, it, expect } from "vitest";

type MockState = {
  auth: {
    token: string;
  };
  booking: {
    loading: boolean;
    success: boolean;
    error: string | null;
    message: string;
  };
};

vi.mock("../../hooks/reduxHooks", () => ({
  useAppDispatch: () => vi.fn(),

  useAppSelector: (selector: (state: MockState) => unknown) =>
    selector({
      auth: {
        token: "fake-token",
      },

      booking: {
        loading: false,
        success: false,
        error: null,
        message: "",
      },
    }),
}));

describe("Reservation Form", () => {
  it("phone field rejects non-digits", async () => {
    render(<Reservation />);

    const phoneInput = screen.getByLabelText(/phone/i);

    await userEvent.type(phoneInput, "abc123@#");

    expect(phoneInput).toHaveValue("123abc");
  });
});
