import { useState } from 'react';
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

import specializationList from './specializations.json';

export default function SettingsForm() {
  const [selectedBeginner, setSelectedBeginner] = useState([]);
  const [selectedIntermediate, setSelectedIntermediate] = useState([]);
  const [selectedAdvanced, setSelectedAdvanced] = useState([]);

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
    //send data to server
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
