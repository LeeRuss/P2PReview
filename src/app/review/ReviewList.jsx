import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Button,
  Rating,
  Divider,
  List,
  ListItem,
} from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link } from 'react-router-dom';

export default function ReviewList({ reviewList, isUserWorkAuthor }) {
  return reviewList.map((review, index) => (
    <Accordion
      key={index}
      sx={{ mb: '1rem', borderRadius: '4px', ': before': { content: 'none' } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          '& .MuiAccordionSummary-content': {
            justifyContent: 'space-between',
          },
        }}
      >
        <Rating
          value={review.mark}
          precision={0.5}
          readOnly
          sx={{ mr: '1rem', alignSelf: 'center' }}
        />
        {!isUserWorkAuthor ? (
          <Typography
            component="p"
            variant="subtitle1"
            sx={{ alignSelf: 'flex-end' }}
          >{`${review.work_title} - ${review.department}`}</Typography>
        ) : (
          <Typography
            component="p"
            variant="subtitle1"
            sx={{ alignSelf: 'flex-end' }}
          >{`${review.user_name}, ${review.user_age} - ${review.user_advancement}`}</Typography>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography textAlign="justify">{review.content}</Typography>
        {review.links?.length > 0 && (
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
              {review.links.map((link, index) => (
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
        {!isUserWorkAuthor && (
          <Button
            component={Link}
            to={`/work/${review.work_id}`}
            variant="contained"
            endIcon={<OpenInNewIcon />}
            sx={{ alignSelf: 'flex-end' }}
          >
            Show reviewed work
          </Button>
        )}
      </AccordionDetails>
    </Accordion>
  ));
}
