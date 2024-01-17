import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Button,
  Rating,
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
        <Rating value={review.mark} readOnly></Rating>
        {!isUserWorkAuthor ? (
          <Typography
            component="p"
            variant="subtitle1"
            sx={{ alignSelf: 'flex-end' }}
          >{`${review.work_title} - ${review.work_department}`}</Typography>
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
