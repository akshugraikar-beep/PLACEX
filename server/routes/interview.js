// server/routes/interviews.js
import express from 'express';
import Interview from '../models/Interview.js';
import verifyToken from '../middleware/authMiddleware.js'; // Optional: for protected access
import handleVideo from "../controllers/videoController.js"
import logger from '../utils/logger.js';
import emailService from '../services/emailService.js';


const router = express.Router();

/**
 * @route   GET /api/interviews/past
 * @desc    Get all completed (past) interviews
 * @access  Private (optional - uncomment verifyToken if needed)
 */
router.get('/past', /* verifyToken, */ async (req, res) => {
  try {
const pastInterviews = await Interview.find({ status: 'completed' });


    const formatted = pastInterviews.map((interview) => ({
      id: interview._id,
      title: interview.title,
      company: interview.company,
      date: new Date(interview.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      score: interview.score,
      status: interview.status,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    logger.error('Error fetching past interviews:', error);
    res.status(500).json({ message: 'Server error while fetching past interviews' });
  }
});
router.post("/upload", handleVideo )

/**
 * @route   POST /api/interviews/schedule-and-notify
 * @desc    Schedule interview and send email notification to candidate
 * @access  Public (or Private)
 */
router.post('/schedule-and-notify', async (req, res) => {
  const { candidateEmail, candidateName, role, dateTime, meetLink, notes } = req.body;

  if (!candidateEmail || !candidateName || !role || !dateTime || !meetLink) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: candidateEmail, candidateName, role, dateTime, meetLink'
    });
  }

  try {
    logger.debug(`Scheduling interview for ${candidateName} (${candidateEmail}) on ${dateTime}`);

    // If email service is configured, send actual email.
    // If not, log it clearly and return sandbox success.
    if (emailService.isConfigured) {
      await emailService.sendInterviewInvitation(
        candidateEmail,
        candidateName,
        role,
        dateTime,
        meetLink,
        notes
      );
      res.status(200).json({
        success: true,
        message: `Interview invitation sent to ${candidateEmail}!`
      });
    } else {
      logger.warn(`
⚠️  EMAIL SERVICE NOT CONFIGURED (Missing GMAIL_USER or GMAIL_APP_PASSWORD in .env)
✉️  Logged Email Invitation:
    To: ${candidateEmail}
    Candidate: ${candidateName}
    Role: ${role}
    Scheduled Time: ${dateTime}
    Join Link: ${meetLink}
    Notes: ${notes}
      `);

      res.status(200).json({
        success: true,
        message: `Interview scheduled! (Sandbox Mode: GMAIL_USER / GMAIL_APP_PASSWORD are not configured in your backend .env file, so the email was logged to the server console instead).`
      });
    }
  } catch (error) {
    logger.error('Error sending interview invitation:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send interview email invitation',
      error: error.message
    });
  }
});

export default router;

