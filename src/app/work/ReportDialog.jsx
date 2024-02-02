import { useState, useContext } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { useParams } from 'react-router-dom';
import { API } from 'aws-amplify';
import { UserContext } from '../contexts/UserContext';
import { useForm, Controller } from 'react-hook-form';

const reportTypes = [
  `Scam`,
  `Troll`,
  `Work not related to selected department.`,
];

const myAPI = 'p2previewapi';
const path = '/report';

export default function ReportDialog() {
  const { workId } = useParams();
  const [uploading, setUploading] = useState(false);
  const [uploadingEnded, setUploadingEnded] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    data.workId = parseInt(workId);
    const options = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken,
      },
      body: data,
    };
    setUploading(true);
    setUploadingEnded(false);
    API.post(myAPI, path, options)
      .then((response) => {
        console.log('Sending report succeeded');
        setUploadSuccess(true);
      })
      .catch((error) => {
        console.log('Sending report failed');
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
        sx={{ mt: '0.5rem', alignSelf: 'flex-start' }}
      >
        <ReportIcon />
      </Button>
      <Dialog
        component="form"
        onSubmit={handleSubmit(onSubmit)}
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
        <DialogTitle>Report current work</DialogTitle>
        <DialogContent>
          <Controller
            name="report_type"
            control={control}
            defaultValue=""
            rules={{
              required: 'You need to select report type.',
            }}
            render={({ field }) => (
              <FormControl sx={{ m: 1, width: '90%' }}>
                <InputLabel error={!!errors.report_type}>
                  Report type
                </InputLabel>
                <Select
                  {...field}
                  error={!!errors.report_type}
                  disabled={uploading}
                  fullWidth
                  label="Report type"
                >
                  {reportTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: theme.palette.error.main }}>
                  {errors.report_type?.message}
                </FormHelperText>
              </FormControl>
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
              Report send successfully.
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
                : 'There is some problem with sending your report. Try again later.'}
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
            Send report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
