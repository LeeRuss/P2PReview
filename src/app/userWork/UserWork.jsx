import { Container, Paper, Typography, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function UserWork() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: '80vh',
        maxHeight: '80vh',
        minWidth: { xs: '90vw', md: '65vw', lg: '40vw' },
        maxWidth: { xs: '90vw', md: '65vw', lg: '40vw' },
        padding: '0',
        display: 'flex',
        alignItems: 'stretch',
        marginTop: { xs: '12.5vh', md: '10vh', lg: '10vh' },
        marginBottom: '1rem',
      }}
    >
      <Paper elevation={8} sx={{ minHeight: '100%', width: '100%' }}>
        <Container
          maxWidth="xl"
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            marginLeft: 0,
            marginRight: 0,
            border: 1,
            borderColor: 'rgb(128, 128, 128)',
            borderRadius: 1,
          }}
        >
          <Typography component="h1" variant="h3">
            Your work
          </Typography>
          <Button
            component={Link}
            to={'/addWork'}
            variant="contained"
            sx={{ minWidth: '25%', maxWidth: '80%' }}
          >
            Add work
          </Button>
          <Divider
            variant="middle"
            flexItem
            sx={{ mt: '0.5rem', mb: '1rem', borderWidth: '1.5px' }}
          />
        </Container>
      </Paper>
    </Container>
  );
}
