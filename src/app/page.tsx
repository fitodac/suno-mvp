'use client'

import { useEffect, useRef, useState } from 'react'
import {
	Textarea,
	Switch,
	Button,
	Image,
	Spinner,
	ScrollShadow,
	cn,
} from '@nextui-org/react'
import numeral from 'numeral'
import { useCreateSong, useGetQuota, useGetSongs } from '@/hooks'

export default function Home() {
	/**
	 * Prompt generator
	 * -------------------------------------------------------------------------------------------------------
	 */
	const { quota, getQuota } = useGetQuota()

	const [form, setForm] = useState({
		prompt: '',
		make_instrumental: false,
		model: 'chirp-v3-5|chirp-v3-0',
	})

	const { createSong, creatingSong, errorCreatingSong } = useCreateSong()

	const generatePrompt = () => {
		getQuota()
		console.log('propmt generated')

		createSong(form, () => {
			setLoadingSongs(true)
			fetchSongs()
		})
	}

	/**
	 * Prompt generator end
	 * -------------------------------------------------------------------------------------------------------
	 */

	/**
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 * PLAYER START
	 * -------------------------------------------------------------------------------------------------------
	 */
	const [plyrSrc, setPlyrSrc] = useState<null | string>('')
	const [active, setActive] = useState<string>('')
	const plyr = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		if (plyr.current) plyr.current.play()
	}, [plyr])

	const { songs, fetchSongs, loadingSongs, setLoadingSongs, fetchSongsError } =
		useGetSongs()

	// Player start
	const playerStart = (src: string) => {
		setPlyrSrc(null)

		setTimeout(() => {
			setPlyrSrc(src)

			setTimeout(() => {
				if (plyr.current) {
					plyr.current.play()
				}
			}, 100)
		}, 100)
	}
	/**
	 * -------------------------------------------------------------------------------------------------------
	 * PLAYER END
	 */

	/**
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 *
	 * -------------------------------------------------------------------------------------------------------
	 * RENDER
	 */

	return (
		<main className="flex min-h-screen flex-col px-10 pb-7 font-extralight">
			<div className="w-full flex py-8">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					className="fill-gray-500 w-10 h-10"
				>
					<path d="M15 4.58152V12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C12.3506 9 12.6872 9.06016 13 9.17071V2.04938C18.0533 2.5511 22 6.81465 22 12C22 17.5229 17.5228 22 12 22C6.47715 22 2 17.5229 2 12C2 6.81465 5.94668 2.5511 11 2.04938V4.0619C7.05369 4.55399 4 7.92038 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 8.64262 17.9318 5.76829 15 4.58152Z"></path>
				</svg>
			</div>

			<div className="w-full h-full max-w-6xl flex gap-x-20">
				{/* Main content */}
				<div className="w-3/5 space-y-6">
					{quota && (
						<div className="text-sm flex justify-between">
							<div className="">Créditos restantes {quota.credits_left}</div>
						</div>
					)}

					<div className="relative space-y-6">
						<fieldset>
							<Textarea
								size="lg"
								minRows={10}
								onValueChange={(e) => {
									if (form.prompt.length <= 3000)
										setForm({ ...form, prompt: e })
								}}
								defaultValue={form.prompt}
								isDisabled={creatingSong}
								classNames={{
									inputWrapper: 'h-52',
									input: 'font-extralight',
								}}
							></Textarea>

							<div className="text-sm mt-2 flex justify-end">
								{form.prompt.length}/500
							</div>

							<div className="text-sm flex gap-3">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-5"
								>
									<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path>
								</svg>
								Ten en cuenta que el límite del prompt es de 500 caracteres.
							</div>
						</fieldset>

						<div className="flex justify-between items-center gap-10">
							<Switch
								defaultSelected={form.make_instrumental}
								onValueChange={(e) =>
									setForm({ ...form, make_instrumental: e })
								}
								isDisabled={creatingSong}
							>
								Instrumental
							</Switch>

							<Button
								size="lg"
								type="submit"
								color="primary"
								className="px-20"
								onPress={generatePrompt}
								isDisabled={creatingSong}
							>
								Crear
							</Button>
						</div>

						{creatingSong && (
							<div className="bg-black/80 text-center inset-0 -top-6 absolute grid place-content-center z-30">
								<div>
									<Spinner className=" z-30" />
									<div className="text-sm">
										Creando la canción... por favor, ten paciencia
									</div>
								</div>
							</div>
						)}
					</div>

					{errorCreatingSong && (
						<div className="text-danger">Error al crear la canción</div>
					)}

					<div className={cn(creatingSong && 'opacity-50 pointer-events-none')}>
						<div className="mt-10 text-sm">Prompts de ejemplo</div>
						<div className="mt-2 space-y-3 text-sm font-extralight">
							<div className="bg-gray-900 p-3 rounded-xl">
								Pop, Dance Pop, Ethereal, female vocals, catchy, eletronic, 130
								bpm, high quality production, perfect sounds
							</div>
							<div className="bg-gray-900 p-3 rounded-xl">
								Dance-pop, nostalgic, intimate, emotive male voice,Synth lead,
								bassline. high-quality production,perfect sounds, earworm
							</div>
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="w-2/5 relative">
					{loadingSongs && (
						<Spinner className="absolute left-1/2 top-20 z-30" />
					)}

					{fetchSongsError ? (
						<>
							<div className="text-danger">Error al obtener canciones</div>
						</>
					) : (
						<>
							<div className="text-sm text-gray-500">Canciones generadas</div>

							<ScrollShadow className="h-[600px] mt-6">
								<div
									className={cn(
										'space-y-2 pb-20',
										loadingSongs && 'opacity-30 pointer-events-none'
									)}
								>
									{songs && !songs.length && (
										<div className="font-extralight">
											No hay canciones para mostrar
										</div>
									)}

									{songs &&
										songs.map((e) => (
											<Button
												key={e.id}
												fullWidth
												className={cn(
													'bg-transparent flex gap-5 items-center h-auto justify-start p-0 group'
												)}
												onPress={() => {
													playerStart(e.audio_url)
													setActive(e.id)
												}}
											>
												<div
													className={cn(
														'relative overflow-hidden rounded-2xl border-2',
														active === e.id
															? 'border-primary'
															: 'border-foreground-300'
													)}
												>
													<div
														className={cn(
															'bg-black/30 inset-0 absolute flex items-center justify-center z-30 group-hover:opacity-100',
															active !== e.id && 'opacity-0'
														)}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															className="w-10 fill-white"
														>
															<path d="M7.75194 5.43872L18.2596 11.5682C18.4981 11.7073 18.5787 12.0135 18.4396 12.252C18.3961 12.3265 18.3341 12.3885 18.2596 12.432L7.75194 18.5615C7.51341 18.7006 7.20725 18.62 7.06811 18.3815C7.0235 18.305 7 18.2181 7 18.1296V5.87061C7 5.59446 7.22386 5.37061 7.5 5.37061C7.58853 5.37061 7.67547 5.39411 7.75194 5.43872Z"></path>
														</svg>
													</div>

													<Image
														width={100}
														height={100}
														fallbackSrc="https://via.placeholder.com/100x100"
														src={
															e.image_url ??
															'https://via.placeholder.com/100x100'
														}
														alt={e.title}
														removeWrapper
														classNames={{
															img: 'object-cover',
														}}
													/>
												</div>

												<div className="flex flex-col items-start">
													<div className="text-lg">{e.title}</div>
													<div className="text-foreground-400 text-sm font-medium">
														{e.duration
															? numeral(e.duration).format('00:00')
															: '--:--'}
													</div>
												</div>
											</Button>
										))}
								</div>
							</ScrollShadow>
						</>
					)}
				</div>
			</div>

			{plyrSrc && (
				<audio ref={plyr} controls className="w-full bottom-0 fixed">
					<source src={plyrSrc} type="audio/mp3" />
				</audio>
			)}
		</main>
	)
}
