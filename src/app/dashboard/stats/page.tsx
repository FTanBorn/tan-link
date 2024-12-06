// src/app/dashboard/page.tsx
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
  Stack
} from '@mui/material'
import {
  Visibility,
  TrendingUp,
  Share as ShareIcon,
  Add as AddIcon,
  Link as LinkIcon,
  People as PeopleIcon
} from '@mui/icons-material'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useAnalytics } from '@/hooks/useAnalytics'
import { platformIcons } from '@/components/tour/steps/LinksStep/constants'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { stats, linkStats, loading, linksData } = useAnalytics(user?.uid)

  const statsConfig = [
    {
      title: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: <Visibility />,
      trend: '+0%',
      isUp: true,
      color: '#2196F3'
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: <TrendingUp />,
      trend: '+0%',
      isUp: true,
      color: '#4CAF50'
    },
    {
      title: 'Active Links',
      value: stats.activeLinks.toString(),
      icon: <LinkIcon />,
      trend: '0%',
      isUp: true,
      color: '#FF9800'
    },
    {
      title: 'CTR',
      value: stats.totalViews > 0 ? `${((stats.totalClicks / stats.totalViews) * 100).toFixed(1)}%` : '0%',
      icon: <PeopleIcon />,
      trend: '0%',
      isUp: true,
      color: '#9C27B0'
    }
  ]

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 } }}>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}
      >
        {/* Welcome Message */}
        <Typography variant='h5' sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          Welcome, {user?.displayName || 'User'}! 👋
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5
          }}
        >
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => router.push('/dashboard/links')}
            sx={{
              px: 3, // Daha minimal bir genişlik
              borderRadius: 3,
              textTransform: 'none'
            }}
          >
            Add Link
          </Button>
          <Button
            variant='outlined'
            startIcon={<ShareIcon />}
            disabled
            onClick={() => router.push(`/${user?.displayName}`)}
            sx={{
              px: 3, // Daha minimal bir genişlik
              borderRadius: 3,
              textTransform: 'none'
            }}
          >
            Profile
          </Button>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 2 }}>
        {statsConfig.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)'
                }
              }}
            >
              {/* Üst Kısım */}
              <Stack
                direction='column'
                justifyContent='center'
                alignItems='center'
                p={2}
                sx={{
                  bgcolor: `${stat.color}10`,
                  borderBottom: `2px solid ${stat.color}`,
                  textAlign: 'center'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}25`,
                    color: stat.color,
                    width: 56,
                    height: 56,
                    fontSize: 24,
                    mb: 1
                  }}
                >
                  {stat.icon}
                </Avatar>
                {!loading ? (
                  <>
                    <Typography variant='h5' fontWeight='bold' color={stat.color}>
                      {stat.value}
                    </Typography>
                    <Typography variant='subtitle1' color='text.secondary'>
                      {stat.title}
                    </Typography>
                  </>
                ) : (
                  <Skeleton variant='text' width='60%' height={40} />
                )}
              </Stack>
              {/* Boş Alt Kısım */}
              <Box p={2}></Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Links Performance */}
      <Card
        elevation={4}
        sx={{
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <CardContent>
          {/* Başlık */}
          <Typography variant='h6' fontWeight='bold' gutterBottom>
            Links Performance
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* İçerik */}
          {loading
            ? [...Array(5)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant='text' width='80%' height={30} />
                  <Skeleton variant='rectangular' width='100%' height={6} sx={{ mt: 1, borderRadius: 5 }} />
                </Box>
              ))
            : linksData.map((link, index) => {
                const linkStat = linkStats.find((stat: any) => stat.platform === link.platform)

                return (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      p: 1,

                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.06)'
                      }
                    }}
                  >
                    {/* Başlık ve İstatistik */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {platformIcons[link.platform]?.icon}
                        <Typography variant='body2' fontWeight='500'>
                          {link.title}
                        </Typography>
                      </Box>
                      <Typography variant='body2' color='text.secondary' fontWeight='500'>
                        {linkStat ? `${linkStat.clicks.toLocaleString()} clicks` : '0 clicks'}
                      </Typography>
                    </Box>

                    {/* İlerleme Çubuğu */}
                    <LinearProgress
                      variant='determinate'
                      value={linkStat?.progress || 0}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        position: 'relative',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: platformIcons[link.platform]?.color,
                          animation: `progressAnimation 1.5s ease-in-out`,
                          animationFillMode: 'forwards'
                        },
                        '@keyframes progressAnimation': {
                          '0%': { width: '0%' },
                          '100%': { width: `${linkStat?.progress || 0}%` }
                        }
                      }}
                    />
                  </Box>
                )
              })}
        </CardContent>
      </Card>
    </Box>
  )
}
