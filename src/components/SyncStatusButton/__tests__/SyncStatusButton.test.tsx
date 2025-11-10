import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SyncStatusButton } from "../index";

describe("SyncStatusButton", () => {
  it("renders with backend available and triggers onSync", () => {
    const onSync = vi.fn();
    render(
      <SyncStatusButton
        onSync={onSync}
        isSyncing={false}
        syncStatus={{
          lastSync: null,
          pendingSync: false,
          backendAvailable: true,
        }}
      />,
    );

    const btn = screen.getByTitle("Sync with backend");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onSync).toHaveBeenCalled();
  });

  it("disables button while syncing", () => {
    render(
      <SyncStatusButton
        onSync={vi.fn()}
        isSyncing={true}
        syncStatus={{
          lastSync: null,
          pendingSync: false,
          backendAvailable: true,
        }}
      />,
    );

    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
  });
});
