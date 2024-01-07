import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function AddReview() {
  const { workId } = useParams();
  return (
    <>
      <Button variant="contained" sx={{ minWidth: '25%', maxWidth: '80%' }}>
        Review / {workId}
      </Button>
    </>
  );
}
