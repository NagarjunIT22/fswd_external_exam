import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper
} from '@mui/material';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  eventType: Yup.string().required('Event type is required'),
  date: Yup.date().required('Date is required'),
  time: Yup.string()
    .required('Time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format'),
  venue: Yup.string().required('Venue is required')
});

const eventTypes = ['Academic', 'Cultural', 'Sports', 'Technical', 'Other'];

const EventForm = ({ event, onSubmit, onCancel }) => {
  const formik = useFormik({
    initialValues: event || {
      title: '',
      description: '',
      eventType: '',
      date: '',
      time: '',
      venue: '',
      image: null
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const formData = new FormData();
        
        // Add all required fields
        formData.append('title', values.title.trim());
        formData.append('description', values.description.trim());
        formData.append('eventType', values.eventType);
        formData.append('venue', values.venue.trim());
        
        // Format date to ISO string
        if (values.date) {
          const date = new Date(values.date);
          if (!isNaN(date.getTime())) {
            formData.append('date', date.toISOString());
          }
        }
        
        // Format time to HH:MM
        if (values.time) {
          formData.append('time', values.time);
        }
        
        // Add image if it exists
        if (values.image instanceof File) {
          formData.append('image', values.image);
        }

        // Log form data for debugging
        console.log('Form values:', values);
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
        setErrors({ submit: error.message });
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        {event ? 'Edit Event' : 'Create Event'}
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Event Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />

          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />

          <TextField
            fullWidth
            select
            id="eventType"
            name="eventType"
            label="Event Type"
            value={formik.values.eventType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.eventType && Boolean(formik.errors.eventType)}
            helperText={formik.touched.eventType && formik.errors.eventType}
          >
            {eventTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            id="date"
            name="date"
            label="Date"
            type="date"
            value={formik.values.date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.date && Boolean(formik.errors.date)}
            helperText={formik.touched.date && formik.errors.date}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            id="time"
            name="time"
            label="Time"
            type="time"
            value={formik.values.time}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.time && Boolean(formik.errors.time)}
            helperText={formik.touched.time && formik.errors.time}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            id="venue"
            name="venue"
            label="Venue"
            value={formik.values.venue}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.venue && Boolean(formik.errors.venue)}
            helperText={formik.touched.venue && formik.errors.venue}
          />

          <TextField
            fullWidth
            id="image"
            name="image"
            type="file"
            onChange={(event) => {
              formik.setFieldValue('image', event.currentTarget.files[0]);
            }}
            InputLabelProps={{ shrink: true }}
          />

          {formik.errors.submit && (
            <Typography color="error" sx={{ mt: 2 }}>
              {formik.errors.submit}
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default EventForm; 