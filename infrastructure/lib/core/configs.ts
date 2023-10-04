import { CloudFrontWebDistributionProps, OriginAccessIdentity } from "@aws-cdk/aws-cloudfront";
import { IBucket } from "@aws-cdk/aws-s3";

type CloutFrontPropsGetter = (info: { bucket: IBucket, oai: OriginAccessIdentity }) => CloudFrontWebDistributionProps;
export const getCloudfrontProps: CloutFrontPropsGetter = ({ bucket: s3BucketSource, oai: originAccessIdentity }) => ({
  originConfigs: [
    {
      s3OriginSource: {
        s3BucketSource,
        originAccessIdentity,
      },
      behaviors: [{ isDefaultBehavior: true }],
    },
    ],
    errorConfigurations: [
      {
        errorCode: 403,
        responseCode: 200,
        responsePagePath: '/index.html',
        errorCachingMinTtl: 86400,
      },
      {
        errorCode: 404,
        responseCode: 200,
        responsePagePath: '/index.html',
        errorCachingMinTtl: 86400,
      },
    ],
});
