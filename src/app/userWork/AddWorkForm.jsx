import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
} from '@mui/material';
import specializationList from '../settings/specializations.json';

export default function AddWorkForm() {
  const theme = useTheme();
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
    console.log(data);
    //send new work to database
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
        rules={{ required: 'Title is required', maxLength: 150 }}
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        )}
      />
      <Controller
        name="shortDescription"
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
            required
            fullWidth
            id="short_description"
            label="Short description"
            error={!!errors.shortDescription}
            helperText={errors.shortDescription?.message}
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
                error={!!errors.advancement}
                sx={{
                  textAlign: 'left',
                }}
              >
                <MenuItem key="beginner" value={'beginner'}>
                  {'Beginner'}
                </MenuItem>
                <MenuItem key="intermediate" value={'Intermediate'}>
                  {'Intermediate'}
                </MenuItem>
                <MenuItem key="advanced" value={'Advanced'}>
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
      <Typography variant="h5" component="h2">
        Links
      </Typography>
      <Divider
        variant="middle"
        flexItem
        sx={{ mt: '0.5rem', mb: '1rem', borderWidth: '1.5px' }}
      />
      {fields.flatMap((field, index) => [
        <Controller
          key={`link-${index}`}
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
              error={!!errors.links?.index.link}
              helperText={errors.links?.index.link.message}
              sx={{ margin: '0.5rem 0' }}
            />
          )}
        />,
        <Controller
          key={`link-description-${index}`}
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
              error={!!errors.links?.index.description}
              helperText={errors.links?.index.description.message}
              sx={{ margin: '0.5rem 0' }}
            />
          )}
        />,
        <Button
          key={`link-delete-${index}`}
          type="button"
          variant="contained"
          onClick={() => remove(index)}
          sx={{ width: '20%', alignSelf: 'flex-end' }}
        >
          Remove
        </Button>,
      ])}
      <Button
        type="button"
        variant="contained"
        onClick={() => append({ link: '', description: '' })}
        sx={{ width: '20%', margin: '0.5rem 0' }}
      >
        Add
      </Button>
      <Button
        type="submit"
        onClick={() => {
          console.log(errors);
        }}
        variant="contained"
        sx={{ alignSelf: 'flex-end', width: '30%' }}
      >
        Add work!
      </Button>
    </Box>
  );
}
