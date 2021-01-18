const admin = require('firebase-admin');
const fs = require('fs');

const existsSync = fs.existsSync;
const readFileSync = fs.readFileSync;

// This script sets or removes an admin custom claim on the firebase user of the provided email


// from https://github.com/prescottprue/cypress-firebase/
function readJsonFile(filePath) {
  if (!existsSync(filePath)) {
    return {};
  }

  try {
    const fileBuffer = readFileSync(filePath, 'utf8');
    return JSON.parse(fileBuffer.toString());
  } catch (err) {
    /* eslint-disable no-console */
    console.error(
      `cypress-firebase: Unable to parse ${filePath.replace(
        process.cwd(),
        '',
      )} - JSON is most likely not valid`,
    );
    /* eslint-enable no-console */
    return {};
  }
}

// modified from https://github.com/prescottprue/cypress-firebase/
function getServiceAccount() {
  const serviceAccountPath = `${process.cwd()}/serviceAccount.json`;
  // Check for local service account file (Local dev)
  if (existsSync(serviceAccountPath)) {
    return readJsonFile(serviceAccountPath); // eslint-disable-line global-require, import/no-dynamic-require
  }

  // Use environment variables
  const serviceAccountEnvVar = process.env.SERVICE_ACCOUNT;
  if (serviceAccountEnvVar) {
    if (typeof serviceAccountEnvVar === 'string') {
      try {
        return JSON.parse(serviceAccountEnvVar);
      } catch (err) {
        console.warn(
          `Issue parsing 'SERVICE_ACCOUNT' environment variable from string to object, returning string`,
        );
      }
    }
    return serviceAccountEnvVar;
  }

  return null;
}

const args = process.argv.slice(2);

const email = args[0];

if(!email) {
  throw new Error('No email provided!');
}

if(args[1] !== 'add' && args[1] !== 'remove') {
  throw new Error('Invalid add/remove argument');
}

const addAdmin = args[1] === 'add'

const serviceAccount = getServiceAccount();
const projectId = process.env.GCLOUD_PROJECT || serviceAccount.project_id;

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${projectId}.firebaseio.com`
});

admin
  .auth()
  .getUserByEmail(email)
  .then((user) => {
    console.log(`Found User ID ${user.uid} with email ${user.email}`);
    // Confirm user is verified.
    if (user.emailVerified && addAdmin) {
      // Add custom claims for additional privileges.
      // This will be picked up by the user on token refresh or next sign in on new device.
      console.log(`User email is verified, setting admin claim`);
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    } else {
      console.log(`Removing admin claim.`);
      return admin.auth().setCustomUserClaims(user.uid, null);
    }
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  }).then(() => {
    process.exit(0);
  });
