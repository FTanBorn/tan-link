// src/hooks/useAnalytics.ts
import { useState, useEffect } from 'react'
import { db } from '@/config/firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { platformIcons } from '@/components/tour/steps/LinksStep/constants'

type PlatformType = keyof typeof platformIcons

interface LinkStats {
  title: string
  clicks: number
  progress: number
  platform: PlatformType
  url: string
  lastClicked?: Date
}

interface Stats {
  totalViews: number
  totalClicks: number
  activeLinks: number
  viewsTrend: number
  clicksTrend: number
}

interface Link {
  id: string
  platform: keyof typeof platformIcons
  title: string
  url: string
  order: number
}

interface FirestoreLink extends Link {
  createdAt: Date
  updatedAt: Date
}

export const useAnalytics = (userId: string | undefined) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats>({
    totalViews: 0,
    totalClicks: 0,
    activeLinks: 0,
    viewsTrend: 0,
    clicksTrend: 0
  })
  const [linkStats, setLinkStats] = useState<LinkStats[]>([])
  const [linksData, setLinksData] = useState<Link[]>([])

  useEffect(() => {
    if (!userId) return

    const fetchAnalytics = async () => {
      try {
        const pageViewsRef = doc(db, `users/${userId}/stats/pageViews`)
        const pageViewsDoc = await getDoc(pageViewsRef)

        const pageViews = pageViewsDoc.exists() ? pageViewsDoc.data() : { total: 0 }

        // Link istatistiklerini alıyoruz
        const linkStatsRef = collection(db, `users/${userId}/linkStats`)
        const linkStatsSnapshot = await getDocs(linkStatsRef)

        // Link verilerini alıyoruz
        const linksRef = collection(db, `users/${userId}/links`)
        const linksSnapshot = await getDocs(linksRef)
        const linksData = linksSnapshot.docs
          .map(
            doc =>
              ({
                id: doc.id,
                ...doc.data()
              } as FirestoreLink)
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0))
        setLinksData(linksData)
        const links = new Map(linksSnapshot.docs.map(doc => [doc.id, doc.data()]))

        // Link istatistiklerini işliyoruz
        let totalClicks = 0
        const processedLinkStats = linkStatsSnapshot.docs.map(doc => {
          const data = doc.data()
          const link = links.get(doc.id)
          totalClicks += data.total || 0

          return {
            title: link?.title || 'Unknown Link',
            clicks: data.total || 0,
            platform: link?.platform || 'website',
            url: link?.url || '#',
            lastClicked: data.lastClicked?.toDate(),
            progress: 0
          }
        })

        // Progress değerlerini hesaplıyoruz
        const maxClicks = Math.max(...processedLinkStats.map(link => link.clicks))
        const linksWithProgress = processedLinkStats
          .map(link => ({
            ...link,
            progress: maxClicks > 0 ? (link.clicks / maxClicks) * 100 : 0
          }))
          .sort((a, b) => b.clicks - a.clicks)

        setStats({
          totalViews: pageViews.total || 0,
          totalClicks,
          activeLinks: linksSnapshot.docs.length,
          viewsTrend: 0,
          clicksTrend: 0
        })
        setLinkStats(linksWithProgress)
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [userId])

  return { stats, linkStats, loading, error, linksData }
}
