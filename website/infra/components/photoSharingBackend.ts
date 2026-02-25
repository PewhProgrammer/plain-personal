import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as path from "path";

export interface PhotoSharingBackendArgs {
  environment: string;
  lambdaCodePath: string;
}

export class PhotoSharingBackend extends pulumi.ComponentResource {
  public readonly storageBucket: aws.s3.Bucket;
  public readonly api: aws.apigatewayv2.Api;
  public readonly apiUrl: pulumi.Output<string>;
  public readonly metadataTable: aws.dynamodb.Table;

  constructor(
    name: string,
    args: PhotoSharingBackendArgs,
    opts?: pulumi.ComponentResourceOptions
  ) {
    super("custom:photo:Backend", name, {}, opts);

    const defaultResourceOptions: pulumi.ResourceOptions = { parent: this };

    // S3 bucket for storing images
    this.storageBucket = new aws.s3.Bucket(
      `${name}-storage`,
      {
        tags: {
          Name: `Photo Storage - ${args.environment}`,
          Environment: args.environment,
        },
        corsRules: [
          {
            allowedHeaders: ["*"],
            allowedMethods: ["PUT", "POST", "GET"],
            allowedOrigins: ["*"], // Tighten this in production
            exposeHeaders: ["ETag"],
            maxAgeSeconds: 3000,
          },
        ],
      },
      defaultResourceOptions
    );

    // Block public access to storage bucket
    new aws.s3.BucketPublicAccessBlock(
      `${name}-storage-block`,
      {
        bucket: this.storageBucket.id,
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      defaultResourceOptions
    );

    // Lifecycle rule to reduce costs
    new aws.s3.BucketLifecycleConfigurationV2(
      `${name}-lifecycle`,
      {
        bucket: this.storageBucket.id,
        rules: [
          {
            id: "transition-old-images",
            status: "Enabled",
            transitions: [
              {
                days: 90,
                storageClass: "STANDARD_IA",
              },
              {
                days: 180,
                storageClass: "GLACIER_INSTANT_RETRIEVAL",
              },
            ],
          },
        ],
      },
      defaultResourceOptions
    );

    // DynamoDB table for album and image metadata
    this.metadataTable = new aws.dynamodb.Table(
      `${name}-metadata`,
      {
        billingMode: "PAY_PER_REQUEST", // On-demand pricing for cost efficiency
        hashKey: "PK",
        rangeKey: "SK",
        attributes: [
          { name: "PK", type: "S" },
          { name: "SK", type: "S" },
          { name: "GSI1PK", type: "S" },
          { name: "GSI1SK", type: "S" },
        ],
        globalSecondaryIndexes: [
          {
            name: "GSI1",
            hashKey: "GSI1PK",
            rangeKey: "GSI1SK",
            projectionType: "ALL",
          },
        ],
        tags: {
          Name: `Photo Metadata - ${args.environment}`,
          Environment: args.environment,
        },
      },
      defaultResourceOptions
    );

    // IAM role for Lambda functions
    const lambdaRole = new aws.iam.Role(
      `${name}-lambda-role`,
      {
        assumeRolePolicy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "lambda.amazonaws.com",
              },
            },
          ],
        }),
      },
      defaultResourceOptions
    );

    // Attach basic Lambda execution policy
    new aws.iam.RolePolicyAttachment(
      `${name}-lambda-basic`,
      {
        role: lambdaRole.name,
        policyArn: aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole,
      },
      defaultResourceOptions
    );

    // Custom policy for S3 and DynamoDB access
    const lambdaPolicy = new aws.iam.Policy(
      `${name}-lambda-policy`,
      {
        policy: pulumi
          .all([this.storageBucket.arn, this.metadataTable.arn])
          .apply(([bucketArn, tableArn]) =>
            JSON.stringify({
              Version: "2012-10-17",
              Statement: [
                {
                  Effect: "Allow",
                  Action: [
                    "s3:PutObject",
                    "s3:GetObject",
                    "s3:DeleteObject",
                    "s3:ListBucket",
                  ],
                  Resource: [`${bucketArn}/*`, bucketArn],
                },
                {
                  Effect: "Allow",
                  Action: [
                    "dynamodb:PutItem",
                    "dynamodb:GetItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                  ],
                  Resource: [tableArn, `${tableArn}/index/*`],
                },
              ],
            })
          ),
      },
      defaultResourceOptions
    );

    new aws.iam.RolePolicyAttachment(
      `${name}-lambda-policy-attach`,
      {
        role: lambdaRole.name,
        policyArn: lambdaPolicy.arn,
      },
      defaultResourceOptions
    );

    // Lambda functions
    const lambdaEnvironment = {
      STORAGE_BUCKET: this.storageBucket.id,
      METADATA_TABLE: this.metadataTable.name,
      ENVIRONMENT: args.environment,
    };

    const createAlbumLambda = this.createLambdaFunction(
      `${name}-createAlbum`,
      args.lambdaCodePath,
      "createAlbum.handler",
      lambdaRole.arn,
      lambdaEnvironment,
      defaultResourceOptions
    );

    const getAlbumLambda = this.createLambdaFunction(
      `${name}-getAlbum`,
      args.lambdaCodePath,
      "getAlbum.handler",
      lambdaRole.arn,
      lambdaEnvironment,
      defaultResourceOptions
    );

    const listImagesLambda = this.createLambdaFunction(
      `${name}-listImages`,
      args.lambdaCodePath,
      "listImages.handler",
      lambdaRole.arn,
      lambdaEnvironment,
      defaultResourceOptions
    );

    const getUploadUrlLambda = this.createLambdaFunction(
      `${name}-getUploadUrl`,
      args.lambdaCodePath,
      "getUploadUrl.handler",
      lambdaRole.arn,
      lambdaEnvironment,
      defaultResourceOptions
    );

    const getDownloadUrlLambda = this.createLambdaFunction(
      `${name}-getDownloadUrl`,
      args.lambdaCodePath,
      "getDownloadUrl.handler",
      lambdaRole.arn,
      lambdaEnvironment,
      defaultResourceOptions
    );

    // API Gateway HTTP API
    this.api = new aws.apigatewayv2.Api(
      `${name}-api`,
      {
        protocolType: "HTTP",
        corsConfiguration: {
          allowOrigins: ["*"], // Tighten this in production
          allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          allowHeaders: ["content-type", "x-amz-date", "authorization"],
          maxAge: 300,
        },
        tags: {
          Name: `Photo API - ${args.environment}`,
          Environment: args.environment,
        },
      },
      defaultResourceOptions
    );

    // API Gateway stage
    const stage = new aws.apigatewayv2.Stage(
      `${name}-stage`,
      {
        apiId: this.api.id,
        name: "$default",
        autoDeploy: true,
      },
      defaultResourceOptions
    );

    // Create routes and integrations
    this.createRoute(
      `${name}-createAlbum`,
      this.api,
      "POST",
      "/albums",
      createAlbumLambda,
      defaultResourceOptions
    );

    this.createRoute(
      `${name}-getAlbum`,
      this.api,
      "GET",
      "/albums/{albumId}",
      getAlbumLambda,
      defaultResourceOptions
    );

    this.createRoute(
      `${name}-listImages`,
      this.api,
      "GET",
      "/albums/{albumId}/images",
      listImagesLambda,
      defaultResourceOptions
    );

    this.createRoute(
      `${name}-getUploadUrl`,
      this.api,
      "POST",
      "/albums/{albumId}/upload-url",
      getUploadUrlLambda,
      defaultResourceOptions
    );

    this.createRoute(
      `${name}-getDownloadUrl`,
      this.api,
      "GET",
      "/albums/{albumId}/download-url/{imageId}",
      getDownloadUrlLambda,
      defaultResourceOptions
    );

    this.apiUrl = pulumi.interpolate`${this.api.apiEndpoint}`;

    this.registerOutputs({
      storageBucket: this.storageBucket.id,
      metadataTable: this.metadataTable.name,
      apiUrl: this.apiUrl,
    });
  }

  private createLambdaFunction(
    name: string,
    codePath: string,
    handler: string,
    roleArn: pulumi.Output<string>,
    environment: { [key: string]: pulumi.Input<string> },
    opts: pulumi.ResourceOptions
  ): aws.lambda.Function {
    return new aws.lambda.Function(
      name,
      {
        runtime: aws.lambda.Runtime.NodeJS18dX,
        code: new pulumi.asset.AssetArchive({
          ".": new pulumi.asset.FileArchive(codePath),
        }),
        handler: handler,
        role: roleArn,
        environment: {
          variables: environment,
        },
        memorySize: 256, // Minimal memory for cost efficiency
        timeout: 30, // 30 seconds should be plenty for these operations
        tags: {
          Name: name,
        },
      },
      opts
    );
  }

  private createRoute(
    name: string,
    api: aws.apigatewayv2.Api,
    method: string,
    path: string,
    lambda: aws.lambda.Function,
    opts: pulumi.ResourceOptions
  ): void {
    // Lambda permission for API Gateway
    new aws.lambda.Permission(
      `${name}-permission`,
      {
        action: "lambda:InvokeFunction",
        function: lambda.name,
        principal: "apigateway.amazonaws.com",
        sourceArn: pulumi.interpolate`${api.executionArn}/*/*`,
      },
      opts
    );

    // Integration
    const integration = new aws.apigatewayv2.Integration(
      `${name}-integration`,
      {
        apiId: api.id,
        integrationType: "AWS_PROXY",
        integrationUri: lambda.arn,
        payloadFormatVersion: "2.0",
      },
      opts
    );

    // Route
    new aws.apigatewayv2.Route(
      `${name}-route`,
      {
        apiId: api.id,
        routeKey: `${method} ${path}`,
        target: pulumi.interpolate`integrations/${integration.id}`,
      },
      opts
    );
  }
}
