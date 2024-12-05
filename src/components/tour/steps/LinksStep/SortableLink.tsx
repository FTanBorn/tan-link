'use client'
import { Card, CardContent, IconButton, Box, Typography, Tooltip } from '@mui/material'
import { DragIndicator, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material'
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const platformInfo = platformIcons[link.platform]

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 1,
        border: '1px solid',
        borderColor: 'divider',
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        '&:hover': {
          boxShadow: 2,
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
          py: '5px !important'
        }}
      >
        <IconButton size='small' {...attributes} {...listeners} sx={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
          <DragIndicator />
        </IconButton>

        <Box
          sx={{
            width: 30,
            height: 30,
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

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant='subtitle2' noWrap>
            {link.title || platformInfo.placeholder}
          </Typography>
          <Typography variant='body2' color='text.secondary' noWrap sx={{ maxWidth: '100%' }}>
            {link.url}
          </Typography>
        </Box>

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
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Delete'>
            <IconButton
              size='small'
              onClick={e => {
                e.stopPropagation()
                onDelete()
              }}
              color='error'
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}
