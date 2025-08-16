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
      name: 'E-Commerce Platform',
      tech: 'React, Node.js, PostgreSQL',
      description: 'Full-featured online shopping platform with payment integration',
      status: 'Production'
    },
    {
      name: 'Task Management App',
      tech: 'Vue.js, Express, MongoDB',
      description: 'Collaborative project management tool with real-time updates',
      status: 'Development'
    },
    {
      name: 'Analytics Dashboard',
      tech: 'Angular, Python, FastAPI',
      description: 'Business intelligence dashboard with data visualization',
      status: 'Production'
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
        addOutput('Available commands:');
        addOutput('  about       - Learn about Ilham Ramadhan');
        addOutput('  projects    - View development projects');
        addOutput('  skills      - Display technical skills');
        addOutput('  contact     - Get contact information');
        addOutput('  clear       - Clear terminal screen');
        addOutput('  ls          - List directory contents');
        addOutput('  pwd         - Show current directory');
        addOutput('  whoami      - Display current user');
        addOutput('  date        - Show current date and time');
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
        addOutput('=== Recent Projects ===');
        addOutput('');
        projects.forEach((project, index) => {
          addOutput(`${index + 1}. ${project.name}`);
          addOutput(`   Tech Stack: ${project.tech}`);
          addOutput(`   Description: ${project.description}`);
          addOutput(`   Status: ${project.status}`);
          addOutput('');
        });
        addOutput('Use "project <number>" to view details');
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
        addOutput('about.md    projects/    skills.json    contact.txt');
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
          addOutput(`=== ${project.name} ===`);
          addOutput(`Tech Stack: ${project.tech}`);
          addOutput(`Description: ${project.description}`);
          addOutput(`Status: ${project.status}`);
        } else {
          addOutput('Project not found. Use "projects" to see available projects.', 'error');
        }
        break;

      default:
        addOutput(`Command not found: ${cmd}`, 'error');
        addOutput('Type "help" to see available commands.');
        break;
    }
  }, [addOutput, setLines]);

  const getAvailableCommands = useCallback(() => {
    return ['help', 'about', 'projects', 'skills', 'contact', 'clear', 'ls', 'pwd', 'whoami', 'date'];
  }, []);

  return {
    executeCommand,
    getAvailableCommands,
  };
};