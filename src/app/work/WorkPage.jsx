import {
  Container,
  Paper,
  Typography,
  Divider,
  CircularProgress,
  Button,
  List,
  ListItem,
  useTheme,
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import AddReview from '../review/AddReview';
import WorkReviewsList from './WorkReviewsList';
import { API } from 'aws-amplify';
import { UserContext } from '../contexts/UserContext';

const myAPI = 'p2previewapi';
const path = '/work/{proxy+}';

export default function Work() {
  const theme = useTheme();
  const { workId } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getWork = async () => {
      const options = {
        headers: {
          Authorization: user.signInUserSession.idToken.jwtToken,
        },
        queryStringParameters: { workId: workId },
      };
      API.get(myAPI, path, options)
        .then((response) => {
          console.log('Fetching work succeeded');
          setWork(response);
        })
        .catch((error) => {
          console.log('Fetching work failed');
          setError(true);
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getWork();
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
          {loading && (
            <CircularProgress
              size="5.5rem"
              sx={{ mt: '50%' }}
            ></CircularProgress>
          )}
          {!!work && (
            <>
              <Typography component="h1" variant="h3">
                {work.title}
              </Typography>
              <Typography
                component="p"
                variant="h6"
                gutterBottom
              >{`${work.department} - ${work.advancement}`}</Typography>
              <Divider
                variant="middle"
                flexItem
                textAlign="left"
                sx={{ mt: '0.5rem', mb: '1rem', borderWidth: '1.5px' }}
              >
                <Typography component="h2" variant="h5">
                  Short description
                </Typography>
              </Divider>
              <Typography
                component="p"
                align="justify"
                sx={{
                  alignSelf: 'flex-start',
                  ml: '1rem',
                  mr: '1rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {work.short_description}
              </Typography>
              <Divider
                variant="middle"
                flexItem
                textAlign="left"
                sx={{ mt: '1rem', mb: '1rem', borderWidth: '1.5px' }}
              >
                <Typography component="h2" variant="h5">
                  Full description
                </Typography>
              </Divider>
              <Typography
                component="p"
                align="justify"
                sx={{
                  alignSelf: 'flex-start',
                  ml: '1rem',
                  mr: '1rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {work.description}
              </Typography>
              {work.links?.length > 0 && (
                <>
                  <Divider
                    variant="middle"
                    flexItem
                    textAlign="left"
                    sx={{ mt: '1rem', mb: '1rem', borderWidth: '1.5px' }}
                  >
                    <Typography component="h2" variant="h5">
                      Links
                    </Typography>
                  </Divider>
                  <List sx={{ width: '100%' }}>
                    {work.links.map((link, index) => (
                      <ListItem key={index} sx={{ flexDirection: 'column' }}>
                        <Typography
                          component="p"
                          align="justify"
                          sx={{
                            alignSelf: 'flex-start',
                            ml: '1rem',
                            mr: '1rem',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          • {link.description}
                        </Typography>
                        <Button
                          href={link.link}
                          target="_blank"
                          variant="contained"
                          endIcon={<OpenInNewIcon />}
                          sx={{
                            alignSelf: 'flex-end',
                            mr: '1rem',
                            mt: '1rem',
                            mb: '1rem',
                            maxWidth: '40%',
                            wordBreak: 'break-word',
                          }}
                        >
                          <b>{link.link}</b>
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
              <Divider
                variant="middle"
                flexItem
                textAlign="left"
                sx={{ mt: '1rem', mb: '1rem', borderWidth: '1.5px' }}
              />
              {work.user_uuid === user.attributes.sub ? (
                <WorkReviewsList />
              ) : (
                <AddReview />
              )}
            </>
          )}

          {!!error && (
            <Typography
              component="h1"
              variant="h5"
              color={theme.palette.error.main}
            >
              There was some error, try again later
            </Typography>
          )}
        </Container>
      </Paper>
    </Container>
  );
}
