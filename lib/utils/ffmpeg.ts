import { FFmpeg, fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg'

export const loadFFmpeg = async (): Promise<FFmpeg> => {
  const ffmpeg = createFFmpeg({
    log: true,
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

export const filterBlackAndWhite = async (ffmpeg: FFmpeg, videoFile: File): Promise<Blob> => {
  try {
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))

    await ffmpeg.run('-i', 'input.mp4', '-vf', 'format=gray', 'output.mp4')

    const data = ffmpeg.FS('readFile', 'output.mp4')

    const bwVideoBlob = new Blob([data.buffer], { type: 'video/mp4' })

    return bwVideoBlob
  } catch (error) {
    throw error
  }
}
