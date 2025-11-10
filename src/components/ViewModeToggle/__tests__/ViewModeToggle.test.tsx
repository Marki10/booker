import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ViewModeToggle } from "..";

describe("ViewModeToggle", () => {
  it("renders list and calendar buttons and toggles mode", () => {
    const onChange = vi.fn();
    render(<ViewModeToggle viewMode="list" onViewModeChange={onChange} />);

    const listBtn = screen.getByRole("button", { name: /list/i });
    const calBtn = screen.getByRole("button", { name: /calendar/i });

    expect(listBtn).toBeInTheDocument();
    expect(calBtn).toBeInTheDocument();

    fireEvent.click(calBtn);
    expect(onChange).toHaveBeenCalledWith("calendar");

    fireEvent.click(listBtn);
    expect(onChange).toHaveBeenCalledWith("list");
  });
});
