import { FFmpeg, fetchFile, createFFmpeg } from '@ffmpeg/ffmpeg'

export const loadFFmpeg = async (): Promise<FFmpeg> => {
  const ffmpeg = createFFmpeg({
    log: true,
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

export const filterBlur = async (ffmpeg: FFmpeg, videoFile: File | Blob): Promise<Blob> => {
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))

  // Apply the blur filter
  await ffmpeg.run('-i', 'input.mp4', '-vf', 'boxblur=10:5', 'output.mp4')

  const data = ffmpeg.FS('readFile', 'output.mp4')

  const blurredVideoBlob = new Blob([data.buffer], { type: 'video/mp4' })

  return blurredVideoBlob
}

export const filterSepia = async (ffmpeg: FFmpeg, videoFile: File | Blob): Promise<Blob> => {
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))

  await ffmpeg.run(
    '-i',
    'input.mp4',
    '-vf',
    'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131',
    'output.mp4'
  )

  const data = ffmpeg.FS('readFile', 'output.mp4')

  const SVideoBlob = new Blob([data.buffer], { type: 'video/mp4' })

  return SVideoBlob
}

export const speedUp = async (ffmpeg: FFmpeg, videoFile: File | Blob): Promise<Blob> => {
  // Convert Blob or File to Uint8Array
  const fileData = await fetchFile(videoFile)

  // Write the file to memory
  ffmpeg.FS('writeFile', 'input.mp4', fileData)

  // Run the FFMpeg command, speed up the video by 2 times and audio by 2 times
  await ffmpeg.run('-i', 'input.mp4', '-vf', 'setpts=0.5*PTS', '-af', 'atempo=2.0', 'output.mp4')

  // Read the result
  const data = ffmpeg.FS('readFile', 'output.mp4')

  // Convert it to a Blob for further usage or to be able to download it
  return new Blob([data.buffer], { type: 'video/mp4' })
}
