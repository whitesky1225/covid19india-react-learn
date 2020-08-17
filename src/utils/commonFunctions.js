export const isDevelopmentOrTest = () => {
    console.log('isDevelopmentOrTest',process,process.env)
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test")
    return true;
  return false;
};
