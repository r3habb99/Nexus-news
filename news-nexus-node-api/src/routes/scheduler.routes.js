import express from "express";
import { schedulerController } from "../controllers/index.js";

const router = express.Router();

/**
 * @route   GET /api/scheduler/status
 * @desc    Get scheduler status and statistics
 * @access  Public
 * @example /api/scheduler/status
 */
router.get("/status", schedulerController.getStatus);

/**
 * @route   POST /api/scheduler/trigger
 * @desc    Manually trigger a scheduled fetch
 * @body    schedule - Schedule name (EARLY_MORNING, MORNING, AFTERNOON, EVENING, NIGHT)
 * @access  Public
 * @example POST /api/scheduler/trigger { "schedule": "MORNING" }
 */
router.post("/trigger", schedulerController.triggerManualFetch);

/**
 * @route   POST /api/scheduler/start
 * @desc    Start the scheduler
 * @access  Public
 * @example POST /api/scheduler/start
 */
router.post("/start", schedulerController.startScheduler);

/**
 * @route   POST /api/scheduler/stop
 * @desc    Stop the scheduler
 * @access  Public
 * @example POST /api/scheduler/stop
 */
router.post("/stop", schedulerController.stopScheduler);

export default router;
