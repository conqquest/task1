-- Clean up existing data for seed idempotency
TRUNCATE TABLE submissions, assignment_groups, assignments, group_members, groups, users CASCADE;

-- Insert Admin
INSERT INTO users (id, name, email, password_hash, role) VALUES 
('a0000000-0000-0000-0000-000000000000', 'Prof. Kumar', 'prof@joineazy.com', '$2a$10$Rlpw0ZnwflaGOtlXewDRcuYoD7i5r2Gu1o9yiC2i6RHypIG2a03.K', 'admin');

-- Insert Students
INSERT INTO users (id, name, email, password_hash, role) VALUES 
('b1111111-1111-1111-1111-111111111111', 'Student One', 'student1@joineazy.com', '$2a$10$Rlpw0ZnwflaGOtlXewDRcuYoD7i5r2Gu1o9yiC2i6RHypIG2a03.K', 'student'),
('b2222222-2222-2222-2222-222222222222', 'Student Two', 'student2@joineazy.com', '$2a$10$Rlpw0ZnwflaGOtlXewDRcuYoD7i5r2Gu1o9yiC2i6RHypIG2a03.K', 'student'),
('b3333333-3333-3333-3333-333333333333', 'Student Three', 'student3@joineazy.com', '$2a$10$Rlpw0ZnwflaGOtlXewDRcuYoD7i5r2Gu1o9yiC2i6RHypIG2a03.K', 'student');

-- Insert Groups
INSERT INTO groups (id, name, code, created_by) VALUES 
('c1111111-1111-1111-1111-111111111111', 'Alpha Coders', 'ALPHA01', 'b1111111-1111-1111-1111-111111111111'),
('c2222222-2222-2222-2222-222222222222', 'Beta Builders', 'BETA02', 'b2222222-2222-2222-2222-222222222222');

-- Insert Group Members
INSERT INTO group_members (id, group_id, student_id) VALUES 
('d1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111'),
('d2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'b3333333-3333-3333-3333-333333333333'),
('d3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222');

-- Insert Assignments
INSERT INTO assignments (id, title, description, due_date, onedrive_url, target_type, created_by) VALUES 
('e1111111-1111-1111-1111-111111111111', 'Assignment 1 - Node API', 'Build a REST API with Express', NOW() + INTERVAL '7 days', 'https://onedrive.live.com/sample1', 'all', 'a0000000-0000-0000-0000-000000000000'),
('e2222222-2222-2222-2222-222222222222', 'Assignment 2 - React Frontend', 'Build a React app', NOW() + INTERVAL '14 days', 'https://onedrive.live.com/sample2', 'specific_groups', 'a0000000-0000-0000-0000-000000000000');

-- Insert Assignment Groups (for assignment 2)
INSERT INTO assignment_groups (assignment_id, group_id) VALUES 
('e2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111');

-- Insert Submission
INSERT INTO submissions (id, assignment_id, group_id, submitted_by, status, notes) VALUES 
('f1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'pending', 'Please review our code.');
