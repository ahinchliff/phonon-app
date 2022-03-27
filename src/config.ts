const getEnvVariable = (property: string, canBeUndefined = false): any => {
  const value = process.env[property];

  if (!canBeUndefined && !value) {
    throw new Error(`${property} environment variable is not set`);
  }

  return value;
};

export default {
  ethereumRPC: getEnvVariable("REACT_APP_ETHERUM_RPC"),
  ethereumRinkebyRPC: getEnvVariable("REACT_APP_ETHERUM_RINKEBY_RPC"),
};
