import { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Box,
  Select,
  MenuItem,
  FormHelperText,
  FormControl,
  InputLabel,
  useTheme,
} from '@mui/material';
import { API } from 'aws-amplify';
import specializationList from '../settings/specializations.json';
import ReviewersList from './ReviewersList';

const myAPI = 'p2preview';
const path = '/reviewersRanking/{department}';

export default function ReviewersRanking() {
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const theme = useTheme();
  const { user } = useContext(UserContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    const options = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken,
      },
    };
    setLoading(true);
    API.get(myAPI, `/reviewersRanking/${data.department}`, options)
      .then((response) => {
        console.log('Sending report succeeded');
        setRanking(response);
      })
      .catch((error) => {
        console.log('Sending report failed');
        setError(error);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: '80vh',
        maxHeight: '80vh',
        minWidth: { xs: '90vw', md: '65vw', lg: '40vw' },
        maxWidth: { xs: '90vw', md: '65vw', lg: '40vw' },
        padding: '0',
        display: 'flex',
        alignItems: 'stretch',
        marginTop: { xs: '12.5vh', md: '10vh', lg: '10vh' },
        marginBottom: '1rem',
      }}
    >
      <Paper elevation={8} sx={{ minHeight: '100%', width: '100%' }}>
        <Container
          maxWidth="xl"
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1rem',
            marginLeft: 0,
            marginRight: 0,
            border: 1,
            borderColor: 'rgb(128, 128, 128)',
            borderRadius: 1,
            overflowY: 'auto',
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h3">
              Reviewers ranking
            </Typography>
            <Controller
              name="department"
              control={control}
              defaultValue=""
              rules={{
                required: 'You need to select department of your work.',
              }}
              render={({ field }) => (
                <FormControl margin="normal" sx={{ width: '75%' }}>
                  <InputLabel id="department" error={!!errors.department}>
                    Department
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="department"
                    label="Department"
                    disabled={loading}
                    fullWidth
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
            <Button
              variant="contained"
              type="submit"
              sx={{ minWidth: '25%', maxWidth: '80%' }}
            >
              Show ranking
            </Button>
          </Box>

          <Divider
            variant="middle"
            flexItem
            sx={{ mt: '0.5rem', mb: '1rem', borderWidth: '1.5px' }}
          />
          {loading && (
            <CircularProgress
              size="5.5rem"
              sx={{ mt: '50%' }}
            ></CircularProgress>
          )}
          {!!ranking && <ReviewersList reviewersList={ranking} />}
          {!!error && (
            <Typography
              component="h1"
              variant="h5"
              color={theme.palette.error.main}
            >
              There is some problem with loading ranking. Try again later.
            </Typography>
          )}
        </Container>
      </Paper>
    </Container>
  );
}
