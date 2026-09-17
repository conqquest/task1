const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.createAssignment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { title, description, due_date, onedrive_url, target_type, target_group_ids } = req.body;
    
    await client.query('BEGIN');
    const assignmentId = uuidv4();
    const result = await client.query(
      `INSERT INTO assignments (id, title, description, due_date, onedrive_url, target_type, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [assignmentId, title, description, due_date, onedrive_url, target_type || 'all', req.user.id]
    );

    if (target_type === 'specific_groups' && Array.isArray(target_group_ids)) {
      for (const groupId of target_group_ids) {
        await client.query(
          'INSERT INTO assignment_groups (assignment_id, group_id) VALUES ($1, $2)',
          [assignmentId, groupId]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in createAssignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

exports.getAssignments = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const result = await pool.query('SELECT * FROM assignments ORDER BY due_date ASC');
      return res.json(result.rows);
    }

    const result = await pool.query(
      `SELECT DISTINCT a.* FROM assignments a
       LEFT JOIN assignment_groups ag ON a.id = ag.assignment_id
       LEFT JOIN group_members gm ON ag.group_id = gm.group_id
       WHERE a.target_type = 'all' OR gm.student_id = $1
       ORDER BY a.due_date ASC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getAssignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupId } = req.query; // If student wants submission status for a specific group

    const result = await pool.query('SELECT * FROM assignments WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Assignment not found' });
    
    let assignment = result.rows[0];

    if (groupId) {
      const subResult = await pool.query(
        'SELECT * FROM submissions WHERE assignment_id = $1 AND group_id = $2',
        [id, groupId]
      );
      assignment.submission = subResult.rows[0] || null;
    }

    res.json(assignment);
  } catch (error) {
    console.error('Error in getAssignmentById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, onedrive_url } = req.body;
    
    const result = await pool.query(
      `UPDATE assignments SET title = COALESCE($1, title), description = COALESCE($2, description), 
       due_date = COALESCE($3, due_date), onedrive_url = COALESCE($4, onedrive_url) 
       WHERE id = $5 RETURNING *`,
      [title, description, due_date, onedrive_url, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in updateAssignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM assignments WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'Assignment not found' });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAssignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
