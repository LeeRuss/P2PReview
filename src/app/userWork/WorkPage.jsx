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
import { useEffect, useState } from 'react';

const workObject = {
  id: 0,
  title: 'Work title',
  shortDescription:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mi nulla, rutrum ut velit quis, semper convallis sem. In tincidunt suscipit turpis, eget pulvinar lectus tincidunt laoreet. Quisque id posuere metus, ut interdum mi. Morbi id lectus a lacus ultricies pellentesque. Maecenas libero sapien, efficitur fringilla lectus quis, aliquam vulputate purus. Suspendisse aliquet nibh non condimentum luctus. Aenean tincidunt leo at imperdiet elementum.',
  description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce mi nulla, rutrum ut velit quis, semper convallis sem. In tincidunt suscipit turpis, eget pulvinar lectus tincidunt laoreet. Quisque id posuere metus, ut interdum mi. Morbi id lectus a lacus ultricies pellentesque. Maecenas libero sapien, efficitur fringilla lectus quis, aliquam vulputate purus. Suspendisse aliquet nibh non condimentum luctus. Aenean tincidunt leo at imperdiet elementum.

  Nullam tempor, odio a interdum hendrerit, tortor ipsum laoreet felis, eget laoreet ligula odio sed mauris. Quisque auctor magna fermentum tincidunt tempor. Etiam pretium est sed feugiat aliquet. Duis feugiat nec ex cursus gravida. Donec est urna, venenatis ut mattis sit amet, rutrum vitae turpis. Phasellus tortor nisl, rhoncus sit amet ex a, ultricies ornare quam. Vestibulum dictum eget lacus eu sollicitudin.
  
  Maecenas pretium a ligula a lobortis. Vestibulum eu molestie purus, vel ullamcorper libero. Duis rutrum felis at nibh fringilla posuere. Praesent sit amet metus enim. Integer bibendum vulputate arcu sit amet consequat. Etiam non ultrices urna. Sed pretium nisl non feugiat aliquam. Sed auctor felis augue, quis euismod mi sagittis eget. Donec eget quam orci. Etiam tincidunt, lectus non feugiat condimentum, sem ante ultrices libero, vitae varius ex ex et elit. Nullam in lectus in lectus lacinia efficitur mattis non erat.`,
  department: 'Data Science',
  advancement: 'Intermediate',
  links: [
    {
      link: 'https://www.google.com/',
      description:
        'Link to google search engine which is most pupular search engine. ',
    },
    {
      link: 'https://www.youtube.com/',
      description:
        'YouTube is a free video sharing website that makes it easy to watch online videos. You can even create and upload your own videos to share with others.',
    },
  ],
};

export default function Work() {
  const theme = useTheme();
  const { workId } = useParams();
  const [work, setWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setWork(workObject);
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
                {work.shortDescription}
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
              <List>
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
                      }}
                    >
                      <b>{link.link}</b>
                    </Button>
                  </ListItem>
                ))}
              </List>
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
