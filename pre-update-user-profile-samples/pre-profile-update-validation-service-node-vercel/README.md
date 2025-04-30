# Node-based Pre-Profile Update Validation Service through Vercel

A Node.js-based microservice deployed on Vercel that acts as a Pre-Profile Update Service. It validates department
inputs and alerts the security team via email if sensitive user attributes (email, phone, department) are modified.

## Table of Contents
    
* [Overview](#overview)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Setup Instructions](#setup-instructions)
    + [1️⃣Clone the Repository](#1-clone-the-repository)
    + [2️⃣Install Dependencies](#2-install-dependencies)
    + [3️⃣Configure Environment Variables](#3-configure-environment-variables)
    + [4️⃣Run](#4-run)
* [Configure the Pre-Update Profile Action in Product](#configure-the-pre-update-profile-action-in-product)
    + [Configuring the Action in WSO2 Identity Server](#configuring-the-action-in-wso2-identity-server)
    + [Configuring the Action in Asgardeo](#configuring-the-action-in-asgardeo)
* [API Endpoints](#api-endpoints)
* [Environment Variables](#environment-variables)

---

## Overview

This service validates incoming user profile updates in identity systems like WSO2 IS. It performs strict checks on
departments and sends an alert email if sensitive claims are updated.

It supports:

- Department validation against an allowlist.
- Notification emails on updates to sensitive fields like email, phone, and department.
- API key authentication.

[← Back to Table of Contents](#table-of-contents)

---

## Features

- Secure API with header-based API key validation
- Department whitelist enforcement
- Email alerts for sensitive attribute changes
- Easily deployable to [Vercel](https://vercel.com/)

[← Back to Table of Contents](#table-of-contents)

---

## Prerequisites

- Node.js 22+
- A [Mailtrap](https://mailtrap.io/) (or similar SMTP) account for testing emails
- A [Vercel](https://vercel.com/) account for deployment
- API client like Postman or curl for testing requests

[← Back to Table of Contents](#table-of-contents)

---

## Setup Instructions

### 1. Clone the Repository

   ```bash
   git clone <your-repo-url>
   cd your-repo-name
   ```

### 2. Install Dependencies

    ```bash
    npm install
    ```

### 3. Configure Environment Variables

Create a .env file in the project root with the following:

   ```env
    API_KEY=your_api_key_here 
    MAILTRAP_USER=your_mailtrap_user
    MAILTRAP_PASS=your_mailtrap_pass
   ```

### 4. Run

Use a tool like vercel dev to test locally:

```bash
    vercel dev
  ```

To deploy in production please make sure a Vercel account exists and use the command:

```bash
    vercel --prod
  ```

[← Back to Table of Contents](#table-of-contents)

---

## Configure the Pre-Update Profile Action in Product

### Configuring the Action in WSO2 Identity Server

To integrate this service with WSO2 Identity Server, follow the step-by-step guide at
the [documentation](https://is.docs.wso2.com/en/next/guides/service-extensions/pre-flow-extensions/pre-update-profile-action/).

### Configuring the Action in Asgardeo

To integrate this service with Asgardeo, follow the step-by-step guide at
the [documentation](https://wso2.com/asgardeo/docs/guides/service-extensions/pre-flow-extensions/pre-update-profile-action/).

[← Back to Table of Contents](#table-of-contents)

---

## API Endpoints

### Health Check

This endpoint is to check if the service is successfully running.

- **GET** `/`
- **Response:**

```json
{
  "status": "ok",
  "message": "Service is running."
}
```

[← Back to Table of Contents](#table-of-contents)

---

### Validate Profile Update

Validates department and checks if sensitive attributes are being updated. If so, an email alert is triggered.

- **POST** `/validate-user-profile-update`
- **Request Headers:**

| Headers Key  | 	Value           |
|--------------|------------------|
| api-key	     | your_api_key     |
| Content-Type | application/json |

- **Request Body:**

```json
{
  "actionType": "PRE_UPDATE_PROFILE",
  "event": {
    "request": {
      "claims": [
        {
          "uri": "http://wso2.org/claims/department",
          "value": "HR"
        },
        {
          "uri": "http://wso2.org/claims/mobile",
          "value": "+94771223448"
        },
        {
          "uri": "http://wso2.org/claims/emailaddress",
          "value": "testuser@wso2.com"
        }
      ]
    },
    "tenant": {
      "id": "2210",
      "name": "deshankoswatte"
    },
    "user": {
      "id": "57b22cbf-4688-476c-a607-c0c9d089d25d",
      "claims": [
        {
          "uri": "http://wso2.org/claims/username",
          "value": "testuser@wso2.com"
        },
        {
          "uri": "http://wso2.org/claims/identity/userSource",
          "value": "DEFAULT"
        },
        {
          "uri": "http://wso2.org/claims/identity/idpType",
          "value": "Local"
        }
      ]
    },
    "userStore": {
      "id": "REVGQVVMVA==",
      "name": "DEFAULT"
    },
    "initiatorType": "ADMIN",
    "action": "UPDATE"
  }
}
```

- **Response (Unauthorized API Key):**

```json
{
  "actionStatus": "FAILED",
  "failureReason": "unauthorized",
  "failureDescription": "Invalid or missing API key."
}
```

- **Response (Invalid Action Type):**

```json
{
  "actionStatus": "FAILED",
  "failureReason": "invalid_input",
  "failureDescription": "Invalid actionType provided."
}
```

- **Response (Invalid Department):**

```json
{
  "actionStatus": "FAILED",
  "failureReason": "invalid_department_input",
  "failureDescription": "Provided user department value is invalid."
}
```

- **Response (Email Sending Failure):**

```json
{
  "actionStatus": "FAILED",
  "failureReason": "email_error",
  "failureDescription": "Failed to notify security team about sensitive data update."
}
```

- **Response (Department validation and email sending is successful):**

```json
{
  "actionStatus": "SUCCESS"
}
```

[← Back to Table of Contents](#table-of-contents)

---

## Environment Variables

| Variable       | Description                   |
|----------------|-------------------------------|
| API_KEY	       | API key for header-based auth | 
| MAILTRAP_USER	 | Mailtrap username for SMTP    |
| MAILTRAP_PASS	 | Mailtrap password for SMTP    |

[← Back to Table of Contents](#table-of-contents)

---
