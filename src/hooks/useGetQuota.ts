import { useEffect, useState } from 'react'

interface Quota {
	credits_left: number
	monthly_limit: number
	monthly_usage: number
	period: null | any
}

export const useGetQuota = () => {
	const [quota, setQuota] = useState<Quota | null>(null)

	const getQuota = async () => {
		try {
			const response = await fetch(
				'https://sunoapi-fitodacs-projects.vercel.app/api/get_limit'
			)

			if (!response.ok) {
				throw new Error('Error en la solicitud')
			}

			const data = await response.json()
			// console.log('data', data)
			setQuota(data)
		} catch (err) {
			console.log('useGetSongs error', err)
		} finally {
		}
	}

	useEffect(() => {
		getQuota()
	}, [])

	return { quota, getQuota }
}
