import { useState, useContext } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { API } from 'aws-amplify';
import { UserContext } from '../contexts/UserContext';

const myAPI = 'p2previewapi';
const path = '/review';

export default function AddReview() {
  const { workId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadingEnded, setUploadingEnded] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useContext(UserContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log(data);
    data.workId = parseInt(workId);
    data.mark = parseFloat(data.mark);
    const options = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken,
      },
      body: data,
    };
    setUploading(true);
    setUploadingEnded(false);
    API.put(myAPI, path, options)
      .then((response) => {
        console.log('Uploading work succeeded');
        console.log(JSON.stringify(response));
        setUploadSuccess(true);
      })
      .catch((error) => {
        console.log('Uploading work failed');
        setUploadSuccess(false);
        setUploadError(error);
        console.log(error);
      })
      .finally(() => {
        setUploading(false);
        setUploadingEnded(true);
      });
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
              maxHeight: '90%',
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
                  value: 2000,
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
                  disabled={uploading}
                  required
                  multiline
                  fullWidth
                  id="review_content"
                  label="Review message"
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              )}
            />
            <Typography sx={{ mt: '0.5rem' }}>Overall rating:</Typography>
            <Controller
              name="mark"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <Rating
                  {...field}
                  precision={0.5}
                  disabled={uploading}
                  id="review_rating"
                  size="large"
                  value={parseFloat(field.value)}
                />
              )}
            />
            {uploadingEnded && uploadSuccess && (
              <Alert
                severity="success"
                sx={{
                  minWidth: '30%!important',
                  maxWidth: '100%!important',
                }}
              >
                Work uploaded successfully.
              </Alert>
            )}
            {uploadingEnded && !uploadSuccess && (
              <Alert
                severity="error"
                sx={{
                  minWidth: '30%!important',
                  maxWidth: '100%!important',
                }}
              >
                {uploadError.response?.data?.error
                  ? uploadError.response.data.message
                  : 'There is some problem with uploading your review. Try again later.'}
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'space-between' }}>
            <Button onClick={handleClose} variant="contained">
              Cancel
            </Button>
            <Button disabled={uploading} type="submit" variant="contained">
              {uploading && (
                <CircularProgress size="1.5rem" sx={{ mr: '1rem' }} />
              )}
              Upload review
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
