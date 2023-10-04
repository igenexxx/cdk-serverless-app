import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { execSync } from 'child_process';
import * as path from 'path';
import * as cwt from 'cdk-webapp-tools';
import { getCloudfrontProps } from "./configs";

interface WebAppProps {
  hostingBucket: s3.IBucket;
  relativeWebAppPath?: string;
  baseDir?: string;
}

export class WebApp extends cdk.Construct {
  webDistribution: cloudfront.CloudFrontWebDistribution;

  constructor(scope: cdk.Construct, id: string, private props: WebAppProps) {
    super(scope, id);
    this.initWebDistribution();
    this.deployWebApp();
  }

  private initWebDistribution(): void {
    const oai = new cloudfront.OriginAccessIdentity(this, 'WebHostingOAI', {});
    const cloudFrontProps = getCloudfrontProps({ bucket: this.props.hostingBucket, oai });

    this.webDistribution = new cloudfront.CloudFrontWebDistribution(this, 'AppHostingDistribution', cloudFrontProps);
    this.props.hostingBucket.grantRead(oai);
  }

  private deployWebApp(): void {
    new cwt.WebAppDeployment(this, 'WebAppDeploy', {
      baseDirectory: this.props.baseDir,
      relativeWebAppPath: this.props.relativeWebAppPath,
      webDistribution: this.webDistribution,
      webDistributionPaths: ['/*'],
      buildCommand: 'yarn build',
      buildDirectory: 'build',
      bucket: this.props.hostingBucket,
      prune: true,
    });

    new cdk.CfnOutput(this, 'URL', { value: `https://${this.webDistribution.distributionDomainName}/` });
  }
}
