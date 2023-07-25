export const downloadFile = (file: File | Blob, outputFileExtension: 'mp4' | 'mp3' = 'mp4') => {
  const url = URL.createObjectURL(file)

  // Create a download link and click it
  const link = document.createElement('a')
  link.href = url
  link.download = `output.${outputFileExtension}`
  document.body.appendChild(link)
  link.click()

  // Cleanup
  URL.revokeObjectURL(url)
  document.body.removeChild(link)
}
