import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  Box,
  DialogTitle,
  DialogActions,
  DialogContent,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import ReviewList from '../review/ReviewList';

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

export default function WorkReviewsList() {
  const theme = useTheme();
  const { workId } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reviewList, setWorkList] = useState(null);

  useEffect(() => {
    setWorkList(reviewListExample);
    setLoading(false);
  }, []);

  function handleClose() {
    setDialogOpen(false);
  }

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        variant="contained"
        sx={{ minWidth: '25%', maxWidth: '80%' }}
      >
        Show reviews
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              maxWidth: { xs: '90vw', md: '65vw', lg: '40vw' },
              maxHeight: '70vh',
            },
          },
        }}
      >
        <DialogTitle>Reviews of current work</DialogTitle>
        <DialogContent>
          {loading && <CircularProgress size="5.5rem"></CircularProgress>}
          {!!reviewList && (
            <ReviewList reviewList={reviewList} isUserWorkAuthor={true} />
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
