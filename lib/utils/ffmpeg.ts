import { FFmpeg, fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg'

export const loadFFmpeg = async (): Promise<FFmpeg> => {
  const ffmpeg = createFFmpeg({
    corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
  })
  await ffmpeg.load()
  return ffmpeg
}

export const extractAudio = async (ffmpeg: FFmpeg, videoFile: File | Blob): Promise<Blob> => {
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
  // Write the video files to ffmpeg's file system
  const fileNames = videoFiles.map((file, i) => `input${i}.mp4`)
  for (let i = 0; i < videoFiles.length; i++) {
    ffmpeg.FS('writeFile', fileNames[i], new Uint8Array(await videoFiles[i].arrayBuffer()))
  }

  // Run ffmpeg command to scale and concatenate the videos
  await ffmpeg.run(
    '-i',
    'input0.mp4',
    '-i',
    'input1.mp4',
    '-filter_complex',
    '[0:v:0]scale=1280:720[v0];[1:v:0]scale=1280:720[v1];[v0][0:a:0][v1][1:a:0]concat=n=2:v=1:a=1[outv][outa]',
    '-map',
    '[outv]',
    '-map',
    '[outa]',
    '-vsync',
    '2',
    '-framerate',
    '30',
    'output.mp4'
  )

  // Read the output and create a Blob
  const data = ffmpeg.FS('readFile', 'output.mp4')
  return new Blob([data.buffer], { type: 'video/mp4' })
}

export const filterBlackAndWhite = async (
  ffmpeg: FFmpeg,
  videoFile: File | Blob
): Promise<Blob> => {
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))

  await ffmpeg.run('-i', 'input.mp4', '-vf', 'format=gray', 'output.mp4')

  const data = ffmpeg.FS('readFile', 'output.mp4')

  const bwVideoBlob = new Blob([data.buffer], { type: 'video/mp4' })

  return bwVideoBlob
}
