'use client'
import { useState, useEffect } from 'react'
import { Box, Grid, Typography, Button, Alert, CircularProgress } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { collection, addDoc, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore'
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

export default function LinksStep() {
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
            } as Link)
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

  const handleAddLink = async (linkData: AddLinkData) => {
    if (!user) return
    try {
      await addDoc(collection(db, `users/${user.uid}/links`), {
        ...linkData,
        order: links.length,
        createdAt: new Date()
      })
      await loadLinks()
      setIsDialogOpen(false)
    } catch (err) {
      console.error('Error adding link:', err)
      setError('Failed to add link')
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!user) return
    try {
      await deleteDoc(doc(db, `users/${user.uid}/links/${id}`))
      await loadLinks()
    } catch (err) {
      console.error('Error deleting link:', err)
      setError('Failed to delete link')
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
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Links List */}
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
            size='small'
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
            sx={{ mb: 2 }}
          >
            Add New Link
          </Button>

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

        {/* Preview */}
        <Grid item xs={12} md={5}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Typography variant='h6' gutterBottom>
              Preview
            </Typography>
            <LinkPreview links={links} />
          </Box>
        </Grid>
      </Grid>

      {/* Navigation */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button variant='outlined' onClick={prevStep}>
          Back
        </Button>
        <Button variant='contained' onClick={handleContinue}>
          Continue
        </Button>
      </Box>

      {/* Add/Edit Dialog */}
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
