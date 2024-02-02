import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

export default function ReviewersList(reviewersList) {
  return (
    <List sx={{ width: '100%' }}>
      {reviewersList.map((reviewer, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar>{index}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${reviewer.name} ${reviewer.surname}`}
            secondary={`Reviewed ${reviewer.reviews_count} ${
              reviewer.reviews_count == 1 ? 'work' : 'works'
            }.`}
          />
        </ListItem>
      ))}
    </List>
  );
}
