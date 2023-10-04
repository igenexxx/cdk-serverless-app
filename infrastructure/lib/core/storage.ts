import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class AssetStorage extends cdk.Construct {
  public readonly uploadBucket: s3.Bucket;
  public readonly hostingBucket: s3.Bucket;
  public readonly assetBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.uploadBucket = this.createBucket('UploadBucket');
    this.hostingBucket = this.createBucket('WebHostingBucket');
    this.assetBucket = this.createBucket('AssetBucket');
  }

  private createBucket(name: string): s3.Bucket {
    return new s3.Bucket(this, name, { encryption: s3.BucketEncryption.S3_MANAGED });
  }
}
