const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

exports.createGroup = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Group name is required' });

    let code;
    let isUnique = false;
    while (!isUnique) {
      code = generateCode();
      const codeCheck = await client.query('SELECT id FROM groups WHERE code = $1', [code]);
      if (codeCheck.rows.length === 0) isUnique = true;
    }

    await client.query('BEGIN');
    const groupId = uuidv4();
    const groupResult = await client.query(
      'INSERT INTO groups (id, name, code, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [groupId, name, code, req.user.id]
    );
    
    const group = groupResult.rows[0];

    await client.query(
      'INSERT INTO group_members (id, group_id, student_id) VALUES ($1, $2, $3)',
      [uuidv4(), groupId, req.user.id]
    );
    
    await client.query('COMMIT');
    res.status(201).json(group);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in createGroup:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.id, g.name, g.code, g.created_at, g.created_by,
        (SELECT COUNT(*) FROM group_members gm2 WHERE gm2.group_id = g.id) as member_count
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.student_id = $1
       ORDER BY g.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getMyGroups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT g.*, 
        (SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id) as member_count
       FROM groups g
       ORDER BY g.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getAllGroups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Group code is required' });

    const groupResult = await pool.query('SELECT id FROM groups WHERE code = $1', [code]);
    if (groupResult.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupId = groupResult.rows[0].id;
    
    try {
      await pool.query(
        'INSERT INTO group_members (id, group_id, student_id) VALUES ($1, $2, $3)',
        [uuidv4(), groupId, req.user.id]
      );
      res.json({ message: 'Successfully joined group', groupId });
    } catch (err) {
      if (err.code === '23505') { // unique violation
        return res.status(400).json({ error: 'Already a member of this group' });
      }
      throw err;
    }
  } catch (error) {
    console.error('Error in joinGroup:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;
    
    if (!email) return res.status(400).json({ error: 'Email is required' });

    if (req.user.role !== 'admin') {
      const groupCheck = await pool.query('SELECT created_by FROM groups WHERE id = $1', [groupId]);
      if (groupCheck.rows.length === 0 || groupCheck.rows[0].created_by !== req.user.id) {
        return res.status(403).json({ error: 'Only group creator or admin can add members' });
      }
    }

    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const studentId = userResult.rows[0].id;

    try {
      await pool.query(
        'INSERT INTO group_members (id, group_id, student_id) VALUES ($1, $2, $3)',
        [uuidv4(), groupId, studentId]
      );
      res.json({ message: 'Member added successfully' });
    } catch (err) {
      if (err.code === '23505') return res.status(400).json({ error: 'User is already a member' });
      throw err;
    }
  } catch (error) {
    console.error('Error in addMember:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    
    if (req.user.role !== 'admin' && req.user.id !== memberId) {
      const groupCheck = await pool.query('SELECT created_by FROM groups WHERE id = $1', [groupId]);
      if (groupCheck.rows.length === 0 || groupCheck.rows[0].created_by !== req.user.id) {
        return res.status(403).json({ error: 'Only group creator, admin, or the member themselves can remove' });
      }
    }

    await pool.query(
      'DELETE FROM group_members WHERE group_id = $1 AND student_id = $2',
      [groupId, memberId]
    );
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error in removeMember:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, gm.joined_at
       FROM users u
       JOIN group_members gm ON u.id = gm.student_id
       WHERE gm.group_id = $1
       ORDER BY u.name`,
      [groupId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getGroupMembers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
