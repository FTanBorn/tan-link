// src/services/analytics.ts
import { db } from '@/config/firebase'
import { doc, increment, serverTimestamp, setDoc } from 'firebase/firestore'

class AnalyticsService {
  async recordPageView(userId: string, username: string) {
    try {
      const today = new Date()
      const dateKey = today.toISOString().split('T')[0]
      const monthKey = dateKey.substring(0, 7)

      // Düzeltilmiş path
      const statsRef = doc(db, `users/${userId}/stats/pageViews`)

      const updateData = {
        total: increment(1),
        lastViewed: serverTimestamp(),
        [`daily.${dateKey}`]: increment(1),
        [`monthly.${monthKey}`]: increment(1),
        recentVisit: {
          timestamp: serverTimestamp(),
          username: username
        }
      }

      await setDoc(statsRef, updateData, { merge: true })
    } catch (error) {
      console.error('Error recording page view:', error)
    }
  }

  async recordLinkClick(userId: string, username: string, linkId: string, platform: string, url: string) {
    try {
      const today = new Date()
      const dateKey = today.toISOString().split('T')[0]
      const monthKey = dateKey.substring(0, 7)

      const linkStatsRef = doc(db, `users/${userId}/linkStats/${linkId}`)

      await setDoc(
        linkStatsRef,
        {
          total: increment(1),
          [`dailyClicks.${dateKey}`]: increment(1),
          [`monthlyClicks.${monthKey}`]: increment(1),
          lastClicked: serverTimestamp(),
          platform,
          url
        },
        { merge: true }
      )

      console.log('Link click recorded successfully')
    } catch (error) {
      console.error('Error recording link click:', error)
    }
  }
}

export const analyticsService = new AnalyticsService()
