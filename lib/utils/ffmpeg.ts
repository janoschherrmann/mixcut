import { FFmpeg, fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg'

export const loadFFmpeg = async (): Promise<FFmpeg> => {
  const ffmpeg = createFFmpeg({
    corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
  })
  await ffmpeg.load()
  return ffmpeg
}

export const extractAudio = (ffmpeg: FFmpeg, videoFile: File): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Write the file to memory
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))

      // Run the command to extract audio
      await ffmpeg.run(
        '-i',
        'input.mp4',
        '-vn',
        '-ar',
        '44100',
        '-ac',
        '2',
        '-b:a',
        '192k',
        'output.mp3'
      )

      // Read the result
      const data = ffmpeg.FS('readFile', 'output.mp3')

      // Create a Blob from the data
      const audioBlob = new Blob([data.buffer], { type: 'audio/mpeg' })

      resolve(audioBlob)
    } catch (error) {
      reject(error)
    }
  })
}
