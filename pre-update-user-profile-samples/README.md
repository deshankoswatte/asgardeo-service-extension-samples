# Pre-Profile Update Service Samples

This repository contains sample implementations of a pre-profile update validation service that can be integrated with
[Asgardeo](https://console.asgardeo.io/) or [WSO2 Identity Server](https://wso2.com/identity-server/). These samples
demonstrate how to build and deploy the service using Node.js/Express, and expose it securely through Choreo, Vercel and
AWS Lambda.

## Table of Contents

* [Overview](#-overview)
* [Samples](#-samples)
* [Getting Started](#-getting-started)

## Overview

The Pre-Profile Update Validation Service acts as a validation layer that enforces business rules and integrates with
external systems before user profile changes are committed. This ensures data integrity, improves security, and
maintains compliance with organizational policies.

When a profile update is initiated, the request is routed through the service. The service can perform various checks
and actions before allowing the update to proceed:

* Department Validation: Before a user can update their department, the service validates the department value against
  the company directory through a pre-defined list to ensure it is legitimate.

* Security Notifications: For updates to sensitive fields such as email, phone number, or department, the service
  proactively notifies the security team via email, enabling monitoring and rapid response to potential unauthorized
  changes.

This approach helps prevent invalid or unauthorized data changes while seamlessly integrating with existing enterprise
systems.

## Samples

### Express-based Pre-Profile Update Validation Service through Choreo

Located
in [pre-profile-update-validation-service-express-choreo](pre-profile-update-validation-service-express-choreo/README.md),
this sample demonstrates how to implement a pre-profile update validation service using Express.js, deployed through
Choreo. It validates department updates against an internal company directory and sends notification emails to the
security team before sensitive attributes such as email, phone number, or department are updated.

### Node-based Pre-Profile Update Validation Service through AWS Lambda

Located
in [pre-profile-update-validation-service-node-aws-lambda](pre-profile-update-validation-service-node-aws-lambda/README.md),
this sample demonstrates how to implement a
pre-profile update validation service using Node.js, deployed through AWS Lambda Function. It validates department
updates against an internal company directory and sends notification emails to the security team before sensitive
attributes such as email, phone number, or department are updated.

### Node-based Pre-Profile Update Validation Service through Vercel

Located
in [pre-profile-update-validation-service-node-vercel](pre-profile-update-validation-service-node-vercel/README.md),
this sample demonstrates how to implement a pre-profile update validation service using Node.js, deployed through
Vercel. It validates department updates against an internal company directory and sends notification emails to the
security team before sensitive attributes such as email, phone number, or department are updated.

## Getting Started

To get started with any of the samples, navigate to the respective project directory and follow the setup instructions
provided in the project's README file.
