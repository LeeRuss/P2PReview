import { useState } from 'react';
import {
  Button,
  Dialog,
  Box,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Rating,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

export default function AddReview() {
  const { workId } = useParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

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
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              minWidth: { xs: '90vw', md: '65vw', lg: '40vw' },
              maxWidth: { xs: '90vw', md: '65vw', lg: '40vw' },
            },
          },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          padding="0 1rem"
        >
          <DialogTitle>Review current work</DialogTitle>
          <DialogContent>
            <Controller
              name="content"
              control={control}
              defaultValue=""
              rules={{
                required:
                  'Review message is required. Make your review valuable for work author.',
                maxLength: {
                  value: 1500,
                  message: 'Your review is too long.',
                },
                minLength: {
                  value: 400,
                  message: 'Your review is too short.',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  multiline
                  fullWidth
                  id="review_content"
                  label="Review message"
                  error={!!errors.reviewContent}
                  helperText={errors.reviewContent?.message}
                />
              )}
            />
            <Typography sx={{ mt: '0.5rem' }}>Overall rating:</Typography>
            <Controller
              name="rating"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <Rating
                  {...field}
                  precision={0.5}
                  id="review_rating"
                  size="large"
                  value={parseFloat(field.value)}
                />
              )}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <Button onClick={handleClose} variant="contained">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Upload review
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
