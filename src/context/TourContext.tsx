
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { useAuth } from './AuthContext'
import { db } from '@/config/firebase'

export type StepType = 'register' | 'username' | 'links' | 'theme' | 'preview'

interface TourContextType {
  currentStep: StepType
  stepsCompleted: Record<StepType, boolean>
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: StepType) => void
  markStepCompleted: (step: StepType) => void
  isStepCompleted: (step: StepType) => boolean
}

const steps: StepType[] = ['register', 'username', 'links', 'theme', 'preview']

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState<StepType>('register')
  const [stepsCompleted, setStepsCompleted] = useState<Record<StepType, boolean>>({
    register: false,
    username: false,
    links: false,
    theme: false,
    preview: false
  })

  useEffect(() => {
    const checkUserProgress = async () => {
      if (!user) {
        setCurrentStep('register')
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        const userData = userDoc.data()

        if (!userData?.username) {
          setCurrentStep('username')
          setStepsCompleted(prev => ({ ...prev, register: true }))
          return
        }

        const linksRef = collection(db, `users/${user.uid}/links`)
        const linksSnapshot = await getDocs(linksRef)
        const hasLinks = linksSnapshot.size > 0

        const newStepsCompleted = {
          register: true,
          username: true,
          links: hasLinks,
          theme: !!userData.theme,
          preview: false
        }

        setStepsCompleted(newStepsCompleted)

        if (!hasLinks) {
          setCurrentStep('links')
        } else if (!userData.theme) {
          setCurrentStep('theme')
        } else {
          router.push('/dashboard/stats')
        }
      } catch (error) {
        console.error('Error checking user progress:', error)
        setCurrentStep('register')
      }
    }

    checkUserProgress()
  }, [user])

  const nextStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const prevStep = () => {
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const goToStep = (step: StepType) => {
    const targetIndex = steps.indexOf(step)
    const currentIndex = steps.indexOf(currentStep)

    if (targetIndex <= currentIndex || stepsCompleted[steps[targetIndex - 1]]) {
      setCurrentStep(step)
    }
  }

  const markStepCompleted = (step: StepType) => {
    setStepsCompleted(prev => ({ ...prev, [step]: true }))
  }

  const isStepCompleted = (step: StepType) => stepsCompleted[step]

  const value = {
    currentStep,
    stepsCompleted,
    nextStep,
    prevStep,
    goToStep,
    markStepCompleted,
    isStepCompleted
  }

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>
}

export const useTour = () => {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}
