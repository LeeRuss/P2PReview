import { useState } from 'react';
import {
  Button,
  Dialog,
  Box,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';
import { useParams } from 'react-router-dom';

export default function AddReview() {
  const { workId } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);

  function onSubmit() {}

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
        Review
      </Button>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <Box component="form" onSubmit={onSubmit} noValidate>
          <DialogTitle>Review current work</DialogTitle>
          <DialogContent></DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Upload review</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
