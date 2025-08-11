const generateAppointmentEmail = (appointment, user, service) => {
  return `
    <h2>سلام ${user.name} عزیز</h2>
    <p>نوبت شما با موفقیت ثبت شد:</p>
    <ul>
      <li><strong>سرویس:</strong> ${service.name}</li>
      <li><strong>تاریخ:</strong> ${appointment.date.toDateString()}</li>
      <li><strong>ساعت:</strong> ${appointment.timeSlot}</li>
    </ul>
    <p>ممنون از اعتماد شما ❤️</p>
  `;
};

module.exports = generateAppointmentEmail;