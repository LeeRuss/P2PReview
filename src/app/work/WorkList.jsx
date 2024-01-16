import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Button,
} from '@mui/material/';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link } from 'react-router-dom';

export default function WorkList({ workList }) {
  return workList.map((work, index) => (
    <Accordion
      key={index}
      sx={{
        mb: '1rem',
        borderRadius: '4px',
        ': before': { content: 'none' },
        width: '100%',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{
          '& .MuiAccordionSummary-content': {
            flexDirection: 'column',
          },
        }}
      >
        <Typography
          component="h2"
          variant="h6"
          sx={{ alignSelf: 'flex-start' }}
        >
          {work.title}
        </Typography>
        <Typography
          component="p"
          variant="subtitle1"
          sx={{ alignSelf: 'flex-end' }}
        >{`${work.department} - ${work.advancement}`}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography textAlign="justify">{work.short_description}</Typography>
        <Button
          component={Link}
          to={`/work/${work.id}`}
          variant="contained"
          endIcon={<OpenInNewIcon />}
          sx={{ alignSelf: 'flex-end' }}
        >
          Open
        </Button>
      </AccordionDetails>
    </Accordion>
  ));
}
