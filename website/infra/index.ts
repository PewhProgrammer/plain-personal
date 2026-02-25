import * as pulumi from "@pulumi/pulumi";
import * as path from "path";
import { StaticWebsite } from "./components/staticWebsite";
import { PhotoSharingBackend } from "./components/photoSharingBackend";

// Get configuration
const config = new pulumi.Config("website");
const awsConfig = new pulumi.Config("aws");
const environment = config.require("environment");
const region = awsConfig.require("region");

// Paths
const landingPagePath = path.join(__dirname, "../apps/landing/dist");
const photoFrontendPath = path.join(__dirname, "../apps/photo-sharing/frontend/dist");
const photoBackendPath = path.join(__dirname, "../apps/photo-sharing/backend/dist");

// Deploy Landing Page
const landingPage = new StaticWebsite("landing-page", {
  siteName: `Personal Website - ${environment}`,
  contentPath: landingPagePath,
  indexDocument: "index.html",
  errorDocument: "index.html",
});

// Deploy Photo Sharing Backend
const photoBackend = new PhotoSharingBackend("photo-backend", {
  environment: environment,
  lambdaCodePath: photoBackendPath,
});

// Deploy Photo Sharing Frontend
const photoFrontend = new StaticWebsite("photo-frontend", {
  siteName: `Photo Sharing - ${environment}`,
  contentPath: photoFrontendPath,
  indexDocument: "index.html",
  errorDocument: "index.html",
});

// Export outputs
export const landingPageUrl = landingPage.url;
export const landingPageBucket = landingPage.bucket.id;
export const landingPageDistributionId = landingPage.distribution.id;

export const photoFrontendUrl = photoFrontend.url;
export const photoFrontendBucket = photoFrontend.bucket.id;
export const photoFrontendDistributionId = photoFrontend.distribution.id;

export const photoApiUrl = photoBackend.apiUrl;
export const photoStorageBucket = photoBackend.storageBucket.id;
export const photoMetadataTable = photoBackend.metadataTable.name;

export const region_output = region;
export const environment_output = environment;

// Create a config object for frontends
export const frontendConfig = pulumi.all([
  photoApiUrl,
  landingPageUrl,
  photoFrontendUrl,
]).apply(([apiUrl, landingUrl, photoUrl]) => ({
  apiBaseUrl: apiUrl,
  landingPageUrl: landingUrl,
  photoSharingUrl: photoUrl,
}));
