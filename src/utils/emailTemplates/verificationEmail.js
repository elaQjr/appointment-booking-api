const generateVerificationEmail = (name , verificationUrl) => {
    return `
          <h2>سلام ${name} عزیز</h2>
          <p>برای تأیید ایمیل خود روی لینک زیر کلیک کنید:</p>
          <a href="${verificationUrl}">تأیید ایمیل</a>
          <p>این لینک فقط تا ۱ ساعت معتبر است.</p>
        `;
};

module.exports = generateVerificationEmail;