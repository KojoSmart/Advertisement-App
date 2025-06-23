const signupMailTemplate = (username) => {
  return {
    subject: "Welcome to Our App!",
    html: `
      <h1>Hello ${username} </h1>
      <p>Thank you for signing up! We're glad to have you here.</p>
    `
  };
};

module.exports = signupMailTemplate;
