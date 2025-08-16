import { useCallback } from 'react';

interface TerminalLine {
  id: string;
  content: string;
  type: 'command' | 'output' | 'error' | 'info';
  timestamp: number;
}

interface UseTerminalCommandsProps {
  setLines: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
}

export const useTerminalCommands = ({ setLines, setCurrentPath }: UseTerminalCommandsProps) => {
  const addOutput = useCallback((content: string, type: 'output' | 'error' | 'info' = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString(),
      content,
      type,
      timestamp: Date.now(),
    };
    setLines(prev => [...prev, newLine]);
  }, [setLines]);

  const projects = [
    {
      id: 'ecommerce-platform',
      name: 'E-Commerce Platform',
      tech: 'React, Node.js, PostgreSQL, Stripe',
      description: 'Full-featured online shopping platform with payment integration',
      status: 'Production',
      github: 'https://github.com/ilham-ramadhan/ecommerce-platform',
      demo: 'https://my-ecommerce-demo.com',
      features: [
        'User authentication & authorization',
        'Product catalog with search & filtering',
        'Shopping cart & checkout process',
        'Payment integration with Stripe',
        'Admin dashboard for inventory management',
        'Order tracking & email notifications'
      ],
      challenges: 'Implementing real-time inventory updates and optimizing database queries for large product catalogs.',
      learned: 'Advanced PostgreSQL optimization, Redis caching strategies, and serverless architecture patterns.'
    },
    {
      id: 'task-management',
      name: 'Task Management App',
      tech: 'Vue.js, Express, MongoDB, Socket.io',
      description: 'Collaborative project management tool with real-time updates',
      status: 'Development',
      github: 'https://github.com/ilham-ramadhan/task-manager',
      demo: 'https://task-manager-demo.com',
      features: [
        'Real-time collaboration with Socket.io',
        'Kanban boards with drag-and-drop',
        'Team management & role-based permissions',
        'Time tracking & reporting',
        'File attachments & comments',
        'Mobile-responsive design'
      ],
      challenges: 'Handling real-time synchronization conflicts and implementing efficient permission systems.',
      learned: 'WebSocket management, conflict resolution strategies, and Vue 3 Composition API best practices.'
    },
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      tech: 'Angular, Python, FastAPI, PostgreSQL',
      description: 'Business intelligence dashboard with data visualization',
      status: 'Production',
      github: 'https://github.com/ilham-ramadhan/analytics-dashboard',
      demo: 'https://analytics-demo.com',
      features: [
        'Interactive charts with Chart.js & D3.js',
        'Real-time data processing',
        'Custom report generation',
        'Data export in multiple formats',
        'Role-based access control',
        'API rate limiting & caching'
      ],
      challenges: 'Processing large datasets efficiently and creating performant real-time visualizations.',
      learned: 'Data processing optimization, advanced Angular patterns, and Python async programming.'
    }
  ];

  const articles = [
    {
      id: 'microservices-architecture',
      title: 'Building Scalable Microservices with Node.js',
      date: '2024-01-15',
      category: 'Backend',
      readTime: '8 min read',
      description: 'A comprehensive guide to designing and implementing microservices architecture using Node.js, Docker, and Kubernetes.',
      tags: ['Node.js', 'Microservices', 'Docker', 'Kubernetes'],
      preview: 'Microservices architecture has become the gold standard for building scalable applications...'
    },
    {
      id: 'react-performance',
      title: 'React Performance Optimization: Beyond the Basics',
      date: '2024-01-08',
      category: 'Frontend',
      readTime: '12 min read',
      description: 'Advanced techniques for optimizing React applications including code splitting, memoization, and bundle analysis.',
      tags: ['React', 'Performance', 'Optimization', 'Webpack'],
      preview: 'Performance optimization is crucial for modern React applications. In this article, we\'ll explore...'
    },
    {
      id: 'database-design',
      title: 'Database Design Patterns for Modern Applications',
      date: '2023-12-28',
      category: 'Database',
      readTime: '10 min read',
      description: 'Exploring different database design patterns and when to use them in modern web applications.',
      tags: ['Database', 'PostgreSQL', 'Design Patterns', 'SQL'],
      preview: 'Choosing the right database design pattern can make or break your application\'s performance...'
    },
    {
      id: 'devops-ci-cd',
      title: 'Complete CI/CD Pipeline with GitHub Actions',
      date: '2023-12-20',
      category: 'DevOps',
      readTime: '15 min read',
      description: 'Step-by-step guide to setting up automated deployment pipelines using GitHub Actions, Docker, and AWS.',
      tags: ['CI/CD', 'GitHub Actions', 'Docker', 'AWS'],
      preview: 'Continuous Integration and Deployment are essential for modern development workflows...'
    }
  ];

  const skills = [
    'Frontend: React, Vue.js, Angular, TypeScript, Tailwind CSS',
    'Backend: Node.js, Python, Java, Express, FastAPI',
    'Database: PostgreSQL, MongoDB, Redis',
    'Cloud: AWS, Docker, Kubernetes',
    'Tools: Git, Jest, Cypress, Figma'
  ];

  const executeCommand = useCallback((command: string) => {
    const [cmd, ...args] = command.toLowerCase().split(' ');

    switch (cmd) {
      case 'help':
        addOutput('┌─────────────────────────────────────────────────────────────┐');
        addOutput('│                    AVAILABLE COMMANDS                       │');
        addOutput('├─────────────────────────────────────────────────────────────┤');
        addOutput('│ about          - Learn about Ilham Ramadhan                │');
        addOutput('│ projects       - View recent projects                       │');
        addOutput('│ project <id>   - View detailed project info                │');
        addOutput('│ articles       - View recent articles/blog posts           │');
        addOutput('│ article <id>   - Read specific article                     │');
        addOutput('│ skills         - Display technical skills                   │');
        addOutput('│ contact        - Get contact information                    │');
        addOutput('│ experience     - View work experience                      │');
        addOutput('│ ascii          - Show ASCII art logo                       │');
        addOutput('│ tree           - Show file structure                       │');
        addOutput('│ clear          - Clear terminal screen                     │');
        addOutput('│ ls             - List directory contents                   │');
        addOutput('│ cat <file>     - Display file contents                     │');
        addOutput('│ pwd            - Show current directory                    │');
        addOutput('│ whoami         - Display current user                      │');
        addOutput('│ date           - Show current date and time               │');
        addOutput('└─────────────────────────────────────────────────────────────┘');
        break;

      case 'ascii':
        addOutput('');
        addOutput('  ██╗██╗     ██╗  ██╗ █████╗ ███╗   ███╗');
        addOutput('  ██║██║     ██║  ██║██╔══██╗████╗ ████║');
        addOutput('  ██║██║     ███████║███████║██╔████╔██║');
        addOutput('  ██║██║     ██╔══██║██╔══██║██║╚██╔╝██║');
        addOutput('  ██║███████╗██║  ██║██║  ██║██║ ╚═╝ ██║');
        addOutput('  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝');
        addOutput('');
        addOutput('    ╦═╗ ╔═╗ ╔╦╗ ╔═╗ ╔╦╗ ╦ ╦ ╔═╗ ╔╗╔');
        addOutput('    ╠╦╝ ╠═╣ ║║║ ╠═╣  ║║ ╠═╣ ╠═╣ ║║║');
        addOutput('    ╩╚═ ╩ ╩ ╩ ╩ ╩ ╩ ╩╩╝ ╩ ╩ ╩ ╩ ╝╚╝');
        addOutput('');
        addOutput('    Fullstack Developer & Code Architect');
        addOutput('');
        break;

      case 'tree':
        addOutput('portfolio/');
        addOutput('├── about.md');
        addOutput('├── contact.txt');
        addOutput('├── projects/');
        addOutput('│   ├── ecommerce-platform/');
        addOutput('│   ├── task-management/');
        addOutput('│   └── analytics-dashboard/');
        addOutput('├── articles/');
        addOutput('│   ├── microservices-architecture.md');
        addOutput('│   ├── react-performance.md');
        addOutput('│   ├── database-design.md');
        addOutput('│   └── devops-ci-cd.md');
        addOutput('├── experience.json');
        addOutput('└── skills.json');
        break;

      case 'articles':
        addOutput('┌─────────────────────────────────────────────────────────────┐');
        addOutput('│                      RECENT ARTICLES                        │');
        addOutput('└─────────────────────────────────────────────────────────────┘');
        addOutput('');
        articles.slice(0, 4).forEach((article, index) => {
          addOutput(`${index + 1}. ${article.title}`);
          addOutput(`   📅 ${article.date} │ 📂 ${article.category} │ ⏱️ ${article.readTime}`);
          addOutput(`   📝 ${article.description}`);
          addOutput(`   🏷️ Tags: ${article.tags.join(', ')}`);
          addOutput('');
        });
        addOutput('💡 Use "article <number>" to read full article');
        addOutput('💡 Use "articles --all" to see all articles');
        break;

      case 'experience':
        addOutput('┌─────────────────────────────────────────────────────────────┐');
        addOutput('│                    WORK EXPERIENCE                          │');
        addOutput('└─────────────────────────────────────────────────────────────┘');
        addOutput('');
        addOutput('🏢 Senior Fullstack Developer @ TechCorp Indonesia');
        addOutput('   📅 Jan 2022 - Present');
        addOutput('   • Led development of microservices architecture');
        addOutput('   • Improved application performance by 40%');
        addOutput('   • Mentored 3 junior developers');
        addOutput('');
        addOutput('🏢 Fullstack Developer @ StartupXYZ');
        addOutput('   📅 Jun 2021 - Dec 2021');
        addOutput('   • Built e-commerce platform from scratch');
        addOutput('   • Implemented CI/CD pipelines');
        addOutput('   • Reduced deployment time by 60%');
        addOutput('');
        addOutput('🏢 Frontend Developer @ WebStudio');
        addOutput('   📅 Mar 2020 - May 2021');
        addOutput('   • Developed responsive web applications');
        addOutput('   • Collaborated with design team on UI/UX');
        addOutput('   • Optimized frontend performance');
        break;

      case 'about':
        addOutput('=== About Ilham Ramadhan ===');
        addOutput('');
        addOutput('Fullstack Developer with 3+ years of experience building');
        addOutput('scalable web applications. Passionate about clean code,');
        addOutput('modern technologies, and creating exceptional user experiences.');
        addOutput('');
        addOutput('Currently focused on:');
        addOutput('• Building robust APIs and microservices');
        addOutput('• Creating responsive, accessible frontends');
        addOutput('• Implementing DevOps best practices');
        addOutput('• Contributing to open-source projects');
        break;

      case 'projects':
        if (args[0] === '--detailed' || args[0] === '--all') {
          addOutput('┌─────────────────────────────────────────────────────────────┐');
          addOutput('│                    ALL PROJECTS (DETAILED)                  │');
          addOutput('└─────────────────────────────────────────────────────────────┘');
          addOutput('');
          projects.forEach((project, index) => {
            addOutput(`${index + 1}. ${project.name} [${project.status}]`);
            addOutput(`   🔧 Tech: ${project.tech}`);
            addOutput(`   📝 ${project.description}`);
            addOutput(`   🚀 Demo: ${project.demo}`);
            addOutput(`   📂 Code: ${project.github}`);
            addOutput(`   ✨ Key Features:`);
            project.features.slice(0, 3).forEach(feature => {
              addOutput(`      • ${feature}`);
            });
            addOutput('');
          });
        } else {
          addOutput('┌─────────────────────────────────────────────────────────────┐');
          addOutput('│                     RECENT PROJECTS                         │');
          addOutput('└─────────────────────────────────────────────────────────────┘');
          addOutput('');
          projects.forEach((project, index) => {
            addOutput(`${index + 1}. ${project.name} [${project.status}]`);
            addOutput(`   🔧 ${project.tech}`);
            addOutput(`   📝 ${project.description}`);
            addOutput('');
          });
          addOutput('💡 Use "project <number>" for detailed view');
          addOutput('💡 Use "projects --detailed" for all details');
        }
        break;

      case 'skills':
        addOutput('=== Technical Skills ===');
        addOutput('');
        skills.forEach(skill => {
          addOutput(`• ${skill}`);
        });
        break;

      case 'contact':
        addOutput('=== Contact Information ===');
        addOutput('');
        addOutput('📧 Email: ilham.ramadhan@example.com');
        addOutput('🔗 LinkedIn: /in/ilham-ramadhan');
        addOutput('🐙 GitHub: /ilham-ramadhan');
        addOutput('🌐 Website: ilhamramadhan.dev');
        addOutput('📱 Phone: +62 xxx xxxx xxxx');
        break;

      case 'ls':
        if (args[0] === 'projects') {
          addOutput('ecommerce-platform/  task-management/  analytics-dashboard/');
        } else if (args[0] === 'articles') {
          addOutput('microservices-architecture.md  react-performance.md');
          addOutput('database-design.md           devops-ci-cd.md');
        } else {
          addOutput('about.md    projects/    articles/    skills.json    contact.txt    experience.json');
        }
        break;

      case 'pwd':
        addOutput('/home/ilham/portfolio');
        break;

      case 'whoami':
        addOutput('ilham');
        break;

      case 'date':
        addOutput(new Date().toString());
        break;

      case 'clear':
        setLines([]);
        break;

      case 'project':
        const projectIndex = parseInt(args[0]) - 1;
        if (projectIndex >= 0 && projectIndex < projects.length) {
          const project = projects[projectIndex];
          addOutput('┌─────────────────────────────────────────────────────────────┐');
          addOutput(`│                    ${project.name.toUpperCase().padEnd(29)} │`);
          addOutput('└─────────────────────────────────────────────────────────────┘');
          addOutput('');
          addOutput(`📊 Status: ${project.status}`);
          addOutput(`🔧 Tech Stack: ${project.tech}`);
          addOutput(`📝 Description: ${project.description}`);
          addOutput('');
          addOutput('✨ Key Features:');
          project.features.forEach(feature => {
            addOutput(`   • ${feature}`);
          });
          addOutput('');
          addOutput(`🎯 Challenges: ${project.challenges}`);
          addOutput('');
          addOutput(`🧠 What I Learned: ${project.learned}`);
          addOutput('');
          addOutput('🔗 Links:');
          addOutput(`   📂 GitHub: ${project.github}`);
          addOutput(`   🚀 Live Demo: ${project.demo}`);
        } else if (args[0]) {
          // Try to find by ID
          const project = projects.find(p => p.id === args[0]);
          if (project) {
            addOutput('┌─────────────────────────────────────────────────────────────┐');
            addOutput(`│                    ${project.name.toUpperCase().padEnd(29)} │`);
            addOutput('└─────────────────────────────────────────────────────────────┘');
            addOutput('');
            addOutput(`📊 Status: ${project.status}`);
            addOutput(`🔧 Tech Stack: ${project.tech}`);
            addOutput(`📝 Description: ${project.description}`);
            addOutput('');
            addOutput('✨ Key Features:');
            project.features.forEach(feature => {
              addOutput(`   • ${feature}`);
            });
            addOutput('');
            addOutput(`🎯 Challenges: ${project.challenges}`);
            addOutput('');
            addOutput(`🧠 What I Learned: ${project.learned}`);
            addOutput('');
            addOutput('🔗 Links:');
            addOutput(`   📂 GitHub: ${project.github}`);
            addOutput(`   🚀 Live Demo: ${project.demo}`);
          } else {
            addOutput('Project not found. Use "projects" to see available projects.', 'error');
          }
        } else {
          addOutput('Usage: project <number> or project <id>', 'error');
          addOutput('Example: project 1 or project ecommerce-platform');
        }
        break;

      case 'article':
        const articleIndex = parseInt(args[0]) - 1;
        if (articleIndex >= 0 && articleIndex < articles.length) {
          const article = articles[articleIndex];
          addOutput('┌─────────────────────────────────────────────────────────────┐');
          addOutput(`│                      ARTICLE PREVIEW                        │`);
          addOutput('└─────────────────────────────────────────────────────────────┘');
          addOutput('');
          addOutput(`📰 ${article.title}`);
          addOutput(`📅 Published: ${article.date} │ 📂 ${article.category} │ ⏱️ ${article.readTime}`);
          addOutput('');
          addOutput(`📝 Description:`);
          addOutput(`   ${article.description}`);
          addOutput('');
          addOutput(`📖 Preview:`);
          addOutput(`   ${article.preview}`);
          addOutput('');
          addOutput(`🏷️ Tags: ${article.tags.join(', ')}`);
          addOutput('');
          addOutput('💡 Full article available on my blog (contact for link)');
        } else if (args[0]) {
          // Try to find by ID
          const article = articles.find(a => a.id === args[0]);
          if (article) {
            addOutput('┌─────────────────────────────────────────────────────────────┐');
            addOutput(`│                      ARTICLE PREVIEW                        │`);
            addOutput('└─────────────────────────────────────────────────────────────┘');
            addOutput('');
            addOutput(`📰 ${article.title}`);
            addOutput(`📅 Published: ${article.date} │ 📂 ${article.category} │ ⏱️ ${article.readTime}`);
            addOutput('');
            addOutput(`📝 Description:`);
            addOutput(`   ${article.description}`);
            addOutput('');
            addOutput(`📖 Preview:`);
            addOutput(`   ${article.preview}`);
            addOutput('');
            addOutput(`🏷️ Tags: ${article.tags.join(', ')}`);
            addOutput('');
            addOutput('💡 Full article available on my blog (contact for link)');
          } else {
            addOutput('Article not found. Use "articles" to see available articles.', 'error');
          }
        } else {
          addOutput('Usage: article <number> or article <id>', 'error');
          addOutput('Example: article 1 or article microservices-architecture');
        }
        break;

      case 'cat':
        if (args[0] === 'about.md') {
          addOutput('=== About Ilham Ramadhan ===');
          addOutput('');
          addOutput('Fullstack Developer with 3+ years of experience building');
          addOutput('scalable web applications. Passionate about clean code,');
          addOutput('modern technologies, and creating exceptional user experiences.');
        } else if (args[0] === 'contact.txt') {
          addOutput('📧 ilham.ramadhan@example.com');
          addOutput('🔗 linkedin.com/in/ilham-ramadhan');
          addOutput('🐙 github.com/ilham-ramadhan');
          addOutput('🌐 ilhamramadhan.dev');
        } else if (args[0] === 'skills.json') {
          addOutput('{');
          addOutput('  "frontend": ["React", "Vue.js", "Angular", "TypeScript"],');
          addOutput('  "backend": ["Node.js", "Python", "Java", "Express"],');
          addOutput('  "database": ["PostgreSQL", "MongoDB", "Redis"],');
          addOutput('  "cloud": ["AWS", "Docker", "Kubernetes"],');
          addOutput('  "tools": ["Git", "Jest", "Cypress", "Figma"]');
          addOutput('}');
        } else {
          addOutput(`cat: ${args[0]}: No such file`, 'error');
        }
        break;

      case 'ls':
        if (args[0] === 'projects') {
          addOutput('ecommerce-platform/  task-management/  analytics-dashboard/');
        } else if (args[0] === 'articles') {
          addOutput('microservices-architecture.md  react-performance.md');
          addOutput('database-design.md           devops-ci-cd.md');
        } else {
          addOutput('about.md    projects/    articles/    skills.json    contact.txt    experience.json');
        }
        break;

      default:
        addOutput(`Command not found: ${cmd}`, 'error');
        addOutput('Type "help" to see available commands.');
        break;
    }
  }, [addOutput, setLines]);

  const getAvailableCommands = useCallback(() => {
    return ['help', 'about', 'projects', 'project', 'articles', 'article', 'skills', 'experience', 'contact', 'ascii', 'tree', 'cat', 'clear', 'ls', 'pwd', 'whoami', 'date'];
  }, []);

  return {
    executeCommand,
    getAvailableCommands,
  };
};