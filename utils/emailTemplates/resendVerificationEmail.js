const generateResendVerificationEmail = (name, verificationUrl) => {
    return `
          <h2>سلام ${name} عزیز 👋</h2>
          <p>دوباره لینک تأیید ایمیل برای شما ارسال شد:</p>
          <a href="${verificationUrl}">تأیید ایمیل</a>
          <p>این لینک فقط تا ۱ ساعت اعتبار دارد.</p>
        `;
};

module.exports = generateResendVerificationEmail;