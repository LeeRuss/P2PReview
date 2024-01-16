import { useState, useEffect, useContext } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { API } from 'aws-amplify';
import { UserContext } from '../contexts/UserContext';
import specializationList from './specializations.json';

const myAPI = 'p2previewapi';
const path = '/userSettings';

export default function SettingsForm() {
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
          console.log(response);
          let specializations = response.specializations;
          setSelectedBeginner(specializations.beginner);
          setSelectedIntermediate(specializations.intermediate);
          setSelectedAdvanced(specializations.advanced);
          console.log('Fetching specializations succeeded');
          console.log(specializations);
        })
        .catch((error) => {
          console.log('Fetching specializations failed');
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
        console.log(response);
      })
      .catch((error) => {
        console.log('Uploading specializations failed');
        console.log(error);
      });
  };

  return (
    <>
      <FormControl sx={{ m: 1, minWidth: '50%', maxWidth: '75%' }}>
        <InputLabel>Beginner</InputLabel>
        <Select
          multiple
          value={selectedBeginner}
          onChange={handleBeginner}
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
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: '50%', maxWidth: '75%' }}>
        <InputLabel>Intermediate</InputLabel>
        <Select
          multiple
          value={selectedIntermediate}
          onChange={handleIntermediate}
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
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: '50%', maxWidth: '75%' }}>
        <InputLabel>Advanced</InputLabel>
        <Select
          multiple
          value={selectedAdvanced}
          onChange={handleAdvanced}
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
      </FormControl>
      <Button
        onClick={saveChanges}
        variant="contained"
        sx={{ alignSelf: 'flex-end', mt: '1rem', mr: '1rem' }}
      >
        Save Changes
      </Button>
    </>
  );
}
