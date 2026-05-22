#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SharedStack } from '../lib/shared-stack';
import { TenantStack, TenantConfig } from '../lib/tenant-stack';
import * as fs from 'fs';
import * as path from 'path';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
};

// ── Shared infrastructure (one per region) ───────────────────────────────────
const shared = new SharedStack(app, 'MyschedlrShared', { env });

// ── Per-tenant stacks — read from tenants.json ───────────────────────────────
// To add a tenant: add an entry to tenants.json and run `cdk deploy --all`
// To remove a tenant: remove from tenants.json and run `cdk destroy MyschedlrTenant-<id>`
const tenants: TenantConfig[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'tenants.json'), 'utf-8'),
);

tenants.forEach((tenant, index) => {
  const stack = new TenantStack(app, `MyschedlrTenant-${tenant.id}`, {
    env,
    tenant,
    vpc: shared.vpc,
    cluster: shared.cluster,
    repository: shared.repository,
    httpsListener: shared.httpsListener,
    // ALB listener rules must have unique priorities; start at 100, step by 10
    listenerPriority: 100 + index * 10,
  });
  stack.addDependency(shared);
});
