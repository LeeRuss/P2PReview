import { useState, useEffect, useContext } from 'react';
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
import { API } from 'aws-amplify';
import { UserContext } from '../contexts/UserContext';

const myAPI = 'p2previewapi';
const path = '/review/{proxy+}';

export default function WorkReviewsList() {
  const theme = useTheme();
  const { workId } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reviewList, setReviewList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getReviews = async () => {
      const options = {
        headers: {
          Authorization: user.signInUserSession.idToken.jwtToken,
        },
        queryStringParameters: { workId: workId },
      };
      API.get(myAPI, path, options)
        .then((response) => {
          console.log('Fetching review succeeded');
          setReviewList(response);
        })
        .catch((error) => {
          console.log('Fetching review failed');
          setError(true);
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getReviews();
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
          {Array.isArray(reviewList) && (
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
