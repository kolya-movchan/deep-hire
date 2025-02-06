import { Header } from "@/react-components/Header"
import { Box, Container, Typography, Grid, Paper } from "@mui/material"

export const Home = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #EEF2FF, #FFFFFF, #F3E8FF)",
      }}
    >
      <Header />
      <Container maxWidth="lg" sx={{ py: 16 }}>
        <Box sx={{ maxWidth: "900px", mx: "auto", textAlign: "center" }}>
          <Typography
            variant="h2"
            fontWeight="800"
            gutterBottom
            sx={{
              background: "linear-gradient(to right, #9333EA, #4F46E5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            Transform Your Experience with My App
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto", mb: 8 }}
          >
            Join thousands of users who have already discovered our exclusive features. Start your
            journey today and unlock a world of possibilities.
          </Typography>

          <Grid container spacing={4} sx={{ pt: 4 }}>
            {[
              { stat: "10K+", label: "Active Users" },
              { stat: "99.9%", label: "Uptime" },
              { stat: "24/7", label: "Support" },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.5)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Typography variant="h4" fontWeight="bold" sx={{ color: "primary.main", mb: 1 }}>
                    {item.stat}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {item.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  )
}
