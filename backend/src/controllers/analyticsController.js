const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const studentCountResult = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'");
    const groupCountResult = await pool.query("SELECT COUNT(*) FROM groups");
    const assignmentCountResult = await pool.query("SELECT COUNT(*) FROM assignments");
    
    const totalGroups = parseInt(groupCountResult.rows[0].count) || 1;
    const totalAssignments = parseInt(assignmentCountResult.rows[0].count) || 1;
    const totalExpectedSubmissions = totalGroups * totalAssignments;

    const submissionCountResult = await pool.query("SELECT COUNT(*) FROM submissions WHERE status = 'confirmed'");
    const confirmedSubmissions = parseInt(submissionCountResult.rows[0].count) || 0;

    let submissionRate = 0;
    if (totalExpectedSubmissions > 0) {
        submissionRate = Math.round((confirmedSubmissions / totalExpectedSubmissions) * 100);
    }

    res.json({
      totalStudents: parseInt(studentCountResult.rows[0].count),
      totalGroups: parseInt(groupCountResult.rows[0].count),
      totalAssignments: parseInt(assignmentCountResult.rows[0].count),
      submissionRatePercentage: submissionRate
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSubmissionsByAssignment = async (req, res) => {
  try {
    const totalGroupsResult = await pool.query("SELECT COUNT(*) FROM groups");
    const totalGroups = parseInt(totalGroupsResult.rows[0].count) || 0;

    const result = await pool.query(`
      SELECT a.id, a.title,
             COUNT(s.id) FILTER (WHERE s.status = 'confirmed') as confirmed_count,
             COUNT(s.id) FILTER (WHERE s.status = 'pending') as pending_count
      FROM assignments a
      LEFT JOIN submissions s ON a.id = s.assignment_id
      GROUP BY a.id, a.title
      ORDER BY a.created_at DESC
    `);
    
    const formatted = result.rows.map(row => {
      const confirmed = parseInt(row.confirmed_count);
      const pending = parseInt(row.pending_count);
      return {
        id: row.id,
        title: row.title,
        confirmed,
        pending,
        not_submitted: Math.max(0, totalGroups - (confirmed + pending))
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error in getSubmissionsByAssignment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getGroupProgress = async (req, res) => {
  try {
    const totalAssignmentsResult = await pool.query("SELECT COUNT(*) FROM assignments");
    const totalAssignments = parseInt(totalAssignmentsResult.rows[0].count) || 1;

    const result = await pool.query(`
      SELECT g.id, g.name,
             COUNT(s.id) FILTER (WHERE s.status = 'confirmed') as completed_assignments
      FROM groups g
      LEFT JOIN submissions s ON g.id = s.group_id
      GROUP BY g.id, g.name
      ORDER BY g.name ASC
    `);

    const formatted = result.rows.map(row => {
      const completed = parseInt(row.completed_assignments);
      return {
        id: row.id,
        name: row.name,
        completedAssignments: completed,
        totalAssignments: totalAssignments,
        completionPercentage: Math.round((completed / totalAssignments) * 100)
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error in getGroupProgress:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
