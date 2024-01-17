import {
  Container,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  useTheme,
} from '@mui/material';
import ReviewList from '../review/ReviewList';
import { useState, useEffect, useContext } from 'react';
import { API } from 'aws-amplify';
import { UserContext } from '../contexts/UserContext';

const myAPI = 'p2previewapi';
const path = '/userReviews';

export default function UserReviews() {
  const theme = useTheme();
  const [reviewList, setReviewList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);
  console.log(reviewList);

  useEffect(() => {
    const getSpecializations = async () => {
      const options = {
        headers: {
          Authorization: user.signInUserSession.idToken.jwtToken,
        },
      };
      API.get(myAPI, path, options)
        .then((response) => {
          console.log('Fetching specializations succeeded');
          setReviewList(response);
        })
        .catch((error) => {
          console.log('Fetching specializations failed');
          setError(error);
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getSpecializations();
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
          {reviewList && (
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
