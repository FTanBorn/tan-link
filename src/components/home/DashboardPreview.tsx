'use client'
import { memo } from 'react'
import { Box, Paper, Typography, Grid, Button, Divider, LinearProgress, Avatar, useTheme } from '@mui/material'
import {
  BarChart as BarChartIcon,
  TrendingUp,
  Link as LinkIcon,
  Share as ShareIcon,
  Visibility,
  Add as AddIcon,
  GridView as GridViewIcon
} from '@mui/icons-material'

const platformColors = {
  instagram: { color: '#E1306C', bgColor: '#FCE4EC' },
  twitter: { color: '#1DA1F2', bgColor: '#E3F2FD' },
  youtube: { color: '#FF0000', bgColor: '#FFEBEE' },
  linkedin: { color: '#0077B5', bgColor: '#E3F2FD' },
  website: { color: '#9C27B0', bgColor: '#F3E5F5' }
}

// Sample data
const metrics = [
  { id: 'views', label: 'Views', value: '2,584', icon: <Visibility />, color: '#2196F3' },
  { id: 'clicks', label: 'Clicks', value: '947', icon: <TrendingUp />, color: '#4CAF50' },
  { id: 'links', label: 'Links', value: '8', icon: <LinkIcon />, color: '#FF9800' },
  { id: 'ctr', label: 'CTR', value: '36.7%', icon: <BarChartIcon />, color: '#9C27B0' }
]

type Platform = 'instagram' | 'twitter' | 'youtube' | 'linkedin' | 'website';

const linkPerformance: { id: number; platform: Platform; title: string; clicks: number; progress: number }[] = [
  { id: 1, platform: 'instagram', title: 'Instagram', clicks: 342, progress: 100 },
  { id: 2, platform: 'twitter', title: 'Twitter', clicks: 187, progress: 55 },
  { id: 3, platform: 'youtube', title: 'YouTube', clicks: 121, progress: 35 }
]

function DashboardPreview() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return (
    <Paper
      elevation={4}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Dashboard Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GridViewIcon color='primary' />
          <Typography variant='h6' fontWeight='bold' sx={{ fontSize: '1rem' }}>
            Dashboard
          </Typography>
        </Box>

        <Avatar
          src='/api/placeholder/40/40'
          sx={{ width: 32, height: 32, border: '2px solid', borderColor: 'primary.main' }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 2 }}>
        {/* Welcome Card */}
        <Paper
          variant='outlined'
          sx={{
            p: 2,
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: isDarkMode ? 'rgba(15, 23, 42, 0.3)' : 'rgba(249, 250, 251, 0.5)'
          }}
        >
          <Box>
            <Typography variant='h6' sx={{ fontSize: '0.95rem', fontWeight: 600 }}>
              Good day, Jane!
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              Your profile has 34 new visits today
            </Typography>
          </Box>

          <Button
            variant='contained'
            size='small'
            startIcon={<ShareIcon fontSize='small' />}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              fontSize: '0.75rem',
              py: 0.5
            }}
          >
            Share
          </Button>
        </Paper>

        {/* Metrics Grid */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {metrics.map(metric => (
            <Grid item xs={6} md={3} key={metric.id}>
              <Paper
                variant='outlined'
                sx={{
                  p: 1.5,
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  borderRadius: 1.5,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      mr: 1,
                      bgcolor: `${metric.color}15`,
                      color: metric.color
                    }}
                  >
                    {metric.icon}
                  </Avatar>
                  <Typography variant='caption' color='text.secondary'>
                    {metric.label}
                  </Typography>
                </Box>
                <Typography variant='h6' fontWeight='bold' sx={{ fontSize: '1.1rem' }}>
                  {metric.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Link Performance */}
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}
          >
            <Typography variant='subtitle2' fontSize='0.8rem'>
              Link Performance
            </Typography>
            <Button
              startIcon={<AddIcon fontSize='small' />}
              size='small'
              sx={{
                textTransform: 'none',
                fontSize: '0.7rem'
              }}
            >
              Add Link
            </Button>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {linkPerformance.map(link => (
            <Box key={link.id} sx={{ mb: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.5
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '4px',
                      mr: 1,
                      bgcolor: platformColors[link.platform].bgColor,
                      color: platformColors[link.platform].color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem'
                    }}
                  >
                    {link.platform[0].toUpperCase()}
                  </Box>
                  <Typography variant='body2' fontSize='0.75rem'>
                    {link.title}
                  </Typography>
                </Box>
                <Typography variant='caption' color='text.secondary'>
                  {link.clicks} clicks
                </Typography>
              </Box>
              <LinearProgress
                variant='determinate'
                value={link.progress}
                sx={{
                  height: 4,
                  borderRadius: 1,
                  backgroundColor: 'action.hover',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: platformColors[link.platform].color
                  }
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

export default memo(DashboardPreview)
