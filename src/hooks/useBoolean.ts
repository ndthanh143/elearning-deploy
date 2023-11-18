import { useMemo, useState } from 'react'

export function useBoolean(initialState = false) {
  const [value, setValue] = useState(initialState)
  const callbacks = useMemo(
    () => ({
      on: () => setValue(true),
      off: () => setValue(false),
      toggle: () => setValue((prev) => !prev),
    }),
    [],
  )
  return [value, callbacks]
}
