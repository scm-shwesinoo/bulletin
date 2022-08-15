module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f51ec3c0294e0e43d521302479ed81e6'),
  },
});
