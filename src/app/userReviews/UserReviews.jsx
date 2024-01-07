import {
  Container,
  Paper,
  Typography,
  Divider,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ReviewList from '../review/ReviewList';
import { useState, useEffect } from 'react';

const reviewListExample = [
  {
    id: 1,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mi nulla, rutrum ut velit quis, semper convallis sem. In tincidunt suscipit turpis, eget pulvinar lectus tincidunt laoreet. Quisque id posuere metus, ut interdum mi. Morbi id lectus a lacus ultricies pellentesque. Maecenas libero sapien, efficitur fringilla lectus quis, aliquam vulputate purus. Suspendisse aliquet nibh non condimentum luctus. Aenean tincidunt leo at imperdiet elementum.',
    rating: 2.5,
    work: {
      id: 0,
      title: 'Example title',
      department: 'Data science',
    },
    user: {
      id: 0,
      advancement: 'Beginner',
      name: 'Alex',
    },
  },
  {
    id: 2,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mi nulla, rutrum ut velit quis, semper convallis sem. In tincidunt suscipit turpis, eget pulvinar lectus tincidunt laoreet. Quisque id posuere metus, ut interdum mi. Morbi id lectus a lacus ultricies pellentesque. Maecenas libero sapien, efficitur fringilla lectus quis, aliquam vulputate purus. Suspendisse aliquet nibh non condimentum luctus. Aenean tincidunt leo at imperdiet elementum.',
    rating: 5,
    work: {
      id: 0,
      title: 'Example title',
      department: 'Data science',
    },
    user: {
      id: 1,
      advancement: 'Intermediate',
      name: 'Lisa',
    },
  },
  {
    id: 3,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mi nulla, rutrum ut velit quis, semper convallis sem. In tincidunt suscipit turpis, eget pulvinar lectus tincidunt laoreet. Quisque id posuere metus, ut interdum mi. Morbi id lectus a lacus ultricies pellentesque. Maecenas libero sapien, efficitur fringilla lectus quis, aliquam vulputate purus. Suspendisse aliquet nibh non condimentum luctus. Aenean tincidunt leo at imperdiet elementum.',
    rating: 3.5,
    work: {
      id: 0,
      title: 'Example title',
      department: 'Data science',
    },
    user: {
      id: 2,
      advancement: 'Advanced',
      name: 'Patrick',
    },
  },
];

export default function UserReviews() {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviewList, setWorkList] = useState(null);

  useEffect(() => {
    setWorkList(reviewListExample);
    setLoading(false);
  }, []);

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
            overflowY: 'auto',
          }}
        >
          <Typography component="h1" variant="h3">
            Your reviews
          </Typography>
          <Divider
            variant="middle"
            flexItem
            sx={{ mt: '0.5rem', mb: '1rem', borderWidth: '1.5px' }}
          />
          {loading && (
            <CircularProgress
              size="5.5rem"
              sx={{ mt: '50%' }}
            ></CircularProgress>
          )}
          {!!reviewList && (
            <ReviewList reviewList={reviewList} isUserWorkAuthor={false} />
          )}
          {!!error && (
            <Typography
              component="h1"
              variant="h5"
              color={theme.palette.error.main}
            >
              There is some problem with loading your reviews list. Try again
              later.
            </Typography>
          )}
        </Container>
      </Paper>
    </Container>
  );
}
