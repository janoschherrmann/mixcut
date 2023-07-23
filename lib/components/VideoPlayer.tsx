import { useEffect, useRef } from 'react'
import { type MediaPlayerElement } from 'vidstack'
import {
	useMediaStore,
	useMediaRemote,
	MediaPlayer,
	MediaOutlet,
	MediaPlayButton,
	MediaMuteButton,
	MediaVolumeSlider,
	MediaFullscreenButton,
	MediaSeekButton,
	MediaMenu,
	MediaPlaybackRateMenuItems,
	MediaMenuButton,
	MediaMenuItems,
	MediaPlaybackRateMenuButton,
	MediaGesture,
	MediaTimeSlider,
	MediaSliderValue
} from '@vidstack/react'
import {
	PauseIcon,
	PlayIcon,
	ReplayIcon,
	MuteIcon,
	VolumeHighIcon,
	VolumeLowIcon,
	FullscreenIcon,
	FullscreenExitIcon,
	SeekForward15Icon,
	SeekBackward15Icon,
	SettingsIcon,
	ArrowLeftIcon,
	OdometerIcon,
	ChevronRightIcon
} from '@vidstack/react/icons'
import { useVideoContext } from '../contexts/VideoContext'
import { Button } from './Button'
import { FileUploadButton } from './FileUploadButton'

function SettingsMenu() {
	return (
		<MediaMenu className='relative inline-block'>
			<MediaMenuButton
				className='group flex h-12 w-12 items-center justify-center rounded-sm outline-none'
				aria-label='Settings'>
				<SettingsIcon className='h-8 w-8 rounded-sm transition-transform duration-200 ease-out group-aria-expanded:rotate-90 group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400' />
			</MediaMenuButton>
			<MediaMenuItems className='absolute right-0 bottom-full h-[var(--menu-height)] min-w-[260px] overflow-y-auto rounded-lg bg-black/95 p-2.5 shadow-sm backdrop-blur-sm transition-all duration-200 ease-in aria-hidden:pointer-events-none aria-hidden:bottom-0 aria-hidden:opacity-0 data-[resizing]:overflow-hidden'>
				<PlaybackRateMenu />
			</MediaMenuItems>
		</MediaMenu>
	)
}

function PlaybackRateMenu() {
	return (
		<MediaMenu className='text-sm text-white'>
			<PlaybackRateMenuButton />
			<MediaPlaybackRateMenuItems
				className='relative flex flex-col p-1 aria-hidden:hidden'
				radioGroupClass='w-full'
				radioClass='group flex cursor-pointer items-center p-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-2 data-[focus]:ring-blue-400'
				radioCheckClass="rounded-full border-1 flex items-center justify-center w-2.5 h-2.5 mr-2 border-gray-500 group-aria-checked:border-white after:content-[''] after:border-2 after:border-white after:hidden group-aria-checked:after:inline-block after:rounded-full after:w-1 after:h-1"
			/>
		</MediaMenu>
	)
}

function PlaybackRateMenuButton() {
	return (
		<MediaMenuButton className='group flex cursor-pointer items-center p-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-2 data-[focus]:ring-blue-400'>
			<ArrowLeftIcon className='hidden h-4 w-4 group-aria-expanded:inline' />
			<OdometerIcon className='h-6 w-6 group-aria-expanded:hidden' />
			<span className='ml-1.5'>Speed</span>
			<span className='ml-auto text-white/50' slot='hint'></span>
			<ChevronRightIcon className='ml-0.5 h-4 w-4 text-white/50 group-aria-expanded:hidden group-aria-disabled:opacity-0' />
		</MediaMenuButton>
	)
}

type VideoPlayerProps = {
	src: string
	videoIndex: 'firstSource' | 'secondSource'
}

export const VideoPlayer = ({ src, videoIndex }: VideoPlayerProps) => {
	const player = useRef<MediaPlayerElement>(null)
	const videoContext = useVideoContext()
	const remote = useMediaRemote(player)
	const playerState = useMediaStore(player)

	useEffect(() => {
		if (playerState && videoContext[videoIndex].remote) {
			videoContext.setPlayerState(videoIndex, playerState)
		}

		if (remote && !videoContext[videoIndex].remote) {
			videoContext.setRemote(videoIndex, remote)
		}
	}, [remote, playerState, videoIndex])

	const handleRemoveVideo = () => videoContext.deleteSource(videoIndex)

	return (
		<MediaPlayer aspectRatio={16 / 9} load='eager' ref={player} src={src}>
			<MediaOutlet>
				<MediaGesture event='pointerup' action='toggle:paused' />
			</MediaOutlet>
			<div className='bg-zinc-900 mt-1 rounded-md px-2 py-1 text-white flex gap-x-2'>
				<MediaPlayButton
					className='flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'
					aria-label='Play'>
					{!playerState.ended && <PlayIcon className='paused:block ended:hidden hidden' />}
					<PauseIcon className='not-paused:block hidden' />
					<ReplayIcon className='ended:block hidden' />
				</MediaPlayButton>
				<MediaMuteButton
					className='group flex h-7 w-7 items-center justify-center

 bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'
					aria-label='Mute'>

					<MediaVolumeSlider
						className="group my-2.5 flex w-12 h-full items-center"
						trackClass="absolute left-1/2 z-0 h-3 w-1 -translate-x-1/2 bg-[#5a595a] outline-none group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400"
						trackFillClass="absolute z-20 w-1 h-[var(--slider-fill-percent)] -translate-x-1/2 bg-white will-change-[height]"
						thumbContainerClass="right-[var(--slider-fill-percent)] left-1/2 z-20 w-full h-5 -translate-x-1/2 group-data-[dragging]:bottom-[var(--slider-pointer-percent)]"
						thumbClass="right left-1/2 h-5 w-4 -translate-x-1/2 translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-150 ease-in group-data-[interactive]:opacity-100"
						aria-orientation="vertical"
					>
						<div
							className="absolute bottom-[var(--preview-bottom)] left-full flex translate-y-1/2 items-center justify-center rounded-sm bg-black px-1 py-px text-white/80 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in"
							slot="preview"
						>
							<MediaSliderValue type="pointer" format="percent" />
						</div>
					</MediaVolumeSlider>
					<MuteIcon className='hidden group-data-[volume=muted]:block' />
					<VolumeLowIcon className='hidden group-data-[volume=low]:block' />
					<VolumeHighIcon className='hidden group-data-[volume=high]:block' />
				</MediaMuteButton>
				<MediaSeekButton
					seconds={-15}
					className='flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'>
					<SeekBackward15Icon />
				</MediaSeekButton>
				<MediaSeekButton
					className='flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'
					seconds={15}
					aria-label='Seek forward 15 seconds'>
					<SeekForward15Icon />
				</MediaSeekButton>
				<FileUploadButton videoIndex={videoIndex} />
				<Button onClick={handleRemoveVideo}>Remove video</Button>
				<MediaFullscreenButton
					className='flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'
					aria-label='Fullscreen'>
					<FullscreenIcon className='not-fullscreen:block hidden' />
					<FullscreenExitIcon className='fullscreen:block hidden' />
				</MediaFullscreenButton>
				<SettingsMenu />
				<MediaTimeSlider
					className='group mx-2.5 flex h-12  items-center'
					trackClass='absolute top-1/2 left-0 z-0 h-1 w-full -translate-y-1/2 bg-[#5a595a] outline-none group-data-[focus]:ring-4 group-data-[focus]:ring-blue-400'
					trackFillClass='live:bg-red-500 absolute top-1/2 left-0 z-20 h-1 w-[var(--slider-fill-percent)] -translate-y-1/2 bg-white will-change-[width]'
					trackProgressClass='absolute top-1/2 left-0 z-10 h-1 w-[var(--media-buffered-percent)] -translate-y-1/2 bg-[#878787] will-change-[width]'
					thumbContainerClass='absolute top-0 left-[var(--slider-fill-percent)] z-20 h-full w-5 -translate-x-1/2 group-data-[dragging]:left-[var(--slider-pointer-percent)]'
					thumbClass='absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-150 ease-in group-data-[interactive]:opacity-100'
					chaptersClass='relative flex items-center w-full h-full'
					chapterContainerClass='flex items-center w-[var(--width)] h-full mr-0.5 last:mr-0'
					chapterClass='relative flex items-center w-full h-1'>
					<div
						className='absolute bottom-full left-[var(--preview-left)] flex -translate-x-1/2 items-center justify-center rounded-sm bg-black px-1 py-px text-white/80 opacity-0 transition-opacity duration-200 ease-out group-data-[interactive]:opacity-100 group-data-[interactive]:ease-in'
						slot='preview'>
						<MediaSliderValue type='pointer' format='time' />
					</div>
				</MediaTimeSlider>
			</div>
		</MediaPlayer>
	)
}

