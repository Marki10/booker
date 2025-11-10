import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DateFilter } from "../index";

describe("DateFilter", () => {
  it("does not render when selectedDate is empty", () => {
    const { container } = render(
      <DateFilter selectedDate="" onClear={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders when selectedDate is provided and clears on click", () => {
    const onClear = vi.fn();
    render(<DateFilter selectedDate="2025-11-10" onClear={onClear} />);

    expect(screen.getByText(/Showing bookings for:/i)).toBeInTheDocument();
    expect(screen.getByText("2025-11-10")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Clear filter/i }));
    expect(onClear).toHaveBeenCalled();
  });
});
