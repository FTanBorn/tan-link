// src/components/SortableLink.tsx
'use client'
import { useState } from 'react'
import {
  Card,
  CardContent,
  IconButton,
  Box,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import { DragIndicator, Delete as DeleteIcon, Edit as EditIcon, OpenInNew as OpenIcon } from '@mui/icons-material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { platformIcons } from './constants'

interface SortableLinkProps {
  link: {
    id: string
    platform: keyof typeof platformIcons
    title: string
    url: string
  }
  onEdit: () => void
  onDelete: () => void
}

export default function SortableLink({ link, onEdit, onDelete }: SortableLinkProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const platformInfo = platformIcons[link.platform]

  const handleDelete = () => {
    setShowDeleteDialog(false)
    onDelete()
  }

  const handleOpenLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(link.url, '_blank')
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        elevation={isDragging ? 4 : 0}
        sx={{
          mb: 1,
          border: '1px solid',
          borderColor: 'divider',
          opacity: isDragging ? 0.5 : 1,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 2,
            borderColor: 'primary.main',
            '& .actions': {
              opacity: 1
            }
          }
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: '5px !important',
            px: isMobile ? 1 : 2,
            '&:last-child': {
              pb: '5px'
            }
          }}
        >
          {/* Drag Handle */}

          {!isMobile && (
            <IconButton
              size='small'
              {...attributes}
              {...listeners}
              sx={{
                cursor: isDragging ? 'grabbing' : 'grab',
                color: 'text.secondary'
              }}
            >
              <DragIndicator />
            </IconButton>
          )}

          {/* Platform Icon */}
          <Box
            sx={{
              width: isMobile ? 24 : 30,
              height: isMobile ? 24 : 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              bgcolor: platformInfo.bgColor,
              color: platformInfo.color,
              flexShrink: 0
            }}
          >
            {platformInfo.icon}
          </Box>

          {/* Link Info */}
          <Box
            sx={{
              flexGrow: 1,
              minWidth: 0,
              overflow: 'hidden',
              width: { xs: '150px', sm: '200px', md: '300px' },
              maxWidth: '100%'
            }}
            onClick={handleOpenLink}
          >
            <Typography
              variant='subtitle2'
              noWrap
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main'
                },
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              {link.title || platformInfo.placeholder}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
            >
              <Box
                component='span'
                sx={{
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                {link.url}
              </Box>
              <OpenIcon sx={{ fontSize: 14, flexShrink: 0 }} />
            </Typography>
          </Box>

          {/* Actions */}
          <Box
            className='actions'
            sx={{
              display: 'flex',
              opacity: { xs: 1, sm: 0 },
              transition: 'opacity 0.2s'
            }}
          >
            <Tooltip title='Edit'>
              <IconButton
                size='small'
                onClick={e => {
                  e.stopPropagation()
                  onEdit()
                }}
                sx={{ mr: 0.5 }}
              >
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>

            <Tooltip title='Delete'>
              <IconButton
                size='small'
                onClick={e => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
                color='error'
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} maxWidth='xs' fullWidth>
        <DialogTitle>Delete Link</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this link?</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant='subtitle2'>{link.title || platformInfo.placeholder}</Typography>
            <Typography variant='body2' color='text.secondary'>
              {link.url}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color='error' variant='contained'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
