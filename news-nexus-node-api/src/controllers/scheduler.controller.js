import { newsFetchScheduler } from "../services/index.js";
import { sendSuccessResponse, sendErrorResponse, Logger } from "../utils/index.js";

/**
 * Scheduler Controller
 * Manages news fetch scheduler operations
 */
class SchedulerController {
  /**
   * Get scheduler status
   * GET /api/scheduler/status
   */
  async getStatus(req, res) {
    try {
      Logger.info("Fetching scheduler status");
      
      const status = newsFetchScheduler.getStatus();
      
      sendSuccessResponse(res, status, "Scheduler status fetched successfully");
    } catch (error) {
      Logger.error("Error fetching scheduler status", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Trigger manual fetch
   * POST /api/scheduler/trigger
   * Body: { schedule: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT" | "EARLY_MORNING" }
   */
  async triggerManualFetch(req, res) {
    try {
      const { schedule } = req.body;
      
      if (!schedule) {
        return sendErrorResponse(res, "Schedule name is required (MORNING, AFTERNOON, EVENING, NIGHT, EARLY_MORNING)", 400);
      }

      Logger.info("Triggering manual fetch", { schedule });
      
      // Trigger fetch asynchronously (don't wait)
      newsFetchScheduler.triggerManualFetch(schedule).catch((error) => {
        Logger.error("Manual fetch failed", { error: error.message });
      });
      
      sendSuccessResponse(
        res,
        { schedule, status: "triggered" },
        `Manual fetch for ${schedule} has been triggered`,
        202
      );
    } catch (error) {
      Logger.error("Error triggering manual fetch", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Start scheduler
   * POST /api/scheduler/start
   */
  async startScheduler(req, res) {
    try {
      Logger.info("Starting scheduler via API");
      
      newsFetchScheduler.start();
      
      sendSuccessResponse(res, { status: "running" }, "Scheduler started successfully");
    } catch (error) {
      Logger.error("Error starting scheduler", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }

  /**
   * Stop scheduler
   * POST /api/scheduler/stop
   */
  async stopScheduler(req, res) {
    try {
      Logger.info("Stopping scheduler via API");
      
      newsFetchScheduler.stop();
      
      sendSuccessResponse(res, { status: "stopped" }, "Scheduler stopped successfully");
    } catch (error) {
      Logger.error("Error stopping scheduler", { error: error.message });
      sendErrorResponse(res, error.message, 500);
    }
  }
}

export default new SchedulerController();
