import { useState, useEffect, useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Badge,
  Tooltip,
  Typography,
} from '@mui/material';
import { API } from 'aws-amplify';
import { UserContext } from '../contexts/UserContext';
import specializationList from './specializations.json';

const myAPI = 'p2previewapi';
const path = '/userSettings';

export default function SettingsForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingEnded, setUploadingEnded] = useState(false);
  const [fetchingError, setFetchingError] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedBeginner, setSelectedBeginner] = useState([]);
  const [selectedIntermediate, setSelectedIntermediate] = useState([]);
  const [selectedAdvanced, setSelectedAdvanced] = useState([]);
  const { user } = useContext(UserContext);
  useEffect(() => {
    const getSpecializations = async () => {
      const options = {
        headers: {
          Authorization: user.signInUserSession.idToken.jwtToken,
        },
      };

      API.get(myAPI, path, options)
        .then((response) => {
          let specializations = response.specializations;
          setSelectedBeginner(specializations.beginner);
          setSelectedIntermediate(specializations.intermediate);
          setSelectedAdvanced(specializations.advanced);
          setIsLoading(false);
          console.log('Fetching specializations succeeded');
        })
        .catch((error) => {
          console.log('Fetching specializations failed');
          setFetchingError();
          console.log(error);
        });
    };
    getSpecializations();
  }, []);

  const handleBeginner = (event) => {
    setSelectedBeginner(event.target.value);
  };
  const handleIntermediate = (event) => {
    setSelectedIntermediate(event.target.value);
  };
  const handleAdvanced = (event) => {
    setSelectedAdvanced(event.target.value);
  };

  const saveChanges = () => {
    setIsLoading(true);
    let specializations = { beginner: [], intermediate: [], advanced: [] };
    specializations.beginner = selectedBeginner;
    specializations.intermediate = selectedIntermediate;
    specializations.advanced = selectedAdvanced;
    const options = {
      headers: {
        Authorization: user.signInUserSession.idToken.jwtToken,
      },
      body: specializations,
    };
    API.put(myAPI, path, options)
      .then((response) => {
        console.log('Uploading specializations succeeded');
        setUploadSuccess(true);
      })
      .catch((error) => {
        console.log('Uploading specializations failed');
        setUploadSuccess(false);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setUploadingEnded(true);
      });
  };

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: '50%', maxWidth: '75%' }}>
        <Badge
          color="secondary"
          badgeContent={
            <Tooltip title="You are at the beginner level if you have less than one year of experience. You only know the basics of the field.">
              <span>?</span>
            </Tooltip>
          }
        >
          <InputLabel>Beginner</InputLabel>
          <Select
            multiple
            value={selectedBeginner}
            onChange={handleBeginner}
            disabled={isLoading}
            fullWidth
            label="Beginner"
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
              ...spec.subDepartments.map((subDep) => {
                return selectedIntermediate.find(
                  (element) => element === subDep
                ) || selectedAdvanced.find((element) => element === subDep) ? (
                  <MenuItem key={subDep} value={subDep} disabled>
                    {subDep}
                  </MenuItem>
                ) : (
                  <MenuItem key={subDep} value={subDep}>
                    {subDep}
                  </MenuItem>
                );
              }),
            ])}
          </Select>
        </Badge>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: '50%', maxWidth: '75%' }}>
        <Badge
          color="secondary"
          badgeContent={
            <Tooltip title="You are at the intermediate level if you have about 2-3 years of experience or a bachelor's degree in the field.">
              <span>?</span>
            </Tooltip>
          }
        >
          <InputLabel>Intermediate</InputLabel>
          <Select
            multiple
            value={selectedIntermediate}
            onChange={handleIntermediate}
            disabled={isLoading}
            fullWidth
            label="Intermediate"
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
              ...spec.subDepartments.map((subDep) => {
                return selectedBeginner.find((element) => element === subDep) ||
                  selectedAdvanced.find((element) => element === subDep) ? (
                  <MenuItem key={subDep} value={subDep} disabled>
                    {subDep}
                  </MenuItem>
                ) : (
                  <MenuItem key={subDep} value={subDep}>
                    {subDep}
                  </MenuItem>
                );
              }),
            ])}
          </Select>
        </Badge>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: '50%', maxWidth: '75%' }}>
        <Badge
          color="secondary"
          badgeContent={
            <Tooltip title="You are at the advanced level if you have more than 3 years of experience or have at least a master's degree in the field. A given topic has no secrets from you.">
              <span>?</span>
            </Tooltip>
          }
        >
          <InputLabel>Advanced</InputLabel>
          <Select
            multiple
            value={selectedAdvanced}
            onChange={handleAdvanced}
            disabled={isLoading}
            fullWidth
            label="Advanced"
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
              ...spec.subDepartments.map((subDep) => {
                return selectedBeginner.find((element) => element === subDep) ||
                  selectedIntermediate.find((element) => element === subDep) ? (
                  <MenuItem key={subDep} value={subDep} disabled>
                    {subDep}
                  </MenuItem>
                ) : (
                  <MenuItem key={subDep} value={subDep}>
                    {subDep}
                  </MenuItem>
                );
              }),
            ])}
          </Select>
        </Badge>
      </FormControl>
      <Button
        onClick={saveChanges}
        disabled={isLoading}
        variant="contained"
        sx={{ alignSelf: 'flex-end', mt: '1rem', mr: '1rem', mb: '1rem' }}
      >
        {isLoading && <CircularProgress size="1.5rem" sx={{ mr: '1rem' }} />}
        Save Changes
      </Button>
      {uploadingEnded && uploadSuccess && (
        <Alert severity="success" sx={{ alignSelf: 'flex-end' }}>
          Specializations saved successfully.
        </Alert>
      )}
      {uploadingEnded && !uploadSuccess && (
        <Alert severity="error" sx={{ alignSelf: 'flex-end' }}>
          Saving specializations failed. Try again later.
        </Alert>
      )}
      {!uploadingEnded && fetchingError && (
        <Alert severity="error" sx={{ alignSelf: 'flex-end' }}>
          Loading specializations failed. Try again later.
        </Alert>
      )}
    </>
  );
}
