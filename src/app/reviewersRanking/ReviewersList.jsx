import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';

export default function ReviewersList(reviewersList) {
  reviewersList = reviewersList.reviewersList;
  return (
    <List sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {reviewersList.map((reviewer, index) => (
        <ListItem
          key={index}
          sx={{
            width: '50%',
            alignSelf: 'center',
            borderBottom: 'solid 1px rgba(0, 0, 0, 0.12)',
          }}
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                bgcolor:
                  index === 0
                    ? '#FFCC00'
                    : index === 1
                    ? '#BCC6CC'
                    : index === 2
                    ? '#CD7F32'
                    : '#F2F3F5',
                color: index > 2 ? 'black' : 'white',
              }}
            >
              <Typography>{index + 1}</Typography>
            </Avatar>
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
