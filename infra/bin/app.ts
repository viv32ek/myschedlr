#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { BackendStack } from '../lib/backend-stack';
import { UiStack } from '../lib/ui-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
};

const dbStack = new DatabaseStack(app, 'MyschedlrDatabase', { env });

const backendStack = new BackendStack(app, 'MyschedlrBackend', {
  env,
  usersTable: dbStack.usersTable,
});

new UiStack(app, 'MyschedlrUi', { env });

backendStack.addDependency(dbStack);
