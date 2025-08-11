const generateResetPassword = (name, resetLink) => {
    return `
        <h2>سلام ${name} عزیز</h2>
        <p>برای تنظیم رمز عبور جدید، روی لینک زیر کلیک کن:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>این لینک تا ۱۵ دقیقه معتبر است.</p>
      `;
};

module.exports = generateResetPassword;