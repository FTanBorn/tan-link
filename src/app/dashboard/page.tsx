// src/app/dashboard/page.tsx
'use client'
import { Box, Grid, Card, CardContent, Typography, Button, Avatar, LinearProgress, Divider } from '@mui/material'
import {
  Visibility,
  TrendingUp,
  Share as ShareIcon,
  Add as AddIcon,
  Link as LinkIcon,
  People as PeopleIcon,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Demo data - Bu kısım daha sonra Firebase'den gelecek
  const stats = [
    {
      title: 'Total Views',
      value: '2,845',
      icon: <Visibility />,
      trend: '+12.5%',
      isUp: true,
      color: '#2196F3'
    },
    {
      title: 'Total Clicks',
      value: '1,257',
      icon: <TrendingUp />,
      trend: '+8.2%',
      isUp: true,
      color: '#4CAF50'
    },
    {
      title: 'Active Links',
      value: '12',
      icon: <LinkIcon />,
      trend: '-2.4%',
      isUp: false,
      color: '#FF9800'
    },
    {
      title: 'Unique Visitors',
      value: '958',
      icon: <PeopleIcon />,
      trend: '+5.7%',
      isUp: true,
      color: '#9C27B0'
    }
  ]

  // Demo recent links - Bu kısım daha sonra Firebase'den gelecek
  const recentLinks = [
    { title: 'Instagram', clicks: 245, progress: 80 },
    { title: 'Twitter', clicks: 187, progress: 65 },
    { title: 'Portfolio', clicks: 156, progress: 55 },
    { title: 'LinkedIn', clicks: 132, progress: 45 },
    { title: 'GitHub', clicks: 98, progress: 35 }
  ]

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant='h4' gutterBottom>
            Welcome back, {user?.displayName || 'User'}! 👋
          </Typography>
          <Typography color='text.secondary'>Here`s what`s happening with your links today.</Typography>
        </Box>
        <Box>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => router.push('/dashboard/links')}
            sx={{ mr: 2, borderRadius: '20px' }}
          >
            Add New Link
          </Button>
          <Button
            variant='outlined'
            startIcon={<ShareIcon />}
            onClick={() => {
              /* Share profile logic */
            }}
            sx={{ borderRadius: '20px' }}
          >
            Share Profile
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color }}>{stat.icon}</Avatar>
                  <Box sx={{ ml: 'auto' }}>
                    <Typography
                      variant='caption'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: stat.isUp ? 'success.main' : 'error.main'
                      }}
                    >
                      {stat.trend}
                      {stat.isUp ? <ArrowUpward fontSize='small' /> : <ArrowDownward fontSize='small' />}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant='h4' sx={{ mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography color='text.secondary'>{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Recent Performance
          </Typography>
          <Divider sx={{ my: 2 }} />
          {recentLinks.map((link, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant='body2'>{link.title}</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ ml: 'auto' }}>
                  {link.clicks} clicks
                </Typography>
              </Box>
              <LinearProgress variant='determinate' value={link.progress} sx={{ height: 6, borderRadius: 5 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  )
}
