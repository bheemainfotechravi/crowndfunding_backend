import express from "express";
import {
  createCampaign,
  updateCampaignStatus,
  getCampaigns,
  deleteCampaign
} from "../controllers/campaign.controller.js";

import upload from "../middleware/upload.js";

const campaignRouter = express.Router();


campaignRouter.post("/create",upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  createCampaign
);


campaignRouter.patch("/status/:id", updateCampaignStatus);

campaignRouter.get("/get", getCampaigns);

campaignRouter.delete("/delete/:id", deleteCampaign);

export default campaignRouter;