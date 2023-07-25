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

export const combineVideos = async (
  ffmpeg: FFmpeg,
  videoFiles: [File | Blob, File | Blob]
): Promise<Blob> => {
  try {
    // Write the first file to memory
    ffmpeg.FS('writeFile', 'input1.mp4', await fetchFile(videoFiles[0]))

    // Write the second file to memory
    ffmpeg.FS('writeFile', 'input2.mp4', await fetchFile(videoFiles[1]))

    // Run the command to combine the videos
    await ffmpeg.run(
      '-i',
      'input1.mp4',
      '-i',
      'input2.mp4',
      '-filter_complex',
      '[0:v:0][0:a:0][1:v:0][1:a:0]concat=n=2:v=1:a=1[outv][outa]',
      '-map',
      '[outv]',
      '-map',
      '[outa]',
      'output.mp4'
    )

    // Read the result
    const data = ffmpeg.FS('readFile', 'output.mp4')

    // Create a Blob from the data
    const combinedVideoBlob = new Blob([data.buffer], { type: 'video/mp4' })

    return combinedVideoBlob
  } catch (error) {
    throw error
  }
}

export const filterBlackAndWhite = async (ffmpeg: FFmpeg, videoFile: File): Promise<Blob> => {
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))

  await ffmpeg.run('-i', 'input.mp4', '-vf', 'format=gray', 'output.mp4')

  const data = ffmpeg.FS('readFile', 'output.mp4')

  const bwVideoBlob = new Blob([data.buffer], { type: 'video/mp4' })

  return bwVideoBlob
}
