import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleans up component state after each test
afterEach(() => {
  cleanup()
})
