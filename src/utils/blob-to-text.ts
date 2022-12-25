export const blobToText = (blob: Blob): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject('API válida desde el cliente')
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      resolve(e.target?.result as string)
    }

    fileReader.readAsText(blob)
  })
}
