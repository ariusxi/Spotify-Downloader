export const withTimeout = <T>(callback: Promise<T>, ms: number, onTimeout?: () => void): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (onTimeout) onTimeout()
      reject()
    }, ms)

    callback
      .then((result) => {
        clearInterval(timeout)
        resolve(result)
      })
      .catch(() => {
        clearInterval(timeout)
        reject()
      })
  })
}