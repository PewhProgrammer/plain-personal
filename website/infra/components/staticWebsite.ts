import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as fs from "fs";
import * as path from "path";
import * as mime from "mime-types";

export interface StaticWebsiteArgs {
  siteName: string;
  contentPath: string;
  indexDocument?: string;
  errorDocument?: string;
}

export class StaticWebsite extends pulumi.ComponentResource {
  public readonly bucket: aws.s3.Bucket;
  public readonly bucketPolicy: aws.s3.BucketPolicy;
  public readonly distribution: aws.cloudfront.Distribution;
  public readonly url: pulumi.Output<string>;

  constructor(
    name: string,
    args: StaticWebsiteArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("custom:static:Website", name, {}, opts);

    const defaultResourceOptions: pulumi.ResourceOptions = { parent: this };

    // Create S3 bucket for static content
    this.bucket = new aws.s3.Bucket(
      `${name}-bucket`,
      {
        website: {
          indexDocument: args.indexDocument || "index.html",
          errorDocument: args.errorDocument || "index.html", // SPA routing
        },
        tags: {
          Name: args.siteName,
        },
      },
      defaultResourceOptions
    );

    // Block all public access (CloudFront will access via OAI)
    new aws.s3.BucketPublicAccessBlock(
      `${name}-public-access-block`,
      {
        bucket: this.bucket.id,
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      defaultResourceOptions
    );

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new aws.cloudfront.OriginAccessIdentity(
      `${name}-oai`,
      {
        comment: pulumi.interpolate`OAI for ${args.siteName}`,
      },
      defaultResourceOptions
    );

    // Bucket policy to allow CloudFront access
    const bucketPolicyDocument = pulumi
      .all([this.bucket.arn, originAccessIdentity.iamArn])
      .apply(([bucketArn, oaiArn]) =>
        JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Principal: {
                AWS: oaiArn,
              },
              Action: "s3:GetObject",
              Resource: `${bucketArn}/*`,
            },
          ],
        })
      );

    this.bucketPolicy = new aws.s3.BucketPolicy(
      `${name}-bucket-policy`,
      {
        bucket: this.bucket.id,
        policy: bucketPolicyDocument,
      },
      defaultResourceOptions
    );

    // CloudFront distribution
    this.distribution = new aws.cloudfront.Distribution(
      `${name}-cdn`,
      {
        enabled: true,
        isIpv6Enabled: true,
        comment: args.siteName,
        defaultRootObject: args.indexDocument || "index.html",
        priceClass: "PriceClass_100", // Use only North America and Europe for cost savings

        origins: [
          {
            domainName: this.bucket.bucketRegionalDomainName,
            originId: "s3Origin",
            s3OriginConfig: {
              originAccessIdentity:
                originAccessIdentity.cloudfrontAccessIdentityPath,
            },
          },
        ],

        defaultCacheBehavior: {
          targetOriginId: "s3Origin",
          viewerProtocolPolicy: "redirect-to-https",
          allowedMethods: ["GET", "HEAD", "OPTIONS"],
          cachedMethods: ["GET", "HEAD", "OPTIONS"],
          compress: true,

          forwardedValues: {
            queryString: false,
            cookies: {
              forward: "none",
            },
          },

          minTtl: 0,
          defaultTtl: 3600, // 1 hour
          maxTtl: 86400, // 24 hours
        },

        customErrorResponses: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: `/${args.errorDocument || "index.html"}`,
            errorCachingMinTtl: 300,
          },
        ],

        restrictions: {
          geoRestriction: {
            restrictionType: "none",
          },
        },

        viewerCertificate: {
          cloudfrontDefaultCertificate: true,
        },

        tags: {
          Name: args.siteName,
        },
      },
      defaultResourceOptions
    );

    this.url = pulumi.interpolate`https://${this.distribution.domainName}`;

    // Upload content if path exists
    if (fs.existsSync(args.contentPath)) {
      this.uploadContent(args.contentPath, name);
    }

    this.registerOutputs({
      bucketName: this.bucket.id,
      distributionId: this.distribution.id,
      url: this.url,
    });
  }

  private uploadContent(contentPath: string, resourcePrefix: string): void {
    const files = this.getFiles(contentPath);

    files.forEach((file) => {
      const relativePath = path.relative(contentPath, file);
      const contentType = mime.lookup(file) || "application/octet-stream";

      new aws.s3.BucketObject(
        `${resourcePrefix}-${relativePath.replace(/[^a-zA-Z0-9]/g, "-")}`,
        {
          bucket: this.bucket.id,
          key: relativePath,
          source: new pulumi.asset.FileAsset(file),
          contentType: contentType,
          cacheControl: this.getCacheControl(file),
        },
        { parent: this }
      );
    });
  }

  private getFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.getFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    });

    return files;
  }

  private getCacheControl(file: string): string {
    const ext = path.extname(file);

    // Long cache for versioned assets
    if ([".js", ".css", ".woff", ".woff2", ".ttf", ".eot"].includes(ext)) {
      return "public, max-age=31536000, immutable";
    }

    // Shorter cache for images
    if ([".jpg", ".jpeg", ".png", ".gif", ".svg", ".ico"].includes(ext)) {
      return "public, max-age=86400";
    }

    // No cache for HTML
    if (ext === ".html") {
      return "public, max-age=0, must-revalidate";
    }

    return "public, max-age=3600";
  }
}
