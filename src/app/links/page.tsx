'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Tooltip,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragHandle as DragHandleIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Instagram,
  Twitter,
  LinkedIn,
  GitHub,
  YouTube,
  Facebook,
  WhatsApp,
  Telegram,
  Language,
  Mail,
  Store,
  Code
} from '@mui/icons-material'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ProfilePreview from '@/components/home/ProfilePreview'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/config/firebase'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore'

const linkTypes = [
  { type: 'instagram', icon: <Instagram />, label: 'Instagram' },
  { type: 'twitter', icon: <Twitter />, label: 'Twitter' },
  { type: 'linkedin', icon: <LinkedIn />, label: 'LinkedIn' },
  { type: 'github', icon: <GitHub />, label: 'GitHub' },
  { type: 'youtube', icon: <YouTube />, label: 'YouTube' },
  { type: 'facebook', icon: <Facebook />, label: 'Facebook' },
  { type: 'whatsapp', icon: <WhatsApp />, label: 'WhatsApp' },
  { type: 'telegram', icon: <Telegram />, label: 'Telegram' },
  { type: 'website', icon: <Language />, label: 'Website' },
  { type: 'store', icon: <Store />, label: 'Store' },
  { type: 'email', icon: <Mail />, label: 'Email' },
  { type: 'portfolio', icon: <Code />, label: 'Portfolio' }
]

interface LinkItem {
  id: string
  type: string
  title: string
  url: string
  order: number
}

function SortableLink({
  link,
  onDelete,
  onEdit
}: {
  link: LinkItem
  onDelete: (id: string) => void
  onEdit: (link: LinkItem) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card sx={{ mb: 2 }}>
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&:last-child': { pb: 2 },
            minHeight: '60px'
          }}
        >
          <div {...listeners} style={{ cursor: 'move', flexShrink: 0 }}>
            <DragHandleIcon sx={{ color: 'text.secondary' }} />
          </div>

          <Box sx={{ flexShrink: 0 }}>{linkTypes.find(t => t.type === link.type)?.icon}</Box>

          <Box
            sx={{
              flexGrow: 1,
              minWidth: 0
            }}
          >
            <Typography variant='subtitle2' noWrap>
              {link.title || linkTypes.find(t => t.type === link.type)?.label}
            </Typography>
            <Typography variant='body2' color='text.secondary' noWrap sx={{ maxWidth: '100%' }}>
              {link.url}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexShrink: 0
            }}
          >
            <Tooltip title='Edit'>
              <IconButton onClick={() => onEdit(link)} color='primary'>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title='Delete'>
              <IconButton onClick={() => onDelete(link.id)} color='error'>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LinksPage() {
  const { user } = useAuth()
  const [links, setLinks] = useState<LinkItem[]>([])
  const [newLink, setNewLink] = useState({
    type: '',
    title: '',
    url: ''
  })
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, `users/${user.uid}/links`), orderBy('order'))

    const unsubscribe = onSnapshot(q, snapshot => {
      const linksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LinkItem[]

      setLinks(linksData)
    })

    return () => unsubscribe()
  }, [user])

  const handleAddLink = async () => {
    if (!user || !newLink.type || !newLink.url) return

    try {
      const linkRef = collection(db, `users/${user.uid}/links`)
      await addDoc(linkRef, {
        ...newLink,
        order: links.length,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      setNewLink({ type: '', title: '', url: '' })
    } catch (error) {
      console.error('Error adding link:', error)
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!user) return

    try {
      await deleteDoc(doc(db, `users/${user.uid}/links/${id}`))
    } catch (error) {
      console.error('Error deleting link:', error)
    }
  }

  const handleEditLink = async () => {
    if (!user || !editingLink) return

    try {
      const linkRef = doc(db, `users/${user.uid}/links/${editingLink.id}`)
      await updateDoc(linkRef, {
        type: editingLink.type,
        title: editingLink.title,
        url: editingLink.url,
        updatedAt: new Date()
      })

      setEditingLink(null)
    } catch (error) {
      console.error('Error updating link:', error)
    }
  }

  const handleDragEnd = async (event: any) => {
    if (!user || !event.active || !event.over) return

    const { active, over } = event
    if (active.id === over.id) return

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
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sol taraf - Link Yönetimi */}
        <Grid item xs={12} md={7}>
          {editingLink ? (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant='h6'>Edit Link</Typography>
                  <IconButton onClick={() => setEditingLink(null)}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label='Link Type'
                      value={editingLink.type}
                      onChange={e => setEditingLink({ ...editingLink, type: e.target.value })}
                    >
                      {linkTypes.map(option => (
                        <MenuItem key={option.type} value={option.type}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {option.icon}
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Title (Optional)'
                      value={editingLink.title}
                      onChange={e => setEditingLink({ ...editingLink, title: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='URL'
                      value={editingLink.url}
                      onChange={e => setEditingLink({ ...editingLink, url: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant='contained'
                      onClick={handleEditLink}
                      startIcon={<SaveIcon />}
                      sx={{ borderRadius: '20px' }}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant='h6' gutterBottom>
                  Add New Link
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label='Link Type'
                      value={newLink.type}
                      onChange={e => setNewLink({ ...newLink, type: e.target.value })}
                    >
                      {linkTypes.map(option => (
                        <MenuItem key={option.type} value={option.type}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {option.icon}
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Title (Optional)'
                      value={newLink.title}
                      onChange={e => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder='Enter custom title'
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='URL'
                      value={newLink.url}
                      onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder='Enter your link'
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant='contained'
                      startIcon={<AddIcon />}
                      onClick={handleAddLink}
                      disabled={!newLink.type || !newLink.url}
                      sx={{ borderRadius: '20px' }}
                    >
                      Add Link
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Linkler listesi */}
          <Typography variant='h6' gutterBottom sx={{ mt: 4, mb: 2 }}>
            Your Links
          </Typography>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map(link => link.id)} strategy={verticalListSortingStrategy}>
              {links.map(link => (
                <SortableLink key={link.id} link={link} onDelete={handleDeleteLink} onEdit={setEditingLink} />
              ))}
            </SortableContext>
          </DndContext>
        </Grid>

        {/* Sağ taraf - Önizleme */}
        <Grid item xs={12} md={5}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Typography variant='h6' gutterBottom>
              Preview
            </Typography>
            <ProfilePreview links={links} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
