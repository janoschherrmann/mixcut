import { FFmpeg, fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg'

export const loadFFmpeg = async (): Promise<FFmpeg> => {
  const ffmpeg = createFFmpeg({
    corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
  })
  await ffmpeg.load()
  return ffmpeg
}

export const extractAudio = async (ffmpeg: FFmpeg, videoFile: File): Promise<Blob> => {
  return fetchFile(videoFile)
    .then((data) => {
      ffmpeg.FS('writeFile', 'input.mp4', data)
      return ffmpeg.run(
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
    })
    .then(() => {
      const data = ffmpeg.FS('readFile', 'output.mp3')
      return new Blob([data.buffer], { type: 'audio/mpeg' })
    })
    .catch((error) => {
      throw error
    })
}
