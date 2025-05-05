import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import EventForm from '../components/EventForm';
import { eventService } from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Log the form data for debugging
      console.log('Submitting form data:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await eventService.createEvent(formData);
      console.log('Event created successfully:', response);
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Event
      </Typography>
      <EventForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/events')}
      />
    </Container>
  );
};

export default CreateEvent; 