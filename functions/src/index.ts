/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {runPupWithContent, runPupWithUrl} from "./main";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest(async (request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  if (request.method !== "POST") {
    return response.status(405).send("Method is not allowed");
  }

  if (request.body === undefined) {
    return response.status(400).send("No data provided");
  }

  const {url, content} = request.body;
  const trimmedUrl = url.trim();
  const trimmedContent = content.trim();

  let pdf: Buffer;
  if (trimmedUrl && trimmedUrl.length > 0) {
    pdf = await runPupWithUrl(trimmedUrl);
  } else if (trimmedContent && trimmedContent.length > 0) {
    pdf = await runPupWithContent(trimmedUrl);
  } else {
    return response.status(400).send("Wrong data provided");
  }

  response.setHeader("Content-Disposition", "attachment; filename=document.pdf");
  response.contentType("application/pdf");
  response.send(pdf);
});
