// src/app/links/page.tsx
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
  useTheme,
  Drawer,
  Fab,
  Container
} from '@mui/material'
import {
  Add as AddIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
  RemoveRedEye as PreviewIcon
} from '@mui/icons-material'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { collection, addDoc, getDocs, doc, deleteDoc, writeBatch, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from '@/context/AuthContext'
import SortableLink from './components/SortableLink'
import LinkPreview from './components/LinkPreview'
import AddLinkDialog from './components/AddLinkDialog'
import { platformIcons } from './components/constants'

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

export default function LinksPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useAuth()
  const [links, setLinks] = useState<Link[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPreview, setShowPreview] = useState(false)

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
    <Container maxWidth='lg'>
      <Box>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Links Section */}
          <Grid item xs={12} md={7}>
            <Box
              sx={{
                mb: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1
              }}
            >
              <Box>
                <Typography variant='h5' fontWeight='bold'>
                  Your Links
                </Typography>
                <Typography variant='subtitle2' color='text.secondary'>
                  {links.length} {links.length === 1 ? 'link' : 'links'} added
                </Typography>
              </Box>
              {isMobile && (
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => setShowPreview(true)}
                  startIcon={<PreviewIcon />}
                >
                  Preview
                </Button>
              )}
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
                  py: isMobile ? 4 : 8,
                  px: 2,
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

          {/* Preview Section - Desktop */}
          {!isTablet && (
            <Grid item md={5}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <Typography variant='h6' gutterBottom>
                  Preview
                </Typography>
                <LinkPreview links={links} />
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Preview Drawer - Mobile */}
        {isMobile && (
          <Drawer
            anchor='bottom'
            open={showPreview}
            onClose={() => setShowPreview(false)}
            PaperProps={{
              sx: {
                height: '80vh',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16
              }
            }}
          >
            <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
              <Typography variant='h6' gutterBottom>
                Preview
              </Typography>
              <LinkPreview links={links} />
            </Box>
          </Drawer>
        )}

        {/* Mobile Preview FAB */}
        {isMobile && !showPreview && links.length > 0 && (
          <Fab
            color='primary'
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16
            }}
            onClick={() => setShowPreview(true)}
          >
            <PreviewIcon />
          </Fab>
        )}

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
    </Container>
  )
}
