import { useEffect, useState } from 'react'
import type { Songs } from '@/app/types'

export const useGetSongs = () => {
	const [loadingSongs, setLoadingSongs] = useState(true)
	const [songs, setSongs] = useState<Songs>([])
	const [fetchSongsError, setError] = useState(null)

	const fetchSongs = async () => {
		setLoadingSongs(true)

		try {
			const response = await fetch(
				'https://sunoapi-fitodacs-projects.vercel.app/api/get'
			)

			if (!response.ok) {
				throw new Error('Error en la solicitud')
			}

			const data = await response.json()
			// console.log('data', data)
			setSongs(data)
		} catch (err) {
			console.log('useGetSongs error', err)
			setError(err.message)
		} finally {
			setLoadingSongs(false)
		}
	}

	useEffect(() => {
		fetchSongs()
	}, [])

	return { songs, setSongs, loadingSongs, setLoadingSongs, fetchSongsError, fetchSongs }
}
