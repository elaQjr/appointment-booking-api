const generateAppointmentStatusEmail = (appointment, status) => {
  if (status === 'confirmed') {
    return `
      <h2>Your appointment is confirmed ✅</h2>
      <p><strong>Service:</strong> ${appointment.service.name}</p>
      <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
      <p><strong>Time:</strong> ${appointment.timeSlot}</p>
    `;
  } else if (status === 'cancelled') {
    return `
      <h2>Sorry, your appointment was cancelled ❌</h2>
      <p>Please choose another time slot.</p>
    `;
  } else {
    return `<p>Your appointment status has been updated to <strong>${status}</strong>.</p>`;
  }
};

module.exports = generateAppointmentStatusEmail;
