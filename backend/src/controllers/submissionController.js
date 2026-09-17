const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.initiateSubmission = async (req, res) => {
  try {
    const { assignmentId, groupId, notes } = req.body;

    if (!assignmentId || !groupId) {
      return res.status(400).json({ error: 'Assignment ID and Group ID are required' });
    }

    const checkMember = await pool.query(
      'SELECT id FROM group_members WHERE group_id = $1 AND student_id = $2',
      [groupId, req.user.id]
    );

    if (checkMember.rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    try {
      const submissionId = uuidv4();
      const result = await pool.query(
        `INSERT INTO submissions (id, assignment_id, group_id, submitted_by, status, notes)
         VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *`,
        [submissionId, assignmentId, groupId, req.user.id, notes]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Submission already exists for this group and assignment' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Error in initiateSubmission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.confirmSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE submissions SET status = 'confirmed', confirmed_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in confirmSubmission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSubmissionStatus = async (req, res) => {
  try {
    const { assignmentId, groupId } = req.query;
    
    if (!assignmentId || !groupId) {
      return res.status(400).json({ error: 'Assignment ID and Group ID are required' });
    }

    const result = await pool.query(
      'SELECT * FROM submissions WHERE assignment_id = $1 AND group_id = $2',
      [assignmentId, groupId]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in getSubmissionStatus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getGroupSubmissions = async (req, res) => {
  try {
    const { groupId } = req.params;

    const result = await pool.query(
      `SELECT s.*, a.title as assignment_title, a.due_date, u.name as submitted_by_name
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.id
       LEFT JOIN users u ON s.submitted_by = u.id
       WHERE s.group_id = $1
       ORDER BY s.created_at DESC`,
      [groupId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error in getGroupSubmissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
