-- ============================================
-- Seed Data for Portfolio
-- Run this after migration to populate test data
-- ============================================

-- Note: Replace 'YOUR_USER_UUID' with the actual UUID of your auth user
-- You can get this from the Supabase dashboard after signing up

-- Seed Profile (run after user is created)
-- INSERT INTO public.profile (id, display_name, badge_text, hero_title, short_description, detailed_bio, social_links)
-- VALUES (
--   'YOUR_USER_UUID',
--   'Ilham Ramadhan',
--   'Fullstack Developer',
--   'Building Digital Experiences',
--   'Passionate developer creating amazing web applications',
--   'Fullstack Developer with 3+ years of experience building scalable web applications. Passionate about clean code, modern technologies, and creating exceptional user experiences.',
--   '{"github": "https://github.com/ilham-ramadhan", "linkedin": "https://linkedin.com/in/ilham-ramadhan", "email": "ilham@example.com"}'::jsonb
-- );

-- Seed Projects
-- These will be created after user registration via the CMS

-- Dummy data for testing (replace USER_UUID with actual user id after registration)
-- To use: 
-- 1. Create an account via the CMS login
-- 2. Get your user ID from Supabase dashboard (Authentication > Users)
-- 3. Replace 'YOUR_USER_UUID' below and run these queries

/*
-- Example Projects
INSERT INTO public.projects (user_id, title, slug, short_description, content, tech_stack, tags, demo_url, repo_url, is_featured)
VALUES 
(
  'YOUR_USER_UUID'::uuid,
  'E-Commerce Platform',
  'ecommerce-platform',
  'Full-featured online shopping platform with payment integration',
  'A comprehensive e-commerce solution built with React and Node.js. Features include user authentication, product catalog, shopping cart, and Stripe payment integration.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'],
  ARRAY['Web', 'E-Commerce', 'Fullstack'],
  'https://my-ecommerce-demo.com',
  'https://github.com/ilham-ramadhan/ecommerce-platform',
  true
),
(
  'YOUR_USER_UUID'::uuid,
  'Task Management App',
  'task-management',
  'Collaborative project management tool with real-time updates',
  'A real-time task management application featuring Kanban boards, team collaboration, and Socket.io for live updates.',
  ARRAY['Vue.js', 'Express', 'MongoDB', 'Socket.io'],
  ARRAY['Productivity', 'Real-time', 'SaaS'],
  'https://task-manager-demo.com',
  'https://github.com/ilham-ramadhan/task-manager',
  true
),
(
  'YOUR_USER_UUID'::uuid,
  'Analytics Dashboard',
  'analytics-dashboard',
  'Business intelligence dashboard with data visualization',
  'A powerful analytics dashboard for visualizing business metrics with interactive charts and real-time data processing.',
  ARRAY['Angular', 'Python', 'FastAPI', 'PostgreSQL'],
  ARRAY['Analytics', 'Data Visualization', 'Enterprise'],
  'https://analytics-demo.com',
  'https://github.com/ilham-ramadhan/analytics-dashboard',
  true
);

-- Example Blog Posts
INSERT INTO public.blogs (user_id, title, slug, excerpt, content, tags, published_at, is_featured)
VALUES 
(
  'YOUR_USER_UUID'::uuid,
  'Building Scalable Microservices with Node.js',
  'microservices-architecture',
  'A comprehensive guide to designing and implementing microservices architecture using Node.js, Docker, and Kubernetes.',
  'Microservices architecture has become the gold standard for building scalable applications. In this article, we explore the key patterns and best practices for building microservices with Node.js...',
  ARRAY['Node.js', 'Microservices', 'Docker', 'Kubernetes'],
  NOW(),
  true
),
(
  'YOUR_USER_UUID'::uuid,
  'React Performance Optimization: Beyond the Basics',
  'react-performance',
  'Advanced techniques for optimizing React applications including code splitting, memoization, and bundle analysis.',
  'Performance optimization is crucial for modern React applications. In this article, we ll explore advanced techniques that go beyond the basics...',
  ARRAY['React', 'Performance', 'Optimization', 'Webpack'],
  NOW(),
  true
),
(
  'YOUR_USER_UUID'::uuid,
  'Database Design Patterns for Modern Applications',
  'database-design',
  'Exploring different database design patterns and when to use them in modern web applications.',
  'Choosing the right database design pattern can make or break your application s performance. Let me walk you through the most common patterns...',
  ARRAY['Database', 'PostgreSQL', 'Design Patterns', 'SQL'],
  NOW(),
  false
),
(
  'YOUR_USER_UUID'::uuid,
  'Complete CI/CD Pipeline with GitHub Actions',
  'devops-ci-cd',
  'Step-by-step guide to setting up automated deployment pipelines using GitHub Actions, Docker, and AWS.',
  'Continuous Integration and Deployment are essential for modern development workflows. Here is how to set up a complete CI/CD pipeline...',
  ARRAY['CI/CD', 'GitHub Actions', 'Docker', 'AWS'],
  NOW(),
  false
);

-- Example Resume Entries
INSERT INTO public.resume (user_id, type, title, institution, period, description, tags)
VALUES 
(
  'YOUR_USER_UUID'::uuid,
  'experience',
  'Senior Fullstack Developer',
  'TechCorp Indonesia',
  'Jan 2022 - Present',
  'Led development of microservices architecture. Improved application performance by 40%. Mentored 3 junior developers.',
  ARRAY['Leadership', 'Microservices', 'Mentoring']
),
(
  'YOUR_USER_UUID'::uuid,
  'experience',
  'Fullstack Developer',
  'StartupXYZ',
  'Jun 2021 - Dec 2021',
  'Built e-commerce platform from scratch. Implemented CI/CD pipelines. Reduced deployment time by 60%.',
  ARRAY['E-Commerce', 'CI/CD', 'DevOps']
),
(
  'YOUR_USER_UUID'::uuid,
  'experience',
  'Frontend Developer',
  'WebStudio',
  'Mar 2020 - May 2021',
  'Developed responsive web applications. Collaborated with design team on UI/UX. Optimized frontend performance.',
  ARRAY['Frontend', 'React', 'UI/UX']
),
(
  'YOUR_USER_UUID'::uuid,
  'education',
  'Bachelor of Computer Science',
  'Universitas Indonesia',
  '2016 - 2020',
  'Focused on software engineering and web development.',
  ARRAY['Computer Science', 'Software Engineering']
);

-- Example Tech Stack
INSERT INTO public.tech_stack (user_id, name, category)
VALUES 
('YOUR_USER_UUID'::uuid, 'React', 'Frontend'),
('YOUR_USER_UUID'::uuid, 'Vue.js', 'Frontend'),
('YOUR_USER_UUID'::uuid, 'Angular', 'Frontend'),
('YOUR_USER_UUID'::uuid, 'TypeScript', 'Frontend'),
('YOUR_USER_UUID'::uuid, 'Tailwind CSS', 'Frontend'),
('YOUR_USER_UUID'::uuid, 'Node.js', 'Backend'),
('YOUR_USER_UUID'::uuid, 'Python', 'Backend'),
('YOUR_USER_UUID'::uuid, 'Java', 'Backend'),
('YOUR_USER_UUID'::uuid, 'Express', 'Backend'),
('YOUR_USER_UUID'::uuid, 'FastAPI', 'Backend'),
('YOUR_USER_UUID'::uuid, 'PostgreSQL', 'Database'),
('YOUR_USER_UUID'::uuid, 'MongoDB', 'Database'),
('YOUR_USER_UUID'::uuid, 'Redis', 'Database'),
('YOUR_USER_UUID'::uuid, 'AWS', 'Cloud'),
('YOUR_USER_UUID'::uuid, 'Docker', 'Cloud'),
('YOUR_USER_UUID'::uuid, 'Kubernetes', 'Cloud'),
('YOUR_USER_UUID'::uuid, 'Git', 'Tools'),
('YOUR_USER_UUID'::uuid, 'Jest', 'Tools'),
('YOUR_USER_UUID'::uuid, 'Cypress', 'Tools'),
('YOUR_USER_UUID'::uuid, 'Figma', 'Tools');

-- Example Services
INSERT INTO public.services (user_id, title, description, icon_name)
VALUES 
('YOUR_USER_UUID'::uuid, 'Web Development', 'Building modern, responsive web applications with React, Vue, or Angular', 'globe'),
('YOUR_USER_UUID'::uuid, 'Backend Development', 'Creating scalable APIs and microservices with Node.js or Python', 'server'),
('YOUR_USER_UUID'::uuid, 'Database Design', 'Designing efficient database schemas for PostgreSQL and MongoDB', 'database'),
('YOUR_USER_UUID'::uuid, 'DevOps & Cloud', 'Setting up CI/CD pipelines and cloud infrastructure on AWS', 'cloud');

-- Example Certificates
INSERT INTO public.certificates (user_id, title, description, issued_by, issued_date, credential_url)
VALUES 
('YOUR_USER_UUID'::uuid, 'AWS Certified Solutions Architect', 'Professional certification for AWS cloud architecture', 'Amazon Web Services', '2023-06-15', 'https://aws.amazon.com/certification/'),
('YOUR_USER_UUID'::uuid, 'Professional Scrum Master I', 'Scrum methodology certification', 'Scrum.org', '2022-03-20', 'https://www.scrum.org/');
*/
