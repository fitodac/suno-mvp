import { useState } from 'react'

interface Props {
	prompt: string
	make_instrumental: boolean
	model: string
}



const fetchClip = async (id: string) => {
	const response = await fetch(
		`https://sunoapi-fitodacs-projects.vercel.app/api/clip?id=${id}`
	)

	const data = await response.json()

	if (!['complete', 'streaming'].includes(data.status)) {
		await new Promise(resolve => setTimeout(resolve, 2000));
		await fetchClip(id)
	}

	return data
}

export const useCreateSong = () => {
	const [creatingSong, setCreatingSong] = useState(false)
	const [errorCreatingSong, setErrorCreatingSong] = useState(false)

	const createSong = async (props: Props, cb: () => void) => {
		setCreatingSong(true)

		try {
			const response = await fetch(
				'https://sunoapi-fitodacs-projects.vercel.app/api/generate',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(props),
				}
			)
			const data = await response.json()

			await fetchClip(data[0].id)

		} catch (err) {
			console.log('useCreateSong error', err)
			// @ts-ignore
			setErrorCreatingSong(err.message)
		} finally {
			cb()
			setCreatingSong(false)
		}
	}

	return { createSong, creatingSong, errorCreatingSong }
}
