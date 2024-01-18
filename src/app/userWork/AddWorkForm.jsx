import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useTheme,
  Typography,
  Divider,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import specializationList from '../settings/specializations.json';
import { API } from 'aws-amplify';
import { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const myAPI = 'p2previewapi';
const path = '/work';

export default function AddWorkForm() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploadingEnded, setUploadingEnded] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { user } = useContext(UserContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });

  function onSubmit(data) {
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
        console.log('Uploading work succeeded');
        console.log(JSON.stringify(response));
        setUploadSuccess(true);
        navigate(`/work/${response}`);
      })
      .catch((error) => {
        console.log('Uploading work failed');
        setUploadSuccess(false);
        console.log(error);
      })
      .finally(() => {
        setUploading(false);
        setUploadingEnded(true);
      });
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: '100%',
        padding: '0 1rem',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{
          required: 'Title is required',
          maxLength: { value: 150, message: 'Your description is too long.' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            disabled={uploading}
            id="title"
            label="Title"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />
      <Controller
        name="short_description"
        control={control}
        defaultValue=""
        rules={{
          required:
            'Short description is required. Write something to encourage others to see your work.',
          maxLength: { value: 500, message: 'Your description is too long.' },
          minLength: { value: 200, message: 'Your description is too short.' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            disabled={uploading}
            required
            multiline
            fullWidth
            id="short_description"
            label="Short description"
            error={!!errors.short_description}
            helperText={errors.short_description?.message}
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        defaultValue=""
        rules={{
          required:
            'Full description is required. Describe your job. Write everything important about it.',
          maxLength: { value: 1500, message: 'Your description is too long.' },
          minLength: { value: 600, message: 'Your description is too short.' },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            multiline
            disabled={uploading}
            margin="normal"
            required
            fullWidth
            id="description"
            label="Full description"
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />
      <Box display="flex" justifyContent="space-between">
        <Controller
          name="department"
          control={control}
          defaultValue=""
          rules={{
            required: 'You need to select department of your work.',
          }}
          render={({ field }) => (
            <FormControl margin="normal" sx={{ width: '47.5%' }}>
              <InputLabel id="department" error={!!errors.department}>
                Department
              </InputLabel>
              <Select
                {...field}
                labelId="department"
                label="Department"
                disabled={uploading}
                error={!!errors.department}
                sx={{
                  textAlign: 'left',
                }}
              >
                {specializationList.flatMap((spec) => [
                  <MenuItem
                    key={spec.name}
                    value={spec.name}
                    disabled
                    sx={{ backgroundColor: 'black', color: 'white' }}
                  >
                    {spec.name}
                  </MenuItem>,
                  ...spec.subDepartments.map((subDep) => (
                    <MenuItem key={subDep} value={subDep}>
                      {subDep}
                    </MenuItem>
                  )),
                ])}
              </Select>
              <FormHelperText sx={{ color: theme.palette.error.main }}>
                {errors.department?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name="advancement"
          control={control}
          defaultValue=""
          rules={{
            required: 'You need to select advancement of your work.',
          }}
          render={({ field }) => (
            <FormControl margin="normal" sx={{ width: '47.5%' }}>
              <InputLabel id="advancement" error={!!errors.advancement}>
                Advancement level
              </InputLabel>
              <Select
                {...field}
                labelId="advancement"
                label="Advancement level"
                disabled={uploading}
                error={!!errors.advancement}
                sx={{
                  textAlign: 'left',
                }}
              >
                <MenuItem key="beginner" value={'beginner'}>
                  {'Beginner'}
                </MenuItem>
                <MenuItem key="intermediate" value={'intermediate'}>
                  {'Intermediate'}
                </MenuItem>
                <MenuItem key="advanced" value={'advanced'}>
                  {'Advanced'}
                </MenuItem>
              </Select>
              <FormHelperText sx={{ color: theme.palette.error.main }}>
                {errors.advancement?.message}
              </FormHelperText>
            </FormControl>
          )}
        />
      </Box>
      <Tooltip title="Add links to your work. It can be github, youtube, google drive, soundcloud, your website and so on.">
        <Typography variant="h5" component="h2">
          Links
        </Typography>
      </Tooltip>
      <Divider
        variant="middle"
        flexItem
        sx={{ mt: '0.5rem', mb: '1rem', borderWidth: '1.5px' }}
      />
      {fields.flatMap((field, index) => [
        <Controller
          key={`link-${field.id}`}
          name={`links.${index}.link`}
          control={control}
          rules={{
            required: 'You need to provide url address.',
            validate: (value) => {
              if (
                value &&
                !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)
              ) {
                return 'Invalid URL';
              }
              return true;
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label={`Link ${index + 1}`}
              disabled={uploading}
              error={
                errors.links ? (errors.links[index].link ? true : false) : false
              }
              helperText={
                errors.links ? errors.links[index]?.link?.message : null
              }
              sx={{ margin: '0.5rem 0' }}
            />
          )}
        />,
        <Controller
          key={`link-description-${field.id}`}
          name={`links.${index}.description`}
          control={control}
          rules={{
            required:
              'You need to provide simple description to your URL address.',
            maxLength: 150,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label={`Description ${index + 1}`}
              disabled={uploading}
              error={
                errors.links
                  ? errors.links[index].description
                    ? true
                    : false
                  : false
              }
              helperText={
                errors.links ? errors.links[index]?.description?.message : null
              }
              sx={{ margin: '0.5rem 0' }}
            />
          )}
        />,
        <Button
          key={`link-delete-${index}`}
          type="button"
          variant="contained"
          disabled={uploading}
          onClick={() => remove(index)}
          startIcon={<DeleteIcon />}
          sx={{ width: 'auto', alignSelf: 'flex-end' }}
        >
          Remove
        </Button>,
      ])}
      <Button
        type="button"
        variant="contained"
        disabled={fields.length < 5 && !uploading ? false : true}
        onClick={() => append({ link: '', description: '' })}
        startIcon={<AddIcon />}
        sx={{ width: '20%', margin: '0.5rem 0' }}
      >
        Add
      </Button>
      <Button
        type="submit"
        onClick={() => {
          console.log(errors);
        }}
        disabled={uploading}
        variant="contained"
        sx={{ alignSelf: 'flex-end', width: '30%', mb: '1rem' }}
      >
        {uploading && <CircularProgress size="1.5rem" sx={{ mr: '1rem' }} />}
        Add work!
      </Button>
      {uploadingEnded && uploadSuccess && (
        <Alert severity="success" sx={{ alignSelf: 'flex-end' }}>
          Work uploaded successfully.
        </Alert>
      )}
      {uploadingEnded && !uploadSuccess && (
        <Alert severity="error" sx={{ alignSelf: 'flex-end' }}>
          Uploading work failed. Try again later.
        </Alert>
      )}
    </Box>
  );
}
