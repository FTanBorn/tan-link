'use client'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Divider,
  Skeleton,
  Paper,
  IconButton
} from '@mui/material'
import {
  Visibility,
  TrendingUp,
  Share as ShareIcon,
  Add as AddIcon,
  Link as LinkIcon,
  People as PeopleIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useAnalytics } from '@/hooks/useAnalytics'
import { platformIcons } from '@/components/tour/steps/LinksStep/constants'
import { useState, useEffect } from 'react'

export default function DashboardPage() {
  const { user, userData } = useAuth()
  const router = useRouter()
  const { stats, linkStats, loading, linksData } = useAnalytics(user?.uid)
  const [greetingText, setGreetingText] = useState('Hello')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreetingText('Good Morning')
    } else if (hour >= 12 && hour < 18) {
      setGreetingText('Good Afternoon')
    } else {
      setGreetingText('Good Evening')
    }
  }, [])

  // Analytics cards config
  const statsConfig = [
    {
      title: 'Views',
      value: stats.totalViews.toLocaleString(),
      icon: <Visibility />,
      color: '#2196F3'
    },
    {
      title: 'Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: <TrendingUp />,
      color: '#4CAF50'
    },
    {
      title: 'Links',
      value: stats.activeLinks.toString(),
      icon: <LinkIcon />,
      color: '#FF9800'
    },
    {
      title: 'CTR',
      value: stats.totalViews > 0 ? `${((stats.totalClicks / stats.totalViews) * 100).toFixed(1)}%` : '0%',
      icon: <PeopleIcon />,
      color: '#9C27B0'
    }
  ]

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 } }}>
      {/* Welcome Section */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12} sm={8}>
              <Typography variant='h5' gutterBottom>
                {greetingText}, {user?.displayName || 'User'}
              </Typography>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Manage your TanLink profile and monitor its performance.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/dashboard/links')}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Add Link
                </Button>
                <Button
                  variant='outlined'
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    if (userData?.username) {
                      router.push(`/${userData.username}`)
                    } else if (user?.displayName) {
                      router.push(`/${user.displayName}`)
                    } else {
                      // Alert the user if no username is found
                      alert('You need to create a username first to view your profile page.')
                      router.push('/dashboard/profile')
                    }
                  }}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Profile
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsConfig.map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: `${stat.color}12`,
                    color: stat.color,
                    mr: 1.5
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant='body2' color='text.secondary'>
                  {stat.title}
                </Typography>
              </Box>

              {!loading ? (
                <Typography variant='h5' fontWeight='medium'>
                  {stat.value}
                </Typography>
              ) : (
                <Skeleton variant='text' width='60%' height={36} />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Links Performance */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6'>Link Performance</Typography>
          {!loading && linksData.length > 0 && (
            <Button size='small' onClick={() => router.push('/dashboard/links')} sx={{ textTransform: 'none' }}>
              View All
            </Button>
          )}
        </Box>

        <Divider />

        <Box sx={{ p: 1.5 }}>
          {loading ? (
            [...Array(3)].map((_, index) => (
              <Box key={index} sx={{ mb: 1.5, opacity: 1 - index * 0.2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Skeleton variant='text' width='40%' height={20} />
                  <Skeleton variant='text' width='15%' height={20} />
                </Box>
                <Skeleton variant='rounded' width='100%' height={6} sx={{ borderRadius: 1 }} />
              </Box>
            ))
          ) : linksData.length > 0 ? (
            linksData.map((link, index) => {
              const linkStat = linkStats.find(stat => stat.platform === link.platform) || { clicks: 0, progress: 0 }

              return (
                <Box
                  key={index}
                  sx={{
                    mb: index !== linksData.slice(0, 5).length - 1 ? 1.5 : 0,
                    p: 1,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'action.hover'
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.75
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar
                        sx={{
                          width: 28,
                          height: 28,
                          bgcolor: platformIcons[link.platform]?.bgColor || '#f0f0f0',
                          color: platformIcons[link.platform]?.color || '#333'
                        }}
                      >
                        {platformIcons[link.platform]?.icon}
                      </Avatar>
                      <Typography variant='body2' noWrap sx={{ maxWidth: { xs: 120, sm: 150, md: 200 } }}>
                        {link.title || platformIcons[link.platform]?.placeholder}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant='caption' color='text.secondary'>
                        {linkStat.clicks.toLocaleString()} clicks
                      </Typography>

                      <IconButton size='small' href={link.url} target='_blank' sx={{ padding: 0.5 }}>
                        <OpenInNewIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>

                  <LinearProgress
                    variant='determinate'
                    value={linkStat.progress || 0}
                    sx={{
                      height: 4,
                      borderRadius: 1,
                      bgcolor: 'action.hover',
                      '.MuiLinearProgress-bar': {
                        bgcolor: platformIcons[link.platform]?.color
                      }
                    }}
                  />
                </Box>
              )
            })
          ) : (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography color='text.secondary' variant='caption' sx={{ display: 'block', mb: 1 }}>
                You haven`t added any links yet.
              </Typography>
              <Button
                variant='contained'
                size='small'
                startIcon={<AddIcon />}
                onClick={() => router.push('/dashboard/links')}
                sx={{ mt: 1, borderRadius: 1.5, textTransform: 'none', py: 0.5 }}
              >
                Add Link
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
