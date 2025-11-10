import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { AppHeader } from '../index'

const baseProps = {
  onTitleClick: vi.fn(),
  onSync: vi.fn(),
  isSyncing: false,
  syncStatus: { lastSync: null, pendingSync: false, backendAvailable: true },
  viewMode: 'list' as const,
  onViewModeChange: vi.fn(),
  showForm: false,
  onNewBooking: vi.fn(),
}

describe('AppHeader', () => {
  it('renders title and controls', () => {
    render(<AppHeader {...baseProps} />)
    expect(screen.getByText(/Booking App/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New/i })).toBeInTheDocument()
  })

  it('calls handlers on interaction', () => {
    render(<AppHeader {...baseProps} />)

    fireEvent.click(screen.getByText(/Booking App/i))
    expect(baseProps.onTitleClick).toHaveBeenCalled()

    fireEvent.click(screen.getByTitle('Sync with backend'))
    expect(baseProps.onSync).toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: /New/i }))
    expect(baseProps.onNewBooking).toHaveBeenCalled()
  })

  it('hides New button when showForm is true', () => {
    render(<AppHeader {...baseProps} showForm />)
    expect(screen.queryByRole('button', { name: /New/i })).toBeNull()
  })
})
