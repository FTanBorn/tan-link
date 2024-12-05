'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Add as AddIcon, KeyboardArrowUp as UpIcon, KeyboardArrowDown as DownIcon } from '@mui/icons-material'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { collection, addDoc, getDocs, doc, deleteDoc, writeBatch, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from '@/context/AuthContext'
import { useTour } from '@/context/TourContext'
import { platformIcons } from './constants'
import SortableLink from './SortableLink'
import LinkPreview from './LinkPreview'
import AddLinkDialog from './AddLinkDialog'

interface Link {
  id: string
  platform: keyof typeof platformIcons
  title: string
  url: string
  order: number
}

interface AddLinkData {
  platform: keyof typeof platformIcons
  title: string
  url: string
}

interface FirestoreLink extends Link {
  createdAt: Date
  updatedAt: Date
}

export default function LinksStep() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useAuth()
  const { nextStep, prevStep, markStepCompleted } = useTour()
  const [links, setLinks] = useState<Link[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    loadLinks()
  }, [user])

  const loadLinks = async () => {
    if (!user) return
    setLoading(true)
    try {
      const linksRef = collection(db, `users/${user.uid}/links`)
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
      setLinks(linksData)
    } catch (err) {
      console.error('Error loading links:', err)
      setError('Failed to load links')
    } finally {
      setLoading(false)
    }
  }

  const moveLink = async (index: number, direction: 'up' | 'down') => {
    if (!user) return
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= links.length) return

    const newLinks = [...links]
    const temp = newLinks[index]
    newLinks[index] = newLinks[newIndex]
    newLinks[newIndex] = temp

    setLinks(newLinks)

    const batch = writeBatch(db)
    newLinks.forEach((link, idx) => {
      const linkRef = doc(db, `users/${user.uid}/links/${link.id}`)
      batch.update(linkRef, { order: idx })
    })

    try {
      await batch.commit()
    } catch (err) {
      console.error('Error updating order:', err)
      loadLinks()
    }
  }

  const handleUpdateLink = async (linkData: AddLinkData & { id?: string }) => {
    if (!user || !linkData.id) return
    try {
      const linkRef = doc(db, `users/${user.uid}/links/${linkData.id}`)
      await updateDoc(linkRef, {
        platform: linkData.platform,
        title: linkData.title,
        url: linkData.url,
        updatedAt: new Date()
      })
      await loadLinks()
      setIsDialogOpen(false)
      setEditingLink(null)
    } catch (err) {
      console.error('Error updating link:', err)
      setError('Failed to update link')
    }
  }

  const handleAddLink = async (linkData: AddLinkData) => {
    if (!user) return
    try {
      if (editingLink) {
        await handleUpdateLink({ ...linkData, id: editingLink.id })
      } else {
        await addDoc(collection(db, `users/${user.uid}/links`), {
          ...linkData,
          order: links.length,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        await loadLinks()
        setIsDialogOpen(false)
      }
    } catch (err) {
      console.error('Error adding/updating link:', err)
      setError('Failed to save link')
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!user) return
    try {
      await deleteDoc(doc(db, `users/${user.uid}/links/${id}`))

      // Re-order remaining links
      const remainingLinks = links.filter(link => link.id !== id)
      const batch = writeBatch(db)
      remainingLinks.forEach((link, idx) => {
        const linkRef = doc(db, `users/${user.uid}/links/${link.id}`)
        batch.update(linkRef, { order: idx })
      })
      await batch.commit()

      await loadLinks()
    } catch (err) {
      console.error('Error deleting link:', err)
      setError('Failed to delete link')
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!user) return
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = links.findIndex(link => link.id === active.id)
    const newIndex = links.findIndex(link => link.id === over.id)

    const newLinks = arrayMove(links, oldIndex, newIndex)
    setLinks(newLinks)

    const batch = writeBatch(db)
    newLinks.forEach((link, index) => {
      const linkRef = doc(db, `users/${user.uid}/links/${link.id}`)
      batch.update(linkRef, { order: index })
    })

    try {
      await batch.commit()
    } catch (err) {
      console.error('Error updating order:', err)
      loadLinks()
    }
  }

  const handleContinue = () => {
    if (links.length > 0) {
      markStepCompleted('links')
      nextStep()
    } else {
      setError('Please add at least one link before continuing')
    }
  }

  const renderLinks = () => {
    if (isMobile) {
      return links.map((link, index) => (
        <Box key={link.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <IconButton size='small' onClick={() => moveLink(index, 'up')} disabled={index === 0}>
              <UpIcon />
            </IconButton>
            <IconButton size='small' onClick={() => moveLink(index, 'down')} disabled={index === links.length - 1}>
              <DownIcon />
            </IconButton>
          </Box>
          <Box flexGrow={1}>
            <SortableLink
              link={link}
              onEdit={() => {
                setEditingLink(link)
                setIsDialogOpen(true)
              }}
              onDelete={() => handleDeleteLink(link.id)}
            />
          </Box>
        </Box>
      ))
    }

    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={links.map(link => link.id)} strategy={verticalListSortingStrategy}>
          {links.map(link => (
            <SortableLink
              key={link.id}
              link={link}
              onEdit={() => {
                setEditingLink(link)
                setIsDialogOpen(true)
              }}
              onDelete={() => handleDeleteLink(link.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
    )
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' height='400px'>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 2 }}>
            <Typography variant='h5' fontWeight='bold'>
              Add Your Links
            </Typography>
            <Typography variant='subtitle2' color='text.secondary'>
              Add and organize your social media links
            </Typography>
          </Box>

          <Button
            variant='contained'
            fullWidth
            size='large'
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
            sx={{ mb: 3 }}
          >
            Add New Link
          </Button>

          {renderLinks()}

          {links.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '2px dashed',
                borderColor: 'divider'
              }}
            >
              <Typography color='text.secondary' gutterBottom>
                No links added yet
              </Typography>
              <Button variant='outlined' startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>
                Add Your First Link
              </Button>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={5}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Typography variant='h6' gutterBottom>
              Preview
            </Typography>
            <LinkPreview links={links} />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant='outlined' onClick={prevStep}>
          Back
        </Button>
        <Button variant='contained' onClick={handleContinue}>
          Continue
        </Button>
      </Box>

      <AddLinkDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingLink(null)
        }}
        onAdd={handleAddLink}
        editingLink={editingLink}
      />
    </Box>
  )
}
